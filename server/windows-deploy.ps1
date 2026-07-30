$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$TaskName = 'WWComboCommunityServer'
$DefaultPassword = 'REMOVED_FROM_HISTORY'
$HostAddress = '0.0.0.0'
$Port = 9881
$PublicUrl = 'https://Nova.fb520.site'
$RuntimeRoot = Join-Path $env:ProgramData 'WWCombo'
$ServerDir = $PSScriptRoot
$RepositoryRoot = (Resolve-Path (Join-Path $ServerDir '..')).Path
$RunnerPath = Join-Path $ServerDir 'windows-run.ps1'

function Test-Administrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Refresh-ProcessPath {
  $machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
  $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  $env:Path = "$machinePath;$userPath"
}

function Install-WingetPackage {
  param(
    [Parameter(Mandatory = $true)][string]$Id,
    [Parameter(Mandatory = $true)][string]$Label
  )

  $winget = Get-Command winget.exe -ErrorAction SilentlyContinue
  if (-not $winget) {
    throw "$Label is missing and winget is unavailable. Install $Label, then run windows-deploy.cmd again."
  }

  Write-Host "Installing $Label..."
  & $winget.Source install --id $Id --exact --silent --accept-package-agreements --accept-source-agreements
  if ($LASTEXITCODE -ne 0) {
    throw "winget could not install $Label (exit code $LASTEXITCODE)."
  }
  Refresh-ProcessPath
}

function Get-RequiredCommand {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$WingetId,
    [Parameter(Mandatory = $true)][string]$Label
  )

  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $command) {
    Install-WingetPackage -Id $WingetId -Label $Label
    $command = Get-Command $Name -ErrorAction SilentlyContinue
  }
  if (-not $command) {
    throw "$Label is still unavailable after installation. Restart Windows and run windows-deploy.cmd again."
  }
  return $command.Source
}

function Stop-ExistingServer {
  $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if ($task) {
    Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
  }

  $listeners = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
  foreach ($processId in @($listeners.OwningProcess | Sort-Object -Unique)) {
    if (-not $processId) { continue }
    $process = Get-CimInstance Win32_Process -Filter "ProcessId=$processId" -ErrorAction SilentlyContinue
    if ($process -and $process.CommandLine -match 'server[\\/]server\.mjs') {
      Stop-Process -Id $processId -Force
      continue
    }
    throw "Port $Port is occupied by another program (PID $processId). Stop it before deploying WWCombo."
  }
}

function Wait-ForLogin {
  param([Parameter(Mandatory = $true)][string]$Password)

  $loginUrl = "http://127.0.0.1:$Port/api/server/login"
  $body = @{ password = $Password } | ConvertTo-Json
  $lastError = $null

  for ($attempt = 0; $attempt -lt 120; $attempt += 1) {
    try {
      $response = Invoke-RestMethod -Method Post -Uri $loginUrl -ContentType 'application/json' -Body $body -TimeoutSec 5
      if ($response.ok -ne $true) { throw 'The login endpoint did not return ok=true.' }

      $wrongPasswordRejected = $false
      try {
        Invoke-RestMethod -Method Post -Uri $loginUrl -ContentType 'application/json' -Body (@{ password = "$Password-wrong" } | ConvertTo-Json) -TimeoutSec 5 | Out-Null
      } catch {
        if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 401) {
          $wrongPasswordRejected = $true
        }
      }
      if (-not $wrongPasswordRejected) {
        throw 'Password verification failed because the server accepted an incorrect password.'
      }
      return
    } catch {
      $lastError = $_
      Start-Sleep -Seconds 1
    }
  }

  throw "The server did not accept the configured administrator password: $($lastError.Exception.Message)"
}

if (-not (Test-Administrator)) {
  Write-Host 'Administrator permission is required. Opening the UAC prompt...'
  $arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  $process = Start-Process -FilePath 'powershell.exe' -ArgumentList $arguments -Verb RunAs -Wait -PassThru
  exit $process.ExitCode
}

Refresh-ProcessPath
$gitPath = Get-RequiredCommand -Name 'git.exe' -WingetId 'Git.Git' -Label 'Git'
$nodePath = Get-RequiredCommand -Name 'node.exe' -WingetId 'OpenJS.NodeJS.LTS' -Label 'Node.js LTS'
$npmPath = Get-RequiredCommand -Name 'npm.cmd' -WingetId 'OpenJS.NodeJS.LTS' -Label 'npm'

$nodeMajor = [int]((& $nodePath --version).Trim().TrimStart('v').Split('.')[0])
if ($nodeMajor -lt 18) {
  Install-WingetPackage -Id 'OpenJS.NodeJS.LTS' -Label 'Node.js LTS'
  $nodePath = (Get-Command node.exe).Source
  $npmPath = (Get-Command npm.cmd).Source
  $nodeMajor = [int]((& $nodePath --version).Trim().TrimStart('v').Split('.')[0])
  if ($nodeMajor -lt 18) { throw 'Node.js 18 or newer is required.' }
}

$safeDirectories = @(& $gitPath config --system --get-all safe.directory 2>$null)
if ($safeDirectories -notcontains $RepositoryRoot) {
  & $gitPath config --system --add safe.directory $RepositoryRoot
  if ($LASTEXITCODE -ne 0) { throw 'Could not register the repository as a safe Git directory.' }
}

$trackedChanges = (& $gitPath -C $RepositoryRoot status --porcelain --untracked-files=no | Out-String).Trim()
if ($trackedChanges) {
  throw 'The repository has tracked local changes. Commit or remove them before deployment.'
}

Write-Host 'Updating the main repository...'
& $gitPath -C $RepositoryRoot pull --ff-only origin main
if ($LASTEXITCODE -ne 0) { throw 'Git update failed.' }

Write-Host 'Installing server dependencies...'
& $npmPath install --omit=dev --prefix $ServerDir
if ($LASTEXITCODE -ne 0) { throw 'npm install failed.' }

New-Item -ItemType Directory -Path $RuntimeRoot -Force | Out-Null
$adminPassword = if ($env:WWCOMBO_ADMIN_PASSWORD) { $env:WWCOMBO_ADMIN_PASSWORD } else { $DefaultPassword }
$env:WWCOMBO_ADMIN_PASSWORD = $adminPassword
try {
  & $nodePath (Join-Path $ServerDir 'configure.mjs') --runtime $RuntimeRoot
  if ($LASTEXITCODE -ne 0) { throw 'Administrator password configuration failed.' }
} finally {
  Remove-Item Env:WWCOMBO_ADMIN_PASSWORD -ErrorAction SilentlyContinue
}

$serviceConfig = [ordered]@{
  version = 1
  repositoryRoot = $RepositoryRoot
  serverDirectory = $ServerDir
  nodePath = $nodePath
  gitDirectory = (Split-Path $gitPath -Parent)
  host = $HostAddress
  port = $Port
  publicUrl = $PublicUrl
  trustProxy = $true
}
$serviceConfigPath = Join-Path $RuntimeRoot 'windows-service.json'
$serviceConfig | ConvertTo-Json | Set-Content -LiteralPath $serviceConfigPath -Encoding UTF8

Stop-ExistingServer

$powerShellPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$taskArguments = "-NoProfile -ExecutionPolicy Bypass -File `"$RunnerPath`" -RuntimeRoot `"$RuntimeRoot`""
$action = New-ScheduledTaskAction -Execute $powerShellPath -Argument $taskArguments -WorkingDirectory $RepositoryRoot
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'WWCombo community website and API' -Force | Out-Null

$firewallRule = Get-NetFirewallRule -DisplayName 'WWCombo Community Server 9881' -ErrorAction SilentlyContinue
if (-not $firewallRule) {
  New-NetFirewallRule -DisplayName 'WWCombo Community Server 9881' -Direction Inbound -Action Allow -Protocol TCP -LocalPort $Port | Out-Null
}

Start-ScheduledTask -TaskName $TaskName
Write-Host 'Waiting for the server and testing the administrator password...'
Wait-ForLogin -Password $adminPassword

Write-Host ''
Write-Host "User website: $PublicUrl/"
Write-Host "Maintenance console: $PublicUrl/admin/"
Write-Host "Administrator password verified: $adminPassword"
Write-Host "Windows task: $TaskName"
Write-Host "Private runtime data: $RuntimeRoot"
Write-Host 'The server owner does not need to perform daily moderation.'

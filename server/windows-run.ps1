param(
  [Parameter(Mandatory = $true)]
  [string]$RuntimeRoot
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$serviceConfigPath = Join-Path $RuntimeRoot 'windows-service.json'
if (-not (Test-Path -LiteralPath $serviceConfigPath)) {
  throw "Missing Windows service configuration: $serviceConfigPath"
}

$config = Get-Content -LiteralPath $serviceConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
$env:WWCOMBO_RUNTIME_ROOT = $RuntimeRoot
$env:WWCOMBO_HOST = [string]$config.host
$env:WWCOMBO_PORT = [string]$config.port
$env:WWCOMBO_PUBLIC_URL = [string]$config.publicUrl
$env:WWCOMBO_TRUST_PROXY = if ($config.trustProxy) { '1' } else { '0' }
$env:Path = "$($config.gitDirectory);$(Split-Path ([string]$config.nodePath) -Parent);$env:Path"

$serverPath = Join-Path ([string]$config.serverDirectory) 'server.mjs'
$stdoutPath = Join-Path $RuntimeRoot 'server.stdout.log'
$stderrPath = Join-Path $RuntimeRoot 'server.stderr.log'
Set-Location -LiteralPath ([string]$config.repositoryRoot)

while ($true) {
  try {
    & ([string]$config.nodePath) $serverPath 1>> $stdoutPath 2>> $stderrPath
    $exitCode = $LASTEXITCODE
  } catch {
    $_ | Out-String | Add-Content -LiteralPath $stderrPath -Encoding UTF8
    $exitCode = 1
  }

  "$(Get-Date -Format o) server exited with code $exitCode; restarting in 3 seconds." | Add-Content -LiteralPath $stderrPath -Encoding UTF8
  Start-Sleep -Seconds 3
}

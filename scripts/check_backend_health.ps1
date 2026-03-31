$ErrorActionPreference = "Stop"

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

function Normalize-BaseUrl {
  param([string]$Value)

  $trimmed = $Value.Trim()
  if (-not $trimmed) {
    throw "BaseUrl cannot be empty."
  }

  return $trimmed.TrimEnd("/")
}

$normalizedBaseUrl = Normalize-BaseUrl -Value $BaseUrl
$healthUrl = "$normalizedBaseUrl/api/health"

Write-Host "Checking backend health at $healthUrl"

try {
  $response = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 20
} catch {
  throw "Failed to reach $healthUrl. $($_.Exception.Message)"
}

$uploadMetadataPersistence = $response.uploadMetadataPersistence
$storageConfigured = $response.storageConfigured
$databaseConfigured = $response.databaseConfigured

Write-Host ""
Write-Host "Health response summary"
Write-Host "status: $($response.status)"
Write-Host "service: $($response.service)"
Write-Host "databaseConfigured: $databaseConfigured"
Write-Host "uploadMetadataPersistence: $uploadMetadataPersistence"
Write-Host "storageConfigured: $storageConfigured"

$errors = @()

if ($response.status -ne "ok") {
  $errors += "Expected status 'ok' but received '$($response.status)'."
}

if (-not $databaseConfigured) {
  $errors += "databaseConfigured is false. Production is not using shared D1 metadata."
}

if ($uploadMetadataPersistence -ne "d1") {
  $errors += "uploadMetadataPersistence is '$uploadMetadataPersistence' instead of 'd1'."
}

if (-not $storageConfigured) {
  $errors += "storageConfigured is false. R2 is not fully configured."
}

if ($errors.Count -gt 0) {
  Write-Host ""
  Write-Host "Result: FAILED" -ForegroundColor Red
  $errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
  exit 1
}

Write-Host ""
Write-Host "Result: OK" -ForegroundColor Green
Write-Host "Production is reporting shared upload metadata via D1 and R2 storage is configured."

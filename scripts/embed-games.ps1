# Build each game into lukii-portfolio/public/games/<id>
$ErrorActionPreference = "Continue"
$portfolio = "C:\Users\spada\Projects\lukii-portfolio"
$outRoot = Join-Path $portfolio "public\games"
$games = @(
  "heatwave",
  "ascend-deck",
  "expedition-combat",
  "fractal-pulse",
  "stellar-sync",
  "wildwood-survivors",
  "tower-defense",
  "maple-meadow"
)

New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

foreach ($id in $games) {
  $src = "C:\Users\spada\Projects\$id"
  $dest = Join-Path $outRoot $id
  Write-Host "`n==== Building $id ====" -ForegroundColor Cyan
  if (-not (Test-Path $src)) {
    Write-Host "SKIP missing $src" -ForegroundColor Yellow
    continue
  }
  Push-Location $src
  try {
    if (-not (Test-Path "node_modules")) {
      npm install --silent
    }
    npx --yes vite build --base "/games/$id/"
    if ($LASTEXITCODE -ne 0) {
      Write-Host "BUILD FAILED $id" -ForegroundColor Red
      continue
    }
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Copy-Item -Recurse -Force (Join-Path $src "dist\*") $dest
    Write-Host "OK -> $dest" -ForegroundColor Green
  } finally {
    Pop-Location
  }
}

Write-Host "`nDone." -ForegroundColor Cyan

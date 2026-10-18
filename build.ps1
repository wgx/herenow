$ErrorActionPreference = 'Stop'

$inputPath = Join-Path $PSScriptRoot 'herenow.js'
$outputPath = Join-Path $PSScriptRoot 'herenow.min.js'

if (-not (Test-Path -LiteralPath $inputPath -PathType Leaf)) {
    throw "Input file not found: $inputPath"
}

Write-Host "Minifying $inputPath to $outputPath..."
& npx --yes terser $inputPath --compress --mangle --output $outputPath

if ($LASTEXITCODE -ne 0) {
    throw "Terser failed with exit code $LASTEXITCODE."
}

if (-not (Test-Path -LiteralPath $outputPath -PathType Leaf)) {
    throw "Terser completed without creating the output file: $outputPath"
}

Write-Host "Created $outputPath"

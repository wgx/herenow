$ErrorActionPreference = 'Stop'

$inputPath = Join-Path $PSScriptRoot 'herenow.js'
$outputPath = Join-Path $PSScriptRoot 'herenow.min.js'

if (-not (Test-Path -LiteralPath $inputPath -PathType Leaf)) {
    throw "Input file not found: $inputPath"
}

Write-Host "Packing $inputPath to $outputPath..."
& npx --yes roadroller $inputPath -o $outputPath

if ($LASTEXITCODE -ne 0) {
    throw "Roadroller failed with exit code $LASTEXITCODE."
}

if (-not (Test-Path -LiteralPath $outputPath -PathType Leaf)) {
    throw "Roadroller completed without creating the output file: $outputPath"
}

Write-Host "Created $outputPath"

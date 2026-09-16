# ProwdFashion — Supabase-এ রাখা ১১টা প্রোডাক্ট ছবি নামিয়ে
# D:\halfseam-store\images\ ফোল্ডারে ঠিক নামে সেভ করে।
# চালাতে: PowerShell খুলে নিচের লাইনটা পেস্ট করুন —
#   powershell -ExecutionPolicy Bypass -File D:\halfseam-store\download-images.ps1

$base = "https://zrmrwuldfkptoltqmqop.supabase.co/storage/v1/object/public/product-images/"
$dest = "D:\halfseam-store\images"

$files = [ordered]@{
  "p-1788160416567-6018.jpeg" = "vneck-black-print-tee.jpg"
  "p-1788160338200-7709.jpeg" = "orange-cotton-tee.jpg"
  "p-1787834251815-4259.jpeg" = "neverup-black-print-tee.jpg"
  "p-1787853945813-7907.jpeg" = "navy-cotton-tee.jpg"
  "p-1787854130243-8699.jpeg" = "black-print-cotton-tee.jpg"
  "p-1787854329419-7098.jpeg" = "23print-white-tee.jpg"
  "p-1788115499814-9469.jpeg" = "neverup-navy-tee.jpg"
  "p-1788160399088-8510.jpeg" = "neverup-white-print-tee.jpg"
  "p-1788116390259-44.jpeg"   = "neverup-lightgrey-tee.jpg"
  "p-1788160382392-701.jpeg"  = "23print-lightgrey-tee.jpg"
  "p-1788117431498-4351.jpeg" = "newyork-navy-tee.jpg"
}

if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

$ok = 0; $fail = 0
foreach ($k in $files.Keys) {
  $out = Join-Path $dest $files[$k]
  try {
    Invoke-WebRequest -Uri ($base + $k) -OutFile $out -UseBasicParsing -ErrorAction Stop
    $kb = [math]::Round((Get-Item $out).Length / 1KB)
    Write-Host ("  OK    {0}  ({1} KB)" -f $files[$k], $kb) -ForegroundColor Green
    $ok++
  } catch {
    Write-Host ("  FAIL  {0}  -> {1}" -f $files[$k], $_.Exception.Message) -ForegroundColor Red
    $fail++
  }
}

Write-Host ""
Write-Host ("শেষ: {0} টা নামল, {1} টা ব্যর্থ।  ফোল্ডার: {2}" -f $ok, $fail, $dest) -ForegroundColor Cyan

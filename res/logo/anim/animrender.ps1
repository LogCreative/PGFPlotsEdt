# Create Animated Logo Series
# PGFPlotsEdt · LaTeX Sparkle Project
# Log Creative 2021 AGPL-3.0

# Powershell 7 Only -- to render in Parallel
0..45 | ForEach-Object -Parallel {
    $replacer = "view={"+$_+"}"
    $index = '{0:d2}' -f $_
    $file = "animatedlogo-frame" + $index + ".tex"
    (Get-Content ../logo.tex -Raw) -replace "view={(\d+)}", $replacer | Out-File $file
    $dvifile = "animatedlogo-frame" + $index + ".dvi"
    pdflatex -output-format=dvi $file
    dvisvgm --zoom=1 --exact $dvifile
}

# need ImageMagick installed
magick -size 640x640 -depth 8 -loop 1 animatedlogo-frame*.svg animatedlogo.gif 

Remove-Item *.dvi, *.log, *.aux, animatedlogo-frame*.tex, *.svg
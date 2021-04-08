# Create Animated Logo Series
# PGFPlotsEdt · LaTeX Sparkle Project
# Log Creative 2021 AGPL-3.0

Remove-Item *.dvi, *.log, *.aux, animatedlogo-frame*.tex, *.svg

# Powershell 7 Only -- to render in Parallel
0..45 | ForEach-Object -Parallel {
    $view_replacer = "view={"+ $_ +"}"
    $domain_start = -0.57 - ($_ + 1) * 0.02
    $domain_end = -0.43 + ($_ + 1) * 0.02
    $domain_replacer = "domain=" + $domain_start + "*pi" + ":" + $domain_end + "*pi"
    $index = '{0:d2}' -f $_
    $file = "animatedlogo-frame" + $index + ".tex"
    (Get-Content ../logo.tex -Raw) -replace "view={(\d+)}", $view_replacer -replace "domain=0:2\*pi", $domain_replacer | 
        Out-File $file
    $dvifile = "animatedlogo-frame" + $index + ".dvi"
    pdflatex -output-format=dvi $file
    dvisvgm --zoom=1 --exact $dvifile
}

# svg only mode

# # need ImageMagick installed
# magick -size 640x640 -depth 8 -loop 1 animatedlogo-frame%d.svg[0-22] animatedlogo.gif 

# # backward

# 0..22 | ForEach-Object {
#     $filename = "animatedlogo-frame" + $_ + ".svg"
#     $index = 45 - $_
#     $new_filename = "animatedlogo-frame" + $index + ".svg"
#     Rename-Item $filename $new_filename
# }

# magick -size 640x640 -depth 8 -loop 1 animatedlogo-frame%d.svg[23-45] animatedlogo_back.gif 

Remove-Item *.dvi, *.log, *.aux, animatedlogo-frame*.tex
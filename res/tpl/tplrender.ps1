New-Item svg -Type directory
New-Item tmp -Type directory

1..10 | ForEach-Object -Parallel {
    $file = "" + $_;
    $texfile = $file + ".tex"
    $dvifile = $file + ".dvi"
    $svgfile = $file + ".svg"
    Set-Location tmp/
    pdflatex -output-format=dvi ../tex/$texfile
    dvisvgm --zoom=-1 --exact --font-format=woff2 $dvifile
    Copy-Item -Path $svgfile -Destination ../svg/$svgfile -Force
}

Remove-Item -Path tmp/ -Recurse
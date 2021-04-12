New-Item svg -Type directory
New-Item icon -Type directory
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

1..10 | ForEach-Object -Parallel {
    $file = "" + $_;
    $texfile = $file + ".tex"
    $iconfile = $file + "i.tex"
    $dvifile = $file + "i.dvi"
    $svgfile = $file + "i.svg"
    Copy-Item -Path tex/$texfile -Destination tmp/$iconfile
    Set-Location tmp/
    (Get-Content $iconfile -Raw) -replace "axis}\[\]", "axis}[axis lines=none,line width=1.5pt]" -replace "\\begin{tikzpicture}","\begin{tikzpicture}[scale=0.4]"|
        Out-File $iconfile
    pdflatex -output-format=dvi $iconfile
    dvisvgm --zoom=-1 --exact $dvifile
    Copy-Item -Path $svgfile -Destination ../icon/$svgfile -Force
}

Remove-Item -Path tmp/ -Recurse
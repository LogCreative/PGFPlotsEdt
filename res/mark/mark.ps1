# PGFPlots Example Preview Script - Mark
# LaTeX Sparkle Project · Log Creative 2021
# AGPL-3.0 License

# LaTeX3 SVG Compiler is used.

$premable = '\documentclass[tikz,dvisvgm]{standalone}
\usepackage{pgfplots}
\pgfplotsset{compat=1.14}
\usetikzlibrary{plotmarks}
\begin{document}'

$mark_syntax = @('*','x','+')
$mark_synopsis = @('multi','cross','plus')

$setup_first = '\begin{tikzpicture}
\begin{axis}[axis x line={none},
axis y line={none},
]
 \addplot [mark='

$setup_second = ',mark options={scale=2,fill=yellow!80!black},] coordinates {(1,1) (2,2.8) (3,2) (4,4)};
\end{axis}
\end{tikzpicture}
'

$suffix = '\end{document}'

New-Item tex -Type directory
New-Item svg -Type directory
New-Item tmp -Type directory


for($x=0;$x -lt 3;$x++){
    $file = $mark_synopsis[$x] + '.tex'
    $premable + $setup_first + $mark_syntax[$x] + $setup_second + $suffix | Out-File tex/$file
    Set-Location tmp/
    $dvifile = $mark_synopsis[$x] + ".dvi"
    $svgfile = $mark_synopsis[$x] + ".svg"
    pdflatex -output-format=dvi ../tex/$file
    dvisvgm --zoom=-1 --exact --font-format=woff $dvifile
    Copy-Item -Path $svgfile -Destination ../svg/$svgfile -Force
    Set-Location ../
}

Remove-Item -Path tmp/ -Recurse
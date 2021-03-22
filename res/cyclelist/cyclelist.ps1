# PGFPlots Example Preview Script - Cycle list
# LaTeX Sparkle Project · Log Creative 2021
# AGPL-3.0 License

# LaTeX3 SVG Compiler is used.

$premable = '\documentclass[tikz]{standalone}
\usepackage{pgfplots}
\pgfplotsset{compat=1.14}
\begin{document}'

$setup_first = '\begin{tikzpicture}
\begin{axis}[axis x line={none},
axis y line={none},
cycle list name='

$setup_second = ',]
 \addplot+ [] coordinates { (0,0) (1,0)};
 \addplot+ [] coordinates { (0,0) (0.9,0.1)};
 \addplot+ [] coordinates { (0,0) (0.8,0.2)};
 \addplot+ [] coordinates { (0,0) (0.7,0.3)};
 \addplot+ [] coordinates { (0,0) (0.6,0.4)};
 \addplot+ [] coordinates { (0,0) (0.5,0.5)};
 \addplot+ [] coordinates { (0,0) (0.4,0.6)};
 \addplot+ [] coordinates { (0,0) (0.3,0.7)};
 \addplot+ [] coordinates { (0,0) (0.2,0.8)};
 \addplot+ [] coordinates { (0,0) (0.1,0.9)};
 \addplot+ [] coordinates { (0,0) (0,1)};
\end{axis}
\end{tikzpicture}'

$cl_syntax = @('color','exotic','black white','mark list','mark list*','color list','linestyles','linestyles*');

$cl_synopsis = @('color','exotic','black white','mark list','mark listm','color list','linestyles','linestylesm');

$suffix = '\end{document}'

New-Item tex -Type directory
New-Item svg -Type directory
New-Item tmp -Type directory

for($x=0;$x -lt $cl_synopsis.length;$x++){
    $file = $cl_synopsis[$x] + '.tex'
    $premable + $setup_first + $cl_syntax[$x] + $setup_second + $suffix | Out-File tex/$file
    Set-Location tmp/
    $dvifile = $cl_synopsis[$x] + ".dvi"
    $svgfile = $cl_synopsis[$x] + ".svg"
    pdflatex -output-format=dvi ../tex/$file
    dvisvgm --zoom=-1 --exact --font-format=woff $dvifile
    Copy-Item -Path $svgfile -Destination ../svg/$svgfile -Force
    Set-Location ../
}

Remove-Item -Path tmp/ -Recurse
# PGFPlots Example Preview Script - Mark
# LaTeX Sparkle Project · Log Creative 2021
# AGPL-3.0 License

# LaTeX3 SVG Compiler is used.

$premable = '\documentclass[tikz,dvisvgm]{standalone}
\usepackage{pgfplots}
\pgfplotsset{compat=1.14}
\usetikzlibrary{plotmarks}
\begin{document}'

$mark_syntax = @('*','x','+','-','|','o','asterisk','star','10-pointed star','oplus','oplus*','otimes','otimes*','square','square*','triangle','triangle*','diamond','diamond*','halfdiamond','halfdiamond*','halfsquare*','halfsquare right*','halfsquare left*','Mercedes star','Mercedes star flipped','halfcircle','halfcircle*','pentagon','pentagon*')
$mark_synopsis = @('multi','cross','plus','minus','vert','o','asterisk','star','10-pointed star','oplus','oplusm','otimes','otimesm','square','squarem','triangle','trianglem','diamond','diamondm','halfdiamond','halfdiamondm','halfsquarem','halfsquare rightm','halfsquare leftm','Mercedes star','Mercedes star flipped','halfcircle','halfcirclem','pentagon','pentagonm')

$setup_first = '\begin{tikzpicture}
\begin{axis}[axis x line={none},
axis y line={none},
]
 \addplot [mark='

$setup_second = ',mark options={scale=2,fill=yellow!80!black},] coordinates {(1,1) (2,2.8) (3,2) (4,4)};
\end{axis}
\end{tikzpicture}
'

$setup_icon = ',mark options={scale=2,fill=yellow!80!black},] coordinates {(1,1)};
\addplot [mark='

$setup_icon_second = ',mark options={scale=3,fill,fill opacity=0,draw opacity=0},] coordinates {(1,1)};
\end{axis}
\end{tikzpicture}
'

$mark3_syntax = @('ball','cube','cube*')
$mark3_synopsis = @('ball','cube','cubem')

$setup3_first = '\begin{tikzpicture}
\begin{axis}[]
 \addplot3 [mark='

$setup3_first_icon = '\begin{tikzpicture}
\begin{axis}[axis lines=none]
 \addplot3 [mark='

$setup3_second = ',mark options={scale=2,fill=yellow!80!black},] coordinates {(1,1,1) (2,2,3) (3,3,2) (4,4,4)};
\end{axis}
\end{tikzpicture}
'

$setup3_icon = ',mark options={scale=2,fill=yellow!80!black},] coordinates {(1,1,1)};
\addplot3 [mark='

$setup3_icon_second = ',mark options={scale=3,fill,fill opacity=0,draw opacity=0},] coordinates {(1,1,1)};
\end{axis}
\end{tikzpicture}
'

$suffix = '\end{document}'

New-Item tex -Type directory
New-Item svg -Type directory
New-Item tmp -Type directory
New-Item icon -Type directory

for($x=0;$x -lt $mark_synopsis.length;$x++) {
    $file = $mark_synopsis[$x] + '.tex'
    $premable + $setup_first + $mark_syntax[$x] + $setup_icon + $mark_syntax[$x] + $setup_icon_second + $suffix | Out-File tex/$file
    Set-Location tmp/
    $dvifile = $mark_synopsis[$x] + ".dvi"
    $svgfile = $mark_synopsis[$x] + ".svg"
    pdflatex -output-format=dvi ../tex/$file
    dvisvgm --zoom=-1 --exact --font-format=woff $dvifile
    Copy-Item -Path $svgfile -Destination ../icon/$svgfile -Force
    Set-Location ../
}

for($x=0;$x -lt $mark_synopsis.length;$x++) {
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

for($x=0;$x -lt $mark3_synopsis.length;$x++){
    $file = $mark3_synopsis[$x] + '.tex'
    $premable + $setup3_first_icon + $mark3_syntax[$x] + $setup3_icon + $mark3_syntax[$x] + $setup3_icon_second + $suffix | Out-File tex/$file
    Set-Location tmp/
    $dvifile = $mark3_synopsis[$x] + ".dvi"
    $svgfile = $mark3_synopsis[$x] + ".svg"
    pdflatex -output-format=dvi ../tex/$file
    dvisvgm --zoom=-1 --exact --font-format=woff $dvifile
    Copy-Item -Path $svgfile -Destination ../icon/$svgfile -Force
    Set-Location ../
}

for($x=0;$x -lt $mark3_synopsis.length;$x++){
    $file = $mark3_synopsis[$x] + '.tex'
    $premable + $setup3_first + $mark3_syntax[$x] + $setup3_second + $suffix | Out-File tex/$file
    Set-Location tmp/
    $dvifile = $mark3_synopsis[$x] + ".dvi"
    $svgfile = $mark3_synopsis[$x] + ".svg"
    pdflatex -output-format=dvi ../tex/$file
    dvisvgm --zoom=-1 --exact --font-format=woff $dvifile
    Copy-Item -Path $svgfile -Destination ../svg/$svgfile -Force
    Set-Location ../
}

Remove-Item -Path tmp/ -Recurse
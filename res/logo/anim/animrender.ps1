# temporary PDF only version
# animate is not compatible with LaTeX3

Remove-Item *.aux
Remove-Item *.auxlock
Remove-Item *-figure*.*
latex -shell-escape -interaction=batchmode animatedlogo.tex
dvisvgm --zoom=-1 --exact --font-format=woff animatedlogo.dvi
Remove-Item *-figure*.*
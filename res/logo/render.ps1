pdflatex -output-format=dvi logo.tex
dvisvgm --zoom=-1 --exact --font-format=woff logo.dvi
pdflatex -output-format=dvi logoicon.tex
dvisvgm --zoom=-1 --exact --font-format=woff logoicon.dvi
Remove-Item *.aux, *.dvi, *.log
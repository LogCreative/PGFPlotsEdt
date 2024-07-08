% You need to install imagemagick to convert pdf to png
% And requires --shell-escape to run the conversion
\LoadClass[convert={density=300,outext=.png,size=640}]{standalone}
% Get the translation and stored in the variable: trans
\directlua{require("translation.lua")}
\usepackage{xcolor}
\usepackage{array}
\usepackage{amsmath}
\usepackage{MnSymbol}
\let\mathdollar\relax
\usepackage{tcolorbox}
% Set the default font to sans
\renewcommand{\familydefault}{\sfdefault}
// From https://github.com/learnlatex/learnlatex.github.io
// CC-BY-SA 4.0
// TODO: will be adapted to PGFPlotsEdt dict.
latexcompletions = {
    "latex": [
        "author",
        "begin",
        "begin{document}",
        "begin{enumerate}",
        "begin{equation*}",
        "begin{equation}",
        "begin{figure}",
        "begin{itemize}",
        "begin{table}",
        "begin{tabular}",
        "bfseries",
        "documentclass",
        "end",
        "end{document}",
        "end{enumerate}",
        "end{equation*}",
        "end{equation}",
        "end{figure}",
        "end{itemize}",
        "end{table}",
        "end{tabular}",
        "footnote",
        "frac",
        "hline",
        "input",
        "item",
        "itshape",
        "label",
        "makeatletter",
        "makeatother",
        "multicolumn",
        "newcommand",
        "NewDocumentCommand",
        "NewDocumentEnvironment",
        "newenvironment",
        "parbox",
        "ref",
        "renewcommand",
        "RenewDocumentCommand",
        "RenewDocumentEnvironment",
        "renewenvironment",
        "section",
        "subsection",
        "textbf",
        "textit",
        "title",
        "usepackage"
    ],
    "book": [
        "chapter"
    ],
    "amsmath": [
        "begin{align*}",
        "begin{aligned}",
        "begin{align}",
        "begin{cases}",
        "begin{flalign*}",
        "begin{flalign}",
        "begin{gather*}",
        "begin{gather}",
        "centering",
        "cite",
        "dfrac",
        "end{align*}",
        "end{aligned}",
        "end{align}",
        "end{cases}",
        "end{flalign*}",
        "end{flalign}",
        "end{gather*}",
        "end{gather}",
        "tfrac"
    ],
    "graphicx": [
        "includegraphics",
        "rotatebox",
        "scalebox"
    ],
    "xcolor": [
        "color",
        "colorbox",
        "textcolor"
    ],
    "tikz": [
        "begin{tikzpicture}",
        "node",
        "draw",
        "fill",
        "end{tikzpicture}"
    ]
};

var customCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
	var startToken = session.getTokenAt(pos.row, pos.column).value;
	if (startToken.startsWith("\\")){
	    var cmplts=[];
	    var s=0;
	    for (let pkg in latexcompletions) {
		var cs=latexcompletions[pkg];
		s=s-1;
		for(let i=0;i<cs.length;i++){
		    if(cs[i].startsWith(prefix)){
			cmplts.push({name: cs[i], value:cs[i],score: s, meta: pkg});
		    }
		}
	    }
	    callback(null, cmplts);
	} else {
	    callback(null, []);
	    return 
	}	    
    }
}
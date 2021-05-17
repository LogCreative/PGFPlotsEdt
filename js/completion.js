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
    ],
    "pgfplots": [
        "addplot",        
    ]
};

var customCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
	var startToken = session.getTokenAt(pos.row, pos.column).value;
    var cmplts=[];
	if (startToken.startsWith("\\")){
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
        return 
	} else {
        var cmd = startToken.substring(startToken.lastIndexOf(',')+1,startToken.length).trim();
        var param = cmd.split('=');
        var paramname = param[0];
        var paramvalue = param[1];
        if("/".indexOf(param)!=-1){
            param = cmd.split('/');
            paramname = param[0];
            paramvalue = param[1];
        }
        var searching_dict = function(dict,m){
            if(paramvalue){
                if(!dict[paramname]) return ;
                var subdict = dict[paramname][1];
                for(var pv in subdict){
                    if(pv.startsWith(paramvalue))
                        cmplts.push({name: subdict[pv][0], value: pv + ',', caption: pv, score: paramvalue.length - pv.length, meta: paramname});
                }
            } else 
                for(var pn in dict)
                    if(pn.startsWith(paramname)){
                        var suffix = ",";
                        if (pn=="colormap/") suffix = '/';
                        else if (dict[pn][1]) suffix = "=";
                        cmplts.push({name: dict[pn][0], value: pn + suffix, caption: pn, score: paramname.length - pn.length, meta: m});
                    }
        }
        if(session.getLine(pos.row).indexOf("axis")!=-1){
            searching_dict(globalparamDic,"axis");
        }
        searching_dict(sparamDic,"addplot");
        callback(null, cmplts);
	}	
      
    }
}
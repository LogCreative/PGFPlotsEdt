// 颜色字典
var colorDic = {
    "none":     ["transparent","color","transparent"],
    "red":      ["","color","#FF0000"],
    "green":    ["","color","#00FF00"],
    "blue":     ["","color","#0000FF"],
    "cyan":     ["","color","#00AEEF"],
    "magenta":  ["","color","#ED028C"],
    "yellow":   ["","color","#FFF101"],
    "black":    ["","color","#000000"],
    "gray":     ["","color","#808080"],
    "white":    ["","color","#FFFFFF"],
    "darkgrey": ["","color","#404040"],
    "lightgrey":["","color","#BFBFBF"],
    "brown":    ["","color","#BF8040"],
    "lime":     ["","color","#BFFF00"],
    "olive":    ["","color","#968D00"],
    "orange":   ["","color","#FF8000"],
    "pink":     ["","color","#FFBFBF"],
    "purple":   ["","color","#BF0040"],
    "teal":     ["","color","#008080"],
    "violet":   ["","color","#800080"],
};

// 系列的参数字典
// TODO: 使用 json 读取
var sparamDic = {
    "mark":["Markers.",{
        "*":    ["","url","mark/svg/multi.svg"],
        "x":    ["","url","mark/svg/cross.svg"],
        "+":    ["","url","mark/svg/plus.svg"],
    }],
    "only marks":["Contain only markers."],
    "no markers":["Contain no markers."],
    "text mark":["Marker is a character.",{
        "c":         ["The character to mark.","none",""]
    }],
    "scatter":["Scatter plot with colormap."],
    "ybar":["Vertical bar graph."],
    "xbar":["Horizontal bar graph."],
    "domain":["Domain for independent variables.",{
        "0:8":    ["The start and end of the interval.","none",""]
    }],
    "samples":["Sampling number.",{
        "100":         ["The quantity for sampling.","none",""]
    }],
    "color":["Color for both draw and fill.",colorDic],
    "draw":["Line color.",colorDic],
    "fill":["Fill color.",colorDic],
    "solid":["Line style."],
    "dotted":["Line style."],
    "densely dotted":["Line style."],
    "loosely dotted":["Line style."],
    "dashed":["Line style."],
    "densely dashed":["Line style."],
    "loosely dashed":["Line style."],
    "dashdotted":["Line style."],
    "densely dashdotted":["Line style."],
    "loosely dashdotted":["Line style."],
    "line width":["",{
        "1pt":       ["Line width.","none",""]
    }],
    "ultra thin":["Line width."],
    "very thin":["Line width."],
    "thin":["Line width."],
    "semithick":["Line width."],
    "thick":["Line width."],
    "very thick":["Line width."],
    "ultra thick":["Line width."],
};

// 布林值字典
var boolDic = {
    "true":["","none",""],
    "false":["","none",""],
};

var enlargeDic = {
    "0.05": ["a lot of series","none",""],
    "0.8":  ["not too many of series","none",""],
};

// 全局参数字典
var globalparamDic = {
    "ybar stacked":["Vertically stacked."],
    "xbar stacked":["Horizontally stacked."],
    "stack plots":["", {
        "y":    ["Vertically stacked.","url",""],
        "x":    ["Hotizontally stacked","url",""],
    }],
    "area style":[""],
    "ybar interval":["Vertical Histogram."],
    "xticklabel interval boundaries":["Histogram x label."],
    "xtick distance":["",{
        "1":     ["Difference in x.","none",""],
    }],
    "ytick distance":["",{
        "1":     ["Difference in y.","none",""],
    }],
    "ztick distance":["",{
        "1":     ["Difference in z.","none",""],
    }],
    "xmajorgrids":["",boolDic],
    "ymajorgrids":["",boolDic],
    "zmajorgrids":["",boolDic],
    "xminorgrids":["",boolDic],
    "yminorgrids":["",boolDic],
    "zminorgrids":["",boolDic],
    "colormap/":["",{
        "viridis":           ["","colormap","#440154,#481D6F,#453681,#3C4D8A,#32628D,#2A768E,#23898D,#1E9B89,#28AE7F,#45BF6F,#70CE56,#A2DA37,#D7E219"],
        "hot":              ["","colormap","blue,yellow,orange,red"],
        "hot2":             ["","colormap","#000000 0%,#FF0000 37%,#FFFF00 75%,#FFFFFF 100%"],
        "jet":              ["","colormap","#000080 0%,#0000FF 12%,#00FFFF 37%,#FFFF00 62%,#FF0000 87%,#800000 100%"],
        "blackwhite":       ["","colormap","gray,white"],
        "bluered":          ["","colormap","#0000B4 0%,#00FFFF 20%,#64FF00 40%,#FFFF00 60%,#FF0000 80%,#800000 100%"],
        "cool":             ["","colormap","#FFFFFF 0%,#0080FF 50%,#FF00FF 100%"],
        "greenyellow":      ["","colormap","#008000 0%,#FFFF00 100%"],
        "redyellow":        ["","colormap","#FF0000 0%,#FFFF00 100%"],
        "violet":           ["","colormap","#19197A,#FFFFFF,#EE8CEE"],
    }],
    "colorbar":[""],
    "colorbar horizontal":[""],
    "colorbar left":[""],
    "colorbar sampled":[""],
    "colorbar sampled line":[""],
    "cycle list name":["",{
        "color":            ["","url","cyclelist/svg/color.svg"],
        "exotic":           ["","url","cyclelist/svg/exotic.svg"],
        "black white":      ["","url","cyclelist/svg/black white.svg"],
        "mark list":        ["","url","cyclelist/svg/mark list.svg"],
        "mark list*":       ["","url","cyclelist/svg/mark listm.svg"],
        "color list":       ["","url","cyclelist/svg/color list.svg"],
        "linestyles":      ["","url","cyclelist/svg/linestyles.svg"],
        "linestyles*":     ["","url","cyclelist/svg/linestylesm.svg"],
    }],
    "cycle list":["",{
        "{[of colormap]}":                      ["derived from colormap","none",""],
        "{[indices of colormap={0,1,2,3}]}":    ["indices from colormap","none",""],
        "{{blue},{red},{dashed}}":              ["user-defined","none",""],
    }],
    "legend style":["",{
        "{at={(0.5,-0.1)},anchor=north},legend columns=3":       ["bottom","none",""],
        "{at={(0.5,1.03)},anchor=south},legend columns=3":       ["top","none",""],
        "{draw=none}":                                           ["no border","none",""],
    }],
    "symbolic x coords":["",{
        "{Alice,Bob,Tom}":                              ["Symbolic set in x.","none",""],
    }],
    "symbolic y coords":["",{
        "{Alice,Bob,Tom}":                              ["Symbolic set in y.","none",""],
    }],
    "nodes near coords":["Data label."],
};

// 三维参数增补字典
var etdparamDic = {
    "mesh":[""],
    "surf":[""],
    "contour filled":[""],
    "contour gnuplot":[""],
};

// 标记库增补字典
var plotmarksDic = {
    "-":                        ["","url","mark/svg/minus.svg"],
    "|":                        ["","url","mark/svg/vert.svg"],
    "o":                        ["","url","mark/svg/o.svg"],
    "asterisk":                 ["","url","mark/svg/asterisk.svg"],
    "star":                     ["","url","mark/svg/star.svg"],
    "10-pointed star":          ["","url","mark/svg/10-pointed star.svg"],
    "oplus":                    ["","url","mark/svg/oplus.svg"],
    "oplus*":                   ["","url","mark/svg/oplusm.svg"],
    "otimes":                   ["","url","mark/svg/otimes.svg"],
    "otimes*":                  ["","url","mark/svg/otimesm.svg"],
    "square":                   ["","url","mark/svg/square.svg"],
    "square*":                  ["","url","mark/svg/squarem.svg"],
    "triangle":                 ["","url","mark/svg/triangle.svg"],
    "triangle*":                ["","url","mark/svg/trianglem.svg"],
    "diamond":                  ["","url","mark/svg/diamond.svg"],
    "diamond*":                 ["","url","mark/svg/diamondm.svg"],
    "halfdiamond*":             ["","url","mark/svg/halfdiamondm.svg"],
    "halfsquare*":              ["","url","mark/svg/halfsquarem.svg"],
    "halfsquare right*":        ["","url","mark/svg/halfsquare rightm.svg"],
    "halfsquare left*":         ["","url","mark/svg/halfsquare leftm.svg"],
    "Mercedes star":            ["","url","mark/svg/Mercedes star.svg"],
    "Mercedes star flipped":   ["","url","mark/svg/Mercedes star flipped.svg"],
    "halfcircle":               ["","url","mark/svg/halfcircle.svg"],
    "halfcircle*":              ["","url","mark/svg/halfcirclem.svg"],
    "pentagon":                 ["","url","mark/svg/pentagon.svg"],
    "pentagon*":                ["","url","mark/svg/pentagonm.svg"],
    "ball":                     ["","url","mark/svg/ball.svg"],
    "cube":                     ["","url","mark/svg/cube.svg"],
    "cube*":                    ["","url","mark/svg/cubem.svg"],
};

var cyclelist_default = ["Cycle list from colorbrewer.",{}];

var colorbrewerArrayDic = {
    "seq":[
        [],
        [],
        [0,1,2,3,4,5,6,7,8,9,10,11,12],
        [2,5,8],                                    // 3
        [1,4,6,9],
        [1,4,6,8,10],
        [1,3,5,6,8,10],
        [1,3,5,6,7,9,11],
        [0,2,3,5,6,7,9,11],
        [0,2,3,5,6,7,9,10,12]
    ],
    "div":[
        [],
        [],
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
        [4,7,10],                                   // 3
        [2,5,9,12],
        [2,5,7,9,12],
        [1,4,6,8,10,13],
        [1,4,6,7,8,10,13],
        [1,3,5,6,8,9,11,13],
        [1,3,5,6,7,8,9,11,13],
        [0,1,3,5,6,8,9,11,13,14],
        [0,1,3,5,6,7,8,9,11,13,14]
    ],
    "qual":[
        [],
        [],
        [0,1,2,3,4,5,6,7,8,9,10,11],
        [0,1,2],                                    // 3
        [0,1,2,3],
        [0,1,2,3,4],
        [0,1,2,3,4,5],
        [0,1,2,3,4,5,6],
        [0,1,2,3,4,5,6,7],
        [0,1,2,3,4,5,6,7,8],
        [0,1,2,3,4,5,6,7,8,9],
        [0,1,2,3,4,5,6,7,8,9,10],
        [0,1,2,3,4,5,6,7,8,9,10,11]
    ]
};

// 颜色库增补字典
var colorbrewerDic = 
{
    "BuGn-":                ["", "colormap", "#F7FCFD,#EDF8FB,#E5F5F9,#CCECE6,#B2E2E2,#99D8C9,#66C2A4,#41AE76,#2CA25F,#238B45,#006D2C,#005824,#00441B","seq"],
    "BuPu-":                ["", "colormap", "#F7FCFD,#EDF8FB,#E0ECF4,#BFD3E6,#B3CDE3,#9EBCDA,#8C96C6,#8C6BB1,#8856A7,#88419D,#810F7C,#6E016B,#4D004B","seq"],
    "GnBu-":                ["", "colormap", "#F7FCF0,#F0F9E8,#E0F3DB,#CCEBC5,#BAE4BC,#A8DDB5,#7BCCC4,#4EB3D3,#43A2CA,#2B8CBE,#0868AC,#08589E,#084081","seq"],
    "OrRd-":                ["", "colormap", "#FFF7EC,#FEF0D9,#FEE8C8,#FDD49E,#FDCC8A,#FDBB84,#FC8D59,#EF6548,#E34A33,#D7301F,#B30000,#990000,#7F0000","seq"],
    "PuBu-":                ["", "colormap", "#FFF7FB,#F1EEF6,#ECE7F2,#D0D1E6,#BDC9E1,#A6BDDB,#74A9CF,#3690C0,#2B8CBE,#0570B0,#045A8D,#034E7B,#023858","seq"],
    "PuBuGn-":              ["", "colormap", "#FFF7FB,#F6EFF7,#ECE2F0,#D0D1E6,#BDC9E1,#A6BDDB,#67A9CF,#3690C0,#1C9099,#02818A,#016C59,#016450,#014636","seq"],
    "PuRd-":                ["", "colormap", "#F7F4F9,#F1EEF6,#E7E1EF,#D4B9DA,#D7B5D8,#C994C7,#DF65B0,#E7298A,#DD1C77,#CE1256,#980043,#91003F,#67001F","seq"],
    "RdPu-":                ["", "colormap", "#FFF7F3,#FEEBE2,#FDE0DD,#FCC5C0,#FBB4B9,#FA9FB5,#F768A1,#DD3497,#C51B8A,#AE017E,#7A0177,#7A0177,#49006A","seq"],
    "YlGn-":                ["", "colormap", "#FFFFE5,#FFFFCC,#F7FCB9,#D9F0A3,#C2E699,#ADDD8E,#78C679,#41AB5D,#31A354,#238443,#006837,#005A32,#004529","seq"],
    "YlGnBu-":              ["", "colormap", "#FFFFD9,#FFFFCC,#EDF8B1,#C7E9B4,#A1DAB4,#7FCDBB,#41B6C4,#1D91C0,#2C7FB8,#225EA8,#253494,#0C2C84,#081D58","seq"],
    "YlOrBr-":              ["", "colormap", "#FFFFE5,#FFFFD4,#FFF7BC,#FEE391,#FED98E,#FEC44F,#FE9929,#EC7014,#D95F0E,#CC4C02,#993404,#8C2D04,#662506","seq"],
    "YlOrRd-":              ["", "colormap", "#FFFFCC,#FFFFB2,#FFEDA0,#FED976,#FECC5C,#FEB24C,#FD8D3C,#FC4E2A,#F03B20,#E31A1C,#BD0026,#B10026,#800026","seq"],
    "Blues-":               ["", "colormap", "#F7FBFF,#EFF3FF,#DEEBF7,#C6DBEF,#BDD7E7,#9ECAE1,#6BAED6,#4292C6,#3182BD,#2171B5,#08519C,#084594,#08306B","seq"],
    "Greens-":              ["", "colormap", "#F7FCF5,#EDF8E9,#E5F5E0,#C7E9C0,#BAE4B3,#A1D99B,#74C476,#41AB5D,#31A354,#238B45,#006D2C,#005A32,#00441B","seq"],
    "Greys-":               ["", "colormap", "#FFFFFF,#F7F7F7,#F0F0F0,#D9D9D9,#CCCCCC,#BDBDBD,#969696,#737373,#636363,#525252,#252525,#252525,#000000","seq"],
    "Oranges-":             ["", "colormap", "#FFF5EB,#FEEDDE,#FEE6CE,#FDD0A2,#FDBE85,#FDAE6B,#FD8D3C,#F16913,#E6550D,#D94701,#A63603,#8C2D04,#7F2704","seq"],
    "Purples-":             ["", "colormap", "#FCFBFD,#F2F0F7,#EFEDF5,#DADAEB,#CBC9E2,#BCBDDC,#9E9AC8,#807DBA,#756BB1,#6A51A3,#54278F,#4A1486,#3F007D","seq"],
    "Reds-":                ["", "colormap", "#FFF5F0,#FEE5D9,#FEE0D2,#FCBBA1,#FCAE91,#FC9272,#FB6A4A,#EF3B2C,#DE2D26,#CB181D,#A50F15,#99000D,#67000D","seq"],

    "BrBG-":                ["", "colormap", "#543005,#8C510A,#A6611A,#BF812D,#D8B365,#DFC27D,#F6E8C3,#F5F5F5,#C7EAE5,#80CDC1,#5AB4AC,#35978F,#018571,#01665E,#003C30","div"],
    "PiYG-":                ["", "colormap", "#8E0152,#C51B7D,#D01C8B,#DE77AE,#E9A3C9,#F1B6DA,#FDE0EF,#F7F7F7,#E6F5D0,#B8E186,#A1D76A,#7FBC41,#4DAC26,#4D9221,#276419","div"],
    "PRGn-":                ["", "colormap", "#40004B,#762A83,#7B3294,#9970AB,#AF8DC3,#C2A5CF,#E7D4E8,#F7F7F7,#D9F0D3,#A6DBA0,#7FBF7B,#5AAE61,#008837,#1B7837,#00441B","div"],
    "RdGy-":                ["", "colormap", "#67001F,#B2182B,#CA0020,#D6604D,#EF8A62,#F4A582,#FDDBC7,#FFFFFF,#E0E0E0,#BABABA,#999999,#878787,#404040,#4D4D4D,#1A1A1A","div"],
    "PuOr-":                ["", "colormap", "#7F3B08,#B35806,#E66101,#E08214,#F1A340,#FDB863,#FEE0B6,#F7F7F7,#D8DAEB,#B2ABD2,#998EC3,#8073AC,#5E3C99,#542788,#2D004B","div"],
    "RdBu-":                ["", "colormap", "#67001F,#B2182B,#CA0020,#D6604D,#EF8A62,#F4A582,#FDDBC7,#F7F7F7,#D1E5F0,#92C5DE,#67A9CF,#4393C3,#0571B0,#2166AC,#053061","div"],
    "RdYlBu-":              ["", "colormap", "#A50026,#D73027,#D7191C,#F46D43,#FC8D59,#FDAE61,#FEE090,#FFFFBF,#E0F3F8,#ABD9E9,#91BFDB,#74ADD1,#2C7BB6,#4575B4,#313695","div"],
    "RdYlGn-":              ["", "colormap", "#A50026,#D73027,#D7191C,#F46D43,#FC8D59,#FDAE61,#FEE08B,#FFFFBF,#D9EF8B,#A6D96A,#91CF60,#66BD63,#1A9641,#1A9850,#006837","div"],
    "Spectral-":            ["", "colormap", "#9E0142,#D53E4F,#D7191C,#F46D43,#FC8D59,#FDAE61,#FEE08B,#FFFFBF,#E6F598,#ABDDA4,#99D594,#66C2A5,#2B83BA,#3288BD,#5E4FA2","div"],

    "Accent-":              ["", "colormap", "#7FC97F,#BEAED4,#FDC086,#FFFF99,#386CB0,#F0027F,#BF5B17,#666666","qual",8],
    "Pastel1-":             ["", "colormap", "#FBB4AE,#B3CDE3,#CCEBC5,#DECBE4,#FED9A6,#FFFFCC,#E5D8BD,#FDDAEC,#F2F2F2","qual",9],
    "Pastel2-":             ["", "colormap", "#B3E2CD,#FDCDAC,#CBD5E8,#F4CAE4,#E6F5C9,#FFF2AE,#F1E2CC,#CCCCCC","qual",8],
    "Dark2-":               ["", "colormap", "#1B9E77,#D95F02,#7570B3,#E7298A,#66A61E,#E6AB02,#A6761D,#666666","qual",8],
    "Set1-":                ["", "colormap", "#E41A1C,#377EB8,#4DAF4A,#984EA3,#FF7F00,#FFFF33,#A65628,#F781BF,#999999","qual",9],
    "Set2-":                ["", "colormap", "#66C2A5,#FC8D62,#8DA0CB,#E78AC3,#A6D854,#FFD92F,#E5C494,#B3B3B3","qual",8],
    "Set3-":                ["", "colormap", "#8DD3C7,#FFFFB3,#BEBADA,#FB8072,#80B1D3,#FDB462,#B3DE69,#FCCDE5,#D9D9D9,#BC80BD,#CCEBC5,#FFED6F","qual",12],
    "Paired-":              ["", "colormap", "#A6CEE3,#1F78B4,#B2DF8A,#33A02C,#FB9A99,#E31A1C,#FDBF6F,#FF7F00,#CAB2D6,#6A3D9A,#FFFF99,#B15928","qual",12],
};

// 渐变库增补字典
var colormapsDic = {
    "bled":             ["","colormap","#000000,#2B2B00,#005500,#008080,#0000AA,#D500D5,#FF0000"],
    "bright":           ["","colormap","#000000,#4E0364,#024AFF,#FF15B5,#FF711A,#93D572,#E6FF00,#FFFFFF"],
    "bone":             ["","colormap","#000000 0%,#545474 37%,#A7C7C7 75%,#FFFFFF 100%"],
    "cold":             ["","colormap","#000000,#0000FF,#00FFFF,#FFFFFF"],
    "copper":           ["","colormap","#000000 0%,#FF9F65 80%,#FFC77F 100%"],
    "copper2":          ["","colormap","#000000,#443E3F,#AA705F,#CFC28A,#FFFFFF"],
    "earth":            ["","colormap","#000000,#001C0F,#2A2706,#1C4921,#435518,#44702E,#518153,#7C8957,#99937A,#91ADA4,#90CAB4,#ABDCB1,#DAE5A8,#FFEBC7,#FFFFFF"],
    "gray":             ["","colormap","black,white"],
    "hsv":              ["","colormap","#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000"],
    "hsv2":             ["","colormap","#000000,#800080,#0000E6,#00FFFF,#00FF00,#FFFF00,#FF0000"],
    "pastel":           ["","colormap","#000000,#780005,#005BAC,#D723D9,#78AC4E,#FFB018,#E6FF00,#FFFFFF"],
    "pink":             ["","colormap","#000000,#0C102E,#3E162B,#353541,#4F483A,#7A5043,#935B66,#93738C,#90919A,#ADA392,#D8AB95,#FAB3B3,#FFC6E3,#F6E5FF,#FFFFFF"],
    "sepia":            ["","colormap","#000000 0%,#1A0D00 5%,#FFE6CC 90%,#FFFFFF 100%"],
    "spring":           ["","colormap","#FF00FF,#FFFF00"],
    "summer":           ["","colormap","#008066,#FFFF66"],
    "autumn":           ["","colormap","#FF0000,#FFFF00"],
    "winter":           ["","colormap","#0000FF,#00FF80"],
    "temp":             ["","colormap","#2400D9,#191DF7,#2957FF,#3D87FF,#57B0FF,#75D3FF,#99EBFF,#BDF9FF,#EBFFFF,#FFFFEB,#FFF2BD,#FFD699,#FFAC75,#FF7857,#FF3D3D,#F72836,#D91630,#A60021"],
    "thermal":          ["","colormap","#000000,#4D00B3,#FF3300,#FFFF00,#FFFFFF"],
    "viridis high res":  ["","colormap","#440154,#440255,#440357,#450558,#45065A,#45085B,#46095C,#460B5E,#460C5F,#460E61,#470F62,#471163,#471265,#471466,#471567,#471669,#47186A,#48196B,#481A6C,#481C6E,#481D6F,#481E70,#482071,#482172,#482273,#482374,#472575,#472676,#472777,#472878,#472A79,#472B7A,#472C7B,#462D7C,#462F7C,#46307D,#46317E,#45327F,#45347F,#453580,#453681,#443781,#443982,#433A83,#433B83,#433C84,#423D84,#423E85,#424085,#414186,#414286,#404387,#404487,#3F4587,#3F4788,#3E4888,#3E4989,#3D4A89,#3D4B89,#3D4C89,#3C4D8A,#3C4E8A,#3B508A,#3B518A,#3A528B,#3A538B,#39548B,#39558B,#38568B,#38578C,#37588C,#37598C,#365A8C,#365B8C,#355C8C,#355D8C,#345E8D,#345F8D,#33608D,#33618D,#32628D,#32638D,#31648D,#31658D,#31668D,#30678D,#30688D,#2F698D,#2F6A8D,#2E6B8E,#2E6C8E,#2E6D8E,#2D6E8E,#2D6F8E,#2C708E,#2C718E,#2C728E,#2B738E,#2B748E,#2A758E,#2A768E,#2A778E,#29788E,#29798E,#287A8E,#287A8E,#287B8E,#277C8E,#277D8E,#277E8E,#267F8E,#26808E,#26818E,#25828E,#25838D,#24848D,#24858D,#24868D,#23878D,#23888D,#23898D,#22898D,#228A8D,#228B8D,#218C8D,#218D8C,#218E8C,#208F8C,#20908C,#20918C,#1F928C,#1F938B,#1F948B,#1F958B,#1F968B,#1E978A,#1E988A,#1E998A,#1E998A,#1E9A89,#1E9B89,#1E9C89,#1E9D88,#1E9E88,#1E9F88,#1EA087,#1FA187,#1FA286,#1FA386,#20A485,#20A585,#21A685,#21A784,#22A784,#23A883,#23A982,#24AA82,#25AB81,#26AC81,#27AD80,#28AE7F,#29AF7F,#2AB07E,#2BB17D,#2CB17D,#2EB27C,#2FB37B,#30B47A,#32B57A,#33B679,#35B778,#36B877,#38B976,#39B976,#3BBA75,#3DBB74,#3EBC73,#40BD72,#42BE71,#44BE70,#45BF6F,#47C06E,#49C16D,#4BC26C,#4DC26B,#4FC369,#51C468,#53C567,#55C666,#57C665,#59C764,#5BC862,#5EC961,#60C960,#62CA5F,#64CB5D,#67CC5C,#69CC5B,#6BCD59,#6DCE58,#70CE56,#72CF55,#74D054,#77D052,#79D151,#7CD24F,#7ED24E,#81D34C,#83D34B,#86D449,#88D547,#8BD546,#8DD644,#90D643,#92D741,#95D73F,#97D83E,#9AD83C,#9DD93A,#9FD938,#A2DA37,#A5DA35,#A7DB33,#AADB32,#ADDC30,#AFDC2E,#B2DD2C,#B5DD2B,#B7DD29,#BADE27,#BDDE26,#BFDF24,#C2DF22,#C5DF21,#C7E01F,#CAE01E,#CDE01D,#CFE11C,#D2E11B,#D4E11A,#D7E219,#DAE218,#DCE218,#DFE318,#E1E318,#E4E318,#E7E419,#E9E419,#ECE41A,#EEE51B,#F1E51C,#F3E51E,#F6E61F,#F8E621,#FAE622,#FDE724"],
} 

// 统计库增补字典
var statisticsDic = {
    "boxplot":                  [""],
    "boxplot prepared":         ["",{
        "{lower whisker=,lower quartile=,median=,upper quartile=,upper whisker=}":       ["","url",""],
    }],
    "hist":                     ["Histogram.",{
        "{bins=10}":            ["Number of bins.","url",""],
        "{data=}":              ["Column of data.","none",""],
        "cumulative":           ["","url",""],
        "density":              ["","url",""],
    }],
};

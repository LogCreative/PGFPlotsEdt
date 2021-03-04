// 颜色字典
var colorDic = {
    "none":     ["无颜色","color","transparent"],
    "red":      ["红色","color","#FF0000"],
    "green":    ["绿色","color","#00FF00"],
    "blue":     ["蓝色","color","#0000FF"],
    "cyan":     ["青色","color","#00AEEF"],
    "magenta":  ["洋红","color","#ED028C"],
    "yellow":   ["黄色","color","#FFF101"],
    "black":    ["黑色","color","#000000"],
    "gray":     ["灰色","color","#808080"],
    "white":    ["白色","color","#FFFFFF"],
    "darkgrey": ["深灰","color","#404040"],
    "lightgrey":["浅灰","color","#BFBFBF"],
    "brown":    ["棕色","color","#BF8040"],
    "lime":     ["酸橙色","color","#BFFF00"],
    "olive":    ["橄榄绿","color","#968D00"],
    "orange":   ["橙色","color","#FF8000"],
    "pink":     ["粉色","color","#FFBFBF"],
    "purple":   ["紫色","color","#BF0040"],
    "teal":     ["蓝绿色","color","#008080"],
    "violet":   ["紫罗兰色","color","#800080"],
};

// 系列的参数字典
// TODO: 使用 json 读取
var sparamDic = {
    "mark":["散点标记",{
        "*":    ["圆点","url",""],
        "x":    ["叉号","url",""],
        "+":    ["加号","url",""],
    }],
    "only marks":["只显示散点标记"],
    "no markers":["无标记"],
    "text mark":["文字标记",{
        "字符":         ["显示的标记文字","none",""]
    }],
    "scatter":["七彩散点标记"],
    "ybar":["纵向柱形图"],
    "xbar":["横向柱形图"],
    "domain":["自变量定义域",{
        "起始:终止":    ["自变量的起始与终止点","none",""]
    }],
    "samples":["取样数量",{
        "数量":         ["样本点的取样数量","none",""]
    }],
    "color":["颜色",colorDic],
    "draw":["线形颜色",colorDic],
    "fill":["填充颜色",colorDic],
    "solid":["实线"],
    "dotted":["点线"],
    "densely dotted":["密点线"],
    "loosely dotted":["疏点线"],
    "dashed":["虚线"],
    "densely dashed":["密虚线"],
    "loosely dashed":["疏虚线"],
    "dashdotted":["点虚线"],
    "densely dashdotted":["密点虚线"],
    "loosely dashdotted":["虚点虚线"],
    "line width":["线条粗细",{
        "点数pt":       ["线条粗细","none",""]
    }],
    "ultra thin":["极细线"],
    "very thin":["超细线"],
    "thin":["细线"],
    "semithick":["半粗线"],
    "thick":["粗线"],
    "very thick":["超粗线"],
    "ultra thick":["极粗线"],
};

// 布林值字典
var boolDic = {
    "true":["有","none",""],
    "false":["无","none",""],
};

// 全局参数字典
var globalparamDic = {
    "ybar stacked":["纵向堆积柱形图"],
    "xbar stacked":["横向堆积柱形图"],
    "stack plots":["堆积图", {
        "y":    ["纵向堆积图","url",""],
        "x":    ["横向堆积图","url",""],
    }],
    "ybar interval":["纵向直方图"],
    "xticklabel interval boundaries":["直方图横轴数据标签"],
    "xmajorgrids":["x轴大网格",boolDic],
    "ymajorgrids":["y轴大网格",boolDic],
    "zmajorgrids":["z轴大网格",boolDic],
    "xminorgrids":["x轴小网格",boolDic],
    "yminorgrids":["y轴小网格",boolDic],
    "zminorgrids":["z轴小网格",boolDic],
};

// 三维参数增补字典
var etdparamDic = {
    "mesh":["曲面线框"],
    "surf":["曲面填充层"],
    "contour filled":["等高填充图"],
    "contour gnuplot":["等高线图"],
};

// 标记库增补字典
var plotmarksDic = {
    "-":                        ["减号","url",""],
    "|":                        ["竖线","url",""],
    "o":                        ["圆圈","url",""],
    "asterisk":                 ["星号","url",""],
    "star":                     ["五点星","url",""],
    "10-pointed star":          ["十点星","url",""],
    "oplus":                    ["加号圆","url",""],
    "oplus*":                   ["填充加号圆","url",""],
    "otimes":                   ["乘号圆","url",""],
    "otimes*":                  ["填充乘号圆","url",""],
    "square":                   ["方块","url",""],
    "square*":                  ["填充方块","url",""],
    "triangle":                 ["三角形","url",""],
    "triangle*":                ["填充三角形","url",""],
    "diamond":                  ["菱形","url",""],
    "diamond*":                 ["填充菱形","url",""],
    "halfdiamond*":             ["半填充菱形","url",""],
    "halfsquare*":              ["半填充方形（下）","url",""],
    "halfsquare right*":        ["半填充方形（右）","url",""],
    "halfsquare left*":         ["半填充方形（左）","url",""],
    "Mercedes star":            ["三点星","url",""],
    "Mercedes star filipped":   ["翻转三点星","url",""],
    "halfcircle":               ["半分圆","url",""],
    "halfcircle*":              ["填充半分圆","url",""],
    "pentagon":                 ["五边形","url",""],
    "pentagon*":                ["填充五边形","url",""],
    "ball":                     ["球","url",""],
    "cube":                     ["方块","url",""],
    "cube*":                    ["填充方块","url",""],
};

// 颜色库增补字典
// 用代码生成 开始颜色  结束颜色 中间平均分
// var colorbrewerDic = {
//     "BuGn-": ["蓝绿连续渐变","colormap",{
//         "A":"#F7FCFD",
//         "B":"#EDF8FB",
//         "C":"#E5F5F9",
//         "D":"#CCECE6",
//         "E":"#B2E2E2",
//         "F":"#99D8C9",
//         "G":"#66C2A4",
//         "H":"#41AE76",
//         "I":"#2CA25F",
//         "J":"#238B45",
//         "K":"#006D2C",
//         "L":"#005824",
//         "M":"#00441B",
//     }],
//     "BuPu-":["蓝紫连续渐变","colormap",{
//         "A":"#F7FCFD",
//         "B":"#EDF8FB",
//         "C":"#E0ECF4",
//         "D":"#BFD3E6",
//         "E":"#B3CDE3",
//         "F":"#9EBCDA",
//         "G":"#8C96C6",
//         "H":"#8C6BB1",
//         "I":"#8856A7",
//         "J":"#88419D",
//         "K":"#810F7C",
//         "L":"#6E016B",
//         "M":"#4D004B",
//     }],
//     "GnBu-":["绿蓝连续渐变","colormap",{
//         "A":"#F7FCF0",
//         "B":"#F0F9E8",
//         "C":"#E0F3DB",
//         "D":"#CCEBC5",
//         "E":"#BAE4BC",
//         "F":"#A8DDB5",
//         "G":"#7BCCC4",
//         "H":"#4EB3D3",
//         "I":"#43A2CA",
//         "J":"#2B8CBE",
//         "K":"#0868AC",
//         "L":"#08589E",
//         "M":"#084081",
//     }],
//     "OrRd-":["橙红连续渐变","colormap",{
//         "A":"#FFF7EC",
//         "B":"#FEF0D9",
//         "C":"#FEE8C8",
//         "D":"#FDD49E",
//         "E":"#FDCC8A",
//         "F":"#FDBB84",
//         "G":"#FC8D59",
//         "H":"#EF6548",
//         "I":"#E34A33",
//         "J":"#D7301F",
//         "K":"#B30000",
//         "L":"#990000",
//         "M":"#7F0000",
//     }],
//     "PuBu-":["紫蓝连续渐变","colormap",{
//         "A":"#FFF7FB",
//         "B":"#F1EEF6",
//         "C":"#ECE7F2",
//         "D":"#D0D1E6",
//         "E":"#BDC9E1",
//         "F":"#A6BDDB",
//         "G":"#74A9CF",
//         "H":"#3690C0",
//         "I":"#2B8CBE",
//         "J":"#0570B0",
//         "K":"#045A8D",
//         "L":"#034E7B",
//         "M":"#023858",
//     }]
// };

// var colorbrewerDic = {
//     "BuGn-": ["蓝绿连续渐变","colormap",[
//         "#F7FCFD",
//         "",
//         "#00441B",
//     ]],
//     "BuPu-":["蓝紫连续渐变","colormap",[
//         "#F7FCFD",
//         "",
//         "#4D004B",
//     ]],
// }

var colorbrewerDic = 
{
    "Accent-":              ["", "colormap", "#7FC97F,#BEAED4,#FDC086,#FFFF99,#386CB0,#F0027F,#BF5B17,#666666"],
    "Blues-":               ["", "colormap", "#F7FBFF,#EFF3FF,#DEEBF7,#C6DBEF,#BDD7E7,#9ECAE1,#6BAED6,#4292C6,#3182BD,#2171B5,#08519C,#084594,#08306B"],
    "BrBG-":                ["", "colormap", "#543005,#8C510A,#A6611A,#BF812D,#D8B365,#DFC27D,#F6E8C3,#F5F5F5,#C7EAE5,#80CDC1,#5AB4AC,#35978F,#018571,#01665E,#003C30"],
    "BuGn-":                ["", "colormap", "#F7FCFD,#EDF8FB,#E5F5F9,#CCECE6,#B2E2E2,#99D8C9,#66C2A4,#41AE76,#2CA25F,#238B45,#006D2C,#005824,#00441B"],
    "BuPu-":                ["", "colormap", "#F7FCFD,#EDF8FB,#E0ECF4,#BFD3E6,#B3CDE3,#9EBCDA,#8C96C6,#8C6BB1,#8856A7,#88419D,#810F7C,#6E016B,#4D004B"],
    "Dark2-":               ["", "colormap", "#1B9E77,#D95F02,#7570B3,#E7298A,#66A61E,#E6AB02,#A6761D,#666666"],
    "GnBu-":                ["", "colormap", "#F7FCF0,#F0F9E8,#E0F3DB,#CCEBC5,#BAE4BC,#A8DDB5,#7BCCC4,#4EB3D3,#43A2CA,#2B8CBE,#0868AC,#08589E,#084081"],
    "Greens-":              ["", "colormap", "#F7FCF5,#EDF8E9,#E5F5E0,#C7E9C0,#BAE4B3,#A1D99B,#74C476,#41AB5D,#31A354,#238B45,#006D2C,#005A32,#00441B"],
    "Greys-":               ["", "colormap", "#FFFFFF,#F7F7F7,#F0F0F0,#D9D9D9,#CCCCCC,#BDBDBD,#969696,#737373,#636363,#525252,#252525,#252525,#000000"],
    "OrRd-":                ["", "colormap", "#FFF7EC,#FEF0D9,#FEE8C8,#FDD49E,#FDCC8A,#FDBB84,#FC8D59,#EF6548,#E34A33,#D7301F,#B30000,#990000,#7F0000"],
    "Oranges-":             ["", "colormap", "#FFF5EB,#FEEDDE,#FEE6CE,#FDD0A2,#FDBE85,#FDAE6B,#FD8D3C,#F16913,#E6550D,#D94701,#A63603,#8C2D04,#7F2704"],
    "PRGn-":                ["", "colormap", "#40004B,#762A83,#7B3294,#9970AB,#AF8DC3,#C2A5CF,#E7D4E8,#F7F7F7,#D9F0D3,#A6DBA0,#7FBF7B,#5AAE61,#008837,#1B7837,#00441B"],
    "Paired-":              ["", "colormap", "#A6CEE3,#1F78B4,#B2DF8A,#33A02C,#FB9A99,#E31A1C,#FDBF6F,#FF7F00,#CAB2D6,#6A3D9A,#FFFF99,#B15928"],        "Pastel1-":             ["", "colormap", "#FBB4AE,#B3CDE3,#CCEBC5,#DECBE4,#FED9A6,#FFFFCC,#E5D8BD,#FDDAEC,#F2F2F2"],
    "Pastel2-":             ["", "colormap", "#B3E2CD,#FDCDAC,#CBD5E8,#F4CAE4,#E6F5C9,#FFF2AE,#F1E2CC,#CCCCCC"],
    "PiYG-":                ["", "colormap", "#8E0152,#C51B7D,#D01C8B,#DE77AE,#E9A3C9,#F1B6DA,#FDE0EF,#F7F7F7,#E6F5D0,#B8E186,#A1D76A,#7FBC41,#4DAC26,#4D9221,#276419"],
    "PuBu-":                ["", "colormap", "#FFF7FB,#F1EEF6,#ECE7F2,#D0D1E6,#BDC9E1,#A6BDDB,#74A9CF,#3690C0,#2B8CBE,#0570B0,#045A8D,#034E7B,#023858"],
    "PuBuGn-":              ["", "colormap", "#FFF7FB,#F6EFF7,#ECE2F0,#D0D1E6,#BDC9E1,#A6BDDB,#67A9CF,#3690C0,#1C9099,#02818A,#016C59,#016450,#014636"],
    "PuOr-":                ["", "colormap", "#7F3B08,#B35806,#E66101,#E08214,#F1A340,#FDB863,#FEE0B6,#F7F7F7,#D8DAEB,#B2ABD2,#998EC3,#8073AC,#5E3C99,#542788,#2D004B"],
    "PuRd-":                ["", "colormap", "#F7F4F9,#F1EEF6,#E7E1EF,#D4B9DA,#D7B5D8,#C994C7,#DF65B0,#E7298A,#DD1C77,#CE1256,#980043,#91003F,#67001F"],
    "Purples-":             ["", "colormap", "#FCFBFD,#F2F0F7,#EFEDF5,#DADAEB,#CBC9E2,#BCBDDC,#9E9AC8,#807DBA,#756BB1,#6A51A3,#54278F,#4A1486,#3F007D"],
    "RdBu-":                ["", "colormap", "#67001F,#B2182B,#CA0020,#D6604D,#EF8A62,#F4A582,#FDDBC7,#F7F7F7,#D1E5F0,#92C5DE,#67A9CF,#4393C3,#0571B0,#2166AC,#053061"],
    "RdGy-":                ["", "colormap", "#67001F,#B2182B,#CA0020,#D6604D,#EF8A62,#F4A582,#FDDBC7,#FFFFFF,#E0E0E0,#BABABA,#999999,#878787,#404040,#4D4D4D,#1A1A1A"],
    "RdPu-":                ["", "colormap", "#FFF7F3,#FEEBE2,#FDE0DD,#FCC5C0,#FBB4B9,#FA9FB5,#F768A1,#DD3497,#C51B8A,#AE017E,#7A0177,#7A0177,#49006A"],
    "RdYlBu-":              ["", "colormap", "#A50026,#D73027,#D7191C,#F46D43,#FC8D59,#FDAE61,#FEE090,#FFFFBF,#E0F3F8,#ABD9E9,#91BFDB,#74ADD1,#2C7BB6,#4575B4,#313695"],
    "RdYlGn-":              ["", "colormap", "#A50026,#D73027,#D7191C,#F46D43,#FC8D59,#FDAE61,#FEE08B,#FFFFBF,#D9EF8B,#A6D96A,#91CF60,#66BD63,#1A9641,#1A9850,#006837"],
    "Reds-":                ["", "colormap", "#FFF5F0,#FEE5D9,#FEE0D2,#FCBBA1,#FCAE91,#FC9272,#FB6A4A,#EF3B2C,#DE2D26,#CB181D,#A50F15,#99000D,#67000D"],
    "Set1-":                ["", "colormap", "#E41A1C,#377EB8,#4DAF4A,#984EA3,#FF7F00,#FFFF33,#A65628,#F781BF,#999999"],
    "Set2-":                ["", "colormap", "#66C2A5,#FC8D62,#8DA0CB,#E78AC3,#A6D854,#FFD92F,#E5C494,#B3B3B3"],
    "Set3-":                ["", "colormap", "#8DD3C7,#FFFFB3,#BEBADA,#FB8072,#80B1D3,#FDB462,#B3DE69,#FCCDE5,#D9D9D9,#BC80BD,#CCEBC5,#FFED6F"],        "Spectral-":            ["", "colormap", "#9E0142,#D53E4F,#D7191C,#F46D43,#FC8D59,#FDAE61,#FEE08B,#FFFFBF,#E6F598,#ABDDA4,#99D594,#66C2A5,#2B83BA,#3288BD,#5E4FA2"],
    "YlGn-":                ["", "colormap", "#FFFFE5,#FFFFCC,#F7FCB9,#D9F0A3,#C2E699,#ADDD8E,#78C679,#41AB5D,#31A354,#238443,#006837,#005A32,#004529"],
    "YlGnBu-":              ["", "colormap", "#FFFFD9,#FFFFCC,#EDF8B1,#C7E9B4,#A1DAB4,#7FCDBB,#41B6C4,#1D91C0,#2C7FB8,#225EA8,#253494,#0C2C84,#081D58"],
    "YlOrBr-":              ["", "colormap", "#FFFFE5,#FFFFD4,#FFF7BC,#FEE391,#FED98E,#FEC44F,#FE9929,#EC7014,#D95F0E,#CC4C02,#993404,#8C2D04,#662506"],
    "YlOrRd-":              ["", "colormap", "#FFFFCC,#FFFFB2,#FFEDA0,#FED976,#FECC5C,#FEB24C,#FD8D3C,#FC4E2A,#F03B20,#E31A1C,#BD0026,#B10026,#800026"],
};

// 统计库增补字典
var statisticsDic = {
    "boxplot":                  ["箱形图"],
    "boxplot prepared":         ["有标定的箱型图",{
        "{lower whisker=,lower quartile=,median=,upper quartile=,upper whisker=}":       ["下界,下四分位点,中位数,上四分位点,上界","url",""],
    }],
    "hist":                     ["直方图",{
        "{bins=}":              ["直方箱数","url",""],
        "{data=}":              ["数据列","none",""],
        "cumulative":           ["累积直方图","url",""],
        "density":              ["密度直方图","url",""],
    }],
};
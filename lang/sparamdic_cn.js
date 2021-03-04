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

var colorbrewerDic = {
    "BuGn-": ["蓝绿连续渐变","colormap",[
        "#F7FCFD",
        "",
        "#00441B",
    ]],
    "BuPu-":["蓝紫连续渐变","colormap",[
        "#F7FCFD",
        "",
        "#4D004B",
    ]],
}

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
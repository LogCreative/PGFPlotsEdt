// 系列的参数字典
// TODO: 使用 json 读取
var sparamDic = {
    "mark":["散点标记",{
        "*":"圆点",
        "x":"叉号",
        "+":"加号",
    }],
    "only marks":["只显示散点标记"],
    "scatter":["七彩散点标记"],
    "ybar":["纵向柱形图"],
    "xbar":["横向柱形图"],
    "domain":["自变量定义域",{
        "[起始]:[终止]":"自变量的起始与终止点",
    }],
    "samples":["取样数量",{
        "样本点的取样数量":"",
    }],
    "color":["线形颜色",{
        "线形颜色":"",
    }],
    "fill":["填充颜色",{
        "填充颜色":"",
    }]
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
    "-":"减号",
    "|":"竖线",
    "o":"圆圈",
    "asterisk":"星号",
    "star":"五点星",
    "10-pointed star":"十点星",
    "oplus":"加号圆",
    "oplus*":"填充加号圆",
    "otimes":"乘号圆",
    "otimes*":"填充乘号圆",
    "square":"方块",
    "square*":"填充方块",
    "triangle":"三角形",
    "triangle*":"填充三角形",
    "diamond":"菱形",
    "diamond*":"填充菱形",
    "halfdiamond*":"半填充菱形",
    "halfsquare*":"半填充方形（下）",
    "halfsquare right*":"半填充方形（右）",
    "halfsquare left*":"半填充方形（左）",
    "Mercedes star":"三点星",
    "Mercedes star filipped":"翻转三点星",
    "halfcircle":"半分圆",
    "halfcircle*":"填充半分圆",
    "pentagon":"五边形",
    "pentagon*":"填充五边形",
    "ball":"球",
    "cube":"方块",
    "cube*":"填充方块",
};
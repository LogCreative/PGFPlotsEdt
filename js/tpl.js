var tpl_dict = {
    1 : [
        "coordinate",
        "red,very thick",
        "(1989,41918.6643) (1990,42233.42234) (1991,41629.28996) (1992,42525.89913) (1993,43133.13396) (1994,44330.11707) (1995,44985.58096) (1996,46140.53992) (1997,47619.84632) (1998,49177.84224) (1999,50930.16459) (2000,52456.57189) (2001,52456.28985) (2002,52863.55743) (2003,53874.95739) (2004,55419.41533) (2005,56837.80082) (2006,57908.1474) (2007,58431.61598) (2008,57808.58684) (2009,55845.29763) (2010,56808.18649) (2011,57276.37498) (2012,58154.65146) (2013,58823.93537) (2014,59878.48764) (2015,61281.36087) (2016,61892.54428) (2017,62940.04552) (2018,64483.09325) (2019,65560.49087) (2020,62127.48465) "
    ],
    2: [
        "expression",
        "mark=*,domain=-2:2,blue",
        "exp(-x^2)"
    ],
    3: [
        "coordinate",
        "only marks, mark=o, scatter",
        "(609,670) (484,551) (440,637) (433,622) (431,593) (423,540) (418,598) (408,497) (406,578) (399,575) (396.5,618) (393,562) (391,623) (389.5,565) (389,559) (387,565) (373,582) (371,533) (368,613) (365.5,636) (358,661) (355,488) (353,560) (348,496) (347,561) (345.5,581) (341,596) (339,650) (335,551) (328,451) (325,561) (324,614) (320,536) (319,486) (307,487) (306,607) (305,586) (304,533) (301.5,581) (296,519) (288,580) (283,646) (274,586) (265,598) (246,594) (227.5,560) (224,535) (213,542) (194,643) (186,503) (152,551)"
    ],
    4 : [
        "coordinate",
        "ybar,green,fill=green",
        "(1,0.86) (2,0.85) (3,0.845) (4,0.84) (5,0.83)"
    ],
    5: [
        "expression",
        "samples=200,domain=0:4,blue,very thick,fill=blue!50",
        "x/(1+x)",
        ["cycle"],
    ],
    6: [
        "expression",
        "surf",
        ",,x*y",
        ["td"],
    ],
    7: [
        "table",
        "contour prepared",
        "2 2 0.8\\\\\\\\0.857143 2 0.6\\\\1 1 0.6\\\\2 0.857143 0.6\\\\2.5 1 0.6\\\\2.66667 2 0.6\\\\\\\\0.571429 2 0.4\\\\0.666667 1 0.4\\\\1 0.666667 0.4\\\\2 0.571429 0.4\\\\3 0.8 0.4\\\\\\\\0.285714 2 0.2\\\\0.333333 1 0.2\\\\1 0.333333 0.2\\\\2 0.285714 0.2\\\\3 0.4 0.2\\\\",
    ],
    8: [
        "coordinate",
        "ybar interval,fill=blue!50,draw=blue",
        "(0,17) (34,0) (68,3) (102,2) (136,3) (170,5) (204,6) (238,15) (272,22) (306,63) (340,109) (374,162) (408,193) (442,189) (476,166) (510,130) (544,110) (578,83) (612,52) (646,25) (680,4) (714,4)",
    ],
    9: [
        "coordinate",
        "boxplot prepared={lower whisker=2.5, lower quartile=4, median=8.5, upper quartile=12, upper whisker=15",
        "",
        ["statistics"],
    ],
    10: [
        "expression",
        "domain=0:720,samples=200,pink!30,fill=pink!10,line width=1.5pt,",
        "cos(2*x)*sin(2*x)",
        ["polaraxis"],
    ]
}
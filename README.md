![](res/logo/banner.png)

## PGFPlotsEdt - Faster to PGFPlot in LaTeX
### A PGFPlots Statistic Graph Interactive Editor.

<a href="https://logcreative.github.io/PGFPlotsEdt/index.html?lang=en"><img src="https://img.shields.io/badge/lang-EN-9CF"></a>
<a href="https://logcreative.github.io/PGFPlotsEdt/index.html?lang=chs"><img src="https://img.shields.io/badge/语言-中文-9CF"></a>
<a href="https://github.com/LogCreative/PGFPlotsEdt/releases"><img src="https://img.shields.io/github/v/release/LogCreative/PGFPlotsEdt"></a>
<a href="https://github.com/LogCreative/PGFPlotsEdt/blob/master/LICENSE"><img src="https://img.shields.io/github/license/LogCreative/PGFPlotsEdt"></a>
<a href="https://github.com/LogCreative/PGFPlotsEdt/commits/master"><img src="https://img.shields.io/github/last-commit/LogCreative/PGFPlotsEdt"></a>
<a href="https://logcreative.github.io/LaTeXSparkle/"><img src="https://img.shields.io/badge/Under-LaTeX%20Sparkle%20Project-yellowgreen"></a>

#### Introduction

PGFPlots is a remarkable package in LaTeX, to create precise, vectorized, and highly personalized statistic graphs. You could get more information about PGFPlots package on https://github.com/pgf-tikz/pgfplots, thank all those contributors for creating a useful package to plot in LaTeX natively.

PGFPlotsEdt is basically a frontend for this package, to generate PGFPlots code automatically through a web-based user interface. This project is under [LaTeX Sparkle Project](https://logcreative.github.io/LaTeXSparkle/), you could also get some tips on PGFPlots on [this webpage](https://logcreative.github.io/LaTeXSparkle/src/art/chapter06.html).

TikzEdt is the inspiration of this project, to create LaTeX TikZ graph in WYSIWYG (what you see is what you get) mode. You could download this software on [TikzEdt homepage](http://www.tikzedt.org/), you could also get more tips on TikZEdt on [this webpage](https://logcreative.github.io/LaTeXSparkle/src/art/chapter04.html).

#### Usage

- You could use the online version directly:

    <a href="https://logcreative.github.io/PGFPlotsEdt/"><img src="res/logo/logo.svg" width="16px">https://logcreative.github.io/PGFPlotsEdt/ </a>

- If you want to make sure the data won't go anywhere in the Internet, or try to compile the document faster, use the offline version by downloading the repo and fire up a local server to handle the compling tasks:
    - Install TeX distribution on your local computer.
    - Install python and the dependencies by
    ```bash
    pip install flask
    ```
    - Start the server.
    ```bash
    python server.py
    ```
    - Open `http://127.0.0.1:5678` in your browser.
    > For Windows users, the server side will automatically change the fontset used by CJK for a larger compatibility.

- If you want to deploy the server in the LAN, use the deployment server in the directory `deploy`, please follow the [LICENSE](LICENSE) for deployment:
    - If you are using *nix operating system for deployment, finish the configuration in the previous step, and `pip install gunicorn` to install the additional package. Then run the deployment server directly by:
    ```bash
    cd deploy
    python gunicorn-deploy.py
    ```
    - If you are using Windows for deployment or you want to containerize your deployment, you could use the docker virtualization by:
    ```bash
    cd deploy
    docker-compose up --build
    ```
    - Then the deployment will be on `[IP]:5678`.

#### Acknowledgements

<a href="https://cn.vuejs.org/" target="_blank"><img class="icon" src="res/poweredby/vue.png" height="16px">Vue.js</a> is the progressive JavaScript framework for this project.

<a href="https://latexonline.cc/" target="_blank"><img class="icon" src="res/poweredby/latexonline.png" height="16px">LaTeXOnline</a> is the chosen online LaTeX compiler for previewing the graph result.

<a href="https://www.mathjax.org/" target="_blank"><img class="icon" src="res/poweredby/mathjax.ico" height="16px">MathJax</a> is the TeX typeset rendering machine for previewing the formula input.

>Copyright (c) 2020-2024 Log Creative & LaTeX Sparkle Project

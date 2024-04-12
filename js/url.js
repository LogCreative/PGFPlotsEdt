const url = window.location.href;

// Show the about panel directly.
if (url.match("show_about"))
{
    document.getElementById('logo').click();
}

// Edit the code directly.
if (url.match("code_only"))
{
    document.getElementById('btnEdtCode').click();
}

// Change compiler.
if (in_compiler = /compiler=(\w+)/.exec(url))
{
    if (in_compiler[1] == "pdflatex" || in_compiler[1] == "xelatex")
    {
        app.compiler = in_compiler[1];
    }
}

if (url.match("nofast"))
{
    app.notusefast = true;
}

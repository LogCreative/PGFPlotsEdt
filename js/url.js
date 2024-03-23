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
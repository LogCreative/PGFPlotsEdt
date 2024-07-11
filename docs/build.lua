#!/usr/bin/env texlua
-- typeset the documentation for a certain language:
-- `PPEDT_LANG=chs l3build doc`
-- You need to rename the file manually.
-- Please typeset the English documentation in the last run.

module = "pgfplotsedt-docs"

typesetexe = "lualatex"
typesetopts = "-interaction=nonstopmode --shell-escape"

supportdir = "."
typesetsuppfiles = {"*.md"}

typesetfiles = {"pgfplotsedt.tex"}

figdir = "figs/"

local ppedt_lang = os.getenv("PPEDT_LANG")
lang_suffix = ""
if ppedt_lang ~= nil then
    lang_suffix = "_" .. ppedt_lang
end

function typeset_demo_tasks()
    for _, p in ipairs(filelist(figdir, "*.tex")) do
        local name = string.match(p, "(%w+).tex")
        local cmd = "lualatex -interaction=nonstopmode --shell-escape " ..  name .. ".tex"
        if (run(figdir, cmd) ~= 0) then
            return -1
        end
        ren(figdir, name .. ".pdf", name .. lang_suffix .. ".pdf")
        ren(figdir, name .. ".png", name .. lang_suffix .. ".png")
    end
    return 0
end
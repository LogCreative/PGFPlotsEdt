require("lualibs.lua")
local lang = os.getenv("PPEDT_LANG")
if lang == "chs" then
    -- -- luatex-ja could not output DVI, use babel as a workaround
    -- -- https://tex.stackexchange.com/a/717269
    -- tex.print("\\usepackage[chinese, provide=*]{babel}\\babelfont{rm}{FandolSong}\\babelfont{tt}{FandolSong}")
    tex.print("\\usepackage[fontset=fandol]{ctex}")
end
if lang == nil then
    lang = "en"
end
local f = io.open('../../lang/' .. lang .. '.js', 'r')
local s = f:read('*a')
f:close()
s = string.gsub(s, "const %a+ = ", "")
trans = utilities.json.tolua(s)

function scandir(directory)
    local i, t, popen = 0, {}, io.popen
    local pfile = popen('ls -a "'..directory..'"')
    for filename in pfile:lines() do
        i = i + 1
        t[i] = filename
    end
    pfile:close()
    return t
end

for i, v in next, scandir("C:/Users/Bug/OneDrive/Documents/FluentEmojiGif") do
    local format = v:sub(-3, -1)
    local name = v:sub(1, -5)

    if format == "png" then
        os.remove("C:/Users/Bug/OneDrive/Documents/FluentEmojiGif/" .. v)
        --os.execute([[C:\"Program Files"\ImageMagick-7.1.0-Q16-HDRI\magick.exe convert C:/Users/Bug/OneDrive/Documents/FluentEmojiGif/]] .. name .. [[.png C:/Users/Bug/OneDrive/Documents/FluentEmojiGif/]] .. name .. [[.gif]])
    end
end
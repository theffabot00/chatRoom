

const types = [
    {
        "ext":"html",
        "typ":"text"
    },
    {
        "ext":"css",
        "typ":"text"
    },
    {
        "ext":"js",
        "typ":"text"
    }

];

exports.getContentType = function(filext) {
    for (var n in types) {
        if (types[n].ext == filext) {
            var block = types[n]
            return({
                "type":block.typ + "/" + block.ext,
                "style": block.typ
            });
        } 
    }
    //inb4 images spam
    return({
        "type":"UNKNOWN",
        "style":"binary"
    });

}






var http = require('http');
var fs = require('fs');
var url = require('url');

var qs = require('qs');

var ft = require('./fileTypes');
var cm = require("./chatManager");



class DEBUG{
    constructor() {
        var file = "log.txt";
        fs.writeFileSync(file,"");
        this.outFile = file;
    }

    Log(astr) {
        var output = this.outFile;
        fs.appendFile(output, astr + "\n",function(err) {

            if (err) throw err;

        });
        // fs.appendFile(output,"\n", function(err) {
        //     if (err) throw err;
        // });
    }
}

var Debug = new DEBUG();

http.createServer(function(req, res){

    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With, contenttype");
    res.setHeader("Access-Control-Allow-Credentials",true);


    var nURL = url.parse(req.url);
    var reqName = nURL.pathname.substring(1);
    var reqData = qs.parse(nURL.query);
    
    if (reqName == "") {
        Debug.Log("Requested: ((nothing))");
    } else {
        Debug.Log("Requested: " + reqName );
    }
    //request management idfk
    if (!reqName) {
        res.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("main.html", function(err,dat) {
            if (err) {
                Debug.Log("what the fuck");
                throw err;
            } else {

                res.write( dat.toString() );
            }
            res.end();
        });
        
    }

    //magical bullshit woohoo
    var isFile = reqName.indexOf(".") + 1;
    if (isFile) {
        var fileExt = reqName.substring(isFile);
        var aCT = ft.getContentType(fileExt);
        if (aCT.type == "UNKNOWN") {
            res.writeHead(404, {"Content-Type":"text/plain"});
            console.log("mf requesting for a file that doest exist");
        } else {
            res.writeHead(200, {"Content-Type":aCT.type});
            fs.readFile(reqName, function(err,dat) {
                if(err) {
                    throw err;
                } else {
                    if (aCT.style == "text") {
                        res.write (dat.toString());
                    } else {
                        res.write(dat, "binary");
                    }
                }
                res.end();
            });
        }
        
    } 
    //  
    if (reqName && !isFile) {
        //if it isnt a file, its probably someone asking for a specific
        var location = reqData.location;

        if (location == "chat") {
            //regardless of what happens, it should return a string with new logs
            var n = cm.manage(reqName, reqData);
            res.end(n);
        } 
    }
    

}).listen(6689);





//??? how does this work???
var fs = require('fs');


// function getRecent(path) {
//     var fileNames = fs.readdirSync(path);
//     //god dammit i dont understand how apply works
//     for (var file in fileNames) {
//         fileNames[file] = parseInt(fileNames[file]);
//     }
//     console.log(fileNames);
//     return(Math.max.apply(Math,fileNames));
// }


exports.manage = function(name, dat) {
    var room = parseInt(dat.room);
    var nDir = new Dir(room);
    nDir.focusLatest();

    var nText = nDir.getText().split("Ξर्ച്ചക്ക്I").slice(0,-1);

    if (nText.length == 256) {
        nDir.newFile();
        nText = [""];
    }

    var latest = nDir.focus * 256 + nText.length;

    if (name == "newMessage") {
        var msg = dat.msg;
        console.log("a new message being added");
        if (msg.indexOf("Ξर्ച്ചക്ക്I") != -1) {
            
            msg = "[DATA EXPUNGED]";
        }
        var nJSON = {
            "name":dat.name,
            "msg":msg
        };
        fs.appendFile(nDir.path + "/" + nDir.focus , JSON.stringify(nJSON) + "Ξर्ച്ചക്ക്I", function(err){
            if(err) throw err;
        });
        exports.manage("getMessage",{
            "location":"chat",
            "last":latest.toString(),
            "room":room.toString()
        });

        //ITS STILL RUNS LIKE A SCRIPT GET FUCKED SSTOOPID
        name = "getMessage";
        dat = {
            "last":latest.toString(),
            "room":room.toString()
        }

    }

    if (name == "getMessage") {

        var oDir = 9;
        if (nDir.focus) {
            var oDir = new Dir(room);
            oDir.focusLatest();
            oDir.focus--;
        }
        if (dat.last == -1) {

            if (oDir != 9) {
                nText = oDir.getText().split("Ξर्ച്ചക്ക്I").slice(0,-1).concat(nText);
            }
            var writeBack = {
                "latest":latest,
                "text2Add":nText.slice()
            };
            return(JSON.stringify(writeBack));
        } else {

            var fileNumS = Math.floor(dat.last / 256 );
            var fileLineS = Math.floor(dat.last % 256);

            var beginFrag = fs.readFileSync("rooms/" + room + "/" + fileNumS).toString().split("Ξर्ച്ചക്ക്I").slice(fileLineS,-1);
            for (var n = fileNumS + 1; n <= nDir.focus; n++) {
                beginFrag = beginFrag.concat(fs.readFileSync("rooms/" + room + "/" + n).toString().split("Ξर्ച്ചക്ക്I").slice(0,-1));
            }
            var writeBack = {
                "latest":latest,
                "text2Add":beginFrag

            }
            return(JSON.stringify(writeBack));
        }


    }


    
}

//oh god why am i doing this
//its not even flexible
class Dir {
    constructor(roomNum) {
        this.room = roomNum;
        this.path = "rooms/" + this.room;

        this.files = fs.readdirSync(this.path);

        //just for this
        this.files = Number.parseInt.apply(Math, this.files);

        this.focus = this.files[0];

        
    }

    focusLatest() {
        for (var file in this.files) {
            if (file > this.focus) {
                this.focus = file;
            }
        }
        if (this.focus == undefined) {
            this.focus = 0;
        }
    }

    getText() {
        return(fs.readFileSync(this.path + "/" + this.focus).toString());
    }

    newFile() {
        this.focusLatest();
        this.focus++;
        fs.writeFileSync(this.path + "/" + this.focus, "");

        //likely unnecessary? or prob an easier way
        this.files = fs.readdirSync(this.path);

        
        this.files = Number.parseInt.apply(Math, this.files);
    }

}


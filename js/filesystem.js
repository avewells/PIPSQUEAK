//(c) Scott G Gavin, PIPSQUEAK - 01/28/2015
/*jslint node: true */

//this probably needs to be namespaced before too long, prevent collisions
var http = require('http');
var fs = require('fs');

//set the host ip and the desired port
var ip = "127.0.0.1"; //localhost
var port = 8082;

//this function prints the indicated directory, indicates items within a directory under the directory's name and leveled with 4 spaces
function printDir(directory, level, out) {
    "use strict";
    var files,
        i,
        ii;

    //make sure all inputs are assigned an initial variable. Defaults to local directory.
    directory = directory == null ? "." : directory;
    level = level == null ? 0 : level;
    out = out == null ? [] : out;
    files = fs.readdirSync(directory);
    for (i = 0; i < files.length; i += 1) {
        for (ii = 0; ii < level; ii += 1) {
            out.push("    ");
        }
        if (fs.lstatSync(directory + "/" + files[i]).isDirectory()) {
            out.push(files[i] + "\n");
            out = printDir((directory + "/" + files[i]), level + 1, out);
        } else {
            out.push(files[i] + "\n");
        }
    }
    return out;
}

//reads out the contents of a file as a string
function readFile(location) {
    "use strict";
    return fs.readFileSync(location, 'ascii');
}

function copyFile(location, destination)  {
    "use strict";
    fs.createReadStream(location).pipe(fs.createWriteStream(destination));
    return true;
}
//write the string contents of a file. can use different encoding types, like UTF8.
function writeFile(location, contents) {
    "use strict";
    contents = contents == null ? "File generated by PIPSQUEAK\n" : contents;
    //throw an error if the file exists for now.
    if (fs.existsSync(location)) {
        throw "File already exists";
    }
    fs.writeFileSync(location, contents, 'ascii');
    return true;
}

//if theres no overwrite, make the directory. otherwise throw an error
function makeDirectory(location) {
    "use strict";
    var permissions = '0777';
    //need to make sure the selected directory wont overwrite a file too
    if (fs.existsSync(location)) {
        throw "Directory already exists";
    }
    fs.mkdirSync(location, permissions);
    return true;
}

//takes a filename and an optional directory, returns an array with whether the file was found and the local filepath
function findFile(fileName, dir) {
    "use strict";
    var filePath = [false, "No file found"],
        files,
        i;
    if (fileName == null) {
        throw "No filename input";
    }
    //if dir is not defined assign it the local scope, otherwise leave it alone
    dir = dir == null ? "." : dir;
    files = fs.readdirSync(dir);
    for (i = 0; i < files.length; i += 1) {
        if (fs.lstatSync(dir + "/" + files[i]).isDirectory()) {
            filePath = findFile(fileName, (dir + "/" + files[i]));
            if (filePath[0] === true) {
                return filePath;
            }
        } else {
            if (fileName === files[i]) {
                return [true, dir + "/" + files[i]];
            }
        }
    }
    return filePath;
}



//removes a file if it exists
function removeFile(location) {
    "use strict";
    fs.unlinkSync(location);
    return true;
}

//removes a directory if it exists
function removeDirectory(location) {
    "use strict";
    //needs to descend into its directory and delete files.  or not, maybe. Depends on if we want it to delete the whole directory and everything in it, or be safer and only kill directories.
    fs.rmdirSync(location);
    return true;
}

//entry point to removal
function remove(location) {
    "use strict";
    if (!(fs.existsSync(location))) {
        return false;
    }
    //if its a file, call remove file
    if (fs.lstatSync(location).isFile()) {
        removeFile(location);
    } else {
        //if its a directory call remove directory
        removeDirectory(location);
    }
}

//function that will initialize the PIPSQUEAK location if it doesn't already exist.
//location variable to allow us to eventually maybe let the user et where they want the working directory
function initialize(name,location) {
    "use strict";
    //set default location
    location = location == null ? "." : location;
    name = name == null ? "publish" : name;
    if (fs.existsSync(location + "/" + name)) {
        return false;
    }
    //make PIPSQUEAK directory
    makeDirectory(location + "/" + name);
    //main folder is html
    //js, css folders
    makeDirectory(location + "/"  + name + "/js");
    makeDirectory(location + "/" + name + "/css");
    //assets folder
    makeDirectory(location + "/"  + name + "/assets");
    //subfolders - audio, video, images?
    makeDirectory(location + "/"  + name + "/assets/video");
    makeDirectory(location + "/"  + name + "/assets/audio");
    makeDirectory(location + "/"  + name + "/assets/images");
    return true;
}
/* I dont think we need this.
http.createServer(function (req, res) {
    "use strict";
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var words,
        newString = "",
        ip = req.headers['x-forwarded-for'] ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 req.connection.socket.remoteAddress,
        i;
    if (req.url === '/favicon.ico') {
        console.log('Favicon was requested by ' + ip);
    } else {
        console.log("Server was accessed from " + ip);
            //res.write(readFile('html/readTest.html'));
            //var temp = findFile("readTest.html");
            //res.write(" [ " + temp[0] + " , " + temp[1] + " ] \n\n");    
        //makeDirectory("test");
        //writeFile("test/test2.html");        
        initialize();
        words = printDir();
        for (i = 0; i < words.length; i += 1) {
            newString = newString + words[i];
        }
        res.write(newString);
        //remove("test/test2.html");
        //remove("test"); 
    }
    res.end();
}).listen(port); //add ",ip" to the end of the listen to make it listen locally
*/

console.log('Server running at http://' + ip + ':' + port + '/');



const child_process = require("child_process");
const fetch = require("node-fetch-commonjs");
const {getFunctions} = require("./getFunctions.js");
const fs = require("fs");
const path = require("path");
const isBinaryFile = require("isbinaryfile").isBinaryFile;

async function getDirectoryItems(dirpath,extn){
    let totalFuncs = 0;
    let jsFileCount = 0;
    var jsFileName = "";
    let validFileCounter = 0;
    var MiniAppName = "";
    var isRecursive = false

    //let outputfileStream = fs.createWriteStream("./results/npmFunctions.json", {flags:'a'});
    const errorFileStream = fs.createWriteStream("./errors/errorPackages.json",  {flags:'a'});
        try {
            const dir = await fs.promises.opendir(dirpath)
            for await (const dirNames of dir) {

                if(!isRecursive) {
                    MiniAppName = dirNames.name
                }
                const fileItems = fs.readdirSync(dirpath+dirNames.name)
                console.log("fileItems:", fileItems)
                for(let i = 0; i < fileItems.length; i++) {
                    var fileName = path.join(dirNames.name,fileItems[i])
                    var stats = fs.lstatSync(dirpath+fileName)
                    var isFolder = fs.existsSync(dirpath+fileName)
                    if(stats.isDirectory() && isFolder) {
                        var newDirName = dirpath+fileName+"/"
                        //console.log("New Directory:",newDirName)
                        isRecursive = true
                        getDirectoryItems(newDirName,extn);
                    } 
                    else if(fileName.endsWith(extn)) {
                            jsFileCount++;  
                            //console.log("path name:",dirpath+fileName)
                            fileLink =  dirpath+fileName;
                            const fileStr = await fs.readFileSync(fileLink).toString("utf-8")
                            //console.log("FileSTR:" + fileStr)
                            if(fileStr.includes("function")){
                                const functions = await getFunctions(fileStr, fileLink);
                                if(functions?.length) {
                                    validFileCounter++;
                                    totalFuncs += functions.length;
                                    const functionDescriptors = functions.map((func) => ({
                                            function: func,
                                            fileLink,
                                    }));
                                    for (const desc of functionDescriptors) {
                                        currentAppDir = "./results/"+MiniAppName
                                        if(!fs.existsSync(currentAppDir)) {
                                            fs.mkdirSync(currentAppDir)
                                        }
                                        let outputfileStream = fs.createWriteStream(currentAppDir, {flags:'a'});
                                        outputfileStream.write(JSON.stringify(desc) + ", \n");
                                    }
                                }
                            }
                            
                            if(totalFuncs == 7040){
                                break;         
                            }      
                    }   
                } 
            }
            console.log("file count: ", validFileCounter);
            //console.timeEnd();
        }
        catch(e){
            console.log(e.toString());   //Check later
        }  
}
getDirectoryItems("../WXAPKG-files/",".js");

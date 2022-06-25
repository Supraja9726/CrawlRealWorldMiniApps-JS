const esprima = require("esprima");
const fs = require("fs");
const {allChildNodes} = require("./utils.js");


function splitInFuncNodes(fileStr, fileLink) {
    try{
    const tree = esprima.parseModule(fileStr, {range:true});
    const parsed = allChildNodes(tree);
    const funcNodes = parsed.filter(node => 
        node.type === "FunctionDeclaration" || node.type === "FunctionExpression"
    )
    return funcNodes

    }catch(error){
        // console.log(error);
        fs.appendFileSync("./errorFiles.txt", (fileLink + "\n"));
    }
    // console.log(parsed.body);
    
}

function extractFunctions(funcNodes, fileStr) {
    const ranges = funcNodes.map(node => node.range);
    const functions = ranges.map(([start, end]) => {
        const funcText = fileStr.substring(start,end);
        return funcText.startsWith("(")
            ? `function ${funcText}`
            : funcText;
    });

    return functions;
}
const fileLink = "../../../Real-WeChatApps/WXAPKG-files/_-180037095_19.wxapkg_dir/app-service.js"

const fileString = "";

async function getFunctions(fileString, fileLink){

    //console.log("File String:",fileString);
    //console.log("File Link:",fileLink);
    const funcNodes = splitInFuncNodes(fileString, fileLink);
    if(funcNodes) {
        const functions = extractFunctions(funcNodes, fileString);
        //console.log("Functions:",functions);
        return functions;
    }
}
module.exports = { getFunctions };
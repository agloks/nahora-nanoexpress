/* 
  1 - path no worker with relative location as ./
  @path relative or absolute is working, cross-plataform.
  @text mensagem that like to write.
  @fileName need to specify the extesion of file.
*/

const canAcessSync = (file) => {
  try {
    fs.accessSync(file, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch(e) {
    return false;
  }
}

const personLogSucess = (() => {
    "use strict"

    let personLog_same_process = false;
    
    return function log_function(text, fileName, path = "") {
  
      const time = new Date();
      const fs = require("fs");
  
      const _path = require("path");
      path = _path.normalize(path + "/")
  
      const day = time.toLocaleString().split("");
    //   const dayFormated = day.slice(0,9).join("").replace(/\//g,"-");
      let started = false;
  
      if(canAcessSync(fileName)) { started = true; } else {  }
      
      const stream = fs.createWriteStream(`${path}${fileName}`, {flags: "a+"});
      stream.once("open", () => {
    
        if((!started) & (!personLog_same_process)) {
          personLog_same_process = true;
  
          const FIXED = 
          `
      ------------------------------------------------------------------------------------------------
            ${day.slice(0, day.length).join("")}\n
          `
          stream.write(FIXED);
        }
    
        stream.write(text);
        stream.end();
      })
  
      // stream.close();
    } 
})();  

const personLogFail = (() => {
  "use strict"

  let personLog_same_process = false;
  
  return function log_function(text, fileName, path = "") {

    const time = new Date();
    const fs = require("fs");

    const _path = require("path");
    path = _path.normalize(path + "/")

    const day = time.toLocaleString().split("");
    // const dayFormated = day.slice(0,9).join("").replace(/\//g,"-");
    let started = false;

    if(canAcessSync(fileName)) { started = true; } else {  }
    
    const stream = fs.createWriteStream(`${path}${fileName}`, {flags: "a+"});
    stream.once("open", () => {
  
      if((!started) & (!personLog_same_process)) {
        personLog_same_process = true;

        const FIXED = 
        `
    ------------------------------------------------------------------------------------------------
          ${day.slice(0, day.length).join("")}\n
        `
        stream.write(FIXED);
      }
  
      stream.write(text);
      stream.end();
    })

    // stream.close();
  } 
})();

module.exports = {personLogFail, personLogSucess};
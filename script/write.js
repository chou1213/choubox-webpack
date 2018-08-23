const fs = require('fs');
const path = require('path');
const projectname = 'quickStock';
let template = 'module.exports={filename:"' + projectname + '"}';
fs.writeFileSync(path.resolve(__dirname, './project.config.js'), template, 'utf8');
import * as fileUtils from "./utils/fileUtils";
import * as path from 'path';

class TemplateCreator {
    templatesPath:string;
    constructor(templatesPath:string) {
        this.templatesPath = templatesPath;
    }

    manifestContent = `{
        "name": "Classic",
        "commands": [
          {
            "name": "Create directory",
            "action": "createDirectory",
            "args": [
              "$targetFolder\\\\$componentName"
            ]
          },
          {
            "name": "Create CSS file",
            "action": "createFile",
            "args": [
              "$targetFolder\\\\$componentName\\\\$componentName.css",
              "$content(style.css)"
            ]
          }
          ,
          {
            "name": "Create JSX file",
            "action": "createFile",
            "args": [
              "$targetFolder\\\\$componentName\\\\$componentName.jsx",
              "$content(component.jsx)"
            ]
          }
          ,
          {
            "name": "Create index file",
            "action": "createFile",
            "args": [
              "$targetFolder\\\\$componentName\\\\index.js",
              "$content(index.js)"
            ]
          }
        ]
      }`;
    componentContent = `import React from 'react';

    const $componentName = () => {
        return (<div></div>);
    }
    
    export default $componentName;`;
    indexContent = `import $componentName from './$componentName';
    export default $componentName;`;
    styleContent = `.$componentName{
        background-attachment: fixed;
    }`;

    createSimpleComponentTemplate(){
         const templateName = "Classic";
        fileUtils.createDirectory(path.join(this.templatesPath, templateName));       
        this.createTemplateFile(templateName, "manifest.json", this.manifestContent);
        this.createTemplateFile(templateName, "component.jsx", this.componentContent);
        this.createTemplateFile(templateName, "index.js", this.indexContent);
        this.createTemplateFile(templateName, "style.css", this.styleContent);
    }
    
     createTemplateFile(templateName:string, fileName:string, fileContent:string){
        fileUtils.createFile(path.join(this.templatesPath, templateName, fileName), fileContent);
    }
}


export default TemplateCreator;
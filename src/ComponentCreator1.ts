import * as path from 'path';
import {createDirectory, createFile} from './fileUtils';

class ComponentCreator {
    componentName: string;
    folder: string;
    constructor(componentName:string, folder: string) {
        this.componentName = componentName;
        this.folder = folder;
    }

    getComponentFolderPath():string{
       return path.join(this.folder, this.componentName);
    }

    getJsxContent():string{
        return "import React from 'react';"+        
                `\n\nconst ${this.componentName} = () => {` +
                "\n\treturn (<div></div>);" +
                "\n}"+
                `\n\nexport default ${this.componentName};`;
    }

    create() {
        createDirectory(this.getComponentFolderPath());
        this.createComponentFile("css");
        this.createComponentFile("jsx", this.getJsxContent());
        this.createIndex();
        
    }

    createIndex(){
        const indexContent = `import ${this.componentName} from './${this.componentName}';`+
        `\nexport default ${this.componentName};`;

        createFile(path.join(this.getComponentFolderPath(),"index.js"), indexContent);
    }

    createComponentFile(ext: string, fileContent:string=""){
        const filePath = path.join(this.getComponentFolderPath(), this.componentName + "." + ext);
        createFile(filePath,fileContent);
    }
   
}

export default ComponentCreator;
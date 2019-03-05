import * as fs from 'fs';
import { reportError } from './reportingUtils';

function createFile(filepath: string, fileContent: string) {
    fs.writeFile(filepath, fileContent, (err) => reportError(err));
}

function createDirectory(folderName: string) {
    console.log(folderName);
    fs.mkdir(folderName, err => reportError(err));
}


export {
    createFile,
    createDirectory
};
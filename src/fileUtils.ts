import * as fs from "fs";
import * as path from 'path';
import { reportError } from "./reportingUtils";

function createFile(filepath: string, fileContent: string) {
  fs.writeFile(filepath, fileContent, err => reportError(err));
}

function createDirectory(folderName: string) {
  fs.mkdir(folderName, err => reportError(err));
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath).toString();
}

function readFileAsJson<T>(filePath: string) {
  const fileContent = readFile(filePath);
  const json = <T>JSON.parse(fileContent.toString());
  return json;
}

function openFolderInExplorer(folderPath:string){
  require('child_process').exec(`start "" "${folderPath}"`);
}

const isDirectory = (folderPath: string) => fs.lstatSync(folderPath).isDirectory();

const getSubDirectories = (folderPath: string) => fs.readdirSync(folderPath)
.map(name =>{return {name:name, path:path.join(folderPath, name)};} )
.filter(e => isDirectory(e.path));


export { createFile, createDirectory, readFile, readFileAsJson, openFolderInExplorer, isDirectory, getSubDirectories };

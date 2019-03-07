import * as fs from "fs";
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

export { createFile, createDirectory, readFile, readFileAsJson, openFolderInExplorer };

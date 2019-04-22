import * as fs from "fs";
import * as path from 'path';
import * as http from 'https';
import * as zlib from 'zlib';
import * as tarfs from 'tar-fs';
import { reportError } from "./reportingUtils";

function downloadString(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    http.get(url, response => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function compress(inputFilename: string, outputFilename: string) {
  tarfs.pack(inputFilename)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(outputFilename));
}

function decompress(inputFilename: string, outputFilename: string) {
  fs.createReadStream(inputFilename).pipe(zlib.createGunzip()).pipe(tarfs.extract(outputFilename));
}

function downloadFile(url: string, destination: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    try {
      var file = fs.createWriteStream(destination);
      http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          file.close();
          resolve();
        });
      }).on('error', function (err) {
        fs.unlink(destination, err => reportError(err));
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

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

function openFolderInExplorer(folderPath: string) {
  require('child_process').exec(`start "" "${folderPath}"`);
}

const isDirectory = (folderPath: string) => fs.lstatSync(folderPath).isDirectory();

const getSubDirectories = (folderPath: string) => fs.readdirSync(folderPath)
  .map(name => { return { name: name, path: path.join(folderPath, name) }; })
  .filter(e => isDirectory(e.path));

function deleteFile(filePath: string) {
  fs.unlink(filePath, err => reportError(err));
}

function exists(path:string):boolean{
  return fs.existsSync(path);
}

export {
  exists,
  createFile,
  deleteFile,
  createDirectory,
  readFile,
  readFileAsJson,
  openFolderInExplorer,
  isDirectory,
  getSubDirectories,
  downloadFile,
  downloadString,
  compress,
  decompress
};

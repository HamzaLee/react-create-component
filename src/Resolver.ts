import * as fileUtils from "./utils/fileUtils";
import * as path from "path";
import ExtensionContext from './ExtensionContext';
import * as constants from './constants';

class Resolver {
  context: ExtensionContext;
  private argsPlaceHolders: { [key: string]: string };
  private actionsPlaceHolders: { [key: string]: Function };

  constructor(context: ExtensionContext) { 
    this.context = context; 
    this.argsPlaceHolders = {
      [constants.componentNamePlaceHolder]: this.context.componentName,
      [constants.targetFolderPlaceHolder]: this.context.folderPath
    };
    this.actionsPlaceHolders = {
      [constants.createDirectoryAction]: fileUtils.createDirectory,
      [constants.createFileAction]: fileUtils.createFile
    };
  }

  private resolveContentArg = (arg: string) => {
    //Match $content(fileName)

    const fileName = arg.substring((constants.contentPlaceHolder+"(").length, arg.length - 1);
    const filePath = path.join(this.context.templateFolder, fileName);
    const fileContent = fileUtils.readFile(filePath);
    return this.resolvePlaceHolders(fileContent);
  }

  private resolvePlaceHolders = (content: string) => {
    let result = content;
    for (const key in this.argsPlaceHolders) {
      if (this.argsPlaceHolders.hasOwnProperty(key)) {
        const value = this.argsPlaceHolders[key];
        result = result.split(key).join(value);
      }
    }
    return result;
  }

  private resolveArg = (arg: string) => {
    if (arg.startsWith(constants.contentPlaceHolder)) {
      return this.resolveContentArg(arg);
    }

    return this.resolvePlaceHolders(arg);
  }

  resolveArgs(args: string[]): string[] {
    return args.map(this.resolveArg);
  }

  resolveAction(action: string) {
    return this.actionsPlaceHolders[action];
  }
}

export default Resolver;

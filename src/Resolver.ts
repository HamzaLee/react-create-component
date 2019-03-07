import * as fileUtils from "./fileUtils";
import * as path from "path";
import ExtensionContext from './ExtensionContext';

class Resolver {
  context: ExtensionContext;
  private argsPlaceHolders: { [key: string]: string };
  private actionsPlaceHolders: { [key: string]: Function };

  constructor(context: ExtensionContext) { 
    this.context = context; 
    this.argsPlaceHolders = {
      "$componentName": this.context.componentName,
      "$targetFolder": this.context.folderPath
    };
    this.actionsPlaceHolders = {
      createDirectory: fileUtils.createDirectory,
      createFile: fileUtils.createFile
    };
  }

  private resolveContentArg = (arg: string) => {
    //Match $content(blablabla)

    const fileName = arg.substring("$content(".length, arg.length - 1);
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
    if (arg.startsWith("$content")) {
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

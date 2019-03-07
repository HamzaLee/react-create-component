import * as vscode from "vscode";
import * as path from "path";
import * as fileUtils from "./fileUtils";
import Template from "./Template";
import { isNullOrUndefined } from "util";

class ExtensionContext {
  vsCodeContext: vscode.ExtensionContext;
  targetUri: string;
  componentName: string;
  template: Template;
  folderPath: string;
  templateFolder: string;
  templateId: string;

  constructor(
    vscodeContext: vscode.ExtensionContext,
    targetUri: string,
    componentName: string,
    templateId: string
  ) {
    this.vsCodeContext = vscodeContext;
    this.targetUri = targetUri;
    this.componentName = componentName;
    this.templateId = templateId;
    this.template = this.getTemplate(this.vsCodeContext.globalStoragePath);
    this.folderPath = this.getFolderPath(this.targetUri);
    this.templateFolder = path.join(this.vsCodeContext.globalStoragePath, this.templateId);
  }

  private getTemplate(storage: string): Template {
    const fileName = "manifest.json";
    const filePath = path.join(storage, this.templateId, fileName);
    const template = <Template>fileUtils.readFileAsJson(filePath);
    return template;
  }

  private getFolderPath(uri: any): string {
    if (isNullOrUndefined(uri)) {
      if (isNullOrUndefined(vscode.workspace.rootPath)) {       
          throw new Error("Cannot get the folder path");
      }
      return path.join(vscode.workspace.rootPath, "src");
    } else {
      return uri.fsPath;
    }
  }
}

export default ExtensionContext;

import * as vscode from "vscode";
import * as os from "os";
import * as fileUtils from './fileUtils';
import { isNullOrUndefined } from "util";
import ComponentCreator from "./ComponentCreator";
import ExtensionContext  from './ExtensionContext';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand(
    "extension.react-create-component",
    uri => execute(uri, context)
  ));

  context.subscriptions.push(vscode.commands.registerCommand(
    "extension.react-create-component-open-folder",
    () => openFolder(context)
  ));
}

function openFolder(context:vscode.ExtensionContext){
  fileUtils.openFolderInExplorer(context.globalStoragePath);
}

function validate(componentName: string): string | null {
  let isError = false;

  if (isNullOrUndefined(componentName) || componentName === "") {
    isError = true;
  }

  if (componentName[0] !== componentName[0].toUpperCase()) {
    isError = true;
  }

  if (isError) {
    const who = os.userInfo().username;
    return `${who}, the component name should be in TitleCase :)`;
  }

  return null;
}

function execute(uri: any, vsCodecontext: vscode.ExtensionContext) { 
  
  const inputBoxOptions: vscode.InputBoxOptions = {
    validateInput: validate,
    placeHolder: "(Component name)",
    ignoreFocusOut: true
  };

  vscode.window.showInputBox(inputBoxOptions).then(componentName => {
    if (isNullOrUndefined(componentName) || componentName === "") {
      return;
    }

    const context = new ExtensionContext(vsCodecontext, uri, componentName);
    
    if (isNullOrUndefined(context.folderPath)) {
      vscode.window.showErrorMessage(
        "Connot find the root folder, try with context menu."
      );
      return;
    }

    const componentCreator = new ComponentCreator(context);

    try {
      componentCreator.create();
      vscode.window.showInformationMessage(
        `${context.componentName} component is created !`
      );
    } catch (error) {
      vscode.window.showErrorMessage("Sorry, an error occured :(");
    }
  });
}

export function deactivate() {}

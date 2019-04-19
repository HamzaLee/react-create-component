import * as vscode from "vscode";
import * as fileUtils from "./utils/fileUtils";
import { isNullOrUndefined } from "util";
import ComponentCreator from "./ComponentCreator";
import ExtensionContext from "./ExtensionContext";
import TemplateCreator from "./TemplateCreator";
import { getRemoteTemplateList, downloadTemplate } from "./RemoteTemplate";

export function activate(context: vscode.ExtensionContext) {
  setupSimpleComponentTemplate(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.react-create-component", uri =>
      execute(uri, context)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.react-create-component-open-folder",
      () => openFolder(context)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.react-create-component-download-template",
      () => getRemoteTemplates(context)
    )
  );
}


async function getRemoteTemplates(context: vscode.ExtensionContext) {

  const templateList = await getRemoteTemplateList();

  vscode.window.showQuickPick(templateList.map(t => t.name)).then(selectedTemplateName => {
    if (!isNullOrUndefined(selectedTemplateName)) {
      const selectedTemplate = templateList.find(t => t.name === selectedTemplateName);
      if (isNullOrUndefined(selectedTemplate)) {
        vscode.window.showErrorMessage("Sorry, an error occured :(");
        return;
      }
      downloadTemplate(selectedTemplate, context.globalStoragePath);
    }
  });
}
function openFolder(context: vscode.ExtensionContext) {
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
    return `The component name should be in TitleCase :)`;
  }

  return null;
}

function execute(uri: any, vsCodecontext: vscode.ExtensionContext) {
  const inputBoxOptions: vscode.InputBoxOptions = {
    prompt: `Creating a component under ${uri.fsPath}`,
    placeHolder: "(Component name)",
    validateInput: validate,
    ignoreFocusOut: true
  };

  vscode.window.showInputBox(inputBoxOptions).then(componentName => {
    if (isNullOrUndefined(componentName) || componentName === "") {
      return;
    }
    const folders = fileUtils.getSubDirectories(vsCodecontext.globalStoragePath).map(f => f.name);
    vscode.window.showQuickPick(folders).then(selectedTemplate => {
      if (!isNullOrUndefined(selectedTemplate)) {
        createComponent(uri, vsCodecontext, componentName, selectedTemplate);
      }
    });
  });
}

function setupSimpleComponentTemplate(vsCodecontext: vscode.ExtensionContext) {
  const templatesPath = vsCodecontext.globalStoragePath;
  const folders = fileUtils.getSubDirectories(templatesPath);
  if (folders.length > 0) {
    return;
  }
  const templateCreator = new TemplateCreator(templatesPath);
  templateCreator.createSimpleComponentTemplate();
}

function createComponent(
  uri: any,
  vsCodecontext: vscode.ExtensionContext,
  componentName: string,
  selectedTemplate: string
) {
  const context = new ExtensionContext(vsCodecontext, uri, componentName, selectedTemplate);

  if (isNullOrUndefined(context.folderPath)) {
    vscode.window.showErrorMessage("Connot find the root folder, try with context menu.");
    return;
  }

  const componentCreator = new ComponentCreator(context);

  try {
    componentCreator.create();
    vscode.window.showInformationMessage(`${context.componentName} component is created !`);
  } catch (error) {
    vscode.window.showErrorMessage("Sorry, an error occured :(");
  }
}
export function deactivate() { }

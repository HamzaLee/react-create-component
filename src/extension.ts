import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { isNullOrUndefined } from 'util';
import ComponentCreator from './ComponentCreator';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('extension.react-create-component', execute);
	context.subscriptions.push(disposable);
	
}

function validate(componentName:string) : string | null{
	let isError = false;
	
	if(isNullOrUndefined(componentName) || componentName === ''){
		isError = true;
	}
	
	if(componentName[0] !== componentName[0].toUpperCase()){
		isError = true;
	}
	
	if(isError){
		const who = os.userInfo().username;
		return `${who}, the component name should be in TitleCase :)`;
	}
	
	return null;
}



function getFolderPath(uri:any) : string | undefined{
	if(isNullOrUndefined(uri)){
		if(isNullOrUndefined(vscode.workspace.rootPath)){
			return undefined;
		}
		return	path.join(vscode.workspace.rootPath,"src" );
	}else{
		return uri.fsPath;
	}
}

function execute(uri: any) {
	const inputBoxOptions:vscode.InputBoxOptions = {
		validateInput: validate,
		placeHolder:"(Component name)",
		ignoreFocusOut:true
	};

	vscode.window.showInputBox(inputBoxOptions).then(r => {
		if(isNullOrUndefined(r) || r === ''){
			return;
		}
		
		const folderPath = getFolderPath(uri);
		
		if(isNullOrUndefined(folderPath)){
			vscode.window.showErrorMessage("Connot find the root folder, try with context menu.");
			return;
		}
		
		const componentCreator = new ComponentCreator(r, folderPath);
		
		try {
			componentCreator.create();
			vscode.window.showInformationMessage(`${r} component is created !`);
		} catch (error) {
			vscode.window.showErrorMessage("Sorry, an error occured :(");
		}
	});
}

export function deactivate() {}

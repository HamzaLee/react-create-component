import * as path from 'path';
import * as fileUtils from './utils/fileUtils';

export interface RemoteTemplate {
    name: string;
    path: string;
}

export async function getRemoteTemplateList(): Promise<RemoteTemplate[]> {
    const templateListFilePath = "https://raw.githubusercontent.com/HamzaLee/react-create-component/master/templates/index.json";
    const templateListFileContent = await fileUtils.downloadString(templateListFilePath);
    const templateList = <RemoteTemplate[]>JSON.parse(templateListFileContent);
    return templateList;
}

export async function downloadTemplate(remoteTemplate: RemoteTemplate, templatesFolder: string) {
    const compressedFilePath = path.join(templatesFolder, remoteTemplate.name + ".tar.gz");
    const templateFolder = path.join(templatesFolder, remoteTemplate.name);
    await fileUtils.downloadFile(remoteTemplate.path, compressedFilePath);
    fileUtils.decompress(compressedFilePath, templateFolder);
    fileUtils.deleteFile(compressedFilePath);
}


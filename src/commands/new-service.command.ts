import * as _ from "lodash";
import * as changeCase from "change-case";

import {
  InputBoxOptions,
  OpenDialogOptions,
  Uri,
  window,
  workspace,
} from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import {
  getServiceTemplate,
} from "../templates";

export const newService = async (uri: Uri) => {
  const serviceName = await promptForServiceName();
  if (_.isNil(serviceName) || serviceName.trim() === "") {
    window.showErrorMessage("The service name must not be empty");
    return;
  }

  let targetDirectory;
  if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
    targetDirectory = await promptForTargetDirectory();
    if (_.isNil(targetDirectory)) {
      window.showErrorMessage("Please select a valid directory");
      return;
    }
  } else {
    targetDirectory = uri.fsPath;
  }
  const pascalCaseServiceName = changeCase.pascalCase(serviceName);
  try {
    await generateServiceCode(serviceName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCaseServiceName} Service`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForServiceName(): Thenable<string | undefined> {
  const serviceNamePromptOptions: InputBoxOptions = {
    prompt: "Service Name",
    placeHolder: "name",
  };
  return window.showInputBox(serviceNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the service in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

async function generateServiceCode(
  serviceName: string,
  targetDirectory: string
) {
  const shouldCreateDirectory = workspace
    .getConfiguration("bloc")
    .get<boolean>("newServiceTemplate.createDirectory");
  const serviceDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/serivce`
    : targetDirectory;
  await Promise.all([
    createServiceTemplate(serviceName, serviceDirectoryPath),
  ]);
}

function createServiceTemplate(
  serviceName: string,
  targetDirectory: string
) {
  const snakeCaseServiceName = changeCase.snakeCase(serviceName);
  const targetPath = `${targetDirectory}/${snakeCaseServiceName}_serivce.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseServiceName}_serivce.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getServiceTemplate(serviceName), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

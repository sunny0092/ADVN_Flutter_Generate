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
  getRepositoryTemplate,
} from "../templates";

export const newRepository = async (uri: Uri) => {
  const repositoryName = await promptForRepositoryName();
  if (_.isNil(repositoryName) || repositoryName.trim() === "") {
    window.showErrorMessage("The repository name must not be empty");
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
  const pascalCaseRepositoryName = changeCase.pascalCase(repositoryName);
  try {
    await generateRepositoryCode(repositoryName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCaseRepositoryName} Repository`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForRepositoryName(): Thenable<string | undefined> {
  const repositoryNamePromptOptions: InputBoxOptions = {
    prompt: "Repository Name",
    placeHolder: "name",
  };
  return window.showInputBox(repositoryNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the repository in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

async function generateRepositoryCode(
  repositoryName: string,
  targetDirectory: string
) {
  const shouldCreateDirectory = workspace
    .getConfiguration("bloc")
    .get<boolean>("newRepositoryTemplate.createDirectory");
  const repositoryDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/repository`
    : targetDirectory;
  await Promise.all([
    createRepositoryTemplate(repositoryName, repositoryDirectoryPath),
  ]);
}

function createRepositoryTemplate(
  repositoryName: string,
  targetDirectory: string
) {
  const snakeCaseRepositoryName = changeCase.snakeCase(repositoryName);
  const targetPath = `${targetDirectory}/${snakeCaseRepositoryName}_repository.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseRepositoryName}_repository.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getRepositoryTemplate(repositoryName), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

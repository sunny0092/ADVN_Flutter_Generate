import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";

import {
  InputBoxOptions,
  OpenDialogOptions,
  Uri,
  window,
  workspace,
} from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import {
  getRepositoryImplTemplate,
} from "../templates";

export const newRepositoryImpl = async (uri: Uri) => {
  const repositoryImplName = await promptForRepositoryImplName();
  if (_.isNil(repositoryImplName) || repositoryImplName.trim() === "") {
    window.showErrorMessage("The repositoryImpl name must not be empty");
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
  const pascalCaseRepositoryImplName = changeCase.pascalCase(repositoryImplName);
  try {
    await generateRepositoryImplCode(repositoryImplName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCaseRepositoryImplName} RepositoryImpl`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForRepositoryImplName(): Thenable<string | undefined> {
  const repositoryImplNamePromptOptions: InputBoxOptions = {
    prompt: "RepositoryImpl Name",
    placeHolder: "name",
  };
  return window.showInputBox(repositoryImplNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the repositoryImpl in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

async function generateRepositoryImplCode(
  repositoryImplName: string,
  targetDirectory: string
) {
  const shouldCreateDirectory = workspace
    .getConfiguration("bloc")
    .get<boolean>("newRepositoryImplTemplate.createDirectory");
  const repositoryImplDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/impl`
    : targetDirectory;
  if (!existsSync(repositoryImplDirectoryPath)) {
    await createDirectory(repositoryImplDirectoryPath);
  }
  await Promise.all([
    createRepositoryImplTemplate(repositoryImplName, repositoryImplDirectoryPath),
  ]);
}

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

function createRepositoryImplTemplate(
  repositoryImplName: string,
  targetDirectory: string
) {
  const snakeCaseRepositoryImplName = changeCase.snakeCase(repositoryImplName);
  const targetPath = `${targetDirectory}/${snakeCaseRepositoryImplName}_repository_impl.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseRepositoryImplName}_repository_impl.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getRepositoryImplTemplate(repositoryImplName), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

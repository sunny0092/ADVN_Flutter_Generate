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
  getPagingTemplate,
} from "../templates";

export const newPaging = async (uri: Uri) => {
  const pagingName = await promptForPagingName();
  if (_.isNil(pagingName) || pagingName.trim() === "") {
    window.showErrorMessage("The paging name must not be empty");
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
  const pascalCasePagingName = changeCase.pascalCase(pagingName);
  try {
    await generatePagingCode(pagingName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCasePagingName} Paging`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForPagingName(): Thenable<string | undefined> {
  const pagingNamePromptOptions: InputBoxOptions = {
    prompt: "Paging Name",
    placeHolder: "name",
  };
  return window.showInputBox(pagingNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the paging in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

async function generatePagingCode(
  pagingName: string,
  targetDirectory: string
) {
  const shouldCreateDirectory = workspace
    .getConfiguration("bloc")
    .get<boolean>("newPagingTemplate.createDirectory");
  const pagingDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/page`
    : targetDirectory;
  if (!existsSync(pagingDirectoryPath)) {
    await createDirectory(pagingDirectoryPath);
  }
  await Promise.all([
    createPagingTemplate(pagingName, pagingDirectoryPath),
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

function createPagingTemplate(
  pagingName: string,
  targetDirectory: string
) {
  const snakeCasePagingName = changeCase.snakeCase(pagingName);
  const targetPath = `${targetDirectory}/${snakeCasePagingName}_page.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCasePagingName}_page.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getPagingTemplate(pagingName), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

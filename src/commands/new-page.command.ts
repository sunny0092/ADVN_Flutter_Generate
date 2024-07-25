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
  getPageTemplate,
} from "../templates";

export const newPage = async (uri: Uri) => {
  const pageName = await promptForPageName();
  if (_.isNil(pageName) || pageName.trim() === "") {
    window.showErrorMessage("The page name must not be empty");
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
  const pascalCasePageName = changeCase.pascalCase(pageName);
  try {
    await generatePageCode(pageName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCasePageName} Page`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForPageName(): Thenable<string | undefined> {
  const pageNamePromptOptions: InputBoxOptions = {
    prompt: "Page Name",
    placeHolder: "name",
  };
  return window.showInputBox(pageNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the page in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

async function generatePageCode(
  pageName: string,
  targetDirectory: string
) {
  const shouldCreateDirectory = workspace
    .getConfiguration("bloc")
    .get<boolean>("newPageTemplate.createDirectory");
  const pageDirectoryPath = shouldCreateDirectory
    ? `${targetDirectory}/page`
    : targetDirectory;
  if (!existsSync(pageDirectoryPath)) {
    await createDirectory(pageDirectoryPath);
  }
  await Promise.all([
    createPageTemplate(pageName, pageDirectoryPath),
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

function createPageTemplate(
  pageName: string,
  targetDirectory: string
) {
  const snakeCasePageName = changeCase.snakeCase(pageName);
  const targetPath = `${targetDirectory}/${snakeCasePageName}_page.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCasePageName}_page.dart already exists`);
  }
  return new Promise<void>(async (resolve, reject) => {
    writeFile(targetPath, getPageTemplate(pageName), "utf8", (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

import * as _ from "lodash";

import {
  commands,
  ExtensionContext,
  window,
  workspace,
} from "vscode";
import {
  newBloc,
  newPage,
  newPaging,
  newRepository,
  newRepositoryImpl,
  newService,
} from "./commands";
import { analyzeDependencies, setShowContextMenu } from "./utils";

export function activate(_context: ExtensionContext) {
  if (workspace.getConfiguration("bloc").get<boolean>("checkForUpdates")) {
    analyzeDependencies();
  }

  setShowContextMenu();

  _context.subscriptions.push(
    window.onDidChangeActiveTextEditor((_) => setShowContextMenu()),
    workspace.onDidChangeWorkspaceFolders((_) => setShowContextMenu()),
    workspace.onDidChangeTextDocument(async function (event) {
      if (event.document.uri.fsPath.endsWith("pubspec.yaml")) {
        setShowContextMenu(event.document.uri);
      }
    }),
    commands.registerCommand("extension.new-bloc", newBloc),
    commands.registerCommand("extension.new-page", newPage),
    commands.registerCommand("extension.new-paging", newPaging),
    commands.registerCommand("extension.new-repository", newRepository),
    commands.registerCommand("extension.new-repository-impl", newRepositoryImpl),
    commands.registerCommand("extension.new-service", newService),
  );
}

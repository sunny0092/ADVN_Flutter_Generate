import * as yaml from "js-yaml";
import * as _ from "lodash";

import { commands, Uri, workspace } from "vscode";

export async function setShowContextMenu(
  pubspec?: Uri | undefined,
): Promise<void> {
  async function pubspecIncludesBloc(pubspec: Uri): Promise<boolean> {
    try {
      const content = await workspace.fs.readFile(pubspec);
      const yamlContent = yaml.load(content.toString());
      const dependencies = _.get(yamlContent, "dependencies", {});
      return [
        "bloc",
        "page"
      ].some((d) => dependencies.hasOwnProperty(d));
    } catch (_) {}
    return false;
  }

  async function workspaceIncludesBloc(): Promise<boolean> {
    try {
      const pubspecs = await workspace.findFiles("**/**/pubspec.yaml");
      for (const pubspec of pubspecs) {
        if (await pubspecIncludesBloc(pubspec)) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  // async function pubspecIncludesPage(pubspec: Uri): Promise<boolean> {
  //   try {
  //     const content = await workspace.fs.readFile(pubspec);
  //     const yamlContent = yaml.load(content.toString());
  //     const dependencies = _.get(yamlContent, "dependencies", {});
  //     return [
  //       "page",
  //     ].some((d) => dependencies.hasOwnProperty(d));
  //   } catch (_) { }
  //   return false;
  // }

  // async function workspaceIncludesPage(): Promise<boolean> {
  //   try {
  //     const pubspecs = await workspace.findFiles("**/**/pubspec.yaml");
  //     for (const pubspec of pubspecs) {
  //       if (await pubspecIncludesPage(pubspec)) {
  //         return true;
  //       }
  //     }
  //   } catch (_) { }
  //   return false;
  // }

  commands.executeCommand(
    "setContext",
    "bloc.showContextMenu",
    pubspec
      ? await pubspecIncludesBloc(pubspec)
      : await workspaceIncludesBloc(),
    // pubspec
    //   ? await pubspecIncludesPage(pubspec)
    //   : await workspaceIncludesPage(),
  );
}

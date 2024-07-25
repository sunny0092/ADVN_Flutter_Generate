import { workspace } from "vscode";

export const enum TemplateSetting {
  Auto,
  Simple,
}

export const enum TemplateType {
  Bloc,
  Page,
  Paging
}

export function getTemplateSetting(type: TemplateType): TemplateSetting {
  let config: string | undefined;
  switch (type) {
    case TemplateType.Bloc:
      config = workspace.getConfiguration("bloc").get("newBlocTemplate.type");
      break;
    case TemplateType.Page:
      config = workspace.getConfiguration("bloc").get("newPageTemplate.type");
      break;
    case TemplateType.Paging:
      config = workspace.getConfiguration("bloc").get("newPagingTemplate.type");
      break;
    default:
      return TemplateSetting.Auto;
  }

  switch (config) {
    case "simple":
      return TemplateSetting.Simple;
    case "auto":
    default:
      return TemplateSetting.Auto;
  }
}

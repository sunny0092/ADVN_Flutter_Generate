import {
  TemplateType,
  getTemplateSetting,
  TemplateSetting,
} from "./get-template-setting";

export const enum BlocType {
  Simple
}

export async function getBlocType(type: TemplateType): Promise<BlocType> {
  const setting = getTemplateSetting(type);
  switch (setting) {
    case TemplateSetting.Simple:
      return BlocType.Simple;
    case TemplateSetting.Auto:
    default:
      return getDefaultDependency();
  }
}

async function getDefaultDependency(): Promise<BlocType> {
  return BlocType.Simple;
}

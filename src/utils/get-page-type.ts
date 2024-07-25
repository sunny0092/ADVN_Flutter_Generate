export const enum PageType {
  Simple
}

export async function getPageType(): Promise<PageType> {
  return PageType.Simple;
}


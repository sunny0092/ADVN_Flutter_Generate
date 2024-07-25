
import { BlocType } from "../utils";

export function getBlocEventTemplate(
  blocName: string,
  _type: BlocType
): string {
  return getDefaultBlocEventTemplate(blocName);
}

function getDefaultBlocEventTemplate(
  _blocName: string,
): string {
  return `import 'package:sharing/share/base/common/base_event.dart';
  //class <Name>Event extends BaseEvent {}
`;
}


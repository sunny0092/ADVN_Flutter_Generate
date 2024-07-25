import { BlocType } from "../utils";

export function getBlocStateTemplate(
  blocName: string,
  _type: BlocType
): string {
  return getDefaultBlocStateTemplate(blocName);
}

function getDefaultBlocStateTemplate(
  _blocName: string
): string {
  return `import 'package:sharing/share/base/common/base_state.dart';
  //class <Name>State extends BaseState {}
`;
}
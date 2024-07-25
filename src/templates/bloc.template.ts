import * as changeCase from "change-case";
import { BlocType } from "../utils";

export function getBlocTemplate(blocName: string, _type: BlocType): string {
  return getDefaultBlocTemplate(blocName);
}

function getDefaultBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  // const blocState = `${pascalCaseBlocName}State`;
  // const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:injectable/injectable.dart';
import 'package:sharing/share/base/common/base_bloc.dart';

import '${snakeCaseBlocName}_event.dart';
import '${snakeCaseBlocName}_state.dart';

@injectable
class ${pascalCaseBlocName}Bloc extends BaseBloc {
  ${pascalCaseBlocName}Bloc();
  @override
  void onMapEventToState() {
    //on<[Name][Fetch]Event>(on[Name][Fetch]Fetch);
  }
  //on[Name][Fetch]Event([Name][Fetch]Event event, emit) async {}
}
`;
}
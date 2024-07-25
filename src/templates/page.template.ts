export function getPageTemplate(pageName: string): string {
  return getDefaultPageTemplate(pageName);
}


function getDefaultPageTemplate(pageName: string) {
  return `import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:sharing/share/base/base_page.dart';
import 'package:sharing/share/base/common/base_state.dart';

@RoutePage()
class ${pageName}Page extends BasePage {
  ${pageName}Page({ Key? key}) : super(key: key);

@override
  _${pageName}PageState createState() => _${pageName}PageState();
}

class _${pageName}PageState extends BasePageState<${pageName}Bloc> {

  //#region==========================VARIABLE=============================//

  //#endregion=======================VARIABLE============================//

  //#region=============================OVERRIDE=============================//
  // @override
  // bool? get isScrollView => true;

  // @override
  // bool get isTopSafeArea => true;

  // @override
  // Widget appTopWidget() {}

  @override
  void initBloc() { }

  @override
  void listener(BuildContext context, BaseState state) {
    //if(State is SuccessDataState){}
    super.listener(context, state);
  }
  //#endregion==========================OVERRIDE=============================//

  //#region==============================BUILDER=============================//
  @override
  Widget builder(BuildContext context, BaseState state) {
    return Container();
  }
  //#endregion===========================BUILDER=============================//
  
  //#region=============================WIDGET=============================//
  
  //#endregion==========================WIDGET=============================//

  //#region=============================FUNCTION=============================//
  
  //#endregion==========================FUNCTION=============================//
}
`;
}





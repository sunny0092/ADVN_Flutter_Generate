export function getPagingTemplate(pageName: string): string {
  return getDefaultPagingTemplate(pageName);
}


function getDefaultPagingTemplate(pageName: string) {
  return `import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:sharing/share/base/base_paging.dart';
import 'package:sharing/share/base/common/base_state.dart';

@RoutePage()
class ${pageName}Page extends BasePage {
  ${pageName}Page({ Key? key}) : super(key: key);

@override
  _${pageName}PageState createState() => _${pageName}PageState();
}

class _${pageName}PageState extends BasePageState<${pageName}Model,${pageName}Bloc> {

  //#region==========================VARIABLE=============================//
  //List<>? dataList; 

  //#endregion=======================VARIABLE============================//

  //#region=============================OVERRIDE=============================//
  // @override
  // bool? get isScrollView => true;

  // @override
  // bool get isTopSafeArea => true;

  // @override
  // Widget appTopWidget() {}

  // @override
  // BaseEvent initPagingEvent(int page) {
  // return <Name>ListFetchEvent(PagingParams(page: 1, pageSize: 10));
  // }

  @override
  void initBloc() { }



  @override
  void listenerWhen(BaseState previous, BaseState state) {
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
  @override
  Widget itemBuilder(item, int index) {
    return Container();
  }
  //#endregion==========================WIDGET=============================//

  //#region=============================FUNCTION=============================//
  
  //#endregion==========================FUNCTION=============================//
}
`;
}





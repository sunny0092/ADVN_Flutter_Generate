export function getServiceTemplate(name: string): string {
  return getDefaultServiceTemplate(name);
}


function getDefaultServiceTemplate(name: string) {
  return `import 'package:dio/dio.dart';
import 'package:retrofit/http.dart';
import 'package:sharing/remote/model/base_paging_response.dart';
import 'package:sharing/remote/model/base_object_response.dart';
import '../constaints.dart';
import 'package:injectable/injectable.dart';

part '${name.toLowerCase()}_service.g.dart';

@RestApi()
@injectable
abstract class ${name}Service {
  @factoryMethod
  factory ${name}Service(@Named('base_dio') Dio dio, {@Named('base_url') String baseUrl}) = _${name}Service;

  // @POST(ApiConstant.<API>)
  // Future<BaseObjectResponse<[MODEL/dynamic]>> signIn({@Field("[PARAM1]") required String <param1>, @Field("[PARAM2]") required String <param2>});

  // @GET(ApiConstant.<API>)
  // Future<BasePagingResponse<[MODEL/dynamic]>> getSettings({@Queries() Map<String, dynamic>? params});

  // @PUT(ApiConstant.<API>)
  // Future<dynamic> updateUser({@Path("id") required String id, @Field("status") required int status});
}
`;
}





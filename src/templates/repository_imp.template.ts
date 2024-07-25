export function getRepositoryImplTemplate(name: string): string {
  return getDefaultRepositoryImplTemplate(name);
}


function getDefaultRepositoryImplTemplate(name: string) {
  return `import 'package:injectable/injectable.dart';
import 'package:sharing/remote/base_service.dart';
import 'package:sharing/remote/network/fetch_data.dart';
import 'package:sharing/remote/network/fetch_failure.dart';
import 'package:sharing/share/di/flavor_config.dart';
import '../${name.toLowerCase()}_repository.dart';

@Injectable(as: ${name}Repository, env: [Flavor.prod, Flavor.staging, Flavor.dev])
class ${name}RepositoryImpl extends BaseService with ${name}Repository {
  final ${name}Service ${name.toLowerCase()}Service;

  ${name}RepositoryImpl(this.${name.toLowerCase()}Service);

  //@override
  //Future<void> <function>({required Function(FetchData) funDataServer, required Function(FetchFailure) funError}) async {
    // final responseApi = accountService.signIn();
    // await safeCallObjectStatus(response: await safeFetch(() => responseApi), funDataServer: funDataServer, funError: funError);
  //}

`;
}





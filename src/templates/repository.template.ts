export function getRepositoryTemplate(name: string): string {
  return getDefaultRepositoryTemplate(name);
}


function getDefaultRepositoryTemplate(name: string) {
  return `import 'package:sharing/remote/network/fetch_data.dart';
import 'package:sharing/remote/network/fetch_failure.dart';

mixin ${name}Repository {
  //Future<void> <function>({required Function(FetchData) funDataServer, required Function(FetchFailure) funError});
}
`;
}





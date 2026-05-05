import type { ModuleMetadata } from '@nestjs/common';
import { buildCrudController, buildCrudProvider } from './crud.factory';
import type { CrudResourceDefinition } from './crud.types';

export function createCrudModuleMetadata(
  domain: string,
  resources: readonly CrudResourceDefinition[],
): Pick<ModuleMetadata, 'controllers' | 'providers'> {
  return {
    controllers: resources.map((resource) =>
      buildCrudController(domain, resource),
    ),
    providers: resources.map((resource) => buildCrudProvider(domain, resource)),
  };
}

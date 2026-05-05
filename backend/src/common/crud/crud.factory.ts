import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Provider,
  Query,
  Req,
  Type,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Roles } from '../decorators/roles.decorator';
import type { AuthTokenPayload } from '../guards/jwt-auth.guard';
import {
  getCrudToken,
  type CrudModelName,
  type CrudMutationPayload,
  type CrudResourceDefinition,
} from './crud.types';
import { PrismaCrudService } from './prisma-crud.service';

const DEFAULT_READ_ROLES = ['Superadmin', 'Approver'] as const;
const DEFAULT_WRITE_ROLES = ['Superadmin'] as const;

type CrudRequest = Request & {
  user?: AuthTokenPayload;
};

type CrudQuery = Record<string, string | string[] | undefined>;

const RESERVED_QUERY_PARAMS = new Set(['page', 'limit', 'search']);

function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildFilterQuery(query: CrudQuery): Record<string, string> {
  return Object.fromEntries(
    Object.entries(query)
      .filter(([key]) => !RESERVED_QUERY_PARAMS.has(key))
      .map(([key, value]) => [key, firstQueryValue(value)?.trim()])
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function buildCrudControllerName(domain: string, path: string): string {
  return `${toPascalCase(domain)}${toPascalCase(path)}Controller`;
}

function buildCrudControllerPaths(
  domain: string,
  resource: CrudResourceDefinition,
): string[] {
  return [resource.path, ...(resource.aliases ?? [])].map(
    (pathSegment) => `${domain}/${pathSegment}`,
  );
}

export function buildCrudProvider<ModelName extends CrudModelName>(
  domain: string,
  resource: CrudResourceDefinition<ModelName>,
): Provider {
  return {
    provide: getCrudToken(domain, resource.model),
    useFactory: (prisma: PrismaService) =>
      new PrismaCrudService(prisma, resource),
    inject: [PrismaService],
  };
}

export function buildCrudController<ModelName extends CrudModelName>(
  domain: string,
  resource: CrudResourceDefinition<ModelName>,
): Type<unknown> {
  const providerToken = getCrudToken(domain, resource.model);
  const controllerPaths = buildCrudControllerPaths(domain, resource);
  const readRoles = resource.readRoles ?? DEFAULT_READ_ROLES;
  const writeRoles = resource.writeRoles ?? DEFAULT_WRITE_ROLES;

  @Controller(controllerPaths)
  class ResourceCrudController {
    constructor(
      @Inject(providerToken)
      private readonly service: PrismaCrudService<ModelName>,
    ) {}

    @Roles(...readRoles)
    @Get()
    findAll(@Req() request: CrudRequest, @Query() query: CrudQuery) {
      const page = firstQueryValue(query.page);
      const limit = firstQueryValue(query.limit);
      const search = firstQueryValue(query.search);
      const parsedPage = page ? parseInt(page, 10) : undefined;
      const parsedLimit = limit ? parseInt(limit, 10) : undefined;

      return this.service.findAll(
        {
          page: parsedPage,
          limit: parsedLimit,
          search,
          filters: buildFilterQuery(query),
        },
        request.user,
      );
    }

    @Roles(...readRoles)
    @Get(':id')
    findOne(
      @Req() request: CrudRequest,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.service.findOne(id, request.user);
    }

    @Roles(...writeRoles)
    @Post()
    create(@Body() body: CrudMutationPayload) {
      return this.service.create(body);
    }

    @Roles(...writeRoles)
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: CrudMutationPayload,
    ) {
      return this.service.update(id, body);
    }

    @Roles(...writeRoles)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }

  Object.defineProperty(ResourceCrudController, 'name', {
    value: buildCrudControllerName(domain, resource.path),
  });

  return ResourceCrudController;
}

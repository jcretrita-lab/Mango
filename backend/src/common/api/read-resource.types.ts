import type { PrismaClient } from '@prisma/client';
import type { PermissionCode } from '../constants/permissions.constants';

type ReadDelegateMethodName = 'findMany' | 'findFirst' | 'count';

type HasReadDelegateMethods<T> = ReadDelegateMethodName extends keyof T
  ? T
  : never;

export type ReadFindManyArgs = {
  where?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  skip?: number;
  take?: number;
};

type ReadDelegateArgs = {
  readonly findMany: [args?: ReadFindManyArgs];
  readonly findFirst: [args?: ReadFindManyArgs];
  readonly count: [args: { where?: Record<string, unknown> }];
};

export type ReadDelegate = {
  readonly [MethodName in ReadDelegateMethodName]: (
    ...args: ReadDelegateArgs[MethodName]
  ) => Promise<unknown>;
};

export type ReadModelName = Extract<
  {
    [Key in keyof PrismaClient]: HasReadDelegateMethods<
      PrismaClient[Key]
    > extends never
      ? never
      : Key;
  }[keyof PrismaClient],
  string
>;

export interface ReadFilterFieldDefinition {
  readonly query: string;
  readonly field: string;
  readonly jsonPath?: readonly string[];
}

export type ReadFilterField = string | ReadFilterFieldDefinition;

export interface ReadResourceDefinition<
  ModelName extends ReadModelName = ReadModelName,
> {
  readonly model: ModelName;
  readonly label: string;
  readonly searchFields?: readonly string[];
  readonly filterFields?: readonly ReadFilterField[];
  readonly readPermission?: PermissionCode;
  readonly selfReadPermission?: PermissionCode;
  readonly employeeReadScope?: {
    readonly field: string;
  };
}

export interface ReadAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, string>;
}

export type ApiQuery = Record<string, string | string[] | undefined>;

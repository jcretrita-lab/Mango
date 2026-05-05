import type { PrismaClient } from '@prisma/client';
import type { UserRole } from '../constants/app.constants';

type CrudDelegateMethodName =
  | 'findMany'
  | 'findFirst'
  | 'findUnique'
  | 'create'
  | 'update'
  | 'delete';

type HasCrudDelegateMethods<T> = CrudDelegateMethodName extends keyof T
  ? T
  : never;

export type CrudFindManyArgs = {
  where?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  skip?: number;
  take?: number;
};

type CrudDelegateArgs = {
  readonly findMany: [args?: CrudFindManyArgs];
  readonly findFirst: [args?: CrudFindManyArgs];
  readonly findUnique: [args: { readonly where: { readonly id: number } }];
  readonly create: [args: { readonly data: CrudMutationPayload }];
  readonly update: [
    args: {
      readonly where: { readonly id: number };
      readonly data: CrudMutationPayload;
    },
  ];
  readonly delete: [args: { readonly where: { readonly id: number } }];
};

export type CrudDelegate = {
  readonly [MethodName in CrudDelegateMethodName]: (
    ...args: CrudDelegateArgs[MethodName]
  ) => Promise<unknown>;
};

export type CrudModelName = Extract<
  {
    [Key in keyof PrismaClient]: HasCrudDelegateMethods<
      PrismaClient[Key]
    > extends never
      ? never
      : Key;
  }[keyof PrismaClient],
  string
>;

export type CrudMutationPayload = Readonly<Record<string, unknown>>;

export interface CrudFilterFieldDefinition {
  readonly query: string;
  readonly field: string;
  readonly jsonPath?: readonly string[];
}

export type CrudFilterField = string | CrudFilterFieldDefinition;

export interface CrudResourceDefinition<
  ModelName extends CrudModelName = CrudModelName,
> {
  readonly path: string;
  readonly aliases?: readonly string[];
  readonly model: ModelName;
  readonly label: string;
  /** Fields available for text search via ?search= query param */
  readonly searchFields?: readonly string[];
  /** Scalar fields that can be equality-filtered through query params. */
  readonly filterFields?: readonly CrudFilterField[];
  readonly readRoles?: readonly UserRole[];
  readonly writeRoles?: readonly UserRole[];
  readonly genericMutations?: boolean;
  readonly employeeReadScope?: {
    readonly field: string;
  };
}

export function getCrudToken(domain: string, model: CrudModelName): string {
  return `crud:${domain}:${model}`;
}

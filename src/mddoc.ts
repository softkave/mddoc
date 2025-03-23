import {
  AnyFn,
  AnyObject,
  IsBoolean,
  IsStringEnum,
  IsUnion,
  Not,
  OmitFrom,
} from 'softkave-js-utils';
import {Readable} from 'stream';
import {IsNever, OptionalKeysOf, ValueOf} from 'type-fest';
import {HttpEndpointResponseHeaders_ContentType_ContentLength} from './headers.js';
import {BaseEndpointResult} from './types.js';

export const kMddocFieldTypes = {
  Base: 'FieldBase',
  String: 'FieldString',
  ObjectField: 'FieldObjectField',
  Number: 'FieldNumber',
  Boolean: 'FieldBoolean',
  Null: 'FieldNull',
  Undefined: 'FieldUndefined',
  Date: 'FieldDate',
  Array: 'FieldArray',
  Object: 'FieldObject',
  OrCombination: 'FieldOrCombination',
  Binary: 'FieldBinary',
  SdkParamsBody: 'SdkParamsBody',
  HttpEndpointMultipartFormdata: 'HttpEndpointMultipartFormdata',
  HttpEndpointDefinition: 'HttpEndpointDefinition',
} as const;

export type MddocFieldType = ValueOf<typeof kMddocFieldTypes>;

export interface MddocFieldIdPrimitive {
  __id: string;
}

export interface MddocFieldBaseTypePrimitive extends MddocFieldIdPrimitive {
  description?: string;
}

export interface MddocFieldStringTypePrimitive extends MddocFieldIdPrimitive {
  example?: string;
  valid?: string[];
  min?: number;
  max?: number;
  enumName?: string;
  description?: string;
}

export interface MddocFieldNumberTypePrimitive extends MddocFieldIdPrimitive {
  example?: number;
  integer?: boolean;
  min?: number;
  max?: number;
  description?: string;
}

export interface MddocFieldBooleanTypePrimitive extends MddocFieldIdPrimitive {
  example?: boolean;
  description?: string;
}

export interface MddocFieldNullTypePrimitive extends MddocFieldIdPrimitive {
  description?: string;
}

export interface MddocFieldUndefinedTypePrimitive
  extends MddocFieldIdPrimitive {
  description?: string;
}

export interface MddocFieldDateTypePrimitive extends MddocFieldIdPrimitive {
  example?: string;
  description?: string;
}

export interface MddocFieldArrayTypePrimitive<T> extends MddocFieldIdPrimitive {
  type?: ConvertToMddocType<T>;
  min?: number;
  max?: number;
  description?: string;
}

export interface MddocFieldObjectFieldTypePrimitive<
  T,
  TRequired extends boolean = any,
> extends MddocFieldIdPrimitive {
  required: TRequired;
  data: ConvertToMddocType<T>;
  description?: string;
}

export type ConvertToMddocType<
  T = any,
  TAllowOrCombination extends boolean = true,
> =
  IsNever<
    IsUnion<Exclude<T, undefined>> &
      TAllowOrCombination &
      Not<IsStringEnum<Exclude<T, undefined>>> &
      Not<IsBoolean<Exclude<T, undefined>>>
  > extends false
    ? MddocFieldOrCombinationTypePrimitive<Array<ConvertToMddocType<T, false>>>
    : T extends string
      ? MddocFieldStringTypePrimitive
      : T extends number
        ? MddocFieldNumberTypePrimitive
        : T extends boolean
          ? MddocFieldBooleanTypePrimitive
          : T extends Array<infer InferedType>
            ? MddocFieldArrayTypePrimitive<InferedType>
            : T extends Buffer
              ? MddocFieldBinaryTypePrimitive
              : T extends Readable
                ? MddocFieldBinaryTypePrimitive
                : T extends null
                  ? MddocFieldNullTypePrimitive
                  : T extends AnyObject
                    ? MddocFieldObjectTypePrimitive<Exclude<T, undefined>>
                    : MddocFieldBaseTypePrimitive;

export type MddocFieldObjectFieldsMap<T extends object> = Required<{
  [K in keyof T]: K extends OptionalKeysOf<T>
    ? MddocFieldObjectFieldTypePrimitive<Exclude<T[K], undefined>, false>
    : MddocFieldObjectFieldTypePrimitive<Exclude<T[K], undefined>, true>;
}>;

export interface MddocFieldObjectTypePrimitive<T extends object>
  extends MddocFieldIdPrimitive {
  name: string;
  fields?: MddocFieldObjectFieldsMap<T>;
  description?: string;
}

export interface MddocFieldOrCombinationTypePrimitive<
  T extends MddocFieldBaseTypePrimitive[] = MddocFieldBaseTypePrimitive[],
> extends MddocFieldIdPrimitive {
  types: T;
  description?: string;
}

export interface MddocFieldBinaryTypePrimitive extends MddocFieldIdPrimitive {
  min?: number;
  max?: number;
  description?: string;
}

export type MddocMappingFn<
  TSdkParams,
  TRequestHeaders,
  TPathParameters,
  TQuery,
  TRequestBody,
> = AnyFn<
  [keyof TSdkParams],
  | ['header', keyof TRequestHeaders]
  | ['path', keyof TPathParameters]
  | ['query', keyof TQuery]
  | ['body', keyof TRequestBody]
  | undefined
>;

export type MddocSdkParamsToRequestArtifactsMapping<
  TSdkParams,
  TRequestHeaders,
  TPathParameters,
  TQuery,
  TRequestBody,
> = AnyFn<
  [keyof TSdkParams],
  Array<
    | ['header', keyof TRequestHeaders]
    | ['path', keyof TPathParameters]
    | ['query', keyof TQuery]
    | ['body', keyof TRequestBody]
  >
>;

export interface MddocSdkParamsBodyTypePrimitive<
  T extends object = any,
  TRequestHeaders extends object = any,
  TPathParameters extends object = any,
  TQuery extends object = any,
  TRequestBody extends object = any,
> extends MddocFieldIdPrimitive {
  def?: MddocFieldObjectTypePrimitive<T>;
  mappings: MddocMappingFn<
    T,
    TRequestHeaders,
    TPathParameters,
    TQuery,
    TRequestBody
  >;
  serializeAs?: 'json' | 'formdata';
}

export interface MddocHttpEndpointMultipartFormdataTypePrimitive<
  T extends object = any,
> extends MddocFieldIdPrimitive {
  items?: MddocFieldObjectTypePrimitive<T>;
  description?: string;
}

export interface MddocHttpEndpointDefinitionTypePrimitive<
  TRequestHeaders extends AnyObject = AnyObject,
  TPathParameters extends AnyObject = AnyObject,
  TQuery extends AnyObject = AnyObject,
  TRequestBody extends AnyObject = AnyObject,
  TResponseHeaders extends AnyObject = AnyObject,
  TResponseBody extends AnyObject = AnyObject,
  TSdkParams extends AnyObject = TRequestBody,
> extends MddocFieldIdPrimitive {
  basePathname: string;
  method: MddocHttpEndpointMethod;
  pathParamaters?: MddocFieldObjectTypePrimitive<TPathParameters>;
  query?: MddocFieldObjectTypePrimitive<TQuery>;
  requestHeaders?: MddocFieldObjectTypePrimitive<TRequestHeaders>;
  requestBody?:
    | MddocFieldObjectTypePrimitive<TRequestBody>
    | MddocHttpEndpointMultipartFormdataTypePrimitive<TRequestBody>;
  responseHeaders?: MddocFieldObjectTypePrimitive<TResponseHeaders>;
  responseBody?: TResponseBody extends MddocFieldBinaryTypePrimitive
    ? MddocFieldBinaryTypePrimitive
    : MddocFieldObjectTypePrimitive<TResponseBody>;
  sdkParamsBody?: MddocSdkParamsBodyTypePrimitive<
    TSdkParams,
    TRequestHeaders,
    TPathParameters,
    TQuery,
    TRequestBody
  >;
  name: string;
  description?: string;
  tags?: string[];

  // No need to manually set these fields, they are automatically added when
  // generating api and sdk since our error response header and body is the
  // same for all endpoints
  errorResponseHeaders?: MddocFieldObjectTypePrimitive<HttpEndpointResponseHeaders_ContentType_ContentLength>;
  errorResponseBody?: MddocFieldObjectTypePrimitive<BaseEndpointResult>;
}

export type InferMddocFieldObjectType<T, TDefault = never> =
  T extends MddocFieldObjectTypePrimitive<infer TObjectType>
    ? TObjectType
    : TDefault;

export type InferMddocFieldObjectOrMultipartType<T> =
  T extends MddocFieldObjectTypePrimitive<infer TObjectType>
    ? TObjectType
    : T extends MddocHttpEndpointMultipartFormdataTypePrimitive<
          infer TMultipartObjectType
        >
      ? TMultipartObjectType
      : never;

export type InferMddocSdkParamsType<T> =
  T extends MddocSdkParamsBodyTypePrimitive<infer TObjectType>
    ? TObjectType
    : never;

export enum MddocHttpEndpointMethod {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
  Options = 'options',
  Put = 'put',
  Patch = 'patch',
}

function constructBase(
  params: OmitFrom<MddocFieldBaseTypePrimitive, '__id'>
): MddocFieldBaseTypePrimitive {
  return {
    __id: kMddocFieldTypes.Base,
    ...params,
  };
}

function constructString(
  params: OmitFrom<MddocFieldStringTypePrimitive, '__id'>
): MddocFieldStringTypePrimitive {
  return {
    __id: kMddocFieldTypes.String,
    ...params,
  };
}

function constructNumber(
  params: OmitFrom<MddocFieldNumberTypePrimitive, '__id'>
): MddocFieldNumberTypePrimitive {
  return {
    __id: kMddocFieldTypes.Number,
    ...params,
  };
}

function constructBoolean(
  params: OmitFrom<MddocFieldBooleanTypePrimitive, '__id'>
): MddocFieldBooleanTypePrimitive {
  return {
    __id: kMddocFieldTypes.Boolean,
    ...params,
  };
}

function constructNull(
  params: OmitFrom<MddocFieldNullTypePrimitive, '__id'>
): MddocFieldNullTypePrimitive {
  return {
    __id: kMddocFieldTypes.Null,
    ...params,
  };
}

function constructUndefined(
  params: OmitFrom<MddocFieldUndefinedTypePrimitive, '__id'>
): MddocFieldUndefinedTypePrimitive {
  return {
    __id: kMddocFieldTypes.Undefined,
    ...params,
  };
}

function constructDate(
  params: OmitFrom<MddocFieldDateTypePrimitive, '__id'>
): MddocFieldDateTypePrimitive {
  return {
    __id: kMddocFieldTypes.Date,
    ...params,
  };
}

function constructArray<T>(
  params: OmitFrom<MddocFieldArrayTypePrimitive<T>, '__id'>
): MddocFieldArrayTypePrimitive<T> {
  return {
    __id: kMddocFieldTypes.Array,
    ...params,
  };
}

function constructObjectField<T, TRequired extends boolean = false>(
  params: OmitFrom<MddocFieldObjectFieldTypePrimitive<T, TRequired>, '__id'>
): MddocFieldObjectFieldTypePrimitive<T, TRequired> {
  return {
    __id: kMddocFieldTypes.ObjectField,
    ...params,
  };
}

function constructObject<T extends object>(
  params: OmitFrom<MddocFieldObjectTypePrimitive<T>, '__id'>
): MddocFieldObjectTypePrimitive<T> {
  return {
    __id: kMddocFieldTypes.Object,
    ...params,
  };
}

function constructSdkParamsBody(
  params: OmitFrom<MddocSdkParamsBodyTypePrimitive, '__id'>
): MddocSdkParamsBodyTypePrimitive {
  return {
    __id: kMddocFieldTypes.SdkParamsBody,
    ...params,
  };
}

function constructOrCombination<T extends MddocFieldBaseTypePrimitive[]>(
  params: OmitFrom<MddocFieldOrCombinationTypePrimitive<T>, '__id'>
): MddocFieldOrCombinationTypePrimitive<T> {
  return {
    __id: kMddocFieldTypes.OrCombination,
    ...params,
  };
}

function constructBinary(
  params: OmitFrom<MddocFieldBinaryTypePrimitive, '__id'>
): MddocFieldBinaryTypePrimitive {
  return {
    __id: kMddocFieldTypes.Binary,
    ...params,
  };
}

function constructHttpEndpointMultipartFormdata<T extends object>(
  params: OmitFrom<MddocHttpEndpointMultipartFormdataTypePrimitive<T>, '__id'>
): MddocHttpEndpointMultipartFormdataTypePrimitive<T> {
  return {
    __id: kMddocFieldTypes.HttpEndpointMultipartFormdata,
    ...params,
  };
}

function constructHttpEndpointDefinition<
  TRequestHeaders extends AnyObject = AnyObject,
  TPathParameters extends AnyObject = AnyObject,
  TQuery extends AnyObject = AnyObject,
  TRequestBody extends AnyObject = AnyObject,
  TResponseHeaders extends AnyObject = AnyObject,
  TResponseBody extends AnyObject = AnyObject,
  TSdkParams extends AnyObject = TRequestBody,
>(
  params: OmitFrom<
    MddocHttpEndpointDefinitionTypePrimitive<
      TRequestHeaders,
      TPathParameters,
      TQuery,
      TRequestBody,
      TResponseHeaders,
      TResponseBody,
      TSdkParams
    >,
    '__id'
  >
): MddocHttpEndpointDefinitionTypePrimitive<
  TRequestHeaders,
  TPathParameters,
  TQuery,
  TRequestBody,
  TResponseHeaders,
  TResponseBody,
  TSdkParams
> {
  return {
    __id: kMddocFieldTypes.HttpEndpointDefinition,
    ...params,
  };
}
export const mddocConstruct = {
  constructBase,
  constructString,
  constructNumber,
  constructBoolean,
  constructNull,
  constructUndefined,
  constructDate,
  constructArray,
  constructObjectField,
  constructObject,
  constructSdkParamsBody,
  constructOrCombination,
  constructBinary,
  constructHttpEndpointMultipartFormdata,
  constructHttpEndpointDefinition,
};

export function objectHasRequiredFields(
  item:
    | MddocFieldObjectTypePrimitive<any>
    | MddocFieldObjectTypePrimitive<AnyObject>
) {
  return item.fields
    ? Object.values(item.fields).findIndex(next => next.required) !== -1
    : false;
}

export function isMddocFieldBase(
  data: any
): data is MddocFieldBaseTypePrimitive {
  return (
    data && (data as MddocFieldBaseTypePrimitive).__id === kMddocFieldTypes.Base
  );
}

export function isMddocFieldString(
  data: any
): data is MddocFieldStringTypePrimitive {
  return (
    data &&
    (data as MddocFieldStringTypePrimitive).__id === kMddocFieldTypes.String
  );
}

export function isMddocFieldNumber(
  data: any
): data is MddocFieldNumberTypePrimitive {
  return (
    data &&
    (data as MddocFieldNumberTypePrimitive).__id === kMddocFieldTypes.Number
  );
}

export function isMddocFieldBoolean(
  data: any
): data is MddocFieldBooleanTypePrimitive {
  return (
    data &&
    (data as MddocFieldBooleanTypePrimitive).__id === kMddocFieldTypes.Boolean
  );
}

export function isMddocFieldNull(
  data: any
): data is MddocFieldNullTypePrimitive {
  return (
    data && (data as MddocFieldNullTypePrimitive).__id === kMddocFieldTypes.Null
  );
}

export function isMddocFieldUndefined(
  data: any
): data is MddocFieldUndefinedTypePrimitive {
  return (
    data &&
    (data as MddocFieldUndefinedTypePrimitive).__id ===
      kMddocFieldTypes.Undefined
  );
}

export function isMddocFieldDate(
  data: any
): data is MddocFieldDateTypePrimitive {
  return (
    data && (data as MddocFieldDateTypePrimitive).__id === kMddocFieldTypes.Date
  );
}

export function isMddocFieldArray(
  data: any
): data is MddocFieldArrayTypePrimitive<any> {
  return (
    data &&
    (data as MddocFieldArrayTypePrimitive<any>).__id === kMddocFieldTypes.Array
  );
}

export function isMddocFieldObject(
  data: any
): data is MddocFieldObjectTypePrimitive<any> {
  return (
    data &&
    (data as MddocFieldObjectTypePrimitive<any>).__id ===
      kMddocFieldTypes.Object
  );
}

export function isMddocFieldOrCombination(
  data: any
): data is MddocFieldOrCombinationTypePrimitive<any> {
  return (
    data &&
    (data as MddocFieldOrCombinationTypePrimitive<any>).__id ===
      kMddocFieldTypes.OrCombination
  );
}

export function isMddocFieldBinary(
  data: any
): data is MddocFieldBinaryTypePrimitive {
  return (
    data &&
    (data as MddocFieldBinaryTypePrimitive).__id === kMddocFieldTypes.Binary
  );
}

export function isMddocMultipartFormdata(
  data: any
): data is MddocHttpEndpointMultipartFormdataTypePrimitive<any> {
  return (
    data &&
    (data as MddocHttpEndpointMultipartFormdataTypePrimitive<any>).__id ===
      kMddocFieldTypes.HttpEndpointMultipartFormdata
  );
}

export function isMddocEndpoint(
  data: any
): data is MddocHttpEndpointDefinitionTypePrimitive<
  any,
  any,
  any,
  any,
  any,
  any,
  any
> {
  return (
    data &&
    (
      data as MddocHttpEndpointDefinitionTypePrimitive<
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >
    ).__id === kMddocFieldTypes.HttpEndpointDefinition
  );
}

export function isMddocSdkParamsBody(
  data: any
): data is MddocSdkParamsBodyTypePrimitive<any, any, any, any, any> {
  return (
    data &&
    (data as MddocSdkParamsBodyTypePrimitive<any, any, any, any, any>).__id ===
      kMddocFieldTypes.SdkParamsBody
  );
}

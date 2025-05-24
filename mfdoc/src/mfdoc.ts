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

export const kMfdocFieldTypes = {
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

export type MfdocFieldType = ValueOf<typeof kMfdocFieldTypes>;

export interface MfdocFieldIdPrimitive {
  __id: string;
}

export interface MfdocFieldBaseTypePrimitive extends MfdocFieldIdPrimitive {
  description?: string;
}

export interface MfdocFieldStringTypePrimitive extends MfdocFieldIdPrimitive {
  example?: string;
  valid?: string[];
  min?: number;
  max?: number;
  enumName?: string;
  description?: string;
}

export interface MfdocFieldNumberTypePrimitive extends MfdocFieldIdPrimitive {
  example?: number;
  integer?: boolean;
  min?: number;
  max?: number;
  description?: string;
}

export interface MfdocFieldBooleanTypePrimitive extends MfdocFieldIdPrimitive {
  example?: boolean;
  description?: string;
}

export interface MfdocFieldNullTypePrimitive extends MfdocFieldIdPrimitive {
  description?: string;
}

export interface MfdocFieldUndefinedTypePrimitive
  extends MfdocFieldIdPrimitive {
  description?: string;
}

export interface MfdocFieldDateTypePrimitive extends MfdocFieldIdPrimitive {
  example?: string;
  description?: string;
}

export interface MfdocFieldArrayTypePrimitive<T> extends MfdocFieldIdPrimitive {
  type?: ConvertToMfdocType<T>;
  min?: number;
  max?: number;
  description?: string;
}

export interface MfdocFieldObjectFieldTypePrimitive<
  T,
  TRequired extends boolean = any
> extends MfdocFieldIdPrimitive {
  required: TRequired;
  data: ConvertToMfdocType<T>;
  description?: string;
}

export type ConvertToMfdocType<
  T = any,
  TAllowOrCombination extends boolean = true
> = IsNever<
  IsUnion<Exclude<T, undefined>> &
    TAllowOrCombination &
    Not<IsStringEnum<Exclude<T, undefined>>> &
    Not<IsBoolean<Exclude<T, undefined>>>
> extends false
  ? MfdocFieldOrCombinationTypePrimitive<Array<ConvertToMfdocType<T, false>>>
  : T extends string
  ? MfdocFieldStringTypePrimitive
  : T extends number
  ? MfdocFieldNumberTypePrimitive
  : T extends boolean
  ? MfdocFieldBooleanTypePrimitive
  : T extends Array<infer InferedType>
  ? MfdocFieldArrayTypePrimitive<InferedType>
  : T extends Buffer
  ? MfdocFieldBinaryTypePrimitive
  : T extends Readable
  ? MfdocFieldBinaryTypePrimitive
  : T extends null
  ? MfdocFieldNullTypePrimitive
  : T extends AnyObject
  ? MfdocFieldObjectTypePrimitive<Exclude<T, undefined>>
  : MfdocFieldBaseTypePrimitive;

export type MfdocFieldObjectFieldsMap<T extends object> = Required<{
  [K in keyof T]: K extends OptionalKeysOf<T>
    ? MfdocFieldObjectFieldTypePrimitive<Exclude<T[K], undefined>, false>
    : MfdocFieldObjectFieldTypePrimitive<Exclude<T[K], undefined>, true>;
}>;

export interface MfdocFieldObjectTypePrimitive<T extends object>
  extends MfdocFieldIdPrimitive {
  name: string;
  fields?: MfdocFieldObjectFieldsMap<T>;
  description?: string;
}

export interface MfdocFieldOrCombinationTypePrimitive<
  T extends MfdocFieldBaseTypePrimitive[] = MfdocFieldBaseTypePrimitive[]
> extends MfdocFieldIdPrimitive {
  types: T;
  description?: string;
}

export interface MfdocFieldBinaryTypePrimitive extends MfdocFieldIdPrimitive {
  min?: number;
  max?: number;
  description?: string;
}

export type MfdocMappingFn<
  TSdkParams,
  TRequestHeaders,
  TPathParameters,
  TQuery,
  TRequestBody
> = AnyFn<
  [keyof TSdkParams],
  | ['header', keyof TRequestHeaders]
  | ['path', keyof TPathParameters]
  | ['query', keyof TQuery]
  | ['body', keyof TRequestBody]
  | undefined
>;

export type MfdocSdkParamsToRequestArtifactsMapping<
  TSdkParams,
  TRequestHeaders,
  TPathParameters,
  TQuery,
  TRequestBody
> = AnyFn<
  [keyof TSdkParams],
  Array<
    | ['header', keyof TRequestHeaders]
    | ['path', keyof TPathParameters]
    | ['query', keyof TQuery]
    | ['body', keyof TRequestBody]
  >
>;

export interface MfdocSdkParamsBodyTypePrimitive<
  T extends object = any,
  TRequestHeaders extends object = any,
  TPathParameters extends object = any,
  TQuery extends object = any,
  TRequestBody extends object = any
> extends MfdocFieldIdPrimitive {
  def?: MfdocFieldObjectTypePrimitive<T>;
  mappings: MfdocMappingFn<
    T,
    TRequestHeaders,
    TPathParameters,
    TQuery,
    TRequestBody
  >;
  serializeAs?: 'json' | 'formdata';
}

export interface MfdocHttpEndpointMultipartFormdataTypePrimitive<
  T extends object = any
> extends MfdocFieldIdPrimitive {
  items?: MfdocFieldObjectTypePrimitive<T>;
  description?: string;
}

export interface MfdocHttpEndpointDefinitionTypePrimitive<
  TRequestHeaders extends AnyObject = AnyObject,
  TPathParameters extends AnyObject = AnyObject,
  TQuery extends AnyObject = AnyObject,
  TRequestBody extends AnyObject = AnyObject,
  TResponseHeaders extends AnyObject = AnyObject,
  TResponseBody extends AnyObject = AnyObject,
  TSdkParams extends AnyObject = TRequestBody
> extends MfdocFieldIdPrimitive {
  basePathname: string;
  method: MfdocHttpEndpointMethod;
  pathParamaters?: MfdocFieldObjectTypePrimitive<TPathParameters>;
  query?: MfdocFieldObjectTypePrimitive<TQuery>;
  requestHeaders?: MfdocFieldObjectTypePrimitive<TRequestHeaders>;
  requestBody?:
    | MfdocFieldObjectTypePrimitive<TRequestBody>
    | MfdocHttpEndpointMultipartFormdataTypePrimitive<TRequestBody>;
  responseHeaders?: MfdocFieldObjectTypePrimitive<TResponseHeaders>;
  responseBody?: TResponseBody extends MfdocFieldBinaryTypePrimitive
    ? MfdocFieldBinaryTypePrimitive
    : MfdocFieldObjectTypePrimitive<TResponseBody>;
  sdkParamsBody?: MfdocSdkParamsBodyTypePrimitive<
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
  errorResponseHeaders?: MfdocFieldObjectTypePrimitive<HttpEndpointResponseHeaders_ContentType_ContentLength>;
  errorResponseBody?: MfdocFieldObjectTypePrimitive<BaseEndpointResult>;
}

export type InferMfdocFieldObjectType<
  T,
  TDefault = never
> = T extends MfdocFieldObjectTypePrimitive<infer TObjectType>
  ? TObjectType
  : TDefault;

export type InferMfdocFieldObjectOrMultipartType<T> =
  T extends MfdocFieldObjectTypePrimitive<infer TObjectType>
    ? TObjectType
    : T extends MfdocHttpEndpointMultipartFormdataTypePrimitive<
        infer TMultipartObjectType
      >
    ? TMultipartObjectType
    : never;

export type InferMfdocSdkParamsType<T> =
  T extends MfdocSdkParamsBodyTypePrimitive<infer TObjectType>
    ? TObjectType
    : never;

export enum MfdocHttpEndpointMethod {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
  Options = 'options',
  Put = 'put',
  Patch = 'patch',
}

function constructBase(
  params: OmitFrom<MfdocFieldBaseTypePrimitive, '__id'>
): MfdocFieldBaseTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Base,
    ...params,
  };
}

function constructString(
  params: OmitFrom<MfdocFieldStringTypePrimitive, '__id'>
): MfdocFieldStringTypePrimitive {
  return {
    __id: kMfdocFieldTypes.String,
    ...params,
  };
}

function constructNumber(
  params: OmitFrom<MfdocFieldNumberTypePrimitive, '__id'>
): MfdocFieldNumberTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Number,
    ...params,
  };
}

function constructBoolean(
  params: OmitFrom<MfdocFieldBooleanTypePrimitive, '__id'>
): MfdocFieldBooleanTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Boolean,
    ...params,
  };
}

function constructNull(
  params: OmitFrom<MfdocFieldNullTypePrimitive, '__id'>
): MfdocFieldNullTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Null,
    ...params,
  };
}

function constructUndefined(
  params: OmitFrom<MfdocFieldUndefinedTypePrimitive, '__id'>
): MfdocFieldUndefinedTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Undefined,
    ...params,
  };
}

function constructDate(
  params: OmitFrom<MfdocFieldDateTypePrimitive, '__id'>
): MfdocFieldDateTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Date,
    ...params,
  };
}

function constructArray<T>(
  params: OmitFrom<MfdocFieldArrayTypePrimitive<T>, '__id'>
): MfdocFieldArrayTypePrimitive<T> {
  return {
    __id: kMfdocFieldTypes.Array,
    ...params,
  };
}

function constructObjectField<T, TRequired extends boolean = false>(
  params: OmitFrom<MfdocFieldObjectFieldTypePrimitive<T, TRequired>, '__id'>
): MfdocFieldObjectFieldTypePrimitive<T, TRequired> {
  return {
    __id: kMfdocFieldTypes.ObjectField,
    ...params,
  };
}

function constructObject<T extends object>(
  params: OmitFrom<MfdocFieldObjectTypePrimitive<T>, '__id'>
): MfdocFieldObjectTypePrimitive<T> {
  return {
    __id: kMfdocFieldTypes.Object,
    ...params,
  };
}

function constructSdkParamsBody(
  params: OmitFrom<MfdocSdkParamsBodyTypePrimitive, '__id'>
): MfdocSdkParamsBodyTypePrimitive {
  return {
    __id: kMfdocFieldTypes.SdkParamsBody,
    ...params,
  };
}

function constructOrCombination<T extends MfdocFieldBaseTypePrimitive[]>(
  params: OmitFrom<MfdocFieldOrCombinationTypePrimitive<T>, '__id'>
): MfdocFieldOrCombinationTypePrimitive<T> {
  return {
    __id: kMfdocFieldTypes.OrCombination,
    ...params,
  };
}

function constructBinary(
  params: OmitFrom<MfdocFieldBinaryTypePrimitive, '__id'>
): MfdocFieldBinaryTypePrimitive {
  return {
    __id: kMfdocFieldTypes.Binary,
    ...params,
  };
}

function constructHttpEndpointMultipartFormdata<T extends object>(
  params: OmitFrom<MfdocHttpEndpointMultipartFormdataTypePrimitive<T>, '__id'>
): MfdocHttpEndpointMultipartFormdataTypePrimitive<T> {
  return {
    __id: kMfdocFieldTypes.HttpEndpointMultipartFormdata,
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
  TSdkParams extends AnyObject = TRequestBody
>(
  params: Omit<
    MfdocHttpEndpointDefinitionTypePrimitive<
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
): MfdocHttpEndpointDefinitionTypePrimitive<
  TRequestHeaders,
  TPathParameters,
  TQuery,
  TRequestBody,
  TResponseHeaders,
  TResponseBody,
  TSdkParams
> {
  return {
    __id: kMfdocFieldTypes.HttpEndpointDefinition,
    ...params,
  };
}
export const mfdocConstruct = {
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
    | MfdocFieldObjectTypePrimitive<any>
    | MfdocFieldObjectTypePrimitive<AnyObject>
) {
  return item.fields
    ? Object.values(item.fields).findIndex(next => next.required) !== -1
    : false;
}

export function isMfdocFieldBase(
  data: any
): data is MfdocFieldBaseTypePrimitive {
  return (
    data && (data as MfdocFieldBaseTypePrimitive).__id === kMfdocFieldTypes.Base
  );
}

export function isMfdocFieldString(
  data: any
): data is MfdocFieldStringTypePrimitive {
  return (
    data &&
    (data as MfdocFieldStringTypePrimitive).__id === kMfdocFieldTypes.String
  );
}

export function isMfdocFieldNumber(
  data: any
): data is MfdocFieldNumberTypePrimitive {
  return (
    data &&
    (data as MfdocFieldNumberTypePrimitive).__id === kMfdocFieldTypes.Number
  );
}

export function isMfdocFieldBoolean(
  data: any
): data is MfdocFieldBooleanTypePrimitive {
  return (
    data &&
    (data as MfdocFieldBooleanTypePrimitive).__id === kMfdocFieldTypes.Boolean
  );
}

export function isMfdocFieldNull(
  data: any
): data is MfdocFieldNullTypePrimitive {
  return (
    data && (data as MfdocFieldNullTypePrimitive).__id === kMfdocFieldTypes.Null
  );
}

export function isMfdocFieldUndefined(
  data: any
): data is MfdocFieldUndefinedTypePrimitive {
  return (
    data &&
    (data as MfdocFieldUndefinedTypePrimitive).__id ===
      kMfdocFieldTypes.Undefined
  );
}

export function isMfdocFieldDate(
  data: any
): data is MfdocFieldDateTypePrimitive {
  return (
    data && (data as MfdocFieldDateTypePrimitive).__id === kMfdocFieldTypes.Date
  );
}

export function isMfdocFieldArray(
  data: any
): data is MfdocFieldArrayTypePrimitive<any> {
  return (
    data &&
    (data as MfdocFieldArrayTypePrimitive<any>).__id === kMfdocFieldTypes.Array
  );
}

export function isMfdocFieldObject(
  data: any
): data is MfdocFieldObjectTypePrimitive<any> {
  return (
    data &&
    (data as MfdocFieldObjectTypePrimitive<any>).__id ===
      kMfdocFieldTypes.Object
  );
}

export function isMfdocFieldOrCombination(
  data: any
): data is MfdocFieldOrCombinationTypePrimitive<any> {
  return (
    data &&
    (data as MfdocFieldOrCombinationTypePrimitive<any>).__id ===
      kMfdocFieldTypes.OrCombination
  );
}

export function isMfdocFieldBinary(
  data: any
): data is MfdocFieldBinaryTypePrimitive {
  return (
    data &&
    (data as MfdocFieldBinaryTypePrimitive).__id === kMfdocFieldTypes.Binary
  );
}

export function isMfdocMultipartFormdata(
  data: any
): data is MfdocHttpEndpointMultipartFormdataTypePrimitive<any> {
  return (
    data &&
    (data as MfdocHttpEndpointMultipartFormdataTypePrimitive<any>).__id ===
      kMfdocFieldTypes.HttpEndpointMultipartFormdata
  );
}

export function isMfdocEndpoint(
  data: any
): data is MfdocHttpEndpointDefinitionTypePrimitive<
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
      data as MfdocHttpEndpointDefinitionTypePrimitive<
        any,
        any,
        any,
        any,
        any,
        any,
        any
      >
    ).__id === kMfdocFieldTypes.HttpEndpointDefinition
  );
}

export function isMfdocSdkParamsBody(
  data: any
): data is MfdocSdkParamsBodyTypePrimitive<any, any, any, any, any> {
  return (
    data &&
    (data as MfdocSdkParamsBodyTypePrimitive<any, any, any, any, any>).__id ===
      kMfdocFieldTypes.SdkParamsBody
  );
}

type KT = OptionalKeysOf<{
  errors: {
    message: string;
  }[];
}>;

type KM = MfdocFieldObjectFieldsMap<{
  errors: {
    message: string;
  }[];
}>;

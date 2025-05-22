import assert from 'assert';
import {execSync} from 'child_process';
import fse from 'fs-extra';
import {compact, forEach, last, nth, set, upperFirst} from 'lodash-es';
import path from 'path';
import {AnyObject, isObjectEmpty, pathSplit} from 'softkave-js-utils';
import {Doc} from './doc.js';
import {findAndReplaceMddocInFilesInDirectory} from './findAndReplace.js';
import {
  isMddocFieldArray,
  isMddocFieldBinary,
  isMddocFieldBoolean,
  isMddocFieldDate,
  isMddocFieldNull,
  isMddocFieldNumber,
  isMddocFieldObject,
  isMddocFieldOrCombination,
  isMddocFieldString,
  isMddocFieldUndefined,
  isMddocMultipartFormdata,
  isMddocSdkParamsBody,
  mddocConstruct,
  MddocFieldArrayTypePrimitive,
  MddocFieldBinaryTypePrimitive,
  MddocFieldBooleanTypePrimitive,
  MddocFieldDateTypePrimitive,
  MddocFieldNullTypePrimitive,
  MddocFieldNumberTypePrimitive,
  MddocFieldObjectTypePrimitive,
  MddocFieldOrCombinationTypePrimitive,
  MddocFieldStringTypePrimitive,
  MddocFieldUndefinedTypePrimitive,
  MddocHttpEndpointDefinitionTypePrimitive,
  objectHasRequiredFields,
} from './mddoc.js';
import {filterEndpointsByTags} from './utils.js';

function getEnumType(doc: Doc, item: MddocFieldStringTypePrimitive) {
  const name = item.enumName;
  if (name && doc.generatedTypeCache.has(name)) {
    return name;
  }

  const text = item.valid?.map(next => `"${next}"`).join(' | ') ?? 'string';
  if (name) {
    doc.generatedTypeCache.set(name, true);
    doc.appendType(`export type ${name} = ${text}`);
    return name;
  }

  return text;
}

function getStringType(doc: Doc, item: MddocFieldStringTypePrimitive) {
  return item.valid?.length ? getEnumType(doc, item) : 'string';
}

function getNumberType(item: MddocFieldNumberTypePrimitive) {
  return 'number';
}

function getBooleanType(item: MddocFieldBooleanTypePrimitive) {
  return 'boolean';
}

function getNullType(item: MddocFieldNullTypePrimitive) {
  return 'null';
}

function getUndefinedType(item: MddocFieldUndefinedTypePrimitive) {
  return 'undefined';
}

function getDateType(item: MddocFieldDateTypePrimitive) {
  return 'number';
}

function getArrayType(doc: Doc, item: MddocFieldArrayTypePrimitive<any>) {
  const ofType = item.type;
  const typeString = getType(
    doc,
    ofType,
    /** asFetchResponseIfFieldBinary */ false
  );
  return `Array<${typeString}>`;
}

function getOrCombinationType(
  doc: Doc,
  item: MddocFieldOrCombinationTypePrimitive
) {
  return item.types
    .map(next => getType(doc, next, /** asFetchResponseIfFieldBinary */ false))
    .join(' | ');
}

function getBinaryType(
  doc: Doc,
  item: MddocFieldBinaryTypePrimitive,
  asFetchResponse: boolean
) {
  if (asFetchResponse) {
    doc.appendTypeImport(['Readable'], 'stream');
    return 'Blob | Readable';
  } else {
    doc.appendTypeImport(['Readable'], 'stream');
    return 'string | Readable | Blob | Buffer';
  }
}

function getType(
  doc: Doc,
  item: any,
  asFetchResponseIfFieldBinary: boolean
): string {
  if (isMddocFieldString(item)) {
    return getStringType(doc, item);
  } else if (isMddocFieldNumber(item)) {
    return getNumberType(item);
  } else if (isMddocFieldBoolean(item)) {
    return getBooleanType(item);
  } else if (isMddocFieldNull(item)) {
    return getNullType(item);
  } else if (isMddocFieldUndefined(item)) {
    return getUndefinedType(item);
  } else if (isMddocFieldDate(item)) {
    return getDateType(item);
  } else if (isMddocFieldArray(item)) {
    return getArrayType(doc, item);
  } else if (isMddocFieldOrCombination(item)) {
    return getOrCombinationType(doc, item);
  } else if (isMddocFieldBinary(item)) {
    return getBinaryType(doc, item, asFetchResponseIfFieldBinary);
  } else if (isMddocFieldObject(item)) {
    return generateObjectDefinition(doc, item, asFetchResponseIfFieldBinary);
  } else {
    return 'unknown';
  }
}

function shouldEncloseObjectKeyInQuotes(key: string) {
  return /[0-9]/.test(key[0]) || /[^A-Za-z0-9]/.test(key);
}

function generateObjectDefinition(
  doc: Doc,
  item:
    | MddocFieldObjectTypePrimitive<any>
    | MddocFieldObjectTypePrimitive<AnyObject>,
  asFetchResponse: boolean,
  name?: string,
  extraFields: string[] = []
) {
  name = name ?? item.name;
  if (doc.generatedTypeCache.has(name)) {
    return name;
  }

  const fields = item.fields ?? {};
  const entries: string[] = [];
  for (let key in fields) {
    const value = fields[key];
    const entryType = getType(doc, value.data, asFetchResponse);
    const separator = value.required ? ':' : '?:';
    key = shouldEncloseObjectKeyInQuotes(key) ? `"${key}"` : key;
    const entry = `${key}${separator} ${entryType};`;
    entries.push(entry);

    const valueData = value.data;
    if (isMddocFieldObject(valueData)) {
      generateObjectDefinition(doc, valueData, asFetchResponse);
    } else if (
      isMddocFieldArray(valueData) &&
      isMddocFieldObject(valueData.type)
    ) {
      generateObjectDefinition(
        doc,
        valueData.type as MddocFieldObjectTypePrimitive<any>,
        asFetchResponse
      );
    }
  }

  doc.appendType(`export type ${name} = {`);
  entries.concat(extraFields).forEach(entry => doc.appendType(entry));
  doc.appendType('}');
  doc.generatedTypeCache.set(name, true);
  return name;
}

function getTypesFromEndpoint(
  endpoint: MddocHttpEndpointDefinitionTypePrimitive
) {
  // Request body
  const sdkRequestBodyRaw = endpoint.sdkParamsBody ?? endpoint.requestBody;
  const sdkRequestObject = isMddocFieldObject(sdkRequestBodyRaw)
    ? sdkRequestBodyRaw
    : isMddocMultipartFormdata(sdkRequestBodyRaw)
      ? sdkRequestBodyRaw.items
      : isMddocSdkParamsBody(sdkRequestBodyRaw)
        ? sdkRequestBodyRaw.def
        : undefined;

  // Success response body
  const successResponseBodyRaw = endpoint.responseBody;
  const successResponseBodyObject = isMddocFieldObject(successResponseBodyRaw)
    ? successResponseBodyRaw
    : undefined;

  // Success response headers
  const successResponseHeadersObject = endpoint.responseHeaders;

  type SdkEndpointResponseType = {
    body?: any;
  };

  const successObjectFields: SdkEndpointResponseType = {};
  const requestBodyObjectHasRequiredFields =
    sdkRequestObject && objectHasRequiredFields(sdkRequestObject);

  if (successResponseBodyObject) {
    if (objectHasRequiredFields(successResponseBodyObject))
      successObjectFields.body = mddocConstruct.constructObjectField({
        required: true,
        data: successResponseBodyObject,
      });
    else
      successObjectFields.body = mddocConstruct.constructObjectField({
        required: false,
        data: successResponseBodyObject,
      });
  } else if (isMddocFieldBinary(successResponseBodyRaw)) {
    successObjectFields.body = mddocConstruct.constructObjectField({
      required: true,
      data: successResponseBodyRaw,
    });
  }

  return {
    sdkRequestBodyRaw,
    sdkRequestObject,
    successResponseBodyRaw,
    successResponseBodyObject,
    successResponseHeadersObject,
    requestBodyObjectHasRequiredFields,
  };
}

function generateTypesFromEndpoint(
  doc: Doc,
  endpoint: MddocHttpEndpointDefinitionTypePrimitive
) {
  const {sdkRequestObject: requestBodyObject, successResponseBodyObject} =
    getTypesFromEndpoint(endpoint);

  // Request body
  if (requestBodyObject) {
    generateObjectDefinition(doc, requestBodyObject, false);
  }

  // Success response body
  if (successResponseBodyObject) {
    generateObjectDefinition(
      doc,
      successResponseBodyObject,
      /** asFetchResponse */ true
    );
  }
}

function documentTypesFromEndpoint(
  doc: Doc,
  endpoint: MddocHttpEndpointDefinitionTypePrimitive
) {
  generateTypesFromEndpoint(doc, endpoint);
}

function decideIsBinaryRequest(
  req: ReturnType<typeof getTypesFromEndpoint>['sdkRequestBodyRaw']
) {
  return (
    isMddocMultipartFormdata(req) ||
    (isMddocSdkParamsBody(req) && req.serializeAs === 'formdata')
  );
}

function generateEndpointCode(
  doc: Doc,
  types: ReturnType<typeof getTypesFromEndpoint>,
  className: string,
  fnName: string,
  endpoint: MddocHttpEndpointDefinitionTypePrimitive
) {
  const {
    sdkRequestObject,
    successResponseBodyRaw,
    successResponseBodyObject,
    sdkRequestBodyRaw: requestBodyRaw,
    requestBodyObjectHasRequiredFields,
  } = types;

  doc.appendImportFromGenTypes(
    compact([sdkRequestObject?.name, successResponseBodyObject?.name])
  );

  let param0 = '';
  let resultType = 'void';
  let templateParams = '';
  let param1 = 'opts?: MddocEndpointOpts';

  const isBinaryRequest = decideIsBinaryRequest(requestBodyRaw);
  const isBinaryResponse = isMddocFieldBinary(successResponseBodyRaw);
  const requestBodyObjectName = sdkRequestObject?.name;

  if (successResponseBodyObject) {
    doc.appendImportFromGenTypes([successResponseBodyObject.name]);
    resultType = successResponseBodyObject.name;
  } else if (isBinaryResponse) {
    resultType = 'MddocEndpointResultWithBinaryResponse<TResponseType>';
  }

  if (sdkRequestObject) {
    if (requestBodyObjectHasRequiredFields) {
      param0 = `props: ${requestBodyObjectName}`;
    } else {
      param0 = `props?: ${requestBodyObjectName}`;
    }
  }

  const bodyText: string[] = [];
  let mapping = '';
  const sdkBody = endpoint.sdkParamsBody;

  if (isBinaryResponse) {
    bodyText.push('responseType: opts.responseType,');
    templateParams = "<TResponseType extends 'blob' | 'stream'>";
    param1 =
      'opts: MddocEndpointDownloadBinaryOpts<TResponseType> ' +
      '= {responseType: "blob"} as MddocEndpointDownloadBinaryOpts<TResponseType>';
  }

  if (isBinaryRequest) {
    bodyText.push('formdata: props,');
    param1 = 'opts?: MddocEndpointUploadBinaryOpts';
  } else if (sdkRequestObject) {
    bodyText.push('data: props,');
  }

  if (sdkRequestObject && sdkBody) {
    forEach(sdkRequestObject.fields ?? {}, (value, key) => {
      const mapTo = sdkBody.mappings(key);

      if (mapTo) {
        const entry = `"${key}": ["${mapTo[0]}", "${String(mapTo[1])}"],`;
        mapping += entry;
      }
    });

    if (mapping.length) {
      mapping = `{${mapping}}`;
    }
  }

  const params = compact([param0, param1]).join(',');
  const text = `${fnName} = async ${templateParams}(${params}): Promise<${resultType}> => {
    ${mapping.length ? `const mapping = ${mapping} as const` : ''}
    return this.execute${isBinaryResponse ? 'Raw' : 'Json'}({
      ${bodyText.join('')}
      path: "${endpoint.basePathname}",
      method: "${endpoint.method.toUpperCase()}",
    }, opts, ${mapping.length ? 'mapping' : ''});
  }`;

  doc.appendToClass(text, className, 'MddocEndpointsBase');
}

function generateEveryEndpointCode(
  doc: Doc,
  endpoints: Array<MddocHttpEndpointDefinitionTypePrimitive>
) {
  const leafEndpointsMap: Record<
    string,
    Record<
      string,
      {
        endpoint: MddocHttpEndpointDefinitionTypePrimitive;
        types: ReturnType<typeof getTypesFromEndpoint>;
      }
    >
  > = {};
  const branchMap: Record<
    string,
    Record<string, Record<string, /** Record<string, any...> */ any>>
  > = {};

  endpoints.forEach(e1 => {
    const pathname = e1.basePathname;
    // pathname looks like /v1/agentToken/addAgentToken, which should yield 4
    // parts, but pathSplit, removes empty strings, so we'll have ["v1",
    // "agentToken", "addAgentToken"]. also filter out path params.
    const [, ...rest] = pathSplit({input: pathname}).filter(
      p => !p.startsWith(':')
    );

    assert(rest.length >= 2);
    const fnName = last(rest);
    const groupName = nth(rest, rest.length - 2);
    const className = `${upperFirst(groupName)}Endpoints`;
    const types = getTypesFromEndpoint(e1);
    const key = `${className}.${fnName}`;
    set(leafEndpointsMap, key, {types, endpoint: e1});

    const branches = rest.slice(0, -1);
    const branchesKey = branches.join('.');
    set(branchMap, branchesKey, {});
  });

  doc.appendImport(
    [
      'MddocEndpointsBase',
      'MddocEndpointResultWithBinaryResponse',
      'MddocEndpointOpts',
      'MddocEndpointDownloadBinaryOpts',
      'MddocEndpointUploadBinaryOpts',
    ],
    './endpointImports.ts'
  );

  for (const groupName in leafEndpointsMap) {
    const group = leafEndpointsMap[groupName];

    for (const fnName in group) {
      const {types, endpoint} = group[fnName];
      generateEndpointCode(doc, types, groupName, fnName, endpoint);
    }
  }

  function docBranch(
    parentName: string,
    ownName: string,
    branch: Record<string, any>
  ) {
    if (!isObjectEmpty(branch)) {
      forEach(branch, (b1, bName) => {
        docBranch(ownName, bName, b1);
      });
    }

    doc.appendToClass(
      `${ownName} = new ${upperFirst(ownName)}Endpoints(this.config, this);`,
      `${upperFirst(parentName)}Endpoints`,
      'MddocEndpointsBase'
    );
  }

  for (const ownName in branchMap) {
    docBranch('mddoc', ownName, branchMap[ownName]);
  }
}

function uniqEnpoints(
  endpoints: Array<MddocHttpEndpointDefinitionTypePrimitive>
) {
  const endpointNameMap: Record<string, string> = {};

  endpoints.forEach(e1 => {
    const names = pathSplit({input: e1.basePathname});
    const fnName = last(names);
    const method = e1.method.toLowerCase();
    const key = `${fnName}__${method}`;
    endpointNameMap[key] = key;
  });

  return endpoints.filter(e1 => {
    const names = pathSplit({input: e1.basePathname});
    const fnName = last(names);
    const method = e1.method.toLowerCase();
    const ownKey = `${fnName}__${method}`;
    const postKey = `${fnName}__post`;
    const getKey = `${fnName}__get`;

    if (ownKey === getKey && endpointNameMap[postKey]) {
      return false;
    }

    return true;
  });
}

export async function genJsSdk(params: {
  endpoints: MddocHttpEndpointDefinitionTypePrimitive[];
  filenamePrefix: string;
  tags: string[];
  outputDir: string;
  applicationName: string;
}) {
  const {endpoints, filenamePrefix, tags, outputDir, applicationName} = params;
  const endpointsDir = path.normalize(outputDir + '/src/endpoints');
  const typesFilename = `${filenamePrefix}Types.ts`;
  const typesFilepath = path.normalize(endpointsDir + '/' + typesFilename);
  const codesFilepath = path.normalize(
    endpointsDir + `/${filenamePrefix}Endpoints.ts`
  );
  const typesDoc = new Doc('./' + typesFilename);
  const codesDoc = new Doc('./' + typesFilename);

  const httpEndpoints = filterEndpointsByTags(endpoints, tags);

  forEach(httpEndpoints, e1 => {
    if (e1) {
      documentTypesFromEndpoint(typesDoc, e1);
    }
  });

  const uniqHttpEndpoints = uniqEnpoints(httpEndpoints);
  generateEveryEndpointCode(codesDoc, uniqHttpEndpoints);

  fse.ensureFileSync(typesFilepath);
  fse.ensureFileSync(codesFilepath);
  await Promise.all([
    fse.writeFile(typesFilepath, typesDoc.compileText(), {encoding: 'utf-8'}),
    fse.writeFile(codesFilepath, codesDoc.compileText(), {encoding: 'utf-8'}),
  ]);

  await findAndReplaceMddocInFilesInDirectory(endpointsDir, applicationName);

  execSync(`npx code-migration-helpers add-ext -f="${endpointsDir}"`, {
    stdio: 'inherit',
  });
  execSync(`npx --yes prettier --write "${typesFilepath}"`, {stdio: 'inherit'});
  execSync(`npx --yes prettier --write "${codesFilepath}"`, {stdio: 'inherit'});
}

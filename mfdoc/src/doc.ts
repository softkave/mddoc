import {uniq} from 'lodash-es';
import {stringToJsDoc} from './utils.js';

export class Doc {
  protected disclaimer =
    '// This file is auto-generated, do not modify directly. \n' +
    '// Reach out to a code owner to suggest changes.\n';
  protected endpointsText = '';
  protected typesText = '';
  protected docImports: Record<string, {importing: string[]; from: string}> =
    {};
  protected docTypeImports: Record<
    string,
    {importing: string[]; from: string}
  > = {};
  protected classes: Record<
    string,
    {entries: string[]; name: string; extendsName?: string; comment?: string}
  > = {};

  generatedTypeCache: Map<string, boolean> = new Map();

  constructor(protected props: {genTypesFilepath: string}) {}

  appendToType(typeText: string, comment?: string) {
    const jsDoc = stringToJsDoc(comment);
    this.typesText += (jsDoc ? jsDoc + '\n' : '') + typeText + '\n';
    return this;
  }

  appendImport(importing: Array<string>, from: string) {
    let entry = this.docImports[from];
    if (!entry) {
      entry = {from, importing};
      this.docImports[from] = entry;
    } else {
      entry.importing = uniq(entry.importing.concat(importing));
    }

    return this;
  }

  appendTypeImport(importing: Array<string>, from: string) {
    let entry = this.docTypeImports[from];

    if (!entry) {
      entry = {from, importing};
      this.docTypeImports[from] = entry;
    } else {
      entry.importing = uniq(entry.importing.concat(importing));
    }

    return this;
  }

  appendImportFromGenTypes(importing: string[]) {
    let filename = this.props.genTypesFilepath;
    if (filename.endsWith('.ts')) {
      filename = filename.replace('.ts', '.js');
    } else if (!filename.endsWith('.js')) {
      filename = filename + '.js';
    }
    return this.appendImport(
      importing.map(i => `type ${i}`),
      filename
    );
  }

  appendToClass(
    entry: string,
    name: string,
    extendsName?: string,
    comment?: string
  ) {
    let classEntry = this.classes[name];

    if (!classEntry) {
      classEntry = {name, extendsName, entries: [entry], comment};
      this.classes[name] = classEntry;
    } else {
      if (extendsName && extendsName !== classEntry.extendsName) {
        classEntry.extendsName = extendsName;
      }

      classEntry.entries.push(entry);
    }

    return this;
  }

  compileText() {
    return (
      this.disclaimer +
      '\n' +
      this.compileImports() +
      '\n' +
      this.compileTypeImports() +
      '\n' +
      this.typesText +
      '\n' +
      this.endpointsText +
      '\n' +
      this.compileClasses()
    );
  }

  protected compileImports() {
    let importsText = '';

    for (const from in this.docImports) {
      const {importing} = this.docImports[from];
      importsText += `import {${importing.join(', ')}} from "${from}"\n`;
    }

    return importsText;
  }

  protected compileTypeImports() {
    let importsText = '';

    for (const from in this.docTypeImports) {
      const {importing} = this.docTypeImports[from];
      importsText += `import type {${importing.join(', ')}} from "${from}"\n`;
    }

    return importsText;
  }

  protected compileClasses() {
    let classesText = '';

    for (const name in this.classes) {
      const {entries, extendsName, comment} = this.classes[name];
      const extendsText = extendsName ? ` extends ${extendsName}` : '';
      classesText += `export class ${name}${extendsText} {\n`;
      if (comment) {
        const jsDoc = stringToJsDoc(comment);
        classesText += `${jsDoc ? jsDoc + '\n' : ''}`;
      }
      entries.forEach(fieldEntry => {
        classesText += `  ${fieldEntry}\n`;
      });
      classesText += '}\n';
    }

    return classesText;
  }
}

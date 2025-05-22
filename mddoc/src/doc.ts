import {uniq} from 'lodash-es';

export class Doc {
  protected disclaimer =
    '// This file is auto-generated, do not modify directly. \n' +
    '// Reach out to @abayomi to suggest changes.\n';
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
    {entries: string[]; name: string; extendsName?: string}
  > = {};

  generatedTypeCache: Map<string, boolean> = new Map();

  constructor(protected genTypesFilename: string) {}

  appendType(typeText: string) {
    this.typesText += typeText + '\n';
    return this;
  }

  appendEndpoint(endpoint: string) {
    this.endpointsText += endpoint + '\n';
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
    return this.appendImport(importing, this.genTypesFilename);
  }

  appendToClass(entry: string, name: string, extendsName?: string) {
    let classEntry = this.classes[name];

    if (!classEntry) {
      classEntry = {name, extendsName, entries: [entry]};
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
      const {entries, extendsName} = this.classes[name];
      const extendsText = extendsName ? ` extends ${extendsName}` : '';
      classesText += `export class ${name}${extendsText} {\n`;
      entries.forEach(fieldEntry => {
        classesText += `  ${fieldEntry}\n`;
      });
      classesText += '}\n';
    }

    return classesText;
  }
}

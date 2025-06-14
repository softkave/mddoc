# `mfdoc`

## Installation

```bash
npm install mfdoc
pnpm add mfdoc
yarn add mfdoc
```

## `mfdoc` CLI

A CLI tool to generate JS SDK and HTTP API documentation from your codebase.

### General Usage

```bash
mfdoc <command> [options]
```

### Commands

#### `setup-js-sdk`

Setup JS SDK for a project.

```bash
mfdoc setup-js-sdk <project-path> [options]
```

**Arguments:**

- `<project-path>` - Path to the project directory

**Options:**

- `-n, --name <name>` - Name of the project
- `-p, --provider <provider>` - Package manager to use (`npm`, `yarn`, `pnpm`). Default: `npm`

**Example:**

```bash
mfdoc setup-js-sdk ./my-api -n "My API SDK" -p npm
```

#### `gen-js-sdk`

Generate JavaScript SDK from your HTTP API endpoints.

```bash
mfdoc gen-js-sdk <src-path> [options]
```

**Arguments:**

- `<src-path>` - Path to the source code directory

**Options:**

- `-t, --tags <tags>` - Comma-separated list of tags to filter endpoints
- `-o, --output-path <output-path>` - Path where the generated SDK will be saved
- `-e, --endpoints-path <endpoints-path>` - Endpoints path relative to output path. Defaults to `./src/endpoints`
- `-f, --filename-prefix <filename-prefix>` - Prefix for generated SDK filenames

**Example:**

```bash
mfdoc gen-js-sdk ./src -t "public,api" -o ./sdk -f "my-api"
```

#### `gen-http-api-endpoints-info`

Generate detailed information about HTTP API endpoints.

```bash
mfdoc gen-http-api-endpoints-info <src-path> [options]
```

**Arguments:**

- `<src-path>` - Path to the source code directory

**Options:**

- `-t, --tags <tags>` - Comma-separated list of tags to filter endpoints
- `-o, --output-path <output-path>` - Path where the generated endpoint info will be saved

**Example:**

```bash
mfdoc gen-http-api-endpoints-info ./src -t "v1,public" -o ./docs/endpoints.json
```

### Common Workflow

1. **Setup**: Use `setup-js-sdk` to initialize your project structure
2. **Generate Documentation**: Use `gen-http-api-table-of-content` to create API documentation
3. **Generate SDK**: Use `gen-js-sdk` to create a JavaScript SDK for your API
4. **Extract Endpoint Info**: Use `gen-http-api-endpoints-info` to get detailed endpoint information

### Tags

The `--tags` option allows you to filter which endpoints are processed based on tags in your code. This is useful for:

- Generating separate SDKs for different API versions
- Creating documentation for specific feature sets
- Filtering public vs internal endpoints

### Help

For more information about any command, use the help flag:

```bash
mfdoc --help
mfdoc <command> --help
```

### Documentation

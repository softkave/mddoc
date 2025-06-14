#!/usr/bin/env node
import {Command} from 'commander';
import path from 'path';
import {z} from 'zod';
import {genHttpApiEndpointsInfoCmd} from '../genHttpApiEndpointsInfo.js';
import {genJsSdkCmd} from '../genJsSdk.js';
import {setupJsSdk} from '../setupJsSdk.js';

const program = new Command();

program
  .name('mfdoc')
  .description('CLI to generate JS SDK and HTTP API documentation')
  .version('0.1.0');

const setupJsSdkSchema = z.object({
  outputPath: z.string(),
  name: z.string(),
  provider: z.enum(['npm', 'yarn', 'pnpm']).optional().default('npm'),
});

program
  .command('setup-js-sdk')
  .description('Setup JS SDK and HTTP API documentation')
  .argument('<string>', 'path to the project')
  .option('-n, --name <name>', 'name of the project')
  .option('-p, --provider <provider>', 'package manager', 'npm')
  .action(async (str, options) => {
    const parsed = setupJsSdkSchema.parse({
      outputPath: str,
      name: options.name,
      provider: options.provider,
    });
    const absoluteOutputPath = path.resolve(parsed.outputPath);
    await setupJsSdk({...parsed, outputPath: absoluteOutputPath});
  });

const genJsSdkSchema = z.object({
  srcPath: z.string(),
  tags: z.array(z.string()).optional().default([]),
  outputPath: z.string(),
  endpointsPath: z.string().optional().default('./src/endpoints'),
  filenamePrefix: z.string(),
});

program
  .command('gen-js-sdk')
  .description('Generate JS SDK')
  .argument('<string>', 'path to the project')
  .option('-t, --tags <tags>', 'tags to filter endpoints, comma separated')
  .option('-o, --output-path <output-path>', 'output path')
  .option(
    '-e, --endpoints-path <endpoints-path>',
    'endpoints path relative to output path, defaults to ./src/endpoints'
  )
  .option('-f, --filename-prefix <filename-prefix>', 'filename prefix')
  .action(async (str, options) => {
    const parsed = genJsSdkSchema.parse({
      srcPath: str,
      tags: options.tags?.split(','),
      outputPath: options.outputPath,
      endpointsPath: options.endpointsPath,
      filenamePrefix: options.filenamePrefix,
    });
    const absoluteSrcPath = path.resolve(parsed.srcPath);
    await genJsSdkCmd({...parsed, srcPath: absoluteSrcPath});
  });

const genHttpApiEndpointsInfoSchema = z.object({
  srcPath: z.string(),
  tags: z.array(z.string()).optional().default([]),
  outputPath: z.string(),
});

program
  .command('gen-http-api-endpoints-info')
  .description('Generate HTTP API endpoints info')
  .argument('<string>', 'path to the project')
  .option('-t, --tags <tags>', 'tags to filter endpoints, comma separated')
  .option('-o, --output-path <output-path>', 'output path')
  .action(async (str, options) => {
    const parsed = genHttpApiEndpointsInfoSchema.parse({
      srcPath: str,
      tags: options.tags?.split(','),
      outputPath: options.outputPath,
    });
    const absoluteSrcPath = path.resolve(parsed.srcPath);
    await genHttpApiEndpointsInfoCmd({
      ...parsed,
      srcPath: absoluteSrcPath,
    });
  });

program.parse();

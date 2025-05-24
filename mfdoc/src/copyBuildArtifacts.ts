import {copy} from 'fs-extra';
import path from 'path';

async function copyBuildArtifacts(params: {
  srcPath: string;
  outputPath: string;
}) {
  const {srcPath, outputPath} = params;
  await copy(srcPath, outputPath, {
    filter: (src, dest) => {
      if (src.includes('node_modules')) {
        return false;
      }
      return true;
    },
  });
}

const templateSrcPath = path.join(import.meta.dirname, '..', 'templates');
const templatesOutputPath = path.join(
  import.meta.dirname,
  '..',
  'build',
  'templates'
);

const tsconfigSrcPath = path.join(
  import.meta.dirname,
  '..',
  'tsconfig.tsx.json'
);
const tsconfigOutputPath = path.join(
  import.meta.dirname,
  '..',
  'build',
  'other',
  'tsconfig.tsx.json'
);

copyBuildArtifacts({srcPath: templateSrcPath, outputPath: templatesOutputPath});
copyBuildArtifacts({srcPath: tsconfigSrcPath, outputPath: tsconfigOutputPath});

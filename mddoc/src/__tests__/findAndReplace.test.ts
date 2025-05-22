import * as fs from 'fs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  findAndReplaceMddoc,
  findAndReplaceMddocInFile,
  findAndReplaceMddocInFiles,
  findAndReplaceMddocInFilesInDirectory,
} from '../findAndReplace.js';

// Mock fs module
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn(),
  },
}));

describe('findAndReplaceMddoc', () => {
  it('should replace mddoc prefix with new string while preserving case', () => {
    const input = 'mddocTest mddoc_test mddoc-test MDDOCTEST';
    const replacement = 'new';
    const expected = 'newTest new_test new-test NEWTEST';
    expect(findAndReplaceMddoc(input, replacement)).toBe(expected);
  });

  it('should handle different case patterns', () => {
    const input =
      'mddocPascalCase mddocCamelCase mddoc_snake_case mddoc-kebab-case';
    const replacement = 'prefix';
    const expected =
      'prefixPascalCase prefixCamelCase prefix_snake_case prefix-kebab-case';
    expect(findAndReplaceMddoc(input, replacement)).toBe(expected);
  });

  it('should modify text without mddoc prefix', () => {
    const input = 'test normal text without mddoc';
    const replacement = 'new';
    const expected = 'test normal text without new';
    expect(findAndReplaceMddoc(input, replacement)).toBe(expected);
  });
});

describe('findAndReplaceMddocInFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read and write file with replaced content', async () => {
    const mockContent = 'mddocTest content';
    const mockNewContent = 'newTest content';
    const filePath = 'test.txt';
    const replacement = 'new';

    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMddocInFile(filePath, replacement);

    expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, 'utf8');
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      filePath,
      mockNewContent
    );
  });

  it('should handle file read error', async () => {
    const filePath = 'test.txt';
    const replacement = 'new';
    const error = new Error('File not found');

    vi.mocked(fs.promises.readFile).mockRejectedValue(error);

    await expect(
      findAndReplaceMddocInFile(filePath, replacement)
    ).rejects.toThrow('File not found');
  });
});

describe('findAndReplaceMddocInFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process multiple files', async () => {
    const filePaths = ['file1.txt', 'file2.txt'];
    const replacement = 'new';
    const mockContent = 'mddocTest content';

    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMddocInFiles(filePaths, replacement);

    expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
  });
});

describe('findAndReplaceMddocInFilesInDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process all files in directory', async () => {
    const directoryPath = './test';
    const filePaths = ['file1.txt', 'file2.txt'];
    const replacement = 'new';
    const mockContent = 'mddocTest content';

    vi.mocked(fs.promises.readdir).mockResolvedValue(
      filePaths.map(name => ({name, isFile: () => true}) as fs.Dirent)
    );
    vi.mocked(fs.promises.stat).mockResolvedValue({
      isFile: () => true,
    } as fs.Stats);
    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMddocInFilesInDirectory(directoryPath, replacement);

    expect(fs.promises.readdir).toHaveBeenCalledWith(directoryPath, {
      withFileTypes: true,
    });
    expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
  });

  it('should ignore specified files and directories', async () => {
    const directoryPath = './test';
    const filePaths = ['file1.txt', 'node_modules', 'file2.txt'];
    const replacement = 'new';
    const mockContent = 'mddocTest content';

    vi.mocked(fs.promises.readdir).mockResolvedValue(
      filePaths.map(
        name => ({name, isFile: () => name !== 'node_modules'}) as fs.Dirent
      )
    );
    vi.mocked(fs.promises.stat).mockImplementation(path => {
      const pathStr = path.toString();
      return Promise.resolve({
        isFile: () => !pathStr.includes('node_modules'),
        isDirectory: () => pathStr.includes('node_modules'),
      } as fs.Stats);
    });
    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMddocInFilesInDirectory(directoryPath, replacement, {
      ignore: ['node_modules'],
    });

    expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.readFile).not.toHaveBeenCalledWith(
      expect.stringContaining('node_modules')
    );
  });

  it('should not process subdirectories when recursive is false', async () => {
    const directoryPath = './test';
    const filePaths = ['file1.txt', 'subdir'];
    const replacement = 'new';
    const mockContent = 'mddocTest content';

    vi.mocked(fs.promises.readdir).mockResolvedValue(
      filePaths.map(
        name =>
          ({
            name,
            isFile: () => name === 'file1.txt',
            isDirectory: () => name === 'subdir',
          }) as fs.Dirent
      )
    );

    vi.mocked(fs.promises.stat).mockImplementation(path => {
      const pathStr = path.toString();
      return Promise.resolve({
        isFile: () => pathStr === 'file1.txt',
        isDirectory: () => pathStr === 'subdir',
      } as fs.Stats);
    });
    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMddocInFilesInDirectory(directoryPath, replacement, {
      recursive: false,
    });

    expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.promises.readFile).not.toHaveBeenCalledWith(
      expect.stringContaining('subdir')
    );
  });

  it('should process subdirectories when recursive is true', async () => {
    const directoryPath = './test';
    const filePaths = ['file1.txt', 'subdir'];
    const subdirFiles = ['file2.txt'];
    const replacement = 'new';
    const mockContent = 'mddocTest content';

    // Mock readdir to return different results based on the path
    vi.mocked(fs.promises.readdir).mockImplementation(path => {
      if (path === directoryPath) {
        return Promise.resolve(
          filePaths.map(
            name =>
              ({
                name,
                isFile: () => name === 'file1.txt',
                isDirectory: () => name === 'subdir',
              }) as fs.Dirent
          )
        );
      } else if ((path as string).includes('subdir')) {
        return Promise.resolve(
          subdirFiles.map(
            name =>
              ({
                name,
                isFile: () => true,
                isDirectory: () => false,
              }) as fs.Dirent
          )
        );
      }
      return Promise.resolve([]);
    });

    vi.mocked(fs.promises.stat).mockImplementation(path => {
      const pathStr = path.toString();
      return Promise.resolve({
        isFile: () => pathStr.endsWith('.txt'),
        isDirectory: () => pathStr.includes('subdir'),
      } as fs.Stats);
    });
    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMddocInFilesInDirectory(directoryPath, replacement, {
      recursive: true,
    });

    expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      expect.stringContaining('file1.txt'),
      'utf8'
    );
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      expect.stringContaining('subdir/file2.txt'),
      'utf8'
    );
  });
});

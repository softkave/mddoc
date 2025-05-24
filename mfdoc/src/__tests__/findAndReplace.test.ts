import * as fs from 'fs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  findAndReplaceMfdoc,
  findAndReplaceMfdocInFile,
  findAndReplaceMfdocInFiles,
  findAndReplaceMfdocInFilesInDirectory,
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

describe('findAndReplaceMfdoc', () => {
  it('should replace mfdoc prefix with new string while preserving case', () => {
    const input = 'mfdocTest mfdoc_test mfdoc-test MFDOCTEST';
    const replacement = 'new';
    const expected = 'newTest new_test new-test NEWTEST';
    expect(findAndReplaceMfdoc(input, replacement)).toBe(expected);
  });

  it('should handle different case patterns', () => {
    const input =
      'mfdocPascalCase mfdocCamelCase mfdoc_snake_case mfdoc-kebab-case';
    const replacement = 'prefix';
    const expected =
      'prefixPascalCase prefixCamelCase prefix_snake_case prefix-kebab-case';
    expect(findAndReplaceMfdoc(input, replacement)).toBe(expected);
  });

  it('should modify text without mfdoc prefix', () => {
    const input = 'test normal text without mfdoc';
    const replacement = 'new';
    const expected = 'test normal text without new';
    expect(findAndReplaceMfdoc(input, replacement)).toBe(expected);
  });
});

describe('findAndReplaceMfdocInFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read and write file with replaced content', async () => {
    const mockContent = 'mfdocTest content';
    const mockNewContent = 'newTest content';
    const filePath = 'test.txt';
    const replacement = 'new';

    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMfdocInFile(filePath, replacement);

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
      findAndReplaceMfdocInFile(filePath, replacement)
    ).rejects.toThrow('File not found');
  });
});

describe('findAndReplaceMfdocInFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process multiple files', async () => {
    const filePaths = ['file1.txt', 'file2.txt'];
    const replacement = 'new';
    const mockContent = 'mfdocTest content';

    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMfdocInFiles(filePaths, replacement);

    expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
    expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
  });
});

describe('findAndReplaceMfdocInFilesInDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process all files in directory', async () => {
    const directoryPath = './test';
    const filePaths = ['file1.txt', 'file2.txt'];
    const replacement = 'new';
    const mockContent = 'mfdocTest content';

    vi.mocked(fs.promises.readdir).mockResolvedValue(
      filePaths.map(name => ({name, isFile: () => true} as fs.Dirent<any>))
    );
    vi.mocked(fs.promises.stat).mockResolvedValue({
      isFile: () => true,
    } as fs.Stats);
    vi.mocked(fs.promises.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await findAndReplaceMfdocInFilesInDirectory(directoryPath, replacement);

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
    const mockContent = 'mfdocTest content';

    vi.mocked(fs.promises.readdir).mockResolvedValue(
      filePaths.map(
        name =>
          ({name, isFile: () => name !== 'node_modules'} as fs.Dirent<any>)
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

    await findAndReplaceMfdocInFilesInDirectory(directoryPath, replacement, {
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
    const mockContent = 'mfdocTest content';

    vi.mocked(fs.promises.readdir).mockResolvedValue(
      filePaths.map(
        name =>
          ({
            name,
            isFile: () => name === 'file1.txt',
            isDirectory: () => name === 'subdir',
          } as fs.Dirent<any>)
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

    await findAndReplaceMfdocInFilesInDirectory(directoryPath, replacement, {
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
    const mockContent = 'mfdocTest content';

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
              } as fs.Dirent<any>)
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
              } as fs.Dirent)
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

    await findAndReplaceMfdocInFilesInDirectory(directoryPath, replacement, {
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

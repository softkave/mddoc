import {describe, expect, test} from 'vitest';
import {MddocEndpoints} from '../index.js';

describe('config', () => {
  test('config changes cascades', async () => {
    const oldAuthToken = Math.random().toString();
    const newAuthToken = Math.random().toString();
    const mddoc = new MddocEndpoints({authToken: oldAuthToken});
    expect(mddoc.files.getSdkConfig().authToken).toBe(oldAuthToken);
    mddoc.setSdkConfig({authToken: newAuthToken});
    expect(mddoc.files.getSdkConfig().authToken).toBe(newAuthToken);
  });
});

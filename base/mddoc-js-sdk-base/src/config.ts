import type {IRefreshAuthToken} from './types.js';

export type MddocJsConfigAuthToken = string | IRefreshAuthToken;

export interface MddocJsConfigBase {
  authToken?: MddocJsConfigAuthToken;
  serverURL?: string;
}

export class MddocJsConfig<
  TConfig extends MddocJsConfigBase = MddocJsConfigBase
> {
  protected inheritors: MddocJsConfig<TConfig>[] = [];

  constructor(
    protected config: TConfig = {} as TConfig,
    protected inheritConfigFrom?: MddocJsConfig<TConfig>
  ) {
    inheritConfigFrom?.registerSdkConfigInheritor(this);
  }

  setSdkAuthToken(token: MddocJsConfigAuthToken) {
    this.setSdkConfig({authToken: token});
  }

  setSdkConfig(update: Partial<MddocJsConfigBase>) {
    this.config = {...this.config, ...update};
    this.fanoutSdkConfigUpdate(update);
  }

  getSdkConfig() {
    return this.config;
  }

  protected registerSdkConfigInheritor(inheritor: MddocJsConfig<TConfig>) {
    this.inheritors.push(inheritor);
  }

  protected fanoutSdkConfigUpdate(update: Partial<MddocJsConfigBase>) {
    this.inheritors.forEach(inheritor => inheritor.setSdkConfig(update));
  }
}

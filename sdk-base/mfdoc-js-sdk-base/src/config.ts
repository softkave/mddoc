import type {IRefreshAuthToken} from './types.js';

export type MfdocJsConfigAuthToken = string | IRefreshAuthToken;

export interface MfdocJsConfigBase {
  authToken?: MfdocJsConfigAuthToken;
  serverURL?: string;
}

export class MfdocJsConfig<
  TConfig extends MfdocJsConfigBase = MfdocJsConfigBase
> {
  protected inheritors: MfdocJsConfig<TConfig>[] = [];

  constructor(
    protected config: TConfig = {} as TConfig,
    protected inheritConfigFrom?: MfdocJsConfig<TConfig>
  ) {
    inheritConfigFrom?.registerSdkConfigInheritor(this);
  }

  setSdkAuthToken(token: MfdocJsConfigAuthToken) {
    this.setSdkConfig({authToken: token});
  }

  setSdkConfig(update: Partial<MfdocJsConfigBase>) {
    this.config = {...this.config, ...update};
    this.fanoutSdkConfigUpdate(update);
  }

  getSdkConfig() {
    return this.config;
  }

  protected registerSdkConfigInheritor(inheritor: MfdocJsConfig<TConfig>) {
    this.inheritors.push(inheritor);
  }

  protected fanoutSdkConfigUpdate(update: Partial<MfdocJsConfigBase>) {
    this.inheritors.forEach(inheritor => inheritor.setSdkConfig(update));
  }
}

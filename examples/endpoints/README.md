# mfdoc gen-js-sdk example

## cmds

```bash
npm exec -- mfdoc setup-js-sdk generated-js-sdk --name="generated-js-sdk" --provider pnpm
npm exec -- mfdoc gen-http-api-endpoints-info src/index.ts --output-path="./generated-endpoints-info"
npm exec -- mfdoc gen-js-sdk src/index.ts --output-path="./generated-js-sdk" --filename-prefix="public"
```

# mfdoc gen-js-sdk example

## cmds

```bash
npm exec -- mfdoc setup-js-sdk example-js-sdk --name="example-js-sdk"
npm exec -- mfdoc gen-http-api-table-of-content src/index.ts --output-path="./example-toc/api-toc"
npm exec -- mfdoc gen-http-api-endpoints-info src/index.ts --output-path="./example-endpoints-info"
npm exec -- mfdoc gen-js-sdk src/index.ts --output-path="./example-js-sdk" --filename-prefix="public"
```

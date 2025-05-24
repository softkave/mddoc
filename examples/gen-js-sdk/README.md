# mddoc gen-js-sdk example

## cmds

```bash
npm exec -- mddoc setup-js-sdk example-js-sdk --name="example-js-sdk"
npm exec -- mddoc gen-http-api-table-of-content src/index.ts --output-path="./example-toc/api-toc"
npm exec -- mddoc gen-http-api-endpoints-info src/index.ts --output-path="./example-endpoints-info"
npm exec -- mddoc gen-js-sdk src/index.ts --output-path="./example-js-sdk" --filename-prefix="public"
```

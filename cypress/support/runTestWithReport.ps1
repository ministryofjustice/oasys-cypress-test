$filePath = $args[0]


./node_modules/.bin/cypress run --e2e --browser electron --spec "'$filePath'" | Out-Default
# Out-Default hopefully ensures that the tests complete before trying to complile the report.

npx mochawesome-merge ./report/*.json -o ./report/merged.json
marge -o ./report -f index.html ./report/merged.json
Add-Content -Path ./report/assets/app.css  -Value 'pre.test--code-snippet---3H5Xj.javascript.hljs,h4.test--context-title---HHH10{display:none;}a.test--image-link---PUFPJ{width:480px}'
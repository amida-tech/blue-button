ccda-explorer
=============

Cycling through CCDA-samples with blue-button.js

## Running stuff

```
npm install
git clone https://github.com/chb/sample_ccdas.git
mkdir dump
node explorer.js
cp ./dump/stats.json ./explorer/stats.js
cd explorer
python index.py
```

- It will download sample_ccda repo
- Create dump folder
- Run bb test against all CCDAs and generate stuff in dump
- Copy dump results to explorer
- Run python script to generate explorer webpage with success/fail stats (index_py.html)
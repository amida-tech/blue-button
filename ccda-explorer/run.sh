node explorer.js
cp ./dump/stats.json ./explorer/stats.js
cd explorer
python index.py
cd ..
open ./explorer/index_py.html
import os
import hashlib
import json
import shutil
from pathlib import Path

# In/out folders
source_dir = Path("assets")
output_dir = Path("../docs/assets")
output_dir.mkdir(parents=True, exist_ok=True)

# Output file
mapping_js_path = Path("../docs/image_mapping.js")

def sha256sum(filepath):
    with open(filepath, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

files = sorted([f for f in source_dir.glob("*.png") if f.name.count("_") == 1])
pairs = {}

for f in files:
    base, label = f.stem.split("_")
    if base not in pairs:
        pairs[base] = {}
    pairs[base][label] = f

print("Pairs found :" + str(len(pairs)))

image_mapping = {}
for base, pair in pairs.items():
    if "a" in pair and "b" in pair:
        a_hash = sha256sum(pair["a"]) + ".png"
        b_hash = sha256sum(pair["b"]) + ".png"
        image_mapping[base] = {"a": a_hash, "b": b_hash}
        shutil.copy(pair["a"], output_dir / a_hash)
        shutil.copy(pair["b"], output_dir / b_hash)

with open(mapping_js_path, "w", encoding="utf-8") as f:
    f.write("// Image filename mapping (SHA256 hashes)\n")
    f.write("const imageMapping = ")
    json.dump(image_mapping, f, indent=2)
    f.write(";\n")

print("Done!")

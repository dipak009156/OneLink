import os
import glob
import re

files = (
    glob.glob('d:/OneLink/frontend/src/components/**/*.jsx', recursive=True) + 
    glob.glob('d:/OneLink/frontend/src/pages/*.jsx')
)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    content = content.replace('dark:bg-violet-500/100/30', '')
    content = content.replace('dark:selection:bg-violet-50 dark:selection:bg-violet-500/30', 'dark:selection:bg-violet-500/30')
    content = content.replace('dark:bg-violet-500/100', 'dark:bg-violet-50')
    # any other double applications:
    content = content.replace('dark:bg-slate-800/50/50', 'dark:bg-slate-800/50')
    content = content.replace('dark:bg-white/5/5', 'dark:bg-white/5')
    
    if original != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed anomalies in {file}')

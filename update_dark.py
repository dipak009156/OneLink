import os
import glob

replacements = {
    'bg-white': 'bg-white dark:bg-[#0a0f1c]/60 dark:backdrop-blur-xl',
    'bg-gray-50/30': 'bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-500/30',
    'bg-gray-50 ': 'bg-gray-50 dark:bg-slate-800/50 ',
    'bg-gray-50"': 'bg-gray-50 dark:bg-slate-800/50"',
    'bg-gray-100': 'bg-gray-100 dark:bg-slate-800',
    'border-black/[0.05]': 'border-black/[0.05] dark:border-white/5',
    'border-gray-100': 'border-gray-100 dark:border-white/5',
    'border-gray-200': 'border-gray-200 dark:border-white/10',
    'text-gray-900': 'text-gray-900 dark:text-slate-50',
    'text-gray-800': 'text-gray-800 dark:text-slate-100',
    'text-gray-700': 'text-gray-700 dark:text-slate-200',
    'text-gray-600': 'text-gray-600 dark:text-slate-300',
    'text-gray-500': 'text-gray-500 dark:text-slate-400',
    'hover:bg-gray-50': 'hover:bg-gray-50 dark:hover:bg-white/5',
    'hover:text-gray-900': 'hover:text-gray-900 dark:hover:text-white',
    'bg-emerald-50': 'bg-emerald-50 dark:bg-emerald-500/10',
    'text-emerald-600': 'text-emerald-600 dark:text-emerald-400',
    'border-emerald-200': 'border-emerald-200 dark:border-emerald-500/20',
    'bg-violet-50': 'bg-violet-50 dark:bg-violet-500/10',
    'text-violet-600': 'text-violet-600 dark:text-violet-400',
    'border-violet-100': 'border-violet-100 dark:border-violet-500/20',
    'shadow-sm': 'shadow-sm dark:shadow-2xl dark:shadow-black/40',
    'text-[#0077b5]': 'text-[#0077b5] dark:text-[#33a8e5]',
    'text-[#1da1f2]': 'text-[#1da1f2] dark:text-[#4dbdff]'
}

files = glob.glob('d:/OneLink/frontend/src/components/profile/*.jsx') + ['d:/OneLink/frontend/src/pages/PublicProfile.jsx']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements.items():
        # simple text replacement. this might replace inside already replaced strings if not careful, 
        # so avoid re-replacing but these patterns are mostly straightforward.
        # Ensure we only replace if not already replaced
        if new not in content:
            content = content.replace(old, new)
            
    if original != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')

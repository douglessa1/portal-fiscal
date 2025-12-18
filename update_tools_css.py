# Script de Atualização em Massa - Ferramentas
# Este script aplica correções de CSS em todas as páginas de ferramentas

import os
import re

# Diretório de ferramentas
TOOLS_DIR = "pages/ferramentas"

# Padrões de substituição
REPLACEMENTS = [
    # Containers principais
    (r'className="bg-white rounded-lg shadow-md p-6(.*?)"', r'className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-6\1"'),
    (r'className="bg-white rounded-lg shadow-md(.*?)"', r'className="bg-card text-card-foreground rounded-lg shadow-md border border-border\1"'),
    (r'className="bg-white rounded-lg(.*?)"', r'className="bg-card text-card-foreground rounded-lg border border-border\1"'),
    (r'className="bg-white(.*?)"', r'className="bg-card text-card-foreground\1"'),
    
    # Backgrounds
    (r'bg-gray-50', 'bg-background'),
    (r'bg-gray-100', 'bg-muted'),
    (r'bg-gray-200', 'bg-muted'),
    
    # Texto
    (r'text-gray-900', 'text-foreground'),
    (r'text-gray-800', 'text-foreground'),
    (r'text-gray-700', 'text-foreground'),
    (r'text-gray-600', 'text-muted-foreground'),
    (r'text-gray-500', 'text-muted-foreground'),
    (r'text-gray-400', 'text-muted-foreground'),
    
    # Borders
    (r'border-gray-200', 'border-border'),
    (r'border-gray-300', 'border-border'),
    (r'border-gray-400', 'border-border'),
    
    # Hover states
    (r'hover:bg-gray-50', 'hover:bg-muted/50'),
    (r'hover:bg-gray-100', 'hover:bg-muted'),
    
    # Inputs
    (r'className="(.*?)input-field', r'className="\1border border-input bg-background text-foreground rounded focus:ring-2 focus:ring-ring'),
]

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in REPLACEMENTS:
        content = re.sub(pattern, replacement, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Processar todos os arquivos
updated = 0
for filename in os.listdir(TOOLS_DIR):
    if filename.endswith('.js'):
        filepath = os.path.join(TOOLS_DIR, filename)
        if update_file(filepath):
            print(f"✓ Updated: {filename}")
            updated += 1

print(f"\nTotal files updated: {updated}/21")

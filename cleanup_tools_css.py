# Script de Limpeza Final e Compatibilidade Dark Mode
import os
import re

TOOLS_DIR = "pages/ferramentas"

# Mapeamento de cores hardcoded para compatíveis com dark mode
COLOR_MAP = {
    # Cores de Fundo (Alertas/Infos) - Adicionando variante dark
    r'bg-blue-50': 'bg-blue-50 dark:bg-blue-950/30',
    r'bg-green-50': 'bg-green-50 dark:bg-green-950/30',
    r'bg-yellow-50': 'bg-yellow-50 dark:bg-yellow-950/30',
    r'bg-red-50': 'bg-red-50 dark:bg-red-950/30',
    r'bg-purple-50': 'bg-purple-50 dark:bg-purple-950/30',
    
    # Bordas correspondentes
    r'border-blue-200': 'border-blue-200 dark:border-blue-900',
    r'border-green-200': 'border-green-200 dark:border-green-900',
    r'border-yellow-200': 'border-yellow-200 dark:border-yellow-900',
    r'border-red-200': 'border-red-200 dark:border-red-900',
    r'border-purple-200': 'border-purple-200 dark:border-purple-900',
    
    # Textos correspondentes (ajustando para legibilidade no dark)
    r'text-blue-900': 'text-blue-900 dark:text-blue-100',
    r'text-blue-800': 'text-blue-800 dark:text-blue-200',
    r'text-green-900': 'text-green-900 dark:text-green-100',
    r'text-green-800': 'text-green-800 dark:text-green-200',
    r'text-yellow-900': 'text-yellow-900 dark:text-yellow-100',
    r'text-yellow-800': 'text-yellow-800 dark:text-yellow-200',
    r'text-red-900': 'text-red-900 dark:text-red-100',
    r'text-red-800': 'text-red-800 dark:text-red-200',
    r'text-purple-900': 'text-purple-900 dark:text-purple-100',
    
    # Classes genéricas restantes
    r'className="card': 'className="bg-card text-card-foreground rounded-lg shadow-md border border-border',
    r'text-secondary': 'text-muted-foreground',
    r'bg-white': 'bg-card text-card-foreground',
    
    # Inline styles comuns (tentativa de remoção segura)
    r"style=\{\{ background: 'var\(--bg-tertiary\)' \}\}" : 'className="bg-muted"',
    r"style=\{\{ borderColor: 'var\(--border-primary\)' \}\}" : 'className="border-border"',
}

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Aplicar substituições
    for pattern, replacement in COLOR_MAP.items():
        # Evitar duplicar dark: classes se já existirem
        if "dark:" in replacement and replacement in content:
            continue
            
        content = re.sub(pattern, replacement, content)
    
    # Correção específica para borders duplicados pelo script anterior
    content = content.replace('border border-border border-border', 'border border-border')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Processar arquivos
count = 0
for filename in os.listdir(TOOLS_DIR):
    if filename.endswith('.js'):
        # Pular arquivos já refatorados manualmente para evitar conflitos
        if filename in ['difal.js', 'calculadora-margem.js', 'nfe-validator.js', 'mva-ajustada.js', 'xml-viewer.js']:
            continue
            
        if clean_file(os.path.join(TOOLS_DIR, filename)):
            print(f"Fixed: {filename}")
            count += 1

print(f"Total files cleaned: {count}")

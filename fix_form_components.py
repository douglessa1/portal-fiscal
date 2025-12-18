"""
Script to fix all remaining FormComponents imports in Portal Fiscal
Replaces old FormComponents with new Design System components
"""

import os
import re

# Files that need fixing
files_to_fix = [
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\perfil\[id].js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\notificacoes.js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\noticias\[slug].js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\ferramentas\partilha.js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\ferramentas\index.js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\ferramentas\comparador.js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\ferramentas\calculadora-margem.js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\comunidade\[id].js",
    r"c:\Users\Pichau\Desktop\Portal Fiscal\pages\admin\noticias\criar.js",
]

def fix_imports(filepath):
    """Fix FormComponents imports in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match FormComponents import
        pattern = r"import\s+{[^}]+}\s+from\s+['\"]\.\.\/\.\.\/components\/ui\/FormComponents['\"];"
        
        # Check if file has FormComponents import
        if not re.search(pattern, content):
            pattern2 = r"import\s+{[^}]+}\s+from\s+['\"]\.\.\/components\/ui\/FormComponents['\"];"
            pattern3 = r"import\s+{[^}]+}\s+from\s+['\"]\.\.\/\.\.\/\.\.\/components\/ui\/FormComponents['\"];"
            
            if re.search(pattern2, content):
                pattern = pattern2
            elif re.search(pattern3, content):
                pattern = pattern3
            else:
                print(f"✓ {filepath} - No FormComponents import found")
                return False
        
        # Determine correct path depth
        if '\\admin\\' in filepath:
            new_imports = """import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../../components/ui/Form';
import Alert, { AlertDescription } from '../../../components/ui/Alert';"""
        elif '\\ferramentas\\' in filepath or '\\comunidade\\' in filepath or '\\noticias\\' in filepath or '\\perfil\\' in filepath:
            new_imports = """import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../../components/ui/Form';
import Alert, { AlertDescription } from '../../components/ui/Alert';"""
        else:
            new_imports = """import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormGroup, Label, Input, Textarea } from '../components/ui/Form';
import Alert, { AlertDescription } from '../components/ui/Alert';"""
        
        # Replace the import
        content = re.sub(pattern, new_imports, content)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Fixed: {filepath}")
        return True
        
    except Exception as e:
        print(f"✗ Error fixing {filepath}: {e}")
        return False

# Fix all files
fixed_count = 0
for filepath in files_to_fix:
    if os.path.exists(filepath):
        if fix_imports(filepath):
            fixed_count += 1
    else:
        print(f"✗ File not found: {filepath}")

print(f"\n✅ Fixed {fixed_count}/{len(files_to_fix)} files")
print("\n⚠️  Note: Files may still need manual updates for component usage (FormInput → Input, FormButton → Button, etc.)")

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, Heading1, Heading2 } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
    const editorRef = useRef(null);
    const [html, setHtml] = useState(value || '');

    // Sync initial value if changed externally (e.g. loading edit)
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            editorRef.current.focus();
        }
    };

    const handleImageUpload = () => {
        const url = prompt('Digite a URL da imagem:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    const handleLink = () => {
        const url = prompt('Digite a URL do link:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const ToolbarButton = ({ icon: Icon, command, arg = null, title }) => (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                execCommand(command, arg);
            }}
            className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="border border-input rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-muted/40 border-b border-input">
                <ToolbarButton icon={Bold} command="bold" title="Negrito" />
                <ToolbarButton icon={Italic} command="italic" title="Itálico" />
                <ToolbarButton icon={Underline} command="underline" title="Sublinhado" />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <ToolbarButton icon={Heading1} command="formatBlock" arg="H2" title="Título 1" />
                <ToolbarButton icon={Heading2} command="formatBlock" arg="H3" title="Título 2" />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Esquerda" />
                <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centro" />
                <ToolbarButton icon={AlignRight} command="justifyRight" title="Direita" />
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <ToolbarButton icon={List} command="insertUnorderedList" title="Lista" />
                <ToolbarButton icon={LinkIcon} title="Link" onClick={handleLink} command={null} /> {/* Handled specially but passing dummy command */}
                <button type="button" onClick={handleLink} className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" onClick={handleImageUpload} className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground"><ImageIcon className="w-4 h-4" /></button>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                className="p-4 min-h-[300px] outline-none prose dark:prose-invert max-w-none"
                placeholder={placeholder}
                style={{
                    backgroundColor: 'transparent',
                    color: 'inherit'
                }}
            />
        </div>
    );
}

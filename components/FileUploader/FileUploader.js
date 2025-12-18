import { useState } from 'react';

/**
 * Componente Reutilizável de Upload de Arquivos
 * Suporta múltiplos formatos e preview
 */
export default function FileUploader({
    accept = '.xlsx,.xls,.csv,.xml,.pdf',
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB
    onFileSelect,
    onError,
    label = 'Selecionar Arquivo'
}) {
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);

    const validateFile = (file) => {
        // Validar tamanho
        if (file.size > maxSize) {
            return {
                valid: false,
                error: `Arquivo muito grande. Máximo ${(maxSize / 1024 / 1024).toFixed(0)}MB`
            };
        }

        // Validar extensão
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const acceptedExtensions = accept.split(',').map(ext => ext.trim());

        if (!acceptedExtensions.includes(extension)) {
            return {
                valid: false,
                error: `Formato não suportado. Use: ${accept}`
            };
        }

        return { valid: true };
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
    };

    const processFiles = (selectedFiles) => {
        const validFiles = [];
        const errors = [];

        selectedFiles.forEach(file => {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });

        if (validFiles.length > 0) {
            setFiles(multiple ? [...files, ...validFiles] : validFiles);
            if (onFileSelect) {
                onFileSelect(multiple ? validFiles : validFiles[0]);
            }
        }

        if (errors.length > 0 && onError) {
            onError(errors.join('\n'));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-4">
            {/* Área de Upload */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragging
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <div className="text-6xl">📁</div>
                    <div>
                        <label className="cursor-pointer">
                            <span className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition inline-block">
                                {label}
                            </span>
                            <input
                                type="file"
                                accept={accept}
                                multiple={multiple}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="text-sm text-gray-600">
                        ou arraste e solte {multiple ? 'arquivos' : 'um arquivo'} aqui
                    </div>
                    <div className="text-xs text-gray-500">
                        Formatos aceitos: {accept}
                    </div>
                </div>
            </div>

            {/* Lista de Arquivos */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                        Arquivos Selecionados ({files.length})
                    </h4>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"
                        >
                            <div className="flex items-center space-x-3 flex-1">
                                <div className="text-2xl">
                                    {file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? '📊' :
                                        file.name.endsWith('.xml') ? '📝' :
                                            file.name.endsWith('.pdf') ? '📄' :
                                                file.name.endsWith('.csv') ? '📋' : '📁'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                        {file.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="ml-4 text-red-600 hover:text-red-800 font-semibold"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

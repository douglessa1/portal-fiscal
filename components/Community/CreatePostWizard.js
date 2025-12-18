import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Send, Lock, AlertCircle, Check, HelpCircle } from 'lucide-react';
import { POST_TYPES, UF_LIST, canAccessPostType, validatePostData } from '../../lib/community/postTypes';
import { REFORMA_TAGS } from '../../lib/community/reformaTags';
import { usePlan } from '../Permissions/PlanProvider';

const STEPS = [
    { id: 'type', label: 'Tipo' },
    { id: 'fields', label: 'Dados' },
    { id: 'reforma', label: 'Reforma' },
    { id: 'preview', label: 'Revisar' }
];

export default function CreatePostWizard({ onClose, onSubmit }) {
    const { plan } = usePlan();
    const [step, setStep] = useState(0);
    const [selectedType, setSelectedType] = useState(null);
    const [formData, setFormData] = useState({});
    const [reformaTag, setReformaTag] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const currentType = selectedType ? POST_TYPES[selectedType] : null;

    const updateField = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        setError('');
    };

    const nextStep = () => {
        if (step === 0 && !selectedType) {
            setError('Selecione um tipo de publicação');
            return;
        }
        if (step === 1) {
            const validationError = validatePostData(selectedType, formData);
            if (validationError) {
                setError(validationError);
                return;
            }
            if (!title.trim() || title.length < 20) {
                setError('Título deve ter no mínimo 20 caracteres');
                return;
            }
        }
        if (step === 2 && !reformaTag) {
            setError('Selecione uma classificação de Reforma Tributária');
            return;
        }
        setError('');
        setStep(s => Math.min(s + 1, STEPS.length - 1));
    };

    const prevStep = () => {
        setError('');
        setStep(s => Math.max(s - 1, 0));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onSubmit({
                title,
                post_type: selectedType,
                reforma_tag: reformaTag,
                structured_data: formData,
                content: formData.content,
                ...formData
            });
            onClose();
        } catch (err) {
            setError('Erro ao publicar. Tente novamente.');
        }
        setSubmitting(false);
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'select':
                return (
                    <select
                        value={formData[field.id] || ''}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                    >
                        <option value="">Selecione...</option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );

            case 'multiselect':
                const selected = formData[field.id] || [];
                return (
                    <div className="flex flex-wrap gap-2">
                        {field.options.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    const current = formData[field.id] || [];
                                    const newVal = current.includes(opt.value)
                                        ? current.filter(v => v !== opt.value)
                                        : [...current, opt.value];
                                    updateField(field.id, newVal);
                                }}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${selected.includes(opt.value)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'border-input hover:border-primary/50'
                                    }`}
                            >
                                {selected.includes(opt.value) && <Check className="w-3 h-3 inline mr-1" />}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                );

            case 'uf':
                return (
                    <select
                        value={formData[field.id] || ''}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                    >
                        <option value="">Selecione UF...</option>
                        {UF_LIST.map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData[field.id] || false}
                            onChange={(e) => updateField(field.id, e.target.checked)}
                            className="w-4 h-4 rounded border-input"
                        />
                        <span className="text-sm text-foreground">{field.label}</span>
                    </label>
                );

            case 'textarea':
                return (
                    <div>
                        <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => updateField(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={5}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background resize-none"
                        />
                        {field.minLength && (
                            <div className={`text-xs mt-1 ${(formData[field.id]?.length || 0) < field.minLength
                                    ? 'text-amber-600'
                                    : 'text-green-600'
                                }`}>
                                {formData[field.id]?.length || 0} / {field.minLength} caracteres mínimos
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Nova Publicação</h2>
                        <p className="text-xs text-muted-foreground">
                            {currentType ? currentType.label : 'Selecione o tipo de publicação'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress */}
                <div className="px-6 py-3 border-b border-border bg-background">
                    <div className="flex items-center justify-between">
                        {STEPS.map((s, idx) => (
                            <div key={s.id} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${idx < step ? 'bg-green-500 text-white' :
                                        idx === step ? 'bg-primary text-primary-foreground' :
                                            'bg-muted text-muted-foreground'
                                    }`}>
                                    {idx < step ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`ml-2 text-xs font-medium ${idx === step ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {s.label}
                                </span>
                                {idx < STEPS.length - 1 && (
                                    <div className={`w-12 h-0.5 mx-3 ${idx < step ? 'bg-green-500' : 'bg-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 0: Type Selection */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                Escolha o tipo que melhor descreve sua publicação:
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(POST_TYPES).map(type => {
                                    const hasAccess = canAccessPostType(type.id, plan);
                                    const isSelected = selectedType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => hasAccess && setSelectedType(type.id)}
                                            disabled={!hasAccess}
                                            className={`relative p-4 rounded-xl border text-left transition-all ${isSelected
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                    : hasAccess
                                                        ? 'border-border hover:border-primary/50'
                                                        : 'border-border opacity-60 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{type.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-foreground">{type.label}</span>
                                                        {!hasAccess && (
                                                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                                                <Lock className="w-3 h-3" /> PRO
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-primary-foreground" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedType && currentType && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                    <div className="flex items-start gap-2">
                                        <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                        <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">
                                            {currentType.guide}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 1: Dynamic Fields */}
                    {step === 1 && currentType && (
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Título da Publicação *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Título claro e objetivo (mín. 20 caracteres)"
                                    className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background"
                                />
                                <div className="text-xs text-muted-foreground mt-1">{title.length}/20 caracteres</div>
                            </div>

                            {/* Dynamic Fields */}
                            {currentType.fields.filter(f => f.type !== 'checkbox').map(field => (
                                <div key={field.id}>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {field.label} {field.required && '*'}
                                    </label>
                                    {renderField(field)}
                                </div>
                            ))}

                            {/* Checkboxes */}
                            <div className="space-y-2 pt-2">
                                {currentType.fields.filter(f => f.type === 'checkbox').map(field => (
                                    <div key={field.id}>{renderField(field)}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Reforma Tag */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                Classifique sua publicação em relação à Reforma Tributária (EC 132/2023):
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {REFORMA_TAGS.map(tag => {
                                    const isSelected = reformaTag === tag.id;
                                    return (
                                        <button
                                            key={tag.id}
                                            onClick={() => setReformaTag(tag.id)}
                                            className={`p-4 rounded-xl border text-left transition-all ${isSelected
                                                    ? 'ring-2 ring-offset-2'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                            style={isSelected ? {
                                                borderColor: tag.color,
                                                ringColor: tag.color,
                                                backgroundColor: `${tag.color}10`
                                            } : {}}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">{tag.icon}</span>
                                                <span
                                                    className="text-xs font-bold px-2 py-1 rounded text-white"
                                                    style={{ backgroundColor: tag.color }}
                                                >
                                                    {tag.shortLabel}
                                                </span>
                                            </div>
                                            <div className="font-medium text-foreground">{tag.label}</div>
                                            <p className="text-xs text-muted-foreground mt-1">{tag.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {step === 3 && currentType && (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                {/* Type & Tag */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded text-white"
                                        style={{ backgroundColor: currentType.color }}
                                    >
                                        {currentType.icon} {currentType.label}
                                    </span>
                                    {reformaTag && (
                                        <span
                                            className="text-xs font-bold px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: REFORMA_TAGS.find(t => t.id === reformaTag)?.color,
                                                color: reformaTag === 'transicao' ? '#000' : '#fff'
                                            }}
                                        >
                                            {REFORMA_TAGS.find(t => t.id === reformaTag)?.icon}{' '}
                                            {REFORMA_TAGS.find(t => t.id === reformaTag)?.shortLabel}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-foreground mb-3">{title}</h3>

                                {/* Structured Data Grid */}
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {currentType.fields
                                        .filter(f => f.type !== 'textarea' && f.type !== 'checkbox' && formData[f.id])
                                        .map(f => (
                                            <div key={f.id} className="p-2 bg-background rounded-lg">
                                                <div className="text-xs text-muted-foreground">{f.label}</div>
                                                <div className="text-sm font-medium text-foreground">
                                                    {Array.isArray(formData[f.id])
                                                        ? formData[f.id].join(', ')
                                                        : f.options?.find(o => o.value === formData[f.id])?.label || formData[f.id]}
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Content */}
                                <div className="text-sm text-foreground whitespace-pre-wrap border-t border-border pt-3">
                                    {formData.content}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
                    <button
                        onClick={step > 0 ? prevStep : onClose}
                        className="h-10 px-4 text-sm font-medium rounded-lg border border-input hover:bg-muted flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {step > 0 ? 'Voltar' : 'Cancelar'}
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button
                            onClick={nextStep}
                            className="h-10 px-6 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                        >
                            Continuar
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="h-10 px-6 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? 'Publicando...' : 'Publicar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';

export function Tooltip({ children, content, position = 'top' }) {
    const [show, setShow] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-card border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-card border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-card border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-card border-y-transparent border-l-transparent',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}

            {show && content && (
                <div className={`absolute z-50 ${positionClasses[position]} animate-in fade-in zoom-in-95 duration-200`}>
                    <div className="bg-card text-card-foreground px-3 py-2 rounded-lg shadow-lg border border-border text-sm whitespace-nowrap">
                        {content}
                    </div>
                    <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    );
}

export default Tooltip;

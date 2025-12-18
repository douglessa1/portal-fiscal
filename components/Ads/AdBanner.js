import { useState, useEffect } from 'react';

export default function AdBanner({ slotId, format = 'auto', className = '' }) {
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        // Simple check to avoid running AdSense in dev mode (localhost)
        // unless you want to test test-ads.
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setIsDev(true);
        } else {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense Error", e);
            }
        }
    }, []);

    if (isDev) {
        return (
            <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 text-gray-500 font-mono text-xs uppercase tracking-widest p-4 ${className} min-h-[100px] w-full`}>
                Espaço Publicitário (AdSense)
                <br />
                Slot: {slotId || '1234567890'}
            </div>
        );
    }

    return (
        <div className={`ad-container ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with user's ID
                data-ad-slot={slotId || "1234567890"}
                data-ad-format={format}
                data-full-width-responsive="true"></ins>
        </div>
    );
}

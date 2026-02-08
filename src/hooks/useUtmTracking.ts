import { useEffect } from 'react';

const UTM_KEYS = [
    'src',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
];

export const useUtmTracking = () => {
    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const newUtmData: Record<string, string> = {};
            let hasNewData = false;

            // Extract UTMs from URL
            UTM_KEYS.forEach(key => {
                const value = urlParams.get(key);
                if (value) {
                    newUtmData[key] = value;
                    hasNewData = true;
                }
            });

            if (hasNewData) {
                // Merge with existing data, new data takes precedence
                const existing = JSON.parse(localStorage.getItem('utm_data') || '{}');
                const merged = { ...existing, ...newUtmData };
                localStorage.setItem('utm_data', JSON.stringify(merged));
                console.log('📊 UTM Data Updated:', merged);
            }
        } catch (error) {
            console.error('Error tracking UTMs:', error);
        }
    }, []);
};

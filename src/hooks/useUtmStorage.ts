import { useEffect, useState } from 'react';

export const useUtmStorage = () => {
    const [utms, setUtms] = useState<Record<string, string>>({});

    useEffect(() => {
        const currentParams = new URLSearchParams(window.location.search);
        const storedUtms = sessionStorage.getItem('utm_parameters');
        const parsedStoredUtms = storedUtms ? JSON.parse(storedUtms) : {};

        let newUtms: Record<string, string> = { ...parsedStoredUtms };
        let hasNewData = false;

        // List of keys we care about
        const keysToTrack = ['src', 'sck', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'xcod'];

        // 1. Capture from URL (Priority)
        keysToTrack.forEach(key => {
            const value = currentParams.get(key);
            if (value) {
                newUtms[key] = value;
                hasNewData = true;
            }
        });

        // 2. Save only if we found new data
        if (hasNewData) {
            sessionStorage.setItem('utm_parameters', JSON.stringify(newUtms));
        }

        setUtms(newUtms);
    }, []);

    const getUtms = () => {
        const params = new URLSearchParams();
        Object.entries(utms).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    };

    return {
        utms,
        getUtms
    };
};

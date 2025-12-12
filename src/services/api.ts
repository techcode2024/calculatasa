import { format, subDays, addDays } from 'date-fns';

export interface RateData {
    date: string;
    isoDate: string;
    fullDate: Date;
    usd: number;
    eur: number;
}

const PROXY_URL = 'https://api.allorigins.win/get?url=';

export const fetchHistory = async (): Promise<RateData[]> => {
    let historyRates: RateData[] = [];
    let currentUsd = 0;
    let currentEur = 0;

    // 1. Fetch Current Official Rate (Fast & Reliable)
    try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (response.ok) {
            const data = await response.json();
            currentUsd = data.promedio;
        }
    } catch (e) {
        console.error('Error fetching current USD:', e);
    }

    // 2. Fetch EUR/USD Ratio for Euro calculation
    let eurToUsdRatio = 1.05; // Default fallback
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (response.ok) {
            const data = await response.json();
            if (data.rates && data.rates.EUR) {
                eurToUsdRatio = 1 / data.rates.EUR;
            }
        }
    } catch (e) {
        console.error('Error fetching cross rates:', e);
    }

    // Calculate current EUR if we have USD
    if (currentUsd > 0) {
        currentEur = parseFloat((currentUsd * eurToUsdRatio).toFixed(4));
    }

    // 3. Fetch History from BCV API (via Proxy to avoid CORS)
    try {
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        const startStr = format(startDate, 'yyyy-MM-dd');
        const endStr = format(endDate, 'yyyy-MM-dd');

        const targetUrl = `https://bcv-api.rafnixg.dev/rates/history?start_date=${startStr}&end_date=${endStr}`;
        const encodedUrl = encodeURIComponent(targetUrl);

        const response = await fetch(`${PROXY_URL}${encodedUrl}`);
        if (response.ok) {
            const wrapper = await response.json();
            // allorigins returns the actual response in 'contents' field as a string
            if (wrapper.contents) {
                const bcvJson = JSON.parse(wrapper.contents);
                const rates = bcvJson.rates || [];

                // Sort by date ascending
                rates.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

                historyRates = rates.map((item: any) => {
                    const dateParts = item.date.split('-');
                    const publicationDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                    // Shift by 1 day to get Validity Date (User Expectation)
                    const validDate = addDays(publicationDate, 1);

                    return {
                        date: format(validDate, 'dd/MM'),
                        isoDate: format(validDate, 'yyyy-MM-dd'),
                        fullDate: validDate,
                        usd: item.dollar,
                        eur: parseFloat((item.dollar * eurToUsdRatio).toFixed(4))
                    };
                });
            }
        }
    } catch (e) {
        console.error('Error fetching history:', e);
    }

    // 4. Fallback/Merge Logic
    // If history is empty but we have current rate, create a single entry
    if (historyRates.length === 0 && currentUsd > 0) {
        const now = new Date();
        historyRates.push({
            date: format(now, 'dd/MM'),
            isoDate: format(now, 'yyyy-MM-dd'),
            fullDate: now,
            usd: currentUsd,
            eur: currentEur
        });
    }

    // Ensure the last point in history matches the current rate if we have it
    // This ensures the "RateCard" shows the latest value even if history API is lagging
    if (historyRates.length > 0 && currentUsd > 0) {
        const last = historyRates[historyRates.length - 1];
        // If the last history date is NOT today, append today
        const todayStr = format(new Date(), 'dd/MM');

        // Check if the last item (which might be shifted) is already today
        if (last.date !== todayStr) {
            historyRates.push({
                date: todayStr,
                isoDate: format(new Date(), 'yyyy-MM-dd'),
                fullDate: new Date(),
                usd: currentUsd,
                eur: currentEur
            });
        } else {
            // If it IS today, update it with the most precise current rate
            last.usd = currentUsd;
            last.eur = currentEur;
        }
    }

    return historyRates;
};

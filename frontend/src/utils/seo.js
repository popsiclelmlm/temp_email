export const DEFAULT_SEO = Object.freeze({
    siteName: 'Temp Email',
    shortTitle: 'Temp Email',
    title: 'Temp Email - Temporary Email & Disposable Email for Privacy',
    description: 'Create a temporary email and disposable email address to receive codes, hide your real inbox, reduce spam, and protect privacy without registration.',
    keywords: 'temporary email, temp mail, disposable email, one-time email, anonymous email, privacy email, free temp email',
});

export const resolveSeoText = (configuredText, fallbackText) => {
    if (typeof configuredText !== 'string') return fallbackText;

    const trimmedText = configuredText.trim();
    return trimmedText || fallbackText;
};

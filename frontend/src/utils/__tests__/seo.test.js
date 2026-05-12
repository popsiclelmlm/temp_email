import { describe, expect, it } from 'vitest';
import { DEFAULT_SEO, resolveSeoText } from '../seo';

describe('DEFAULT_SEO', () => {
    it('describes the temporary email product in search-friendly terms', () => {
        expect(DEFAULT_SEO.title).toContain('Temporary Email');
        expect(DEFAULT_SEO.title).toContain('Disposable Email');
        expect(DEFAULT_SEO.description).toMatch(/temporary email/i);
        expect(DEFAULT_SEO.description).toMatch(/disposable email/i);
        expect(DEFAULT_SEO.description).toMatch(/privacy/i);
        expect(DEFAULT_SEO.description.length).toBeLessThanOrEqual(160);
    });

    it('keeps core search phrases available for static metadata', () => {
        expect(DEFAULT_SEO.keywords).toContain('temporary email');
        expect(DEFAULT_SEO.keywords).toContain('disposable email');
        expect(DEFAULT_SEO.keywords).toContain('temp mail');
        expect(DEFAULT_SEO.keywords).toContain('privacy');
    });
});

describe('resolveSeoText', () => {
    it('uses configured site text when it is present', () => {
        expect(resolveSeoText('  My Mailbox  ', DEFAULT_SEO.title)).toBe('My Mailbox');
    });

    it('falls back to default SEO text for empty or non-string values', () => {
        expect(resolveSeoText('', DEFAULT_SEO.description)).toBe(DEFAULT_SEO.description);
        expect(resolveSeoText('   ', DEFAULT_SEO.description)).toBe(DEFAULT_SEO.description);
        expect(resolveSeoText(null, DEFAULT_SEO.description)).toBe(DEFAULT_SEO.description);
    });
});

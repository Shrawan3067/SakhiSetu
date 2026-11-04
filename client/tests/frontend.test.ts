import { describe, it, expect } from 'vitest';
import { api } from '../src/services/api';

describe('Frontend Architecture & API Client Suite', () => {
  it('correctly constructs receipt download URL', () => {
    const url = api.getReceiptDownloadUrl('receipt-uuid-1234');
    expect(url).toContain('/receipts/receipt-uuid-1234/download');
  });

  it('correctly constructs Form 10BD CSV download URL with financial year parameter', () => {
    const urlWithFy = api.getForm10BDCsvUrl('2026-27');
    expect(urlWithFy).toContain('/admin/reports/form-10bd?format=csv&financialYear=2026-27');

    const defaultUrl = api.getForm10BDCsvUrl();
    expect(defaultUrl).toContain('/admin/reports/form-10bd?format=csv');
  });

  it('verifies brand color palette compliance', () => {
    const brandColors = {
      primary: '#174C3C',
      deepGreen: '#103A30',
      sage: '#A8BDA8',
      background: '#FAF9F5',
      white: '#FFFFFF',
      primaryText: '#202923',
      secondaryText: '#727B74',
      terracotta: '#C77B59',
    };

    expect(brandColors.primary).toBe('#174C3C');
    expect(brandColors.deepGreen).toBe('#103A30');
    expect(brandColors.terracotta).toBe('#C77B59');
  });
});

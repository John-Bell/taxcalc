import { RentalTaxService } from './RentalTaxService';
import { BrbTracker } from '../models/BrbTracker';
import { getTaxConstants } from '../constants/taxConstants';

const CURRENT_TAX_YEAR = '2025-2026';

describe('RentalTaxService', () => {
  it('calculates rental tax within the basic rate band', () => {
    const service = new RentalTaxService(CURRENT_TAX_YEAR);
    const constants = getTaxConstants(CURRENT_TAX_YEAR);
    const rentalIncome = 10000;
    const brbTracker = new BrbTracker(constants.BasicRateBand);

    const result = service.calculateRentalTax(
      rentalIncome,
      0,
      constants.StandardPersonalAllowance,
      brbTracker,
      [],
      CURRENT_TAX_YEAR
    );

    expect(result).toHaveLength(1);
    const [basicBand] = result;
    expect(basicBand.type).toBe(constants.RentalBandType);
    expect(basicBand.band).toBe(constants.BasicBand);
    expect(basicBand.amount).toBe(rentalIncome);
    expect(basicBand.rate).toBe(constants.RentalBasicRate);
    expect(basicBand.tax).toBeCloseTo(rentalIncome * constants.RentalBasicRate);
  });

  it('progresses rental income through higher rates without allowances', () => {
    const service = new RentalTaxService(CURRENT_TAX_YEAR);
    const constants = getTaxConstants(CURRENT_TAX_YEAR);
    const rentalIncome = 8000;
    const brbTracker = new BrbTracker(5000);

    const result = service.calculateRentalTax(
      rentalIncome,
      0,
      constants.StandardPersonalAllowance,
      brbTracker,
      [],
      CURRENT_TAX_YEAR
    );

    const basicBand = result.find(b => b.band === constants.BasicBand);
    const higherBand = result.find(b => b.band === constants.HigherBand);

    expect(basicBand?.amount).toBe(5000);
    expect(basicBand?.rate).toBe(constants.RentalBasicRate);
    expect(higherBand?.amount).toBe(3000);
    expect(higherBand?.rate).toBe(constants.RentalHigherRate);
    expect(result.some(b => b.rate === 0)).toBe(false);
  });
});

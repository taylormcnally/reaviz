import { buildShallowChartData } from './builder';
import { categoryData } from '../../../demo/category';

 describe('Builder', () => {
  it('it should build zero based chart', () => {
    const result = buildShallowChartData(categoryData);
    expect(result[0].x0).toBe(0);
  });
});

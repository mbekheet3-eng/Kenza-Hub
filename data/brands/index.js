import FASHION_BRANDS from './fashion';
import SPORTS_BRANDS from './sports';
import LUXURY_BRANDS from './luxury';
import KIDS_BRANDS from './kids';
import LOCAL_BRANDS from './local';

const BRANDS = [
  ...FASHION_BRANDS,
  ...SPORTS_BRANDS,
  ...LUXURY_BRANDS,
  ...KIDS_BRANDS,
  ...LOCAL_BRANDS,
];

export default BRANDS;

export {
  FASHION_BRANDS,
  SPORTS_BRANDS,
  LUXURY_BRANDS,
  KIDS_BRANDS,
  LOCAL_BRANDS,
};
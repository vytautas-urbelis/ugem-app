import { fontFamilies } from "../constants/fonts/fonts";

export const getFontFamily = (isLTR, weight) => {
  const selectedFontFamily = isLTR ? fontFamilies.ROBOTO : fontFamilies.NUNITO;
  return selectedFontFamily[weight];
};

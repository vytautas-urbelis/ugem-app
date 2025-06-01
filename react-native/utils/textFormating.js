export const shorterText = (text, length) => {
  const newText = text.slice(0, length);
  if (text.length <= length) {
    return text;
  }
  return newText + "...";
};

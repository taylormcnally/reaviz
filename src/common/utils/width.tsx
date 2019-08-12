import calculateSize from 'calculate-size';

/**
 * Measures the width of text.
 */
export function getTextWidth(text: string, font: string, fontSize: number): number {
  const labelDimensions = calculateSize(text, {
    font,
    fontSize: `${fontSize}px`
  });

  return labelDimensions.width;
}

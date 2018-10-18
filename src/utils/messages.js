import { round } from './time';

export function generateSuccessMessage(filter, language, rawTime) {
  const time = round(rawTime, 3);
  switch (filter) {
    case 'BoxBlur':
      return `Applied box blur using ${language} in ${time}ms`;
    case 'GaussianBlur':
      return `Applied gaussian blur using ${language} in ${time}ms`;
    case 'Grayscale':
      return `Converted image to grayscale using ${language} in ${time}ms`;
    case 'Sharpen':
      return `Sharpened image using ${language} in ${time}ms`;
    case 'Invert':
      return `Inverted image using ${language} in ${time}ms`;
    case 'Cooling':
      return `Applied a cooling filter using ${language} in ${time}ms`;
    default:
      throw new Error(`No message specified for filter: ${filter}`);
  }
}

export function generateErrorMessage(filter, language) {
  switch (filter) {
    case 'BoxBlur':
      return `Error while applying box blur using ${language}`;
    case 'GaussianBlur':
      return `Error while applying gaussian blur using ${language}`;
    case 'Grayscale':
      return `Error while converting image to grayscale using ${language}`;
    case 'Sharpen':
      return `Error while sharpening image using ${language}`;
    case 'Invert':
      return `Error while inverting image using ${language}`;
    case 'Cooling':
      return `Error while applying a cooling filter using ${language}`;
    default:
      throw new Error(`No error message specified for filter: ${filter}`);
  }
}

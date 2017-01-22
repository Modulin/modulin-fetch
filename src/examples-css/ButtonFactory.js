import Button from './Button';
import buttonMarkup from './Button.html';
import buttonStyleDefault from './ButtonDefault.css';
import buttonStyleLarge from './ButtonLarge.css';

export const style = {
  DEFAULT: buttonStyleDefault,
  LARGE: buttonStyleLarge
};

export function create({style}) {
  return new Button(buttonMarkup, style);
}
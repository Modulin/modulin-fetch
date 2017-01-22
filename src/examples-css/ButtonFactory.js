import Button from './Button';
import buttonMarkup from './Button.html';
import buttonStyleDefault from './ButtonDefault.css';
import buttonStyleLarge from './ButtonLarge.css';

export var style = {
  DEFAULT: buttonStyleDefault,
  LARGE: buttonStyleLarge
};

export function create(options) {
  var style = options.style;
  return new Button(buttonMarkup, style);
}
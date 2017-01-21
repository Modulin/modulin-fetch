import Button from './Button';
import buttonStyle1 from './Button1.css';
import buttonStyle2 from './Button2.css';

const button1 = new Button(buttonStyle1);
button1.attach(document.body);

const button2 = new Button(buttonStyle2);
button2.attach(document.body);
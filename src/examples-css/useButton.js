import {create as createButton, style as buttonStyle} from "ButtonFactory";

const button1 = createButton({style: buttonStyle.DEFAULT});
button1.attach(document.body);

const button2 = createButton({style: buttonStyle.LARGE});
button2.attach(document.body);
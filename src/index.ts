import 'whatwg-fetch'
import 'promise-polyfill/src/polyfill';

import AjaxManager from "./AjaxManager/index";

export {AjaxManager};

export * from "./models";
const Ajaxious = new AjaxManager();
if (window)
    (window as any).$ajax = Ajaxious;
export default Ajaxious;


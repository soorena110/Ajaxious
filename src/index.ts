import AjaxManager from "./AjaxManager/index";
export {AjaxManager};

export * from "./models";
const Ajaxious = new AjaxManager();
(window as any).$ajax = Ajaxious;
export default Ajaxious;


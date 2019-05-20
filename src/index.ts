import AjaxManager from "./Manager/AjaxManager";
export * from "./AjaxModels";

const Ajaxious = new AjaxManager();
(window as any).$ajax = Ajaxious;
export default Ajaxious;
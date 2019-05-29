import AjaxManager from "./Manager/AjaxManager";
export * from "./Manager/_models";

const Ajaxious = new AjaxManager();
(window as any).$ajax = Ajaxious;
export default Ajaxious;
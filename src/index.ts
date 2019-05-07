import AjaxManager from "./Manager/AjaxManager";
export {ajaxEmptyPromise, AjaxOptions, AjaxResult, AjaxStatus} from "./AjaxModels";

const Ajaxious = new AjaxManager();
(window as any).$ajax = Ajaxious;
export default Ajaxious;
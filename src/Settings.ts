export const AjaxSetting = {
    path: '',
    header: {} as HeadersInit,
    logs: {} as any
};

const win = (window as any);
if (!win.$trace)
    win.$trace = {};

win.$trace.ajax = {
    setting: AjaxSetting,
    setLogEnablity(verb: string, enablity: boolean) {
        localStorage.setItem('log' + verb, enablity ? 'true' : 'false');
        AjaxSetting.logs[verb] = enablity;
    },
};

['get', 'post', 'put', 'delete'].forEach(verb => {
    AjaxSetting.logs[verb] = (localStorage.getItem('log' + verb) || 'true') == 'false';
    win.$trace.ajax[verb + 'Off'] = () => win.$trace.ajax.setLogEnablity(verb, false);
    win.$trace.ajax[verb + 'On'] = () => win.$trace.ajax.setLogEnablity(verb, true);
});

export default AjaxSetting;
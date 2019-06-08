export const AjaxSetting = {
    path: '',
    header: {} as HeadersInit,
    logs: {} as any
};

const logSettingName = 'ajaxious.logSetting';
const loadPreviousLogSetting = () => {
    if (!window.localStorage)
        return {};

    try {
        const logSettingString = window.localStorage.getItem(logSettingName);
        if (logSettingString)
            return JSON.parse(logSettingName);
    } catch {
    }
    return {};
};
const saveLogSetting = () => {
    if (window.localStorage)
        try {
            window.localStorage.setItem(logSettingName, AjaxSetting.logs);
        } catch {
        }
};


const win = (window as any);
if (!win.$trace)
    win.$trace = {};

win.$trace.ajax = {
    setting: AjaxSetting,
    setLogEnablity(verb: string, enablity: boolean) {
        AjaxSetting.logs[verb] = enablity;
        saveLogSetting();
    },
};

const previousLogSetting = loadPreviousLogSetting();
['get', 'post', 'put', 'delete'].forEach(verb => {
    AjaxSetting.logs[verb] = (previousLogSetting[verb] || 'true') != 'false';
    win.$trace.ajax[verb + 'Off'] = () => win.$trace.ajax.setLogEnablity(verb, false);
    win.$trace.ajax[verb + 'On'] = () => win.$trace.ajax.setLogEnablity(verb, true);
});

export default AjaxSetting;
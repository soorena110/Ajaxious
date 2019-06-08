export const AjaxSetting = {
    path: '',
    header: {} as HeadersInit,
    logs: {} as any
};

const logSettingName = 'Ajaxious.logSetting';
const loadPreviousLogSetting = () => {
    if (!window.localStorage)
        return {};

    try {
        const logSettingString = window.localStorage.getItem(logSettingName);
        if (logSettingString)
            return JSON.parse(logSettingString);
    } catch {
    }
    return {};
};
const saveLogSetting = () => {
    if (window.localStorage)
        try {
            const logStrings = JSON.stringify(AjaxSetting.logs);
            window.localStorage.setItem(logSettingName, logStrings);
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
        if (enablity) {
            win.$trace.ajax[verb + 'Off'] = () => win.$trace.ajax.setLogEnablity(verb, false);
            delete win.$trace.ajax[verb + 'On']
        } else {
            win.$trace.ajax[verb + 'On'] = () => win.$trace.ajax.setLogEnablity(verb, true);
            delete win.$trace.ajax[verb + 'Off']
        }
    },
};

const previousLogSetting = loadPreviousLogSetting();
['get', 'post', 'put', 'delete'].forEach(verb => {
    AjaxSetting.logs[verb] = previousLogSetting[verb] != undefined ? previousLogSetting[verb] : true;
    if (AjaxSetting.logs[verb])
        win.$trace.ajax[verb + 'Off'] = () => win.$trace.ajax.setLogEnablity(verb, false);
    else
        win.$trace.ajax[verb + 'On'] = () => win.$trace.ajax.setLogEnablity(verb, true);
});

export default AjaxSetting;
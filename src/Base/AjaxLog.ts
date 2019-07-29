import {AjaxSetting} from "../AjaxManager/Settings";

function wordSudoColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

export function logAjaxRequestResult(url: string, method: string, res: Response, data: any, info: any) {
    if (AjaxSetting.logs[method.toLowerCase()] == false)
        return;

    const isError = data == undefined;
    let style = 'color: darkcyan';
    if (isError)
        style = 'color: orange; background-color:#500;border';
    else if (Math.floor(res.status / 100) == 4)
        style = 'color: orange';
    else if (Math.floor(res.status / 100) == 5)
        style = 'color: green';


    const keyWord = url.split('/').find(s => !!s.length) || ' ';

    groupCollapsed(`%c  Ajax  %c %c${keyWord[0]}%c ${method}:${url} -> ${res.status} `,
        'color:black;background:#01B8C3', '',
        'padding:1px 5px;border-radius:30px;background:#' + wordSudoColor(keyWord),
        style);

    if (typeof data == 'object')
        console.log('data:', data);
    else {
        groupCollapsed('data');
        console.log('data:', data);
        groupEnd();
    }

    Object.keys(info).forEach(k => {
        groupCollapsed(`%c${k}`, 'color:deepskyblue');
        console.table(info[k]);
        groupEnd();
    });

    groupEnd();
}

function groupCollapsed(...args: any[]) {
    if (console.groupCollapsed && console.groupEnd)
        console.groupCollapsed(...args);
}


function groupEnd() {
    if (console.groupCollapsed && console.groupEnd)
        console.groupEnd();
}
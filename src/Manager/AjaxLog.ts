import {AjaxSetting} from "./Settings";

function wordSudoColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

export function logAjaxRequestResult(url: string, method: string, response: Response, data: any, info: any) {
    if (AjaxSetting.logs[method.toLowerCase()] == false)
        return;

    const isError = data == undefined;
    let style = 'color: darkcyan';
    if (isError)
        style = 'color: orange; background-color:#500;border';
    else if (Math.floor(response.status / 100) == 4)
        style = 'color: orange';
    else if (Math.floor(response.status / 100) == 5)
        style = 'color: green';


    const keyWord = url.split('/').find(s => !!s.length) || ' ';

    if (console.groupCollapsed && console.groupEnd)
        console.groupCollapsed(`%c  Ajax  %c %c${keyWord[0]}%c ${method}:${url} -> ${response.status} `,
            'color:black;background:#01B8C3', '',
            'padding:1px 5px;border-radius:30px;background:#' + wordSudoColor(keyWord),
            style);

    console.log('data:', data);
    console.log('info:', info);


    if (console.groupCollapsed && console.groupEnd)
        console.groupEnd();
}
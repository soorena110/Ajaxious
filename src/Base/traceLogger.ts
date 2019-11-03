import {TraceLogger} from 'azi-tools';

const loggerKeys = ['get', 'post', 'put', 'delete'];
const defaultValues = [false, false, false, false];
export const traceLogger = new TraceLogger('ajax', loggerKeys, defaultValues);

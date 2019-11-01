import Ajaxious from '../index';

Ajaxious.post('google.com', {a: 1, b: 2}, {c: 1, d: 2});
Ajaxious.baseFetchOptions = { mode:"no-cors"};
Ajaxious.basePath = "http://localhost:11977";
Ajaxious.get('tasks');
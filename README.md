# Ajaxious

`Ajaxious` is an event driven request object that helps to organize request events and life cycle.
For example you can add subscribe to responses with 401 and 403 status code to go in login page.
In another example, in a component can subscribe to 2xx and 4xx status code to show notifications.
It is based on `fetch` method that is implemented in many browsers.

## How to use
First for installation run this code :
```node
npm install ajaxious
```

To use `Ajaxious` can do this :

```js
import Ajaxious from "ajaxious";

Ajaxious.setPath('http://host.com/api');
Ajaxious.setHeaders({"x-token" : token})

Ajaxious.get("tasks"); // to fetch data from "http://host.com/api/tasks" with
                       // GET method and with specified headers.


Ajaxious.addEventListener('on4xx', (request, result)=>{
    alert('response error with status code ' + result.status);
});

Ajaxious.addEventListener('on401', (request, result)=>{
    goToLoginPage();
});
```

## Requesting
`Ajaxious` has 4 methods with specific methods, and there is `request` method for other methods.

```js
Ajaxious.get(url, params, options);
Ajaxious.post(url, body, params, options);
Ajaxious.put(url, body, params, options);
Ajaxious.delete(url, params, options);

Ajaxious.request(ajaxiousRequestObject);
```

#### `url`
`url` is `string` and can be relative or absolute url.
If url contains `":/"` string, then `Ajaxious` assumes that url is absolute, but you can change this assumption in `options` params.
Url can contain url params, but we recommend you to use `params` parameter to do this.
 
 ```js
Ajaxious.get('http://host.com/api/employees'); // absolute url

Ajaxious.setPath('http://host.com/api'); // set base url to 'http://host.com/api'.
Ajaxious.get('/employees'); // relative url, this is as same as get request.
Ajaxious.get('employees'); // relative url, no change, just we removed "/" from relative url.
```
 
#### `params`
It is optional argument.
As we said, you can set url params in `url`, but you can also pass an object. 

```js
Ajaxious.get('/employees?taskId=2103');
Ajaxious.get('/employees', { taskId : 2103 }); // both are same, but this is recommended
```

#### `body`
It also is known as form params.
It is optional argument.
You can pass an object or a FormData object.
If you pass an object, then we will stringify it and set `"Content-Type" = "application/json"` in header,
if you want to prevent this header set, you can pass `headers` in `options` params, we discuss later.
 
```js
const bodyObject = {title: 'hello world :)'}
Ajaxious.post(url, bodyObject); // "Content-Type" = "application/json" in header

const formdata = new FormData();
formdata.append('title', 'hello world :)');
Ajaxious.post(url, formdata);
```

#### `options`
It is optional argument.
`options` is an object. its props may have meaning for `Ajaxious`, but you can also set your variable for subscribed events.

`dontTriggerEvents` is used to prevent events running. in below example `alert` would never called for the request, event if the request response status code is 4xx.

Another thing that `Ajaxious` does, is logging in console window.
You can turn it off with setting `neverLog` to `true` in `options`.

As we said you can also set `urlType` in options, if you want to change url type to `"absolute"` or `"relative"` manually.

You can override or add headers for the request.
This object will merge with the base headers or override same keys.
As we said before, if you dont want `"Content-Type" = "application/json"` to be set in headers automatically (due to json `body`), you can override `"Content-Type"` in `options.headers`. 

```js
const options = {
    dontTriggerEvents: true, // so it does not trigger any event.
    neverLog: true, // does not log in console window.
    urlType : "absolute", // or urlType : "relative",
    headers : mergingHeader // this object merges and overrides base headers object.
};
Ajaxious.get(url, undefined, options);

Ajaxious.addEventListener('on4xx', (request, result)=>{
    alert('response error with status code ' + result.status);
});
```

You can also use `options` to pass data to events.

```js
const options = {
    isTheRequestThatIMarkIt : 'Yes' 
};
Ajaxious.get(url, undefined, {headers});

Ajaxious.addEventListener('onSuccess', (request, result)=>{
    if(request.options.isTheRequestThatIMarkIt === 'Yes')
        alert('Yes, is the request that I marked. Now it is successful !!!! ;) ');
});
```

## `Ajaxious.request`
If you can't find your methods in `Ajaxious`, then you should use `Ajaxious.request`.
This method has one argument of type `AjaxRequest`.
All parameters in below example is like what we discussed before.
```js
const ajaxiousRequestObject = {
    url : '/employees',
    method : 'POST',
    body : {title : 'hello world !!!!'},
    params : {taskId : 1052},
    options : {neverLog : true}
};
Ajaxious.request(ajaxiousRequestObject);
``` 


## Response

Request from `Ajaxious` returns a promise of type `AjaxResult`.
So we can use `.then` and `.catch` methods or using `await` in async methods.
```js
Ajaxious.get(url).then(result => console.log(result)); // logs an object of type AjaxResult.
```

AjaxResult contains `status`, `data` and `response`.


#### `response`
`response` is the same `fetch` result.

#### `status`
`status` is almost `response.status`, except when request status code shows a problem in client side.
`status` is `0` when request is not sent and `-1` if error happened before request starts.
If you are using TypeScript, you can check result status code using `AjaxStatus` enum.

```js
Ajaxious.get(url).then(result => {
    if(result.status === AjaxStatus.ok)
        console.log('Its ok ! :) ');
    else if(result.status === AjaxStatus.badRequest)
        console.error('Its bad request ! :( ');
    else
        console.warn('Hmmm ...', result.status);
});
```

#### `data`

If server response header contains `"content-type" = "application/json"`,
then `data` is json parsed of server response content,
otherwise `data` is response content.


```js
Ajaxious.get(url).then(result => {
    console.log(result.data); // json (JS object) if server says has sent json.
});
```

**Note**: Be careful, if status code is 4xx or 5xx, `Ajaxious` does not throw exception,
so you always should check status code in `.then(result => ... )`.



## `Ajaxious` methods

#### `Ajaxious.setPath`
Is used to set base url every request.

```js
Ajaxious.get("tasks"); // to fetch data from "tasks" with no base url

Ajaxious.setPath('http://host.com/api');
Ajaxious.get("tasks"); // to fetch data from "http://host.com/api/tasks"
```

#### `Ajaxious.getPath`
Is used to get base url.

#### `Ajaxious.setHeaders`
Is used to set base headers for every request.

```js
Ajaxious.setPath('http://host.com/api');
Ajaxious.setHeaders({"x-token" : token})

Ajaxious.get("tasks"); // to fetch data from "http://host.com/api/tasks" with
                       // GET method and with headers equal to {"x-token" : token}.
```

You can add header(s) or override base headers for a request via `options.headers`.

```js
Ajaxious.setPath('http://host.com/api');
Ajaxious.setHeaders({"x-token" : token})

Ajaxious.get("tasks", undefined, {
    headers:{header1 : 'header1'}
}); // to fetch data from "http://host.com/api/tasks" with GET method and with
    // headers equal to {"x-token" : token, header1 : 'header1'}.

Ajaxious.get("tasks", undefined, {
    headers:{
        "x-token" : overRidedToken
        header1 : 'header1',
    }
}); // to fetch data from "http://host.com/api/tasks" with GET method and
    //with headers equal to {"x-token" : overRidedToken, header1 : 'header1'}.

```

#### `Ajaxious.getHeaders`
Is used to get base headers.

#### `Ajaxious.addEventListener`
Is used to add an event listener on an event type.

```js
Ajaxious.addEventListener('onSuccess', (request, result) => {
    console.log(request, result)
});
```

Event types are like `on{status code}`.
For example `"on200"` is raised when server response status code is 200,
or `"on403"` is raised when server response status code is 403.

You can also subscribe to status group, for example 400 to 499 is client error status codes,
and we can subscribe to `"on4xx"`. Or `"on5xx"` is server error status codes.

There are some others event types :

`"onSuccess"` raised when server response status code is 200, it's equal to `"on200"`.

`"onError"` raised when server response status code is 400 to 499. it's equal to `"on4xx"`.

`"onUnauthorized"` raised when server response status code is 200, it's equal to `"on401"`.

`"onDone"` raised when server response is received, does not matter what status code it has.

`"onRequesting"` raised before sending request. It is good when we want to change request before execution.

```js
Ajaxious.addEventListener('onRequesting', (request, response) => {
    if(request.url.indexOf('algobox/V1'))
        request.url = request.url.replace('algobox/V1', "algobox/V2");
        // changing url from version 1 to version 2 if url contains "algobox".
});
```

Listener has two arguments, first argument is the request object,
by manipulating it in `"onRequesting"` event listeners, you can change those request destiny.
the second argument is server response, which is talk before.
You can either change its values when you want manipulate receiving data for consumer.

```js
Ajaxious.addEventListener('onDone', (request, response) => {
    if(request.url === '/tasks' || request.url === 'tasks') {
        const tasks = response.data.tasks;
        if(tasks === undefined || tasks === null) // tasks are empty
            response.data.tasks = []; // consumer gets an array, whether full or empty.
    }
});
```

You can also check status code in event listener function.

```js
Ajaxious.addEventListener('onDone', (request, response) => {
    const errorGroup = Math.floor(response.status/100);
    if (errorGroup === 4)
        alert('Error from client');
    else if (errorGroup === 5)
        alert('Error from Server');
    else if (response.status === 604)
        alert("Ohhhh 604 !! They are invaders from Mars !!!");
});
```

**Note** `Ajaxious` is a singleton object from `AjaxManager`. You can create more object from `AjaxManager` if you want to separate request profiles.


#### `Ajaxious.removeEventListener`
Is used to remove an event listener on an event type.

```js
const onSuccess = (request, result) => console.log(request, result)

Ajaxious.addEventListener('onSuccess', onSuccess); // add event
Ajaxious.removeEventListener('onSuccess', onSuccess); // remove event, so nothing happens !!
```




#### `Ajaxious.removeAllListeners`
Is used to remove all event listeners on an event type.

```js
const onSuccess1 = (request, result) => console.log(request, result);
Ajaxious.addEventListener('onSuccess', onSuccess1);

const onSuccess2 = (request, result) => console.log(request, result);
Ajaxious.addEventListener('onSuccess', onSuccess2);

const onSuccess3 = (request, result) => console.log(request, result);
Ajaxious.addEventListener('onSuccess', onSuccess3);

Ajaxious.removeAllListeners('onSuccess'); // remove all events of "onSuccess", so nothing happens !!
```


#### `Ajaxious.removeAllListeners`
Is used to remove all event listeners on an event type.


```js
Ajaxious.addEventListener('onUnauthorized', () => {
    goToLoginPage();
});

const request = {};
const response = {status : 401}
Ajaxious.raiseEvents(request, response); // raises "onUnauthorized" event, because status code is 401.
```


## Logging
`Ajaxious` logs requests in console window. You can set it on or off.

`Ajaxious.removeAllListeners` Is used to set logging enabled or disabled.

```js
if(window.env && window.env.prod == true) // if is production environment, prevent logging.
    Ajaxious.setAllLogOptions(false);
```

You can also filter logging using `window.$trace.ajax` methods.

`window.$trace.ajax.getOff()` prevent logging get requests.
`window.$trace.ajax.getOn()` enables logging get requests.
`window.$trace.ajax.postOff()` prevent logging post requests.
`window.$trace.ajax.postOn()` enables logging post requests.
`window.$trace.ajax.putOff()` prevent logging put requests.
`window.$trace.ajax.putOn()` enables logging put requests.
`window.$trace.ajax.deleteOff()` prevent logging delete requests.
`window.$trace.ajax.deleteOn()` enables logging delete requests.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### Also star my project in gitHub if you like it ;))

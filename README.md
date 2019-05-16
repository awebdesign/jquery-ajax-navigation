# jquery-ajax-navigation
<h3>HTML Attributes</h3>
<ul>
    <li>
        <strong>data-ajax-nav="modal|modal-save|link"</strong>
        <br/>default link<br/>
    the difference between modal and modal-save is that, modal save has a "Save" button listed in the modal windows which automatically submits the first form which is present in the modal box
    </li>
    <li>
        <strong>data-ajax-confirm="Your message here"</strong>
        <br/>Confirmation modal. If there is no message defined then the default one will be used ("Are you sure?")
    </li>
    <li>
        <strong>data-ajax-response="html|json"</strong>
        <br/>Type of server response. Default is JSON
    </li>
    <li>
        <strong>data-ajax-container=".class|#id|this|parent"</strong>
        <br/>The container can have 'this' as a value, which means will take the current element as container, can have 'parent' which means will take the parent of the actual element or can be an id or class name. By default if the value does not starts with . or #, a # character will be put in front of the value
    </li>
    <li>
        <strong>data-ajax-replace=".class|#id|this|parent"</strong>
        <br/>The container which will be replace with the content received from the server. The container replacement can have 'this' as a value, which means will take the current element as container, can have 'parent' which means will take the parent of the actual element or can be an id or class name. By default if the value does not starts with . or #, a # character will be put in front of the value. When using this attribute, data-ajax-container will be ignored
    </li>
    <li>
        <strong>data-ajax-extract=".class|#id"</strong>
        <br/>If we need to extract only a single element from the whole html content response then we can use this attribute and as a value we can define what element we want to extract. By default if the value does not starts with . or #, a # character will be put in front of the value
    </li>
    <li>
        <strong>data-ajax-push="true|false"</strong>
        <br/>Browser history push. Default false
    </li>
    <li>
        <strong>data-ajax-scroll="true|false"</strong>
        <br/>If the attribute is present then after the request the page will automatically scroll to that element
    </li>
    <li>
        <strong>data-ajax-trigger=".class|#id"</strong>
        <br/>If we need to trigger another ajax-nav element then we can use this attribute and as a value we can define the id or class name of the element we want to trigger. By default if the value does not starts with . or #, a # character will be put in front of the value
    </li>
    <li>
        <strong>data-ajax-callback="functionNameHere"</strong>
        <br/>You can specify your custom callback function/method here and also you can use "this" inside the function/method. By default if there are no params sent you will receive "options" and "response" param
    </li>
</ul>

<br/>

<h3>Server Response</h3>
The server can repond with HTML or JSON. In order to proccess the output the library needs to know the type of the response which can be done with data-ajax-response="html" else will threat all the responses as JSON.<br/>
In case of JSON, here are a few values which can be sent:<br/><br/>
<ul>
    <li>
        <strong>redirect</strong>
        <br/>redirects to a specific link
    </li>
    <li>
        <strong>alert</strong>
        <br/>triggers an alert message
    </li>
    <li>
        <strong>content</strong>
        <br/>is the actual content which will be shown
    </li>
    <li>
        <strong>success</strong>
        <br/>will mark the operation as done and will close the modal box
    </li>
    <li>
        <strong>notifications</strong>
        <br/>should be an array or object which can containt the following indexes <b>['success', 'info', 'warning', 'danger']</b> and the value can be an <b>array</b> for multiple messages at once or can be a <b>string</b> for a single message per type. The library will trigger and a message for each value found
    </li>
</ul>

<br/>
<h3>3rd Party Libraries</h3>
<br/><br/>
<ul>
    <li>
        <strong>Bootstrap Validator</strong>
        <br/><a target="_blank" href="https://github.com/1000hz/bootstrap-validator">Git hub 1000hz/bootstrap-validator</a>
    </li>
    <li>
        <strong>Bootstrap Notify</strong>
        <br/><a target="_blank" href="https://github.com/mouse0270/bootstrap-notify">Git hub mouse0270/bootstrap-notify</a>
    </li>
</ul>

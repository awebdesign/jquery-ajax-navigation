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
        <br/>default is "Are you sure?"
    </li>
    <li>
        <strong>data-ajax-response="html|json"</strong>
        <br/>default json
    </li>
    <li>
        <strong>data-ajax-container=".class|#id|this|parent"</strong>
        <br/>the container can have 'this' as a value, which means will take the current element as container, can have 'parent' which means will take the parent of the actual element or can be an id or class name. By default if the value does not starts with . or #, a # character will be put in front of the value
    </li>
    <li>
        <strong>data-ajax-extract=".class|#id"</strong>
        <br/>if we need to extract only a single element from the whole html content response then we can use this attribute and as a value we can define what element we want to extract. By default if the value does not starts with . or #, a # character will be put in front of the value
    </li>
    <li>
        <strong>data-ajax-push="true|false"</strong>
        <br/>default false
    </li>
    <li>
        <strong>data-ajax-scroll="true|false"</strong>
        <br/>if the attribute is present then after the request the page will automatically scroll to that element
    </li>
    <li>
        <strong>data-ajax-trigger=".class|#id"</strong>
        <br/>if we need to trigger another ajax-nav element then we can use this attribute and as a value we can define the id or class name of the element we want to trigger. By default if the value does not starts with . or #, a # character will be put in front of the value
    </li>
    <li>
        <strong>data-ajax-callback="functionNameHere"</strong>
        <br/>you can specify your custom callback function/method here and also you can use "this" inside the function/method. By default if there are no params sent you will receive "options" and "response" param
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
</ul>

# jquery-ajax-navigation

<strong>data-ajax-nav="modal|modal-save|link"</strong> -> default link<br/>
the difference between modal and modal-save is that, modal save has a "Save" button listed in the modal windows which automatically submits the first form which is present in the modal box
<br/>
<strong>data-ajax-confirm="Your message here"</strong> -> default is "Are you sure?"
<br/>
<strong>data-ajax-response="html|json"</strong> -> default json
<br/>
<strong>data-ajax-container=".class|#id|this|parent"</strong> -> the container can have 'this' as a value, which means will take the current element as container, can have 'parent' which means will take the parent of the actual element or can be an id or class name. By default if the value does not starts with . or #, a # character will be put in front of the value
<br/>
<strong>data-ajax-extract=".class|#id"</strong> -> if we need to extract only a single element from the whole html content response then we can use this attribute and as a value we can define what element we want to extract. By default if the value does not starts with . or #, a # character will be put in front of the value
<br/>
<strong>data-ajax-push="true|false"</strong> -> default false
<br/>
<strong>data-ajax-scroll="true|false"</strong> -> if the attribute is present then after the request the page will automatically scroll to that element
<br/>
<strong>data-ajax-trigger=".class|#id"</strong> -> if we need to trigger another ajax-nav element then we can use this attribute and as a value we can define the id or class name of the element we want to trigger. By default if the value does not starts with . or #, a # character will be put in front of the value
<br/>
<strong>data-ajax-callback="functionNameHere"</strong> -> you can specify your custom callback function/method here and also you can use "this" inside the function/method. By default if there are no params sent you will receive "options" and "response" param
<br/><br/>
<h3>Responses</h3>
The server can repond with HTML and this can be interpreted only if the element has the attribute data-ajax-response="html" added, or can be a JSON.<br/>
In case of JSON, here are a few values which can be sent:<br/>
<ul>
<li>redirect -> redirects to a specific link</li>
<li>alert -> triggers an alert message</li>
<li>content -> is the actual content which will be shown</li>
<li>success -> will mark the operation as done and will close the modal box</li>
</ul>

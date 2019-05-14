# jquery-ajax-navigation

<strong>data-ajax-nav="modal|modal-save|link"</strong> -> default link<br/>
the difference between modal and modal-save is that, modal save has a "Save" button listed in the modal windows which automatically submits the first form which is present in the modal box
<br/>
<strong>data-ajax-confirm="Your message here"</strong> -> default is "Are you sure?"
<br/>
<strong>data-ajax-response="html|json"</strong> -> default json
<br/>
<strong>data-ajax-container=".class|#id"</strong> -> just for link, starts with # by default if . or # is not defined
<br/>
<strong>data-ajax-push="true|false"</strong> -> default false
<br/>
<strong>data-ajax-callback="functionNameHere"</strong> -> yout can specify your custom callback function/method here. you can use "this" inside the function/method. By default if there are no params sent you will receive "options" and "response" param
<br/>

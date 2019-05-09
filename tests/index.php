<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>DEMO PAGE</title>
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">


<script src="../js/jquery.ajaxNavigation.js" type="text/javascript"></script>
<script src="../vendors/bootstrap-validator/validator.min.js" type="text/javascript"></script>
</head>

<body>

<!--
/**
 * Ajax navigation
 *
 * data-ajax-nav="modal|confirm|link" -> default link
 * data-ajax-response="html|json" -> default json
 * data-ajax-container=".class|#id" -> just for link, starts with # by default if . or # is not defined
 * data-ajax-confirm="Your message here"
 * data-ajax-push="true|false" -> default false
 */
-->



<h3>TEST AJAX NAV</h3>
<a href="content.php" data-ajax-nav>AJAX NAV (json)- default container</a>
 |
<a href="content.php" data-ajax-nav data-ajax-container="container-custom">AJAX NAV (json) - custom container</a>
|
<a href="content.php" data-ajax-nav data-ajax-push>AJAX NAV (json) - SET STATE</a>
|
<a href="content.php" data-ajax-nav data-ajax-push title="My title">MY TITLE _ AJAX NAV (json) - SET STATE</a>
|
<a href="content.php?link-in-link=true" data-ajax-nav>AJAX NAV (json)- LINK IN LINK</a>
|
<a href="content.php" data-ajax-nav data-ajax-callback="testingCallback(this)">AJAX NAV (json)- CALLBACK</a>

<br/><br/>
<a href="content.php?response=html" data-ajax-nav data-ajax-response="html">AJAX NAV (HTML)- default container</a>
 |
<a href="content.php?response=html" data-ajax-nav data-ajax-response="html" data-ajax-container="container-custom">AJAX NAV (HTML) - custom container</a>
|
<a href="content.php?response=html" data-ajax-nav data-ajax-response="html" data-ajax-push>AJAX NAV (HTML) - SET STATE</a>
|
<a href="content.php?response=html" data-ajax-nav data-ajax-response="html" data-ajax-push title="My title">MY TITLE _ AJAX NAV (HTML) - SET STATE</a>
<br/><br/>

<a href="content.php?redirect=true" data-ajax-nav>AJAX NAV - REDIRECT</a>
<br/><br/>
<a href="content.php?alert=true" data-ajax-nav>AJAX NAV - ALERT</a>

<br/><br/>
<a href="content.php" data-ajax-nav="modal">AJAX NAV (json) - MODAL</a>
|
<a href="content.php" data-ajax-nav="modal-save">AJAX NAV (json) - MODAL WITH SAVE</a>
|
<a href="content.php?response=html&form=true" data-ajax-nav="modal" data-ajax-response="html">AJAX NAV (HTML) - MODAL</a>
|
<a href="content.php?response=html&form=true" data-ajax-nav="modal-save" data-ajax-response="html">AJAX NAV (HTML) - MODAL WITH SAVE</a>
|
<a href="content.php?response=html&form=true" data-ajax-nav="modal-save" data-ajax-response="html" data-ajax-push>AJAX NAV (HTML) MODAL SAVE STATE</a>
|
<a href="content.php?form2=true" data-ajax-nav="modal-save">(json) - MODAL SAVE - continue with modal</a>

<br/><br/>
<form method='post' action='content.php?form2=true' data-ajax-nav="modal-save">
<div class="itlk-form-control large form-group has-feedback">
    <label for="password" class="itlk-label">pass required</label>
    <input class="itlk-input login-input form-control" type="password" id="password" name="password" required data-required-error="Password is required" />
    <span class="fa form-control-feedback" aria-hidden="true"></span>
    <div class="help-block with-errors"></div>
</div>

<input type='submit' value='Submit modal'>
</form>

<br/><br/><br/><br/>
<h3>CONTAINER RESULT HERE (default)</h3>
<div id="container">default content here</div>
<br/><br/>
<h3>CONTAINER RESULT HERE (custom)</h3>
<div id="container-custom">default content here</div>

<script>
    function testingCallback(el) {
        alert('callback function: ' + $(el).data('ajax-callback'));
    }
</script>

</body>
</html>

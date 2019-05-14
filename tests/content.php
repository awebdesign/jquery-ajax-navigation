<?php
/**
 * Ajax navigation
 *
 * data-ajax-nav="modal|confirm|link" -> default link
 * data-ajax-response="html|json" -> default json
 * data-ajax-container=".class|#id" -> just for link, starts with # by default if . or # is not defined
 * data-ajax-confirm="Your message here"
 * data-ajax-push="true|false" -> default false
 */

$data = [
    "content"=> "<h1>AJAX CONTENT HERE ! Time: " . time() . "</h1>"
];

$response = isset($_GET['response']) ? $_GET['response'] : 'json';

if(isset($_GET['delay'])) {
    sleep((int) $_GET['delay']);
}

if(isset($_GET['redirect'])) {
    $data['redirect'] = "http://google.ro";
}

if(isset($_GET['alert'])) {
    $data['alert'] = "ALERT MODE ON!";
}

if(isset($_GET['link-in-link'])) {
    $data['content'] = '<a href="content.php" data-ajax-nav>AJAX NAV (json)- default container</a>';
}

if(isset($_GET['form'])) {
    $data['content'] = "<form method='post' id='form' action='content.php?form=true' data-ajax-nav data-ajax-container='form'><input name='test_field' value='" . time() . "' /><input type='submit' value='Submit field'></form>";
}

if(isset($_GET['form2'])) {
    $data['content'] = "<form method='post' id='form2' action='content.php?form2=true' data-ajax-nav data-ajax-container='form2' >
    <div class='itlk-form-control large form-group has-feedback'>
    <label for='password' class='itlk-label'>pass required</label>
    <input class='itlk-input login-input form-control' type='password' id='password' name='password' required data-required-error='Password is required' />
    <span class='fa form-control-feedback' aria-hidden='true'></span>
    <div class='help-block with-errors'></div>
    </div>
    <br/><br/><a href='content.php?response=html' data-ajax-nav='modal' data-ajax-response='html'>AJAX NAV (HTML) - NEW MODAL</a></form>";
}

if($_POST) {
    $data['content'] = $data['content'] . '<br/>' . print_r($_POST, 1);
}

if($response == 'json') {
    echo json_encode($data);
} else {
    echo $data['content'];
}

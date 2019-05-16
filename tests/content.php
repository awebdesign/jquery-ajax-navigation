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
    "content"=> "<h1>AJAX CONTENT HERE ! <span id='time-span'>Time: " . time() . "</span></h1>"
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
    $data['content'] = "<form method='post' id='form' action='content.php?form=true' data-ajax-nav data-ajax-container='parent'><input name='test_field' value='" . time() . "' /><input type='submit' value='Submit field'></form>";
}

if(isset($_GET['form2'])) {
    $data['content'] = "<form method='post' id='form2' action='content.php?form2=true' data-ajax-nav data-ajax-container='parent' >
    <div class='itlk-form-control large form-group has-feedback'>
    <label for='password' class='itlk-label'>pass required</label>
    <input class='itlk-input login-input form-control' type='password' id='password' name='password' required data-required-error='Password is required' />
    <span class='fa form-control-feedback' aria-hidden='true'></span>
    <div class='help-block with-errors'></div>
    </div>
    <br/><br/><a href='content.php?response=html' data-ajax-nav='modal' data-ajax-response='html'>AJAX NAV (HTML) - NEW MODAL</a></form>";
}

if(isset($_GET['form3'])) {
    $succes =''; //$succes = (isset($_POST['success']) && $_POST['success']) ? ' data-ajax-success' : '';
    $data['content'] = "<form method='post' id='form3' action='content.php?form3=true' data-ajax-nav data-ajax-replace='this' " . $succes .">" . time() ." Success ?<label><input type='radio' name='success' value='0' />No</label><label><input type='radio' name='success' value='1' checked />Yes</label></form>";
}

if(isset($_POST['success']) && $_POST['success'] || isset($_GET['success'])) {
    $data['success'] = true;
}


if($_POST) {
    $data['content'] = $data['content'] . '<br/>' . print_r($_POST, 1) . print_r(time(), 1);
}

/**
 * Ajax navigation
 *
 * data-ajax-nav="modal|confirm|link" -> default link
 * data-ajax-response="html|json" -> default json
 * data-ajax-container=".class|#id" -> just for link, starts with # by default if . or # is not defined
 * data-ajax-confirm="Your message here"
 * data-ajax-push="true|false" -> default false
 */

if($response == 'json') {
    echo json_encode($data);
} else {
    echo $data['content'];
}

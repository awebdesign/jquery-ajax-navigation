/*!
 * Ajax Navigation v1.0.0 for Bootstrap 3, by Aweb
 * Copyright 2019 Aweb
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/awebdesign/jquery-ajax-navigation
 *
 * data-ajax-nav="modal|confirm|link" -> default link
 * data-ajax-response="html|json" -> default json
 * data-ajax-container=".class|#id" -> just for link, starts with # by default if . or # is not defined
 * data-ajax-confirm="Your message here"
 * data-ajax-push="true|false" -> default false
 */

/* Cross-Site Request Forgery (CSRF) For Laravel Use */
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

if (window.An == undefined) window.An = {};
if (window.An.Mutations == undefined) window.An.Mutations = {};

An.Options = {
    nav: 'link',
    response: 'json',
    container: '#container',
    replace: null,
    confirm: 'Are you sure?',
    push: false,
    scroll: false,
    extract: null,
    trigger: null,
    callback: null,    
    //if An.validator is null the validation will be skipped
    validator: {
        feedback: {
            success: 'fa-check',
            error: 'fa-times'
        }
    },
    //if An.notify is null the notifications will not trigger anymore
    notify: {
        newest_on_top: true,
        z_index: 1100
    },
    buttons: {
        save: '<i class="fa fa-save"></i>',
        back: '<i class="fa  fa-check"></i>'
    }
};

//no overide allowed
An.Values = {
    el: null,
    parent: null,
    id: null,
    for: null,
    nodeName: null,
    method: 'GET',
    title: null,
    confirmed: false, //if this thing is true then it can pass the confirm modal box
    modal: false,
    url: null
};

/* Ajax Navigation Methods START */
An.Loader = function (options) {
    $(document).find('.an-overlay').remove();
    $(document).find('.an-overlay-container').removeClass('an-overlay-container');

    var loaderEl = options.replace ? options.replace : options.container;
    loaderEl = (loaderEl === null || options.nav != 'link') ? 'body' : loaderEl;

    $body = $(loaderEl);

    if($body.parents('.modal-content').length) {
        $body = $body.parents('.modal-content');
    }

    if($body.height() < 50 || $body.width() < 50) {
        $body = $('body');
    }

    $(document).on({
        ajaxStart: function() {
            $body.addClass('an-overlay-container');
            $body.append('<div class="an-overlay"><div class="an-overlay-loading"></div></div>');
        },
        ajaxStop: function() {
            $body.find('.an-overlay').remove();
            $body.removeClass('an-overlay-container');
        }
    });
}

An.GetDataset = function (el) {
    if(!el.attr('data-ajax-id')) {
        el.attr('data-ajax-id', An.CreateId()); //if the element has no ID, auto assign one
    }

    var options = $.extend({}, An.Options, An.Values);

    $.each(options, function(option, defaultOptionValue){
        var dataValue = originalValue = el.attr('data-ajax-' + option);
        if(typeof(dataValue) != 'undefined') {
            if(dataValue == '') {
                dataValue = true;
            }
        } else {
            dataValue = defaultOptionValue;
        }

        if(option) {
            switch(option) {                
                case 'id':
                case 'for':
                case 'parent':
                case 'callback':
                case 'validator':
                case 'notifications':
                case 'buttons':
                    break;
                case 'el':
                    if(!dataValue) {
                        dataValue = el;
                    }
                    break;
                case 'nav':
                    if(dataValue == true || (dataValue.toLowerCase() != 'modal' && dataValue.toLowerCase() != 'modal-save' && dataValue.toLowerCase() != 'confirm')) {
                        dataValue = defaultOptionValue;
                    }
                    break;
                case 'response':
                    var dataValue = dataValue.toLowerCase();
                    if(dataValue == true || dataValue.toLowerCase() != 'html') {
                        dataValue = defaultOptionValue;
                    } else {
                        dataValue = 'html';
                    }
                    break;
                case 'container':
                case 'replace':
                    if(dataValue && (!(dataValue.indexOf(".") >= 0) && !(dataValue.indexOf("#") >= 0))) {
                        switch(dataValue) {
                            case 'this':
                                dataValue = el;
                                break;
                            case 'parent':
                                dataValue = el.parent();
                                break;
                            default:
                                dataValue = '#' + dataValue;
                        }
                    }
                    break;
                case 'extract':
                case 'trigger':
                    if(dataValue && (!(dataValue.indexOf(".") >= 0) && !(dataValue.indexOf("#") >= 0))) {
                        dataValue = '#' + dataValue;
                    }
                    break;
                case 'push':
                case 'confirmed':
                case 'scroll':
                    dataValue = (dataValue && dataValue !== 'false') ? true : false;
                    break;                
                case 'modal':
                    var checkifModal = el.parents('.an-modal');
                    if(typeof checkifModal !== 'undefined') {
                        dataValue = checkifModal;

                        var forId = checkifModal.attr('data-ajax-for');
                        options.parent = $('[data-ajax-id="' + forId + '"]');

                        var trigger = options.parent.attr('data-ajax-trigger');
                        if(typeof trigger !== 'undefined') {
                            if(!(trigger.indexOf(".") >= 0) && !(trigger.indexOf("#") >= 0)) {
                                trigger = '#' + trigger;
                            }
                            options.trigger = trigger;
                        }
                    } else {
                        dataValue = false;
                    }
                break;
                case 'confirm':
                    if(typeof(originalValue) != 'undefined') {
                        if(dataValue == true) {
                            dataValue = defaultOptionValue;
                        }
                    } else {
                        dataValue = false;
                    }
                    break;                
                case 'title':
                    dataValue = el.attr(option);
                    if(!dataValue && typeof el.attr('href') != 'undefined') {
                        dataValue = el.text();
                    }
                    break;
                case 'nodeName':
                    dataValue = (typeof el.attr('href') != 'undefined') ? 'link' : 'form';
                break
                case 'url':
                    if(typeof el.attr('href') != 'undefined') {
                        dataValue = el.attr('href');
                    } else if(typeof el.attr('action') != 'undefined') {
                        dataValue = el.attr('action');
                    }

                    if(!dataValue) {
                        alert('URL is not defined for element: ' + options.id);
                    }
                    break
                default:
                    dataValue = el.attr(option);
            }
            if(typeof(dataValue) != 'undefined') {
                options[option] = dataValue;
            } else {
                options[option] = defaultOptionValue;
            }
        }
    });

    return options;
}

An.Load = function (el) {
    var options = An.GetDataset(el);

    if(options.confirm) {
        if(options.confirmed == false) {
            return An.Confirm(el);
        } else {
            el.removeAttr('data-ajax-confirmed');
        }
    }

    //if is a form serialize fields
    var formData = null;
    var hasFiles = false;
    if(options.nodeName == 'form') { //TODO: add this in the constructor!!!
        formData = new FormData();
        options.el.find('input, select, textarea').each(function(){
            var field = $(this);
            if(field.attr('type') == 'file') {
                var attr = (field.prop('files')) ? field.prop('files') : field.attr('files');
                formData.append(field.attr('name'), attr[0]);

                if(field.val().length) {
                    hasFiles = true;
                }
            } else {
                if(field.attr('type')=='checkbox' || field.attr('type')=='radio') {
                    if(field.filter(':checked').val()) {
                        formData.append(field.attr('name'), field.val());
                    }
                } else {
                    formData.append(field.attr('name'), field.val());
                }
            }
        });
    }
    
    An.Loader(options);

    $.ajax({
        type: options.method,
        url: options.url,
        cache: false,
        processData: false,
        contentType: false,
        dataType: options.response,
        data: formData,
        headers: {
            'Ajax-Navigation': true,
        },
        beforeSend: function (){
            //append file uploading bar
            if(hasFiles) {
                $('.inner').css('width', '300px');
                $('.inner span').append('<div id="progress"><span class="pbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></span><span class="percent"><b class="loadingProcent">0%</b></span><span class="elapsed">Start</span></div>');
            }
        },
        success: function (response) {
            An.ProcessOutput(options, response);
        },
        fail: function (xhr, status, error) {
            if(xhr.responseText) {
              An.ProcessOutput(options, {alert: xhr.responseText});
            }
        },
        xhr: function () {  // custom xhr
            var xhr = $.ajaxSettings.xhr();
            if(xhr.upload){ // check if upload property exists
                xhr.upload.addEventListener('progress',function (e){
                    if(e.lengthComputable){
                        var procent = parseInt(100 /(e.total *1 / e.loaded *1) *1);
                        if(e.total===e.loaded)
                            $('.elapsed').html('Finished');
                        else
                            $('.elapsed').html('Uploading');

                        $('.loadingProcent').html(procent+'%');
                        $('.ui-progressbar-value').css('width', procent+'%');
                    }
                }, false); // for handling the progress of the upload
            }
            return xhr;
        }
    });
}

An.ProcessOutput = function (options, response)
{
    if(options.response == 'json') {
        if(response.redirect){
            window.location = response.redirect;
            return true;
        } else if(response.alert) {
            return alert(response.alert);
        }

        if(options.modal != false && response.success) {
            An.CloseModal(options.modal);
        }
    } else {
        response = { content: response };
    }

    //LOAD CONTENT
    if(response.content) {
        if(options.nav == 'modal' || options.nav == 'modal-save') {
            An.CreateModal(options, response.content);
        } else {
            //if the cotnent is not for a modal box and the extract attribute is present then we will extract only what we need from the content
            if(options.extract) {
                var extractEl = $(response.content).find(options.extract);
                if(typeof extractEl !== 'undefined') {
                    response.content = extractEl.html();
                }
            }

            if(options.replace) {
                $(options.replace).replaceWith(response.content);
                options.container = options.replace; //for scroll option
            } else {
                $(options.container).html(response.content);
            }            

            if(options.scroll == true) {
                $('html, body').animate({
                    scrollTop: $(options.container).offset().top
                }, 500);
            }
        }

        if(options.modal) {
            var form = options.modal.find(' > form');
            if(typeof form !== 'undefined' && An.Options.validator) {
                form.validator(An.Options.validator);
            }
        }
    }

    //psh state
    An.Push(options);

    //show notifications
    if(response.notifications && An.Options.notify)
    {
        var notificationsTypes = ['success', 'info', 'warning', 'danger'];
        $.each(notificationsTypes, function(){
            var index = this;
            //in case we have just a single value
            if(typeof response.notifications[index] == 'string') {
                response.notifications[index] = new Array(response.notifications[index]);
            }

            $(response.notifications[index]).each(function(i, value){
                var notifyOptions = $.extend({}, An.Options.notify, {type: index});
                $.notify({
                    message: value                   
                }, notifyOptions);
            });
        });           
    }

    //call calback function if finish
    if(options.callback) {
        var arguments = [options, response];
        An.getFunction(options.callback, ["xhr"]).apply(options.el, arguments);
    }

    if(response.success && options.trigger) {
        return An.Load($(options.trigger));
    }
}

An.Confirm = function (el) {
    var options = An.GetDataset(el);
    el.removeAttr('data-ajax-confirmed'); //in case this el was confirmed previously ask again for permission
    An.CreateModal(options, options.confirm);
    return false;
}

An.Confirmed = function (modalId, forId) {
    //hide modal
    $('[data-ajax-id="' + modalId + '"]').modal('hide');

    var el = $('[data-ajax-id="' + forId + '"]');
    el.attr('data-ajax-confirmed', 'true');
    el.trigger('click');
}

var tabIndex = 0;
An.CreateModal = function (options, content) {
    var modalId = An.CreateId();

    //create modal
    html = '<div class="modal fade an-modal" id="' + modalId + '" data-ajax-id="' + modalId + '" data-ajax-for="' + options.id + '" tabindex="' + tabIndex + '" role="dialog" aria-labelledby="An-modalTitle" aria-hidden="true">';
        html += '<div class="modal-dialog" role="document" style="width: 50%;">';
            html += '<div class="modal-content">';
            if(options.title) {
                html += '<div class="modal-header">';
                    html += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
                    html += '<h4 class="modal-title">' + options.title + '</h4>';
                html += '</div>';
            }
            html += '<div class="modal-body">' + content + '</div>';
            if(options.confirm !== false) {
                html += '<div class="modal-footer">';
                html += '<button type="button" class="btn btn-secondary" data-dismiss="modal" style="margin-right: 7px;"><i class="fa fa-reply"></i></button>';
                html += '<button type="button" class="btn btn-primary" name="Confirm" onclick="An.Confirmed(\'' + modalId + '\'\, \'' + options.id + '\')">' + An.Options.buttons.back + '</button>';
                html += '</div>';
            } else if(options.nav == 'modal-save') {
                html += '<div class="modal-footer">';
                html += '<button type="button" class="btn btn-secondary" data-dismiss="modal" style="margin-right: 7px;"><i class="fa fa-reply"></i></button>';
                html += '<button type="button" class="btn btn-primary" name="Save" onclick="An.SubmitModalForm(\'#' + modalId + '\')">' + An.Options.buttons.save + '</button>';
                html += '</div>';
            }
            html += '</div>';
        html += '</div>';
    html += '</div>';

    $('body').prepend(html);
    $('#' + modalId).modal();

    tabIndex++;
}

An.CloseModal = function (modalId) {
    $(modalId).modal('hide');
}

An.SubmitModalForm = function (modalId) {
    var form = $(modalId).find('.modal-body > form');
    if(typeof form !== 'undefined') {
        form.submit();
    }
}

An.Push = function (options) {
    if(options.push) {
        var currentState = history.state;
        var newState =
        {
            url: options.url,
            title: options.title
        };
        if ((currentState == null) || (currentState.url != newState.url)) {
            history.pushState(newState, options.title, options.url);
            document.title = options.title;
        }
    }
}

An.CreateId = function () {
    return 'An-' + Math.random().toString(36).substring(7);
}

An.getFunction = function (code, argNames) {
    var fn = window, parts = (code || "").split(".");
    while (fn && parts.length) {
        fn = fn[parts.shift()];
    }
    if (typeof (fn) === "function") {
        return fn;
    }
    argNames.push(code);
    return Function.constructor.apply(null, argNames);
};

/* Ajax Navigation Methods END */

/* Ajax Navigation Helpers START */
$(window).bind('popstate', function (){
    window.location.href = window.location.href;
});

//Allow opening multiple bootstrap modal boxes
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function () {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});
/* Ajax Navigation Helpers END */

/* Mutations Observer START */
$(document).ready(function () {    
    for (var propertyName in An.Mutations) {
        var $elements = $(An.Mutations[propertyName].Selector);
        if ($elements.length > 0) {
            An.Mutations[propertyName].Apply($elements);
        }
    }

    // listen for future additions
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                var addedNodes = $(mutation.addedNodes);

                for (var propertyName in An.Mutations) {
                    var $elements = addedNodes.find(An.Mutations[propertyName].Selector)
                            .add(addedNodes.filter(An.Mutations[propertyName].Selector));
                    if ($elements.length > 0) {
                        An.Mutations[propertyName].Apply($elements);
                    }
                }
            }
        });
    });

    var config = { childList: true, characterData: true, subtree: true };

observer.observe(document, config);
});
/* Mutations Observer END */

/* Mutations Listeners START */
An.Mutations.AjaxNav = {
    Selector: '[data-ajax-nav]',
    Apply: function (elements) {
        $.each(elements, function (){
            if (typeof $(this).attr('href') == 'undefined') {
                if(An.Options.validator) {
                    $(this).validator(An.Options.validator).on('submit', function (e) {
                        if (!e.isDefaultPrevented()) {
                            e.preventDefault();
                            An.Load($(this));
                        }
                    });
                } else {
                    $(this).on('submit', function (e) {
                        if (!e.isDefaultPrevented()) {
                            e.preventDefault();
                            An.Load($(this));
                        }
                    });
                }
            } else {
                $(this).click(function (e) {
                    e.preventDefault();
                    An.Load($(this));
                });
            }
        });
    }
};

An.Mutations.AjaxConfirm = {
    Selector: '[data-ajax-confirm]',
    Apply: function (elements) {
        elements.click(function (e) {
            var el = $(this);
            if(!el.filter('[data-ajax-nav]')) { //if is not an ajax nav call
                e.preventDefault();
                An.Confirm(el);
            }
        });
    },
};
/* Mutations Listeners END */
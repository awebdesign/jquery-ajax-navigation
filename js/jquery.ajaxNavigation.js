
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
    confirm: 'Are you sure?',
    push: false,    
    scroll: false,
    extract: null,
    trigger: null,
    callback: null
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
An.Loader = function (el) {
    $body = $(el);    
    $(document).on({    
        ajaxStart: function() { 
            $body.append('<div class="overlay"></div>')
            $body.addClass("loading");
        },
        ajaxStop: function() {
            $body.find('.overlay').remove();
            $body.removeClass("loading"); 
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
                case 'callback':
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
                case 'id':
                case 'for':
                case 'parent':
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
            //loadingScreenStop();
            An.ProcessOutput(options, response);
        },
        fail: function (xhr, status, error) {
            //loadingScreenStop();

            if(xhr.responseText) {
              An.ProcessOutput(options, {alert: xhr.responseText});
            }
        },
        xhr: function () {  // custom xhr
            //loadingScreenStop();
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

            $(options.container).html(response.content);

            if(options.scroll == true) {
                $('html, body').animate({
                    scrollTop: $(options.container).offset().top
                }, 500);
            }
        }
    }

    //psh state
    An.Push(options);

    //show notifications
    if(response.notifications)
    {
        /*if(response.notifications.info) {
            $.jGrowl.defaults.theme = 'jGrowl-info';
            $(response.notifications.info).each(function(){
                $.jGrowl(this, { header: 'Info' });
            });
        }
        if(response.notifications.error) {
            $.jGrowl.defaults.theme = 'jGrowl-error';
            $(response.notifications.error).each(function(){
                $.jGrowl(this, { header: 'Error' });
            });
        }
        $.jGrowl.defaults.theme = 'default';*/
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
    //console.log('An.Confirm');
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
    //close old opened modal
    //$('.an-modal').modal('hide');
    var modalId = An.CreateId();
    /*var hasForm = $(content).find('> form');
    if(typeof hasForm !== 'undefined') {
        $(hasForm).attr('data-ajax-for', options.id);
        content = $(content).get(0).outerHTML;
    }*/

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
                html += '<button type="button" class="btn btn-primary" name="Confirm" onclick="An.Confirmed(\'' + modalId + '\'\, \'' + options.id + '\')"><i class="fa  fa-check"></i></button>';
                html += '</div>';
            } else if(options.nav == 'modal-save') {
                html += '<div class="modal-footer">';
                html += '<button type="button" class="btn btn-secondary" data-dismiss="modal" style="margin-right: 7px;"><i class="fa fa-reply"></i></button>';
                html += '<button type="button" class="btn btn-primary" name="Save" data-ajax-modal-save><i class="fa fa-save"></i></button>';
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

An.SubmitModalForm = function (el) {
    var form = el.parents('.modal-content').find('.modal-body form');
    if(typeof form !== 'undefined') {
        $(form).validator('update');
        form.submit();
    }
}

An.Push = function (options) {
    if(options.push) {
        var currentState = history.state;
        var newState =
        {
            url: options.href,
            title: options.title
        };
        if ((currentState == null) || (currentState.url != newState.url)) {
            history.pushState(newState, options.title, options.href);
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
    An.Loader('body');

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
                    var $elements = //addedNodes.filter(An.Mutations[propertyName].Selector);
                        addedNodes.find(An.Mutations[propertyName].Selector)
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
                $(this).validator({
                    feedback: {
                        success: 'fa-check',
                        error: 'fa-times'
                    }
                }).on('submit', function (e) {
                    if (!e.isDefaultPrevented()) {
                        e.preventDefault();
                        An.Load($(this));
                    }
                });
            } else {
                $(this).click(function (e) {
                    e.preventDefault();
                    An.Load($(this));
                });
            }
        });
    }
};

An.Mutations.AjaxModalSave = {
    Selector: '[data-ajax-modal-save]',
    Apply: function (elements) {
        elements.click(function (e) {
            An.SubmitModalForm($(this));
        });
    },
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
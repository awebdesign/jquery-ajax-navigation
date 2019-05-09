
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

if (window.An == undefined) window.An = {};
if (window.An.Mutations == undefined) window.An.Mutations = {};

An.Options = {
    nav: 'link',
    response: 'json',
    container: '#container',
    confirm: 'Are you sure?',
    push: false,
    callback: null,
};

//no overide allowed
An.Values = {
    el: null,
    action: null,
    method: 'GET',
    href: null,
    title: null
};

/* Ajax Navigation Methods START */
An.GetDataset = function (el) {
    var options = $.extend({}, An.Options, An.Values);

    $.each(options, function(option, defaultOptionValue){
        var dataValue = el.attr('data-ajax-' + option);
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
                        dataValue = '#' + dataValue;
                    }
                    break;
                case 'push':
                    dataValue = (dataValue && dataValue !== 'false') ? true : false;
                    break;
                case 'callback':
                    break;
                case 'title':
                    dataValue = el.attr(option);
                    if(!dataValue && typeof el.attr('href') != 'undefined') {
                        dataValue = el.text();
                    }
                    break;
                default:
                    dataValue = el.attr(option);
            }
            if(dataValue) {
                options[option] = dataValue;
            }
        }
    });

    return options;
}

An.Load = function(el) {
    var options = An.GetDataset(el);
    var url = options.href ? options.href : options.action;

    //if is a form serialize fields
    var formData = null;
    if(options.el.attr('href') === undefined) { //TODO: add this in the constructor!!!
        formData = new FormData();
        var hasFiles = false;
            options.el.find('input, select, textarea').each(function(){
            var field = $(this);
            if(field.attr('type') == 'file') {
                var attr = (field.prop('files')) ? field.prop('files') : field.attr('files');
                formData.append(field.attr('name'), attr[0]);

                if(field.val().length)
                    hasFiles = true;
            } else {
                if(field.attr('type')=='checkbox' || field.attr('type')=='radio') {
                    if(field.filter(':checked').val()) {
                        formData.append(field.attr('name'), field.val());
                    }
                } else
                    formData.append(field.attr('name'), field.val());
            }
        });
    }

    $.ajax({
        type: options.method,
        url: url,
        cache: false,
        processData: false,
        contentType: false,
        dataType: options.response,
        data: formData,
        headers: {
            'An-js': true,
        },
        beforeSend: function(){
            //append file uploading bar
            if(hasFiles) {
                $('.inner').css('width', '300px');
                $('.inner span').append('<div id="progress"><span class="pbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></span><span class="percent"><b class="loadingProcent">0%</b></span><span class="elapsed">Start</span></div>');
            }
        },
        success: function(response) {
            //loadingScreenStop();
            An.ProcessOutput(options, response);
        },
        fail: function(xhr, status, error) {
            //loadingScreenStop();

            if(xhr.responseText) {
              An.ProcessOutput(options, {alert: xhr.responseText});
            }
        }
    });
}

var tabIndex = 0;
An.ProcessOutput = function(options, response)
{
    if(options.response == 'json') {
        if(response.redirect){
            window.location = response.redirect;
            return true;
        } else if(response.alert) {
            return alert(response.alert);
        }
    } else {
        response = { content: response };
    }

    //LOAD CONTENT
    if(response.content) {
        //TO DO
        if(options.el.attr('href') === undefined) {
            $(options.el).validator('update');
            //console.log('TEST UPDATE VALIDATION');
        }

        if(options.nav == 'modal' || options.nav == 'modal-save') {
            //close old opened modal
            //$('#An-modal').modal('hide');
            var modalId = Math.random().toString(36).substring(7);
            console.log(modalId);
            //load modal
            html = '<div class="modal fade An-modal" id="' + modalId + '" tabindex="' + tabIndex + '" role="dialog" aria-labelledby="An-modalTitle" aria-hidden="true">';
                html += '<div class="modal-dialog" role="document" style="width: 50%;">';
                    html += '<div class="modal-content">';
                        html += '<div class="modal-body">' + response.content + '</div>';
                        if(options.nav == 'modal-save') {
                            html += '<div class="modal-footer">';
                            html += '<button type="button" class="btn btn-secondary" data-dismiss="modal" style="margin-right: 7px;"><i class="fa fa-reply"></i></button>';
                            html += '<button type="button" class="btn btn-primary" name="Save" data-ajax-modal-save><i class="fa fa-save"></i></button>';
                            html += '</div>';
                        }
            html += '</div></div></div>';
            $('body').prepend(html);
            $('#' + modalId).modal();
            tabIndex++;
        } else {
            $(options.container).html(response.content);

            $('html, body').animate({
                scrollTop: $(options.container).offset().top
            }, 500);
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
        An.getFunction(options.callback, []).apply(options.el, arguments);
    }
}

An.Push = function(options) {
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

//Allow opening multiple modal boxes
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});
/* Ajax Navigation Methods END */

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
    Apply: function(elements) {
        $.each(elements, function(){
            if ($(this).attr('href') === undefined) {
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
                $(this).click(function(e) {
                    e.preventDefault();
                    An.Load($(this));
                });
            }
        });
    }
};

An.Mutations.AjaxModalSave = {
    Selector: '[data-ajax-modal-save]',
    Apply: function(elements) {
        elements.click(function(e) {
            e.preventDefault();
            $(this).parent().parent().find('form').submit();
        });
    },
};
/* Mutations Listeners END */

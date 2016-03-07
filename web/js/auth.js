(function($){
    $(function(){
            function isEmail(value) {
                return value.match(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
            }

            function focus($field) {
                $field.focus();
                $field.trigger('click');
            }

            function error(error) {
                var form = {
                    containers : {
                        email:    $('[data-field=email]:visible').parent().length ? $('[data-field=email]').parent() : '',
                        text:     $('[data-field=text]:visible').parent().length ? $('[data-field=text]').parent() : '',
                        all:      $('[data-field]:visible').parent().length ? $('[data-field]').parent() : ''
                    },
                    fields: {
                        email:    $('[data-field=email]:visible').length ? $('[data-field=email]') : '',
                        select:   $('[data-field=select]:visible').length ? $('[data-field=select]') : '',
                        text:     $('[data-field=text]:visible').length ? $('[data-field=text]') : '',
                        all:      $('[data-field]:visible').length ? $('[data-field]') : ''
                    },
                    errors: {
                        email:    $('<span />', {class: 'helper'}).text('E-mail address is incorrect'),
                        select:   $('<span />', {class: 'helper'}).text('Please choose the value'),
                        text:     $('<span />', {class: 'helper'}).text('This is a required field'),
                        password: $('<span />', {class: 'helper'}).text('Password field is empty'),
                        placeholder: $('<span />', {class: 'helper'})
                    }
                };

                form.containers['all'].removeClass('error');
                switch (error) {
                    case 'wrong_email':
                        form.containers['email'].addClass('error');
                        form.containers['email'].find('.helper').text('Incorrect email');
                        break;
                    case 'wrong_password':
                        form.containers['text'].addClass('error');
                        form.containers['text'].find('.helper').text('Incorrect password');
                        break;
                    case 'disabled_email':
                        form.containers['email'].addClass('error');
                        form.containers['email'].find('.helper').text('This account is disabled');
                        break;
                    case 'check':
                        var valid = true;
                        //removing fields error msg before validate
                        if(form.containers['all']) form.containers['all'].find('.helper').hide();

                        if( form.fields['text'] ){
                            $.each(form.fields['text'], function(i, field){
                                if ( $(field).val() ){
                                        $(field).parent().find('.helper').hide();
                                } else {
                                        $(field).parent().addClass('error');
                                        if( $(field).attr('type') == 'password' ){
                                            $(field).parent().find('.helper').html( form['errors']['password'].html() ).show();
                                        } else {
                                            $(field).attr('data-error').length ? $(field).parent().find('.helper').html( $(field).attr('data-error') ).show() : $(field).parent().append( form['errors']['text'].clone() );
                                                //$(field).parent().append( form['errors']['placeholder'].clone().text( $(field).attr('data-error')) ).show();
                                        }
                                    valid = false;
                                }
                            });
                        }
                        if( form.fields['select'] ){
                            $.each(form.fields['select'], function(i, field){
                                if( !parseInt( $(field).find('option:selected').val().replace('_', '') , 10) ){
                                    $(field).parent().find('.helper').html( $(field).attr('data-error') ?  $(field).attr('data-error') : form['errors']['select'].html() ).show();
                                    valid = false;
                                }
                            });
                        }
                        if( form.fields['email'] ){
                            if (!isEmail(form.fields['email'].val())) {
                                form.containers['email'].addClass('error');
                                form.containers['email'].find('.helper').html( form['errors']['email'].html()).show();

                                    //focus( form.fields['email'] ); // call
                                valid = false;
                            } else {
                                form.containers['email'].find('.helper').hide();
                            }
                        }

                        // focus on first empty field
                        // need to check if email is valid
                        if(form.fields['all']) focusFirstEmptyField( form.fields['all'].first() );
                        return valid;

                    case 'forgot':
                        if (!isEmail(form.fields['email'].val())) {
                            form.containers['email'].addClass('error');
                            form.containers['email'].find('.helper').text('Is incorrect email address');
                                focus( form.fields['email'] ); // call
                            return false;
                        } else {
                            return true;
                        }
                        break;
                }
            }
/*
            $('[name=_email]').keydown(function (e) {
                if (e.keyCode == 13 && !$(this).parents('.forgot').length) {
                    if (isEmail($(this).val())) {
                        focus($('[name=_password]'))
                    }
                    return false;
                }
            });
            $('[name=_password]').keydown(function (e) {
                if (e.keyCode == 13) {
                    if (!$(this).val()) {
                        return false;
                    } else if (!isEmail($('[name=_email]').val())) {
                        focus($('[name=_email]'));
                        return false;
                    }
                }
            });
*/
            // need to check
            function focusFirstEmptyField(field){
                if( field.val() && field.closest('div').next().length){
                    focusFirstEmptyField( field.closest('div').next().find('input:not([type="checkbox"])') );
                } else {
                    focus(field);
                }
            }

            function focusField(field){
                field.focus();
                field.trigger('click');
            }

            function tryFocusNextField(container){
                var element = container.find('input');
                if( (element.attr('name') != 'email') || (  element.attr('name') == 'email' && isEmail(element.val())  ) ) {
                    container.next().find('[type=text]').length ? focusField(container.next().find('[type=text]')) : focusField(container.next().find('[type=submit]'));
                }
            }

            function focusNextField (array){
                array.each( function(i, field){
                    $(field).keydown(function (evt) {
                        var container = $(field).closest('div');
                        var focused = $(field).prop('tagName').toLowerCase();

                        if (evt.keyCode == 13 ) {
                            tryFocusNextField(container);
                            return false;
                        }
                    });
                });
            }

            if( $('form').length ){
                focusFirstEmptyField($('form input:visible').first());
            }

        $('.moodcount-form').submit(function (evt) {
                evt.preventDefault();
                var $form = $(this);
                if( $form.data('validate') && $form.data('validate') == 'no' ? true : error('check')  ){
                        var ajaxurl   = $('form').attr('action') != '#' ? $('form').attr('action') : '',
                            redirect = $('form').data('redirect');

                    // submit form via ajax
                        $.ajax({
                            type: $form.hasClass('auth-form') ? "POST" : "PUT",
                            url: ajaxurl,
                            data: $form.hasClass('auth-form') ?
                            {
                                _email:     $('#username').val(),
                                _password:  $('#password').val(),
                                _remember_email: $('#remember_email').prop('checked') ? 1 : 0
                            } :
                            {
                                firstName:  $('input[name="name"]').val(),
                                lastName:   $('input[name="lastname"]').val(),
                                birthday:   $('select[name="birthday"] option:selected').val(),
                                career:     $('select[name="career"] option:selected').val(),
                                fullTime:   $('select[name="fullTime"] option:selected').val(),
                                yearStartedWork:   $('select[name="yearStartedWork"] option:selected').val()
                            },
                            success: function(response){
                                $form.find('.hidden-span-from-submit-button').text('We sent you the email!');
                                $form.find('.hidden-span-from-submit-button').show();
                                $form.find('.spinner').hide();
                                $form.find('.spinner').children().hide();

                                
                                if( $form.hasClass('auth-form') ){
                                    if (response.success) {
                                        window.location = redirect;
                                    } else {
                                        // hide all errors
                                        $('form .helper').hide();
                                        $.each(Object.keys(response.errors), function(i, field){
                                            if( $('form').find('[name="'+ field +'"]').length ){
                                                $('form').find('[name="'+ field +'"]').next().html(response.errors[field]).show();
                                            }
                                        });
                                    }
                                } else{
                                    var txt = $('[type="submit"]').text();
                                    $('[type="submit"]').text(response);
                                    setTimeout(function() {
                                        $('[type="submit"]').text(txt);
                                    }, 2500);
                                }
                            }
                        });
                } else {
                    return false;
                }
            });
});
})(jQuery);
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');

    function Validation(form, options) {

        var $form = $(form);

        if ($form.length !== 1 || ($form[0] && $form[0].tagName !== 'FORM')) {
            throw new Error('传入的form参数无效');
        }

        // Check if a validator for this form was already created
        if ($form.data('validator')) {
            return $form.data('validator');
        }

        // Add novalidate tag if HTML5.
        $form.attr('novalidate', 'novalidate');
        $form.data('validator', this);
 
        this.$form = $form;

        this.options = options;

    }

    Validation.prototype = {

        constructor: Validation,

        // http://jqueryvalidation.org/validate/
        validate: function() {

            var options = this.options;
 
 
            if ( validator.settings.onsubmit ) {
 
                this.on( "click.validate", ":submit", function( event ) {
                    if ( validator.settings.submitHandler ) {
                        validator.submitButton = event.target;
                    }
 
                    // Allow suppressing validation by adding a cancel class to the submit button
                    if ( $( this ).hasClass( "cancel" ) ) {
                        validator.cancelSubmit = true;
                    }
 
                    // Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
                        validator.cancelSubmit = true;
                    }
                } );
 
                // Validate the form on submit
                this.on( "submit.validate", function( event ) {
                    if ( validator.settings.debug ) {
 
                        // Prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden, result;
                        if ( validator.settings.submitHandler ) {
                            if ( validator.submitButton ) {
 
                                // Insert a hidden input as a replacement for the missing submit button
                                hidden = $( "<input type='hidden'/>" )
                                    .attr( "name", validator.submitButton.name )
                                    .val( $( validator.submitButton ).val() )
                                    .appendTo( validator.currentForm );
                            }
                            result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
                            if ( validator.submitButton ) {
 
                                // And clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            if ( result !== undefined ) {
                                return result;
                            }
                            return false;
                        }
                        return true;
                    }
 
                    // Prevent submit for invalid forms or custom submit handlers
                    if ( validator.cancelSubmit ) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if ( validator.form() ) {
                        if ( validator.pendingRequest ) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                } );
            }
 
            return validator;
        },
 
        // http://jqueryvalidation.org/valid/
        valid: function() {
            var valid, validator, errorList;
 
            if ( $( this[ 0 ] ).is( "form" ) ) {
                valid = this.validate().form();
            } else {
                errorList = [];
                valid = true;
                validator = $( this[ 0 ].form ).validate();
                this.each( function() {
                    valid = validator.element( this ) && valid;
                    if ( !valid ) {
                        errorList = errorList.concat( validator.errorList );
                    }
                } );
                validator.errorList = errorList;
            }
            return valid;
        },
 
        // http://jqueryvalidation.org/rules/
        rules: function( command, argument ) {
            var element = this[ 0 ],
                settings, staticRules, existingRules, data, param, filtered;
 
            if ( command ) {
                settings = $.data( element.form, "validator" ).settings;
                staticRules = settings.rules;
                existingRules = $.validator.staticRules( element );
                switch ( command ) {
                case "add":
                    $.extend( existingRules, $.validator.normalizeRule( argument ) );
 
                    // Remove messages from rules, but allow them to be set separately
                    delete existingRules.messages;
                    staticRules[ element.name ] = existingRules;
                    if ( argument.messages ) {
                        settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
                    }
                    break;
                case "remove":
                    if ( !argument ) {
                        delete staticRules[ element.name ];
                        return existingRules;
                    }
                    filtered = {};
                    $.each( argument.split( /\s/ ), function( index, method ) {
                        filtered[ method ] = existingRules[ method ];
                        delete existingRules[ method ];
                        if ( method === "required" ) {
                            $( element ).removeAttr( "aria-required" );
                        }
                    } );
                    return filtered;
                }
            }
 
            data = $.validator.normalizeRules(
            $.extend(
                {},
                $.validator.classRules( element ),
                $.validator.attributeRules( element ),
                $.validator.dataRules( element ),
                $.validator.staticRules( element )
            ), element );
 
            // Make sure required is at front
            if ( data.required ) {
                param = data.required;
                delete data.required;
                data = $.extend( { required: param }, data );
                $( element ).attr( "aria-required", "true" );
            }
 
            // Make sure remote is at back
            if ( data.remote ) {
                param = data.remote;
                delete data.remote;
                data = $.extend( data, { remote: param } );
            }
 
            return data;
        }
    };

    module.exports = Validation;
});

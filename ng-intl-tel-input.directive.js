angular.module('ngIntlTelInput')
  .directive('ngIntlTelInput', ['ngIntlTelInput', '$log',
    function (ngIntlTelInput, $log) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attr, ctrl) {
                // Warning for bad directive usage.
                if (attr.type !== 'text' || elm[0].tagName !== 'INPUT') {
                    $log.warn('ng-intl-tel-input can only be applied to a *text* input');
                    return;
                }

                var opts = {};

                // Set opts specified with directive attribute
                if (attr.ngIntlTelInput &&
                    attr.$normalize(attr.ngIntlTelInput) !== 'ngIntlTelInput') {
                    opts = scope.$eval(attr.ngIntlTelInput);
                }

                // Override default country.
                if (attr.defaultCountry) {
                    opts.defaultCountry = attr.defaultCountry;
                }
                // Initialize.
                ngIntlTelInput.init(elm, opts);
                // Validation.
                ctrl.$validators.ngIntlTelInput = function (value) {
                    // if phone number is deleted / empty do not run phone number validation
                    if (value || elm[0].value.length > 0) {
                        var result = elm.intlTelInput("isValidNumber");
                        if (result) {
                            return true;
                        }

                        if (!opts.allowExtensions) {
                            return false;
                        }

                        // Get validation error to see if this is because an extension
                        // was entered
                        var error = elm.intlTelInput("isValidNumber")

                        if (error === intlTelInputUtils.validationError.IS_POSSIBLE) {
                            // Possible valid so considering valid
                            return true;
                        }

                        return false;

                    } else {
                        return true;
                    }
                };
                // Set model value to valid, formatted version.
                ctrl.$parsers.push(function (value) {
                    var extension = elm.intlTelInput('getExtension');
                    return elm.intlTelInput('getNumber').replace(/[^\d]/, '') + (extension ? 'x' + extension : '');
                });
                // Set input value to model value and trigger evaluation.
                ctrl.$formatters.push(function (value) {
                    if (value) {
                        if (value.charAt(0) !== '+') {
                            value = '+' + value;
                        }
                        elm.intlTelInput('setNumber', value);

                        // Update value to number formatted by plugin
                        value = elm.val();
                    }
                    return value;
                });
            }
        };
    }]);
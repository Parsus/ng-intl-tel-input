angular.module('ngIntlTelInput')
  .provider('ngIntlTelInput', ['lodash', function (_) {
      var me = this;
      var props = {};
      var setFn = function (obj) {
          if (typeof obj === 'object') {
              for (var key in obj) {
                  props[key] = obj[key];
              }
          }
      };
      me.set = setFn;

      me.$get = ['$log', function ($log) {
          return Object.create(me, {
              init: {
                  value: function (elm, opts) {
                      if (!window.intlTelInputUtils) {
                          $log.warn('intlTelInputUtils is not defined. Formatting and validation will not work.');
                      }
                      elm.intlTelInput(_.defaults(opts, {}, props));
                  }
              },
          });
      }];
  }]);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global['statickit-react'] = {}, global.React));
}(this, function (exports, React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function ValidationError(props) {
    const {
      prefix,
      field,
      errors,
      ...attrs
    } = props;
    const error = (errors || []).find(error => {
      return error.field == field;
    });

    if (!error) {
      return null;
    }

    return React__default.createElement("div", attrs, prefix, " ", error.message);
  }

  function useForm(id, apiUrl) {
    const [submitting, setSubmitting] = React.useState(false);
    const [succeeded, setSucceeded] = React.useState(false);
    const [errors, setErrors] = React.useState([]);

    const submit = e => {
      const form = e.target;
      const url = (apiUrl || 'https://api.statickit.com') + '/j/forms/' + id + '/submissions';
      e.preventDefault();
      setSubmitting(true);
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: new FormData(form)
      }).then(response => {
        response.json().then(data => {
          switch (response.status) {
            case 200:
              setSucceeded(true);
              break;

            case 422:
              setSucceeded(false);
              setErrors(data.errors);
              break;

            default:
              setSucceeded(false);
              break;
          }
        });
      }).catch(error => {
        setSucceeded(false);
      }).finally(() => {
        setSubmitting(false);
      });
    };

    return [submit, submitting, succeeded, errors];
  }

  exports.ValidationError = ValidationError;
  exports.useForm = useForm;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

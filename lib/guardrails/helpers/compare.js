/* eslint-disable no-eval, no-console */
export default function (instance) {
  instance.registerHelper('eq', function (arg1, arg2) {
    return arg1 === arg2;
  });

  instance.registerHelper('neq', function (arg1, arg2) {
    return arg1 !== arg2;
  });

  instance.registerHelper('gt', function (arg1, arg2) {
    return arg1 > arg2;
  });

  instance.registerHelper('lt', function (arg1, arg2) {
    return arg1 < arg2;
  });

  instance.registerHelper('nullOrEmpty', function (value) {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  instance.registerHelper('null', function (value) {
    return value === null || value === undefined;
  });

  instance.registerHelper('or', function () {
    let args = Array.prototype.slice.call(arguments);

    for (let i = 0; i < args.length - 1; i++) {
      if (args[i]) {
        return true;
      }
    }

    return false;
  });

  instance.registerHelper('and', function () {
    let args = Array.prototype.slice.call(arguments);

    for (let i = 0; i < args.length - 1; i++) {
      if (!args[i]) {
        return false;
      }
    }

    return true;
  });

  instance.registerHelper('add', function (num1, num2) {
    // Check if both parameters are numbers
    if (typeof num1 === 'number' && typeof num2 === 'number') {
      // Perform addition
      return num1 + num2;
    } else {
      // If one or both parameters are not numbers, return an error message
      return 'Error: Both parameters must be numbers';
    }
  });

  instance.registerHelper('subtract', function (num1, num2) {
    // Check if both parameters are numbers
    if (typeof num1 === 'number' && typeof num2 === 'number') {
      // Perform subtraction
      return num1 - num2;
    } else {
      // If one or both parameters are not numbers, return an error message
      return 'Error: Both parameters must be numbers';
    }
  });
}

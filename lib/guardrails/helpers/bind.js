/* eslint-disable no-eval, no-console */

export default function (instance) {
  let bindHandles = [];

  instance.registerHelper('bind', function (prop) {
    bindHandles.push({
      prop: prop,
      data: this,
    });
    let index = bindHandles.length - 1;
    return `data-bind='${index}'`;
  });
}

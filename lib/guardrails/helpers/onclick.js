/* eslint-disable no-eval, no-console */

export default function (instance) {
  let onclickHandles = [];
  let base = this;

  instance.registerHelper('onclick', function (fn, redraw) {
    if (typeof base[fn] === 'function') {
      onclickHandles.push({
        fn: base[fn].bind(base),
        redraw: typeof redraw === 'boolean' ? redraw : true,
        data: this,
      });

      let index = onclickHandles.length - 1;
      return `data-onclickhandler='${index}'`;
    } else {
      console.error(`Error: Method ${fn} does not exist on the class.`);
      return '';
    }
  });
}

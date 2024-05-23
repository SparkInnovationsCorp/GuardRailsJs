/* eslint-disable no-eval, no-console */
export default function (instance) {
  let base = this;

  instance.registerHelper('exec', function (fn) {
    if (typeof base[fn] === 'function') {
      let funct = base[fn].bind(base);
      return funct(this);
    } else {
      console.error(`Error: Method ${fn} does not exist on the class.`);
      return '';
    }
  });
}

/* eslint-disable no-console */

class Dumper {
  static get MODE() {
    return {
      PATH: 1,
      LAST_ELEMENT: 2,
    };
  }

  constructor(maxDepth = 10, dumpMode = Dumper.MODE.LAST_ELEMENT) {
    this.stack = [];
    this.maxDepth = maxDepth;
    this.dumpMode = dumpMode;
  }

  static getClassAttr($) {
    if (!$.attribs) return '';
    if (!$.attribs.class) return '';
    return `.${$.attribs.class.replace(/ +/g, '&')}`;
  }

  printPath() {
    if (!this.stack.length) return;
    const str = this.stack.map(x => `${x.name}${Dumper.getClassAttr(x)}`).join(', ');
    console.log(str);
  }

  printLastElement() {
    if (!this.stack.length) return;
    const prefix = this.stack.map(() => ' ').join('');
    const x = this.stack[this.stack.length - 1];
    const str = `${prefix}${x.name}${Dumper.getClassAttr(x)}`;
    console.log(str);
  }

  dump($, depth = 0) {
    if (this.dumpMode === Dumper.MODE.LAST_ELEMENT) {
      this.printLastElement();
    } else {
      this.printPath();
    }
    if (!$.children || $.children.length === 0) return;
    if (depth === this.maxDepth) return;
    $.children.forEach((x) => {
      if (x.type === 'text') return;
      this.stack.push(x);
      this.dump(x, depth + 1);
      this.stack.pop();
    });
  }
}

module.exports = {
  Dumper,
};

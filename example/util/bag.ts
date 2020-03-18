export class Bag {
  content: any;

  constructor(values: any = {}) {
    this.content = values;
  }

  static of(values) {
    return new Bag(values);
  }

  getBase = (key: string, create: boolean = false): [any, string] => {

    const keys = key.split('.');

    if(keys.length < 2) {
      return [this.content, keys[0]];
    } else {
      let base = this.content;

      while (keys.length > 1) {
        let current = base[keys[0]];

        if (current === undefined) {
          if (create ) {
            current = base[keys[0]] = {};
          } else {
            return [{}, keys.pop() || ''];
          }
        }

        base = current;
        keys.shift();
      }

      return([base, keys[0]]);
    }
  };

  getValue = (key: string): any => {
    const [base, attribute] = this.getBase(key);

    return base[attribute];
  };

  setValue = (key: string, value: any) => {
    const [base, attribute] = this.getBase(key, true);

    base[attribute] = value;
  };
}

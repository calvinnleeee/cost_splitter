// Store a person's name and a list of booleans indicating what
// items they are paying for.
export class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

}

// Store an item's name, price, and whether it is subject to GST and PST.
export class Item {
  name: string;
  price: number;
  gst: boolean;
  pst7: boolean;
  pst10: boolean;
  payers: Person[];

  constructor(name: string) {
    this.name = name;
    this.price = 0;
    this.gst = false;
    this.pst7 = false;
    this.pst10 = false;
    this.payers = [];
  }

  getPrice() {
    return this.price
      + (this.gst ? this.price * 0.05 : 0)
      + (this.pst7 ? this.price * 0.07 : 0)
      + (this.pst10 ? this.price * 0.10 : 0);
  }

  getTax() {
    return (this.gst ? this.price * 0.05 : 0)
      + (this.pst7 ? this.price * 0.07 : 0)
      + (this.pst10 ? this.price * 0.10 : 0);
  }

  getGST() {
    return this.gst ? this.price * 0.05 : 0;
  }

  getPST() {
    return (this.pst7 ? this.price * 0.07 : 0) + (this.pst10 ? this.price * 0.10 : 0);
  }
}

export interface State {
  people: Person[],
  items: Item[],
}
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
  pst: boolean;
  payers: Person[];

  constructor(name: string) {
    this.name = name;
    this.price = 0;
    this.gst = false;
    this.pst = false;
    this.payers = [];
  }
}

export interface State {
  people: Person[],
  items: Item[],

  // constructor() {
  //   this.people = [];
  //   this.items = [];
  // }

  // Add a new person and make their items array the same length as the number of items tracked.
  // addPerson(name: string) {
  //   this.people.push(new Person(name));
  // },

  // Remove a person from the list.
  // deletePerson(person: Person) {
  //   this.people = this.people.filter((p) => p !== person);
  // },

  // Add a new item and make the items array of each person the same length as the number of items tracked.
  // addItem(name: string) {
  //   this.items.push(new Item(name));
  // },

  // Remove an item from the list.
  // deleteItem(item: Item) {
  //   this.items = this.items.filter((i) => i !== item);
  //   this.people.forEach((person) => {
  //     person.items = person.items.filter((i) => i !== item);
  //   });
  // },

  // getLength() {
  //   console.log(`len: ${this.people.length}`);
  // },

  // getNames() {
  //   this.people.forEach((person) => {
  //     console.log(person.name);
  //   });
  // },
}
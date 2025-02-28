// Store a person's name and a list of booleans indicating what
// items they are paying for.
export class Person {
  name: string;
  items: boolean[];

  constructor(name: string) {
    this.name = name;
    this.items = [];
  }

}

// Store an item's name, price, and whether it is subject to GST and PST.
export class Item {
  name: string;
  price: number;
  gst: boolean;
  pst: boolean;

  constructor(name: string) {
    this.name = name;
    this.price = 0;
    this.gst = false;
    this.pst = false;
  }
}

export const State = {
  people: [] as Person[],
  items: [] as Item[],

  // constructor() {
  //   this.people = [];
  //   this.items = [];
  // }

  // Add a new person and make their items array the same length as the number of items tracked.
  addPerson(name: string) {
    this.people.push(new Person(name));
    while (this.people[this.people.length - 1].items.length < this.items.length) {
      this.people[this.people.length - 1].items.push(false);
    }
  },

  // Remove a person from the list.
  deletePerson(person: Person) {
    this.people = this.people.filter((p) => p !== person);
  },

  // Add a new item and make the items array of each person the same length as the number of items tracked.
  addItem(name: string) {
    this.items.push(new Item(name));
    this.people.forEach((person) => {
      while (person.items.length < this.items.length) {
        person.items.push(false);
      }
    });
  },

  // Remove an item from the list.
  deleteItem(item: Item) {
    let idx = this.items.indexOf(item);
    this.items = this.items.filter((i) => i !== item);
    this.people.forEach((person) => {
      person.items = person.items.filter((_, index) => index !== idx);
    });
  },

  getLength() {
    console.log(`len: ${this.people.length}`);
  },
}
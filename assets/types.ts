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

  // Add a new person and make their items array the same length as the number of items tracked.
  addPerson: (name: string) => {
    State.people.push(new Person(name));
    while (State.people[State.people.length - 1].items.length < State.items.length) {
      State.people[State.people.length - 1].items.push(false);
    }
  },

  // Remove a person from the list.
  deletePerson: (person: Person) => {
    State.people = State.people.filter((p) => p !== person);
  },

  // Add a new item and make the items array of each person the same length as the number of items tracked.
  addItem: (name: string) => {
    State.items.push(new Item(name));
    State.people.forEach((person) => {
      while (person.items.length < State.items.length) {
        person.items.push(false);
      }
    });
  },

  // Remove an item from the list.
  deleteItem: (item: Item) => {
    let idx = State.items.indexOf(item);
    State.items = State.items.filter((i) => i !== item);
    State.people.forEach((person) => {
      person.items = person.items.filter((_, index) => index !== idx);
    });
  },

  
}
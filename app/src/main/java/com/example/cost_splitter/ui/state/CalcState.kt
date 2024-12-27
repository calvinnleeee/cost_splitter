package com.example.cost_splitter.ui.state

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.example.cost_splitter.ui.data.Item

class CalcState: ViewModel() {
    // state list of people and their assigned items
    var people = mutableStateListOf<MutableList<Boolean>>()

    // state list of items (price, gst applied?, pst applied?)
    var items = mutableStateListOf<Item>()

    // function to clear the items
    fun clearItems() {
        items.clear()
    }

    // function to reset the number of people
    fun clearPeople() {
        people.clear()
    }

    // add person
    fun addPerson() {
        people.add(mutableListOf<Boolean>())
        while (people.last().size != items.size) {
            people.last().add(false)
        }
    }

    // remove person
    fun removePerson(person: MutableList<Boolean>) {
        people.remove(person)
    }

    // add item (initially 0.00, no taxes applied)
    fun addItem() {
        // add item and update the people to have an extra row of booleans
        val newItem = Item(
            mutableStateOf<String>("item${items.size + 1}"),
            mutableStateOf<Float>(0.00F),
            mutableStateOf(false),
            mutableStateOf(false)
        )
        items.add(newItem)
    }

    // remove item
    fun removeItem(item: Item) {
        val row_to_remove = items.indexOf(item)
        items.remove(item)
        // remove the row corresponding to this item in every person's list
        for (person in people) {
            person.removeAt(row_to_remove)
        }
    }
}
package com.example.cost_splitter.ui.state

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel

class CalcState: ViewModel() {
    // state list of people and their assigned items
    var people = mutableStateListOf<MutableList<Boolean>>()

    // state list of items (Triple of price, gst (5%), pst (7%))
    var items = mutableStateListOf<Triple<Float, Boolean, Boolean>>()

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
    fun removePerson(idx: Int) {

    }

    // add item (initially 0.00, no taxes applied)
    fun addItem() {
        // add item and update the people to have an extra row of booleans
    }

    // remove item
    fun removeItem(idx: Int) {
        // remove item at idx, remove the row from people
    }
}
package com.example.cost_splitter

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.cost_splitter.ui.composables.PersonPopup
import com.example.cost_splitter.ui.composables.PersonRow
import com.example.cost_splitter.ui.data.Person

@Composable
fun PeopleScreen(navCtrl: NavController, vm: MyViewModel) {
    /*
        Show and manage the people to be included in the bill.
        Allow people to be assigned to different items for uneven splits.
        Displays checkboxes for each person equal to the number of items
        on the bill.
     */
    val calcState = vm.calcState

    // variables for managing the popup edit window
    var popup by remember{ mutableStateOf(false) }
    var person_to_edit = remember { mutableStateOf<Person?>(null) }
    val togglePopup = fun () {
        popup = !popup
    }
    // function assigns the current item clicked to the holder for editing
    val popupCallback = fun (person: Person) {
        person_to_edit.value = person
        togglePopup()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.LightGray),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(30.dp))

        // header for the window
        Text(
            "Manage people",
            modifier = Modifier
                .width(200.dp)
                .padding(vertical = 4.dp),
            fontSize = 24.sp,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(20.dp))

        // display no item message if no one has been added yet
        if (calcState.people.size == 0) {
            Text(
                "No people currently added.",
                modifier = Modifier.height(30.dp)
            )
        } else {
            Spacer(Modifier.height(30.dp))
        }

        // lazy column to provide scrolling
        // show a list of all people and the + button
        Box(
            modifier = Modifier.fillMaxWidth()
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxWidth().padding(bottom = 50.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                items(calcState.people.size) { idx ->
                    // callback for removing person from list
                    val removeCallback = fun(person: Person) {
                        calcState.removePerson(person)
                    }

                    PersonRow(calcState.people[idx], removeCallback, popupCallback)
                }
            }

            // row with the add button
            Row(
                modifier = Modifier.height(50.dp).align(Alignment.BottomCenter)
            ) {
                Button(
                    onClick = {
                        calcState.addPerson()
                    },
                    colors = ButtonDefaults.buttonColors().copy(containerColor = Color.Transparent)
                ) {
                    Icon(
                        Icons.Default.Add,
                        contentDescription = null,
                        tint = Color.Black
                    )
                }
            }
        }

        // display popup when enabled
        if (popup) {
            if (person_to_edit.value != null) {
                PersonPopup(person_to_edit.value, calcState.items, togglePopup)
            }
        }
    }
}
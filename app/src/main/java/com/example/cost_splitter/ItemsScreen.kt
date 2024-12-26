package com.example.cost_splitter

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
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
import com.example.cost_splitter.ui.composables.ItemPopup
import com.example.cost_splitter.ui.composables.ItemRow
import com.example.cost_splitter.ui.data.Item

@Composable
fun ItemsScreen(navCtrl: NavController, vm: MyViewModel) {
    /*
        Show the items currently added and checkboxes for each one to apply
        gst or hst.
        Display buttons for removing an individual item and adding items.
        Item names/bars can be clicked to change the price.
     */
    val calcState = vm.calcState

    // variables for managing the popup edit window
    var popup by remember{ mutableStateOf(false) }
    var item_to_edit = remember { mutableStateOf<Item?>(null) }
    val togglePopup = fun () {
        popup = !popup
    }
    // function assigns the current item clicked to the holder for editing
    val popupCallback = fun (item: Item) {
        item_to_edit.value = item
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
            "Manage items",
            modifier = Modifier
                .width(200.dp)
                .padding(vertical = 4.dp),
            fontSize = 24.sp,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(20.dp))

        // add section to show totals here if there are items in the list

        // display table headers if items exist, otherwise an empty spacer
        if (calcState.items.size == 0) {
            Text(
                "No items currently added.",
                modifier = Modifier.height(30.dp)
            )
        } else {
            // Row of text (name, price, GST, PST, blank column for remove button)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(30.dp)
                    .padding(bottom = 5.dp)
            ) {
                Text(
                    "Item",
                    modifier = Modifier.width(150.dp),
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center
                )
                Text(
                    "Price",
                    modifier = Modifier.width(100.dp),
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center
                )
                Text(
                    "GST",
                    modifier = Modifier.width(50.dp),
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center
                )
                Text(
                    "PST",
                    modifier = Modifier.width(50.dp),
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center
                )
                Spacer(Modifier.width(50.dp))
            }
        }

        // lazy column to provide scrolling
        // show a list of all items
        LazyColumn(
            modifier = Modifier.fillMaxWidth()
        ) {
            items(calcState.items.size) { idx ->
                // callback for removing item from list
                val removeCallback = fun (item: Item) {
                    calcState.removeItem(item)
                }

                ItemRow(calcState.items[idx], removeCallback, popupCallback)
            }
        }

        // row with the add button
        Row(
            modifier = Modifier.height(40.dp)
        ) {
            Button(
                onClick = {
                    calcState.addItem()
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

        if (popup) {
            Log.i("info", "item to edit is ${item_to_edit.value}")
            if (item_to_edit.value != null) {
                ItemPopup(item_to_edit.value, togglePopup)
            }
        }
    }
}
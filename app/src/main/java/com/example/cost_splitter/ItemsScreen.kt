package com.example.cost_splitter

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.runtime.mutableFloatStateOf
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
        gst or pst.
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

    // variables for keeping track of totals
    var pretax by remember{ mutableFloatStateOf(0F) }
    var gstTotal by remember{ mutableFloatStateOf(0F) }
    var pstTotal by remember{ mutableFloatStateOf(0F) }
    val updateTotals = fun() {
        pretax = 0F
        gstTotal = 0F
        pstTotal = 0F
        for (item in calcState.items) {
            pretax += item.price.value
            if (item.gst.value) gstTotal += (item.price.value * 0.05F)
            if (item.pst.value) pstTotal += (item.price.value * 0.10F)
        }
    }
    updateTotals()

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

        // display totals (pretax, gst, pst) here if there are items in the list
        if (calcState.items.size > 0) {
            Row(
                modifier = Modifier.height(25.dp).fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Text(
                    "Pretax:  ${"%.2f".format(pretax)}",
                    modifier = Modifier.width(120.dp),
                    fontSize = 16.sp
                )
                Text(
                    "GST:  ${"%.2f".format(gstTotal)}",
                    modifier = Modifier.width(100.dp),
                    fontSize = 16.sp
                )
                Text(
                    "PST:  ${"%.2f".format(pstTotal)}",
                    modifier = Modifier.width(100.dp),
                    fontSize = 16.sp
                )
            }
            Spacer(Modifier.height(20.dp))
        }

        // display table headers if items exist, otherwise an empty spacer
        if (calcState.items.size == 0) {
            Text(
                "No items currently added.",
                modifier = Modifier.height(30.dp)
            )
        } else {
            // Row of text (name, price, GST, PST, blank column to space for remove button)
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
        // show a list of all items and the + button
        Box(
            modifier = Modifier.fillMaxWidth()
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxWidth().padding(bottom = 50.dp)
            ) {
                items(calcState.items.size) { idx ->
                    // callback for removing item from list
                    val removeCallback = fun(item: Item) {
                        calcState.removeItem(item)
                        updateTotals()
                    }

                    ItemRow(calcState.items[idx], removeCallback, popupCallback, updateTotals)
                }
            }

            // row with the add button
            Row(
                modifier = Modifier.height(50.dp).align(Alignment.BottomCenter)
            ) {
                Button(
                    onClick = {
                        calcState.addItem()
                        updateTotals()
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

        if (popup) {
            if (item_to_edit.value != null) {
                ItemPopup(item_to_edit.value, togglePopup, updateTotals)
            }
        }
    }
}
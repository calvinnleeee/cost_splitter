package com.example.cost_splitter

import androidx.collection.mutableFloatListOf
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import com.example.cost_splitter.ui.composables.HomeRow
import com.example.cost_splitter.ui.composables.TipPopup
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun Home(navCtrl: NavController, viewModel: MyViewModel) {
    /*
        Screen used for displaying amounts owed for each person and
        the total amount of the bill (used to double check that you entered
        the item prices and taxes correctly.
     */
    val calcState: CalcState = viewModel.calcState

    // variables for managing the popup edit window
    var popup by remember{ mutableStateOf(false) }
    val togglePopup = fun () {
        popup = !popup
    }
    // function assigns the current item clicked to the holder for editing
    val popupCallback = fun () {
        togglePopup()
    }
    // callback function to set the tip percentage from the popup
    val tipCallback = fun(pct: Int) {
        calcState.updateTip(pct)
    }

    // calculate the costs
    val costs = mutableFloatListOf()
    var split_total = 0F
    var bill_total = 0F
    var tip_total = 0F
    for (i in 0..<calcState.items.size) {
        val base_cost = calcState.items[i].price.value
        val item_gst = if (calcState.items[i].gst.value) base_cost * 0.05F else 0F
        val item_pst = if (calcState.items[i].pst.value) base_cost * 0.1F else 0F
        val total_cost = (base_cost + item_gst + item_pst) * (1F + (calcState.tip_pct.intValue.toFloat() / 100))

        // update bill total
        bill_total += total_cost

        // update tip total
        tip_total += (base_cost + item_gst + item_pst) * (calcState.tip_pct.intValue.toFloat() / 100)

        // count the number of people splitting the current item
        var num_people = 0
        for (j in 0..<calcState.people.size) {
            if (calcState.people[j].items[i]) num_people += 1
        }
        val per_cost = if (num_people != 0) total_cost / num_people else 0F
        costs.add(per_cost)

        // update the total split costs
        split_total += (per_cost * num_people)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.LightGray)
            .padding(horizontal = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(30.dp))

        // header for the window
        Text(
            "Definitely not Splitwise",
            modifier = Modifier
                .width(250.dp)
                .padding(vertical = 4.dp),
            fontSize = 36.sp,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(30.dp))

        // display messages to user if no items and/or no people are added yet
        if (calcState.items.size == 0 && calcState.people.size == 0) {
            Text(
                "No items or people currently added",
                modifier = Modifier.height(30.dp),
                fontSize = 20.sp
            )
        } else if (calcState.people.size == 0) {
            Text(
                "No people currently added",
                modifier = Modifier.height(30.dp),
                fontSize = 20.sp
            )
        } else if (calcState.items.size == 0) {
            Text(
                "No items currently added",
                modifier = Modifier.height(30.dp),
                fontSize = 20.sp
            )
        } else {
            // display each person's amount owed and the totals
            /*
                Structure:
                names: amts
                sum of amts (to check total)
                gst: amt
                pst: amt
                total amt (taxes + total to check with bill)
             */
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight()
            ) {
                // lazy column for the rows
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 100.dp), // padding for bottom display
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // row for each person, showing their owed amounts
                    items(calcState.people.size) { idx ->
                        HomeRow(calcState.people[idx], costs)
                    }
                }

                // bottom sticky box to show totals and tips
                Row(
                    Modifier
                        .height(110.dp)
                        .align(Alignment.BottomCenter)
                ) {
                    // left column for taxes and tip button
                    Column(
                        Modifier.fillMaxWidth(0.5F).fillMaxHeight(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Bottom
                    ) {
                        // button to manage tips
                        Button(
                            onClick = {
                                // tip popup
                                popupCallback()
                            },
                            colors = ButtonDefaults.buttonColors().copy(
                                containerColor = Color.White,
                                contentColor = Color.LightGray
                            ),
                            modifier = Modifier.height(40.dp)
                        ) {
                            Text(
                                "Tip: ${calcState.tip_pct.intValue}%",
                                fontSize = 14.sp,
                                modifier = Modifier.width(60.dp)
                            )
                        }
                        Spacer(Modifier.height(10.dp))

                        var gst = 0F
                        for (item in calcState.items) {
                            if (item.gst.value) gst += (item.price.value * 0.05F)
                        }
                        Text(
                            "GST: $%.2f".format(gst),
                            fontSize = 15.sp,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(10.dp))
                        var pst = 0F
                        for (item in calcState.items) {
                            if (item.pst.value) pst += (item.price.value * 0.1F)
                        }
                        Text(
                            "PST: $%.2f".format(pst),
                            fontSize = 15.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                    // right column for tip, bill, and split total
                    Column(
                        Modifier.fillMaxWidth().fillMaxHeight(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Bottom
                    ) {
                        Text(
                            "Tip: $%.2f".format(tip_total),
                            fontSize = 15.sp,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(10.dp))
                        Text(
                            "Split total: $%.2f".format(split_total),
                            fontSize = 15.sp,
                            color = if (split_total == bill_total) Color.Green else Color.Red,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(10.dp))
                        Text(
                            "Bill total: $%.2f".format(bill_total),
                            fontSize = 15.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    }
    if (popup) {
        TipPopup(calcState.tip_pct.intValue, togglePopup, tipCallback)
    }
}

package com.example.cost_splitter

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.cost_splitter.ui.composables.HomeRow
import com.example.cost_splitter.ui.composables.TopBar
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun Home(navCtrl: NavController, viewModel: MyViewModel) {
    /*
        Screen used for displaying amounts owed for each person and
        the total amount of the bill (used to double check that you entered
        the item prices and taxes correctly.
     */
    val calcState: CalcState = viewModel.calcState

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Gray)
            .padding(horizontal = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(30.dp))

        // header for the window
        Text(
            "Definitely not Splitwise",
            modifier = Modifier
                .width(200.dp)
                .padding(vertical = 4.dp),
            fontSize = 36.sp,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(20.dp))

        // display messages to user if no items and/or no people are added yet
        if (calcState.items.size == 0 && calcState.people.size == 0) {
            Text(
                "No items or people currently added",
                modifier = Modifier.height(30.dp),
                fontSize = 20.sp
            )
        } else if (calcState.people.size == 0) {
            Text(
                "No items currently added",
                modifier = Modifier.height(30.dp),
                fontSize = 20.sp
            )
        } else if (calcState.items.size == 0) {
            Text(
                "No people currently added",
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
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
//                        .padding(bottom = 50.dp)
                    ,horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    items(calcState.people.size) { idx ->
                        val person = calcState.people[idx]

                        HomeRow(person)
                    }
                }
            }
        }
    }
}


/*
// top bar containing reset buttons
//        TopBar(calcState)
//        Spacer(Modifier.height(20.dp))

        // main splitting section
        Column(
            modifier = Modifier.fillMaxSize().padding(start = 9.dp)
        ) {
            // one column per item
            LazyColumn(
                Modifier.fillMaxWidth()
            ) {
                items(calcState.items.size) {
                    val idx = it
                    // item price, gst and hst toggles
                    Column(
                        modifier = Modifier
                            .height(120.dp)
                            .width(100.dp)
                            .background(Color.LightGray)
                    ) {
                        TextField(
                            value = calcState.items[idx].price.value,
                            onValueChange = { v -> calcState.items[idx].price.value = v },
                            modifier = Modifier
                                .height(55.dp)
                                .width(100.dp),
                            textStyle = TextStyle(fontSize = 14.sp),
                            placeholder = { Text("$$.$$", fontSize = 14.sp) },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            singleLine = true,
                            shape = RectangleShape
                        )
                        // gst checkbox
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Checkbox(
                                checked = calcState.items[idx].gst.value,
                                onCheckedChange = {
                                    calcState.items[idx].gst.value = !calcState.items[idx].gst.value
                                },
                                modifier = Modifier.width(50.dp)
                            )
                            Checkbox(
                                checked = calcState.items[idx].hst.value,
                                onCheckedChange = {
                                    calcState.items[idx].hst.value = !calcState.items[idx].hst.value
                                },
                                modifier = Modifier.width(50.dp)
                            )
                        }
                        // hst checkbox
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Text("GST", fontSize = 12.sp, modifier = Modifier.width(50.dp), textAlign = TextAlign.Center)
                            Text("HST", fontSize = 12.sp, modifier = Modifier.width(50.dp), textAlign = TextAlign.Center)
                        }
                    }
                    // check boxes for each person
                    LazyRow() {

                    }
                }
            }
            // one row for the + button for items
            Row(
                modifier = Modifier
                    .height(50.dp)
                    .padding(start = 15.dp)
                    .padding(vertical = 3.dp)
            ) {
                Button(
                    shape = CircleShape,
                    colors = ButtonColors(
                        Color.LightGray,
                        Color.LightGray,
                        Color.Transparent,
                        Color.Transparent
                    ),
                    onClick = { calcState.addItem() }
                ) {
                    Text("+", fontSize = 24.sp, color = Color.Black)
                }
            }
            // one row for showing gst and pst
            // one row for showing total price and price owed by each person
        }
 */
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.cost_splitter.ui.composables.TopBar
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun Home(navCtrl: NavController) {
    val calcState: CalcState = viewModel(navCtrl.getBackStackEntry("home"))

    Column(
        modifier = Modifier.fillMaxSize().background(Color.Gray).padding(horizontal = 6.dp)
    ) {
        // top bar containing reset buttons
        TopBar(calcState)
        Spacer(Modifier.height(20.dp))

        // main splitting section
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // one column per item
            LazyColumn() {
                items(calcState.items.size) {
                    val idx = it
                    // item price, gst and hst toggles
                    Column() {
                        TextField(
                            value = "",
                            onValueChange = { calcState.items[idx].first },
                            textStyle = TextStyle(fontSize = 16.sp),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                        )
                    }
                    LazyRow() {

                    }
                }
            }
            // one row for the + button for items
            Row(
                modifier = Modifier.height(40.dp).padding(start = 25.dp)
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
    }

}
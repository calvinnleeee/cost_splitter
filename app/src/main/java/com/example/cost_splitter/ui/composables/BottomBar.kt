package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun BottomBar(navCtrl: NavController) {
    BottomAppBar(
        modifier = Modifier.height(130.dp),
        containerColor = Color.DarkGray
    ) {
        // items button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Button(
                modifier = Modifier.width(120.dp),
                colors = ButtonColors(
                    containerColor = Color.LightGray,
                    contentColor = Color.LightGray,
                    disabledContainerColor = Color.Transparent,
                    disabledContentColor = Color.Transparent
                ),
                shape = RoundedCornerShape(20),
                onClick = {
                    // navigate to items screen
                    navCtrl.navigate("items")
                }
            ) {
                Text(
                    "Items",
                    color = Color.Black,
                    fontSize = 18.sp,
                    textAlign = TextAlign.Center
                )
            }

            // people button
            Button(
                modifier = Modifier.width(120.dp),
                shape = RoundedCornerShape(20),
                colors = ButtonColors(
                    containerColor = Color.LightGray,
                    contentColor = Color.LightGray,
                    disabledContainerColor = Color.Transparent,
                    disabledContentColor = Color.Transparent
                ),
                onClick = {
                    // navigate to people screen
                    navCtrl.navigate("people")
                }
            ) {
                Text(
                    "People",
                    color = Color.Black,
                    fontSize = 18.sp,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
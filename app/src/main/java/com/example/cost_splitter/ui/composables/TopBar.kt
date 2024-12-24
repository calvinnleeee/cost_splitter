package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun TopBar(calcState: CalcState) {
    // top nav bar

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 50.dp)
            .height(70.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Clear people button
        Button(
            modifier = Modifier.padding(start = 40.dp).width(120.dp),
            colors = ButtonColors(
                containerColor = Color.LightGray,
                contentColor = Color.LightGray,
                disabledContainerColor = Color.Transparent,
                disabledContentColor = Color.Transparent
            ),
            shape = RoundedCornerShape(20),
            onClick = {
                // calcState.clearPeople()
            }
        ) {
            Text(
                "Reset people",
                color = Color.Black,
                fontSize = 18.sp,
                textAlign = TextAlign.Center
            )
        }

        // Clear items button
        Button(
            modifier = Modifier.padding(end = 40.dp).width(120.dp),
            shape = RoundedCornerShape(20),
            colors = ButtonColors(
                containerColor = Color.LightGray,
                contentColor = Color.LightGray,
                disabledContainerColor = Color.Transparent,
                disabledContentColor = Color.Transparent
            ),
            onClick = {
                // calcState.clearItems()
            }
        ) {
            Text(
                "Reset items",
                color = Color.Black,
                fontSize = 18.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}
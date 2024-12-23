package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun TopBar(calcState: CalcState) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(top = 10.dp).height(60.dp)
    ) {
        // Clear people button
        Button(
            modifier = Modifier.padding(start = 40.dp).width(100.dp),
            onClick = {
                // calcState.clearPeople()
            }
        ) {
            Text("Reset people")
        }

        // Clear items button
        Button(
            modifier = Modifier.padding(end = 40.dp).width(100.dp),
            onClick = {
                // calcState.clearItems()
            }
        ) {
            Text("Reset people")
        }
    }
}
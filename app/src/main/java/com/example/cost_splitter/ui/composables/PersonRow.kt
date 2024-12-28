package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
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
import androidx.compose.ui.window.Popup
import com.example.cost_splitter.ui.data.Item
import com.example.cost_splitter.ui.data.Person

@Composable
fun PersonRow(
    person: Person,
    removeCallback: (Person) -> Unit,
    popupToggle: (Person) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth().height(45.dp),
        horizontalArrangement = Arrangement.Center
    ) {
        // name (clickable for editing)
        Text(
            person.name.value,
            modifier = Modifier
                .width(200.dp)
                .padding(start = 10.dp)
                .align(Alignment.CenterVertically)
                .clickable{
                    // call the callback to set the item that needs to be edited
                    popupToggle(person)
                },
            fontSize = 14.sp,
            textAlign = TextAlign.Start
        )
        // remove button
        Icon(
            Icons.Default.Close,
            contentDescription = null,
            modifier = Modifier
                .align(Alignment.CenterVertically)
                .padding(start = 5.dp)
                .clickable{
                    removeCallback(person)
                },
            tint = Color.Red
        )
    }
}
package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.clickable
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.cost_splitter.ui.data.Item

@Composable
fun ItemRow(
    item: Item,
    removeCallback: (Item) -> Unit,
    popupToggle: (Item) -> Unit,
    updateCallback: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth().height(45.dp)
    ) {
        // name (clickable for editing)
        Text(
            item.name.value,
            modifier = Modifier
                .width(150.dp)
                .padding(start = 10.dp)
                .align(Alignment.CenterVertically)
                .clickable{
                    // call the callback to set the item that needs to be edited
                    popupToggle(item)
                },
            fontSize = 14.sp,
            textAlign = TextAlign.Start
        )
        // price (clickable for editing)
        Text(
            "$%.2f".format(item.price.value),
            modifier = Modifier
                .width(100.dp)
                .padding(start = 5.dp)
                .align(Alignment.CenterVertically)
                .clickable{
                    // pop up or smth here to change the price of the item
                    popupToggle(item)
                },
            fontSize = 14.sp,
            textAlign = TextAlign.Start
        )
        // gst checkbox
        Checkbox(
            checked = item.gst.value,
            onCheckedChange = {
                item.gst.value = !item.gst.value
                updateCallback()
            },
            modifier = Modifier.width(50.dp).height(30.dp).align(Alignment.CenterVertically)
        )
        // pst checkbox
        Checkbox(
            checked = item.pst.value,
            onCheckedChange = {
                item.pst.value = !item.pst.value
                updateCallback()
            },
            modifier = Modifier.width(50.dp).height(30.dp).align(Alignment.CenterVertically)
        )
        // remove button
        Icon(
            Icons.Default.Close,
            contentDescription = null,
            modifier = Modifier
                .align(Alignment.CenterVertically)
                .padding(start = 5.dp)
                .clickable{
                    removeCallback(item)
                },
            tint = Color.Red
        )
    }
}
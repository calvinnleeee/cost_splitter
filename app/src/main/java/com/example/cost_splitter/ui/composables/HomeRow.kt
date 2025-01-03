package com.example.cost_splitter.ui.composables

import androidx.collection.MutableFloatList
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.cost_splitter.ui.data.Person

@Composable
fun HomeRow(
    person: Person,
    costs: MutableFloatList
) {
    Row(
        modifier = Modifier.fillMaxWidth().height(45.dp),
        horizontalArrangement = Arrangement.Center
    ) {
        // add the per-cost of each item if the person is splitting the item
        var amt = 0F
        for (i in 0..<person.items.size) {
            if (person.items[i]) {
                amt += costs[i]
            }
        }

        Text(
            person.name.value,
            modifier = Modifier.fillMaxWidth(0.7F).padding(start = 50.dp),
            fontSize = 16.sp
        )
        Text(
            "$%.2f".format(amt),
            modifier = Modifier.fillMaxWidth().padding(start = 10.dp),
            fontSize = 16.sp
        )
    }
}
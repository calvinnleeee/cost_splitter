package com.example.cost_splitter.ui.composables

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.requiredHeightIn
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.cost_splitter.ui.data.Item
import com.example.cost_splitter.ui.data.Person

@SuppressLint("MutableCollectionMutableState")
@Composable
fun PersonPopup(person: Person?, items: SnapshotStateList<Item>, dismissCallback: () -> Unit) {
    // track person's name show in the popup window
    var name by remember{ mutableStateOf(person!!.name.value) }
//    var list = remember{ mutableStateOf(person!!.items) }
    var displayError by remember{ mutableStateOf(false) }

    Dialog(
        onDismissRequest = { dismissCallback() },
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .requiredHeightIn(0.dp, 500.dp)
                .border(2.dp, Color.Black)
                .background(Color.White),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(20.dp))
            // text field to change the current person's name
            TextField(
                value = name,
                onValueChange = { name = it },
                modifier = Modifier.width(350.dp).padding(20.dp),
                label = { Text("Item name", fontSize = 10.sp) },
                trailingIcon = {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = null,
                        tint = Color.Red,
                        modifier = Modifier.clickable{
                            name = ""
                        }
                    )
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                singleLine = true
            )
            // container showing checkboxes and item names
            val scrollState = rememberScrollState()
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .requiredHeightIn(min = 0.dp, max = 500.dp)
                    .verticalScroll(scrollState)
            ) {
                for (i in 0..person!!.items.size step 3) {
                    Row(
                        Modifier.padding(10.dp).fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        for (j in 0..2) {
                            if (i + j < person.items.size) {
                                Text(
                                    items[i + j].name.value,
                                    modifier = Modifier
                                        .size(width = 70.dp, height = 40.dp)
                                        .clickable {
                                            person.items[i + j] = !person.items[i + j]
                                        }
                                        .border(
                                            width = if (person.items[i + j]) 2.dp else 0.dp,
                                            color = if (person.items[i + j]) Color.Green else Color.Black,
                                            shape = RoundedCornerShape(10)
                                        )
                                        .wrapContentHeight(),
                                    fontSize = 14.sp,
                                    color = Color.Black,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }
                }
            }

            // display error message if a field is empty, else use a spacer
            if (displayError) {
                Text(
                    "Cannot have an empty name!",
                    fontSize = 12.sp,
                    modifier = Modifier.height(15.dp),
                    color = Color.Red
                )
            }
            else {
                Spacer(Modifier.height(15.dp))
            }
            Button(
                onClick = {
                    if (name.isNotEmpty()) {
                        person!!.name.value = name
                        dismissCallback()
                    }
                    else {
                        displayError = true
                    }
                },
                modifier = Modifier.width(120.dp).padding(vertical = 20.dp),
                shape = RoundedCornerShape(30),
                colors = ButtonDefaults.buttonColors().copy(
                    containerColor = Color.LightGray,
                    contentColor = Color.Black
                )
            ) {
                Text("Confirm")
            }
        }
    }

}
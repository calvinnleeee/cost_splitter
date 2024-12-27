package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.cost_splitter.ui.data.Item

@Composable
fun ItemPopup(item: Item?, dismissCallback: () -> Unit, updateTotals: () -> Unit) {
    // track names and prices to show in the popup window
    var name by remember{ mutableStateOf(item!!.name.value) }
    var price by remember{ mutableStateOf(item!!.price.value.toString()) }
    var displayError by remember{ mutableStateOf(false) }

    // error messages and number to display when a textfield has an invalid input
    val errMsgs = listOf("Cannot have an empty field!", "Price must be a valid number!")
    var errNum by remember{ mutableIntStateOf(0) }

    Dialog(
        onDismissRequest = { dismissCallback() },
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.8F)
                .height(360.dp)
                .border(2.dp, Color.Black)
                .background(Color.White),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(20.dp))
            TextField(
                value = name,
                onValueChange = { if (it.isNotEmpty()) name = it },
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
            TextField(
                value = price,
                onValueChange = { price = it },
                modifier = Modifier.width(350.dp).padding(20.dp),
                label = { Text("Item price", fontSize = 10.sp)},
                trailingIcon = {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = null,
                        tint = Color.Red,
                        modifier = Modifier.clickable{
                            price = ""
                        }
                    )
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                singleLine = true
            )
            // display error message if a field is empty, else use a spacer
            if (displayError) {
                Text(
                    errMsgs[errNum],
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
                    if (name.isNotEmpty() && price.isNotEmpty()) {
                        try {
                            item!!.name.value = name
                            item.price.value = price.toFloat()
                            updateTotals()
                            dismissCallback()
                        }
                        catch(_: Exception) {
                            errNum = 1
                            displayError = true
                        }
                    }
                    else {
                        errNum = 0
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
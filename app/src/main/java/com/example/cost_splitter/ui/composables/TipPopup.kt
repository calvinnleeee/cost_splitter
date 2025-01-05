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
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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

@Composable
fun TipPopup(initialValue: Int, dismissCallback: () -> Unit, updateTip: (Int) -> Unit) {
    var displayValue by remember{ mutableStateOf(initialValue.toString()) }

    Dialog(
        onDismissRequest = { dismissCallback() },
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.8F)
                .height(250.dp)
                .border(2.dp, Color.Black)
                .background(Color.White),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(20.dp))
            // text field to change tip amount
            TextField(
                value = displayValue,
                onValueChange = { displayValue = it },
                modifier = Modifier.width(200.dp).padding(20.dp),
                label = { Text("Tip percentage", fontSize = 10.sp) },
                trailingIcon = {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = null,
                        tint = Color.Red,
                        modifier = Modifier.clickable{
                            displayValue = ""
                        }
                    )
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                singleLine = true
            )
            Spacer(Modifier.height(15.dp))
            Button(
                onClick = {
                    if (displayValue.isEmpty()) {
                        updateTip(0)
                        dismissCallback()
                    }
                    else {
                        try {
                            updateTip(displayValue.toInt())
                        }
                        catch (_: Exception) {
                            updateTip(0)
                        }
                        finally {
                            dismissCallback()
                        }
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
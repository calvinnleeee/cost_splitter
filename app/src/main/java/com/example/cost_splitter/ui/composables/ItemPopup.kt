package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.compose.ui.zIndex
import androidx.lifecycle.ViewModel
import com.example.cost_splitter.ui.data.Item
import kotlinx.coroutines.android.awaitFrame

@Composable
fun ItemPopup(item: Item?, dismissCallback: () -> Unit) {
    var name by remember{ mutableStateOf(item!!.name.value) }
    var price by remember{ mutableStateOf(item!!.price.value) }


    Dialog(
//        alignment = Alignment.Center,
        onDismissRequest = { dismissCallback() },
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.8F)
                .height(300.dp)
                .border(2.dp, Color.Black)
                .background(Color.White),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(20.dp))
            TextField(
                value = name,
                onValueChange = { name = it },
                modifier = Modifier.width(350.dp).padding(20.dp),
                label = { Text("Item name", fontSize = 10.sp) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                singleLine = true
            )
            TextField(
                value = price,
                onValueChange = { price = it },
                modifier = Modifier.width(350.dp).padding(20.dp),
                label = { Text("Item price", fontSize = 10.sp)},
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                singleLine = true
            )
            Spacer(Modifier.height(10.dp))
            Button(
                onClick = {
                    item!!.name.value = name
                    item.price.value = price
                    dismissCallback()
                },
                modifier = Modifier.width(120.dp).padding(bottom = 20.dp),
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
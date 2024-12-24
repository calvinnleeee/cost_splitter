package com.example.cost_splitter

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.cost_splitter.ui.composables.TopBar
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun Home(navCtrl: NavController) {
    val calcState: CalcState = viewModel(navCtrl.getBackStackEntry("home"))

    TopBar(calcState)
    Column(
        modifier = Modifier.fillMaxSize().padding(8.dp).background(Color.Gray)
    ) {
        Text("placeholder", fontSize = 30.sp)
    }
//    LazyColumn(
//        modifier = Modifier.fillMaxSize().padding(8.dp)
//    ) {
//        Text("placeholder", fontSize = 30.sp)
//    }
}
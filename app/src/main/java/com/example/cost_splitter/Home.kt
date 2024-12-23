package com.example.cost_splitter

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.cost_splitter.ui.composables.TopBar
import com.example.cost_splitter.ui.state.CalcState

@Composable
fun Home(navCtrl: NavController) {
    val calcState: CalcState = viewModel(navCtrl.getBackStackEntry("home"))

    TopBar(calcState)
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(8.dp)
    ) {

    }
}
package com.example.cost_splitter.ui.data

import androidx.compose.runtime.MutableState

data class Item(
    var price: MutableState<String>,
    var gst: MutableState<Boolean>,
    var hst: MutableState<Boolean>
)

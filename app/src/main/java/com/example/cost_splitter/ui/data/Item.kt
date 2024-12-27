package com.example.cost_splitter.ui.data

import androidx.compose.runtime.MutableState

data class Item(
    var name: MutableState<String>,
    var price: MutableState<Float>,
    var gst: MutableState<Boolean>,
    var pst: MutableState<Boolean>
)

package com.example.cost_splitter.ui.data

import androidx.compose.runtime.MutableState
import androidx.compose.runtime.snapshots.SnapshotStateList

data class Person(
    val name: MutableState<String>,
    val items: SnapshotStateList<Boolean>
)

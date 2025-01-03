package com.example.cost_splitter.ui.composables

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonColors
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarColors
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(navCtrl: NavController) {
    // top nav bar
    TopAppBar(
        title = {
            Box(
                modifier = Modifier.height(80.dp).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "not using splitwise lol",
                    modifier = Modifier.fillMaxWidth().padding(bottom = 3.dp),
                    color = Color.White,
                    fontSize = 20.sp,
                    textAlign = TextAlign.Center
                )
            }
        },
        modifier = Modifier
            .height(100.dp)
            .fillMaxWidth(),
        colors = TopAppBarColors(
            containerColor = Color.DarkGray,
            scrolledContainerColor = TopAppBarDefaults.mediumTopAppBarColors().scrolledContainerColor,
            navigationIconContentColor = TopAppBarDefaults.mediumTopAppBarColors().navigationIconContentColor,
            titleContentColor = TopAppBarDefaults.mediumTopAppBarColors().titleContentColor,
            actionIconContentColor = TopAppBarDefaults.mediumTopAppBarColors().actionIconContentColor,
        ),
        navigationIcon = {
            val current by navCtrl.currentBackStackEntryAsState()
            IconButton(
                modifier = Modifier.padding(start = 15.dp),
                onClick = { navCtrl.navigate("home") },
                enabled = current?.destination?.route != "home",
                colors = IconButtonColors(
                    containerColor = Color.Gray,
                    contentColor = Color.White,
                    disabledContainerColor = Color.Transparent,
                    disabledContentColor = Color.Transparent
                )
            ) {
                Icon(
                    Icons.Default.ArrowBack,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    )
}
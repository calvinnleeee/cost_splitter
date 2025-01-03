package com.example.cost_splitter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.cost_splitter.ui.composables.BottomBar
import com.example.cost_splitter.ui.composables.TopBar

class MainActivity : ComponentActivity() {
    private lateinit var viewModel: MyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            // nav controller used for viewmodel to allow display rotation
            val navCtrl = rememberNavController()

            viewModel = ViewModelProvider(this)[MyViewModel::class.java]

            Scaffold(
                topBar = {
                    TopBar(navCtrl)
                },
                bottomBar = {
                    BottomBar(navCtrl)
                },
                content = { padding ->
                    NavHost(
                        navController = navCtrl,
                        modifier = Modifier.fillMaxWidth().padding(padding),
                        startDestination = "home"
                    ) {
                        // home screen showing all totals and amt owed per person
                        composable("home") {
                            Home(navCtrl, viewModel)
                        }
                        // items screen to add/remove items
                        composable("items") {
                            ItemsScreen(navCtrl, viewModel)
                        }
                        // people screen to add/remove people and assign items to them
                        composable("people") {
                            PeopleScreen(navCtrl, viewModel)
                        }
                    }
                }
            )
        }
    }
}

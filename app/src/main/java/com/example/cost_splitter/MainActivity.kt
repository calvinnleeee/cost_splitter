package com.example.cost_splitter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.cost_splitter.ui.composables.BottomBar
import com.example.cost_splitter.ui.composables.TopBar
import com.example.cost_splitter.ui.state.CalcState
import com.example.cost_splitter.ui.theme.Cost_splitterTheme

class MainActivity : ComponentActivity() {
    private lateinit var viewModel: MyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            // nav controller used for viewmodel to allow display rotation
            val navCtrl = rememberNavController()

            viewModel = ViewModelProvider(this)[MyViewModel::class.java]
            // test code to add items in the list
            viewModel.calcState.addItem()
            viewModel.calcState.addItem()

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

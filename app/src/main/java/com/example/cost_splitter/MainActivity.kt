package com.example.cost_splitter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.cost_splitter.ui.composables.TopBar
import com.example.cost_splitter.ui.state.CalcState
import com.example.cost_splitter.ui.theme.Cost_splitterTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            // nav controller used for viewmodel to allow display rotation
            val navCtrl = rememberNavController()

            NavHost(
                navController = navCtrl,
                modifier = Modifier.fillMaxWidth(),
                startDestination = "home"
            ) {
                composable("home") {
                    viewModel(navCtrl.getBackStackEntry("home")) {
                        CalcState()
                    }
                    Home(navCtrl)
                }
            }
        }
    }
}

import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native'

import { AppRoutes } from "./app.routes"

export function Routes(){
    return (
        <View className="flex-1 bg-background">
        {/*Qd muda de tela na animação fica branco então aqui estamos mantendo a cor da tela escolhida*/}
            <NavigationContainer>
                <AppRoutes />
            </NavigationContainer>

        </View>
    )
}



import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '../screens/Home'
import { New } from '../screens/New'
import { Habit } from '../screens/Habit'


//desestruturada -> Navegator criar escopo da nossa rota / Screen para definir destino de cada rota (qual tela ou componente)
const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
    return(
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name="home" //acessar a rota home renderizar para o componente
                component={Home}
            />

            <Screen
                name="new"
                component={New}
            />

            <Screen
                name="habit"
                component={Habit}
            />

        </Navigator>
    )
}



import { StatusBar } from 'react-native';
//importar o useFonts e as fontes que serão usadas
import { useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold } from '@expo-google-fonts/inter'
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import './src/lib/dayjs'

export default function App() {
  const [fontsLoaded] = useFonts({ //useALGUMACOISA é Hook
    // fontes tem q abrir antes do app ser exibido
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  if (!fontsLoaded) { //caso não carregue as fontes não renderiza o app
    return (
      <Loading />
    )
  }

  return (
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
}


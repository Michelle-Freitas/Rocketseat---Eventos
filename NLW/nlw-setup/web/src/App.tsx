import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import './styles/global.css'
import './lib/dayjs'


export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header/>
        <SummaryTable />
      </div>
    </div>
  )
}


//Componente = tudo aquilo que queremos reaproveitar / isolar
//Propriedades = informação enviada para modificar o componente visualmente ou comportalmentalmente

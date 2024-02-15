import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreate: (content: string) => void // é função recebe e não retorna nada
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreate }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor(){
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>){
    //precisa passar um generic <>, pois apenas input e textarea tem value, informando qual o elemento do evento HTMLTextAreaElement
    setContent(event.target.value)
    if(event.target.value === '') setShouldShowOnboarding(true)
  }

  function handleSaveNote(event: FormEvent){
    event.preventDefault()

    if (content === '') return
    onNoteCreate(content)

    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota criada com sucesso')
  }

  function handleStartRecording(){
    // Verificar se pode usar no navegador a opção de gravar
    const isSpeechRecognitionAPIAvaliable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    // dentro do chrome chama webkitSpeechRecognition

    if (!isSpeechRecognitionAPIAvaliable) {
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    // TypeScript não sabe que essa API existe, então instalar @types/dom-speech-recognition como -D

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true //não para de gravar até informar manualmente, se false hr q para de falar ele para de gravar
    speechRecognition.maxAlternatives = 1 //trazer apenas 1 alternativa para palavra q entender
    speechRecognition.interimResults = true // trás o resultado eqto está falando msm antes de terminar de falar

    speechRecognition.onresult = (event) => { //será chamada sempre q ouvir algo
      //para ter todo o conteudo falado concatenar - sendo event.results um Iterator, vamos usar o Array.from() q converte Iterator para array
      const transcription = Array.from(event.results).reduce((text, result) => { //reduce para cada item executa func, valor inicial da informação q qr montar
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start() // iniciar a gravação
  }

  function handleStopRecording(){
    setIsRecording(false)

    if (speechRecognition !== null) speechRecognition.stop() // parar a gravação
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='flex flex-col rounded-md bg-slate-700 p-5 gap-3 text-left hover:ring-2 hover:ring-slate-600  outline-none focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>

        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full bg-slate-700 md:rounded-md  flex flex-col outline-none md:h-[60vh] overflow-hidden'>

          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-300">
                  Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                  {/* colocar botões como type button para não fazer submit dentro do form */}
                </p>
                ) : (
                  <textarea value={content} onChange={handleContentChange} autoFocus className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'/>
                )
              }

            </div>

            {isRecording ? (
              <button type='button' onClick={handleStopRecording} className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center tetx-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique para interromper)
              </button>
            ) : (
              <button type='button' onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center tetx-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                Salvar nota
              </button>
            )}

          </form>

        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
  )
}

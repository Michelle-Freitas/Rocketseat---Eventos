import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'

interface NoteCardProps { // prefere passar um objeto para nome detalhado
  note: {
    id: string
    date: Date
    content: string
  }
  onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps ) {
    return (
      <Dialog.Root>
        {/* alterar o focus-visible e tirar o padrão do sistema outline-none */}
        <Dialog.Trigger className='flex flex-col gap-3 text-left rounded-md bg-slate-800 p-5 overflow-hidden relative hover:ring-2 hover:ring-slate-600  outline-none focus-visible:ring-2 focus-visible:ring-lime-400'>
        {/* Dialog.Trigger susbtituindo o button, ele que abre o modal ao ser clicado */}
          <span className="text-sm font-medium text-slate-200">
            {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true} )}
          </span>
          <p className="text-sm leading-6 text-slate-300">
            {note.content}
          </p>

          {/* Gradiente metade da div h-1/2, colocado div como relative*/}
          {/* pointer-events: none, essa div impede de selecionar o texto (auto) q está no gradiente, para poder selecionar usar none*/}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
        </Dialog.Trigger>

        <Dialog.Portal>

          <Dialog.Overlay className='inset-0 fixed bg-black/50' />
          <Dialog.Content className='fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full bg-slate-700 md:rounded-md  flex flex-col outline-none md:h-[60vh] overflow-hidden'>
          {/* overflow-hidden para que o botão tenha a borda arrendondada junto ao modal*/}

            <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5'/>
            </Dialog.Close>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
              {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true} )}
              </span>
              <p className="text-sm leading-6 text-slate-300">
                {note.content}
              </p>
            </div>

            <button type='button' onClick={() => onNoteDeleted(note.id)} className='w-full bg-slate-800 py-4 text-center tetx-sm text-slate-300 outline-none font-medium group'>
              Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?
            </button>
          </Dialog.Content>

        </Dialog.Portal>
      </Dialog.Root>
    )
}

// FOCUS: Aplica quando clicamos no elemento
// FOCUS-VISIBLE: Aplica apenas navegando pelo teclado
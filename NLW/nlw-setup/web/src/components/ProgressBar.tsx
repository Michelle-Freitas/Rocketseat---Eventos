import * as Progress from '@radix-ui/react-progress';

//Progressbar é diferente para cada dia então props
interface ProgressBarProps {
    progress: number
}

export function ProgressBar(props: ProgressBarProps){
    return (
        <Progress.Root className="h-3 rounded-xl bg-zinc-300 w-full mt-4">
            <Progress.Indicator
                role="progressbar"
                aria-label="Progresso de hábitos coletados nesse dia (texto que o leitor de tela vai ler)"
                aria-valuenow={props.progress}
                className="h-3 rounded-xl bg-violet-600 transition-all"
                style={ {width: `${props.progress}%`} }
            />
        </Progress.Root>
    )
}



/*
Sem usar o RADIX deve se preopupar em preencher as seguintes acessibilidades na barra de progresso em destaque
    const progressStyles = {
        width: `${props.progress}%`
    }
    return (
        <div className="h-3 rounded-xl bg-zinc-300 w-full mt-4">
            <div role="progressbar"
            aria-label="Progresso de hábitos coletados nesse dia (texto que o leitor de tela vai ler)"
            aria-valuenow={props.progress}
            className="h-3 rounded-xl bg-violet-600"
            style={progressStyles}
            />
        </div>
        )
*/

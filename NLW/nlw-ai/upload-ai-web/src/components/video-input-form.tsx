import { api } from "@/lib/axios";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { FileVideo, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";


type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
    converting: 'Convertendo...',
    uploading: 'Carregando...',
    generating: 'Transcrevendo...',
    success: 'Sucesso!'
}

interface VideoInputFormProps {
    onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {

    const [ videoFile, setVideoFile ] = useState<File | null>(null)

    const [status, setStatus] = useState<Status>('waiting')

    const promptInputRef = useRef<HTMLTextAreaElement>(null)


    function handleFileVideo(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget //quem disparou o evento
        //files é um array

        if(!files){
            return
        }

        const selectedFile = files[0]
        setVideoFile(selectedFile)
    }

    async function convertVideoToAudio(video: File){
        console.log('Convert started')


        const ffmpeg = await getFFmpeg()


        await ffmpeg.writeFile('input.mp4', await fetchFile(video))
        /**writeFile('nome') vai criiar um arq dentro da maq q o ffmpeg consegue acessar
         * -> fetchFile do @ffmpeg/util -> converte o arq em uma representação binaria do arq (API: Uint8Array)
        */

        // ffmpeg.on('log', log => { //ouvir eventos, caso bug
        //     console.log(log)
        // })


        ffmpeg.on('progress', progress => {
            console.log('Convert progress: ' + Math.round(progress.progress * 100))
        })


        await ffmpeg.exec([//cada parte do comando deve ser um elemento do array, no final será concatenada
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3'
          ])//comando gerado pelo gpt

        const data = await ffmpeg.readFile('output.mp3') //const data: FileData (tipagem propria do ffmpeg)

        //converter FileData em file do JS => 1. converter em blob (forma de representar um dado de uma forma mais nativa) / 2. blob para file do js
        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg'
        })


        console.log('Convert finished')
        return audioFile


    }


    async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const prompt = promptInputRef.current?.value
        //inlcui '?' pois demora um pouquinho , pode ainda estar nula em um momento

        if(!videoFile){
            return
        }

        setStatus('converting')


        //converter o video em audio => procesamento de videos maiores, podemos deixar menor
        // usando navegador será consumido do navegador do usuário e não do backend q seria pesado processar todos ao mesmo tempo

        //webasembly => podemos binarios / linguagens q não foram feitas para o navegador dentro do navegador (ex: python, php)
        // ffmpeg wasm (https://ffmpegwasm.netlify.app/) -> outros nav podem não funcionar

        const audioFile = await convertVideoToAudio(videoFile)


        //UPLOAD do arquivo
        const data = new FormData() //formdata pq no back upload o content-type é multipart/form-data e não um json

        data.append('file', audioFile) //append (name -> igual no back, value)

        setStatus('uploading')

        const response = await api.post('/videos', data)

        console.log(response.data)
        const videoId = response.data.video.id

        // transcrição do video
        setStatus('generating')
        await api.post(`/videos/${videoId}/transcription`, {
            prompt,
        })

        console.log('finalizou')
        setStatus('success')

        props.onVideoUploaded(videoId)

    }


    const previewURL = useMemo(() => {
        if(!videoFile) {
            return null
        }

    return URL.createObjectURL(videoFile)
    // func do JS -> cria uma url de pre-visualização de arq legivel pelo browser (img, video, etc)

    }, [videoFile])
    /* useMemo(() => {}, [dependencias])    =>  permite que a escolha quando atualiza a interface, qual variavel será monitorada   */



    return (
        <form className="space-y-6" onSubmit={handleUploadVideo}>
        <label
            htmlFor="video"
            className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 justify-center items-center text-muted-foreground hover:bg-primary/5"
        >

            {videoFile ? (
                <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0"/>
            ) : (
                <>
                    <FileVideo className="w-4 h-4" />
                    Selecione um vídeo
                </>
            )}
        </label>
        <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileVideo}/>

        <Separator />

        <div className="space-y-2">
            <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
            <Textarea
            ref={promptInputRef}
            disabled={status !== 'waiting'}
            id="transcription_prompt"
            className="h-20 leading-relaxed resize-none"
            placeholder="Inclua palavras chaves mencionadas no vídeo, separadas por vírgula (,)"
            />
        </div>

        <Button disabled={status !== 'waiting'} className="w-full data-[success=true]:bg-emerald-400" data-success={status === 'success'} >

            {status === 'waiting' ? (
                <>
                    Carregar Vídeo
                    <Upload className="w-4 h-4 ml-2" />
                </>
            ) : (
                statusMessages[status]
            )}

        </Button>
        </form>
    );
}

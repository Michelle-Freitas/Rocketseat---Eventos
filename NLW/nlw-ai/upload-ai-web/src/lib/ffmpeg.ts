import { FFmpeg } from '@ffmpeg/ffmpeg';

//arquivos separados = pegar no github (https://github.com/rocketseat-education/nlw-ai-mastery/tree/main/web/src/ffmpeg)
import coreURL from '../ffmpeg/ffmpeg-core.js?url';
import wasmURL from '../ffmpeg/ffmpeg-core.wasm?url';
import workerURL from '../ffmpeg/ffmpeg-worker.js?url';

// ?url não vai fazer importação direta do arq, importar via url, async, qd precisar (pq estamos usando vite)

let ffmpeg: FFmpeg | null
// precisamos carregar, então vamos carregar só qd precisar

export async function getFFmpeg() {
    if(ffmpeg) { //reaproveita se já tiver
        return ffmpeg
    }

    // recria
    ffmpeg = new FFmpeg()

    if(!ffmpeg.loaded) { //se ainda não existir => FORÇAR com .load()
        await ffmpeg.load({
            coreURL,
            wasmURL,
            workerURL
        })
    }

    return ffmpeg

}

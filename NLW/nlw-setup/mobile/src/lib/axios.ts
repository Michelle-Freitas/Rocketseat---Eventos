import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://26.41.93.55:3333'
    //exp://u_xiqxi.anonymous.19000.exp.direct:80 -> npx expo start --tunnel
    //exp://26.41.93.55:19000 -> npm expo start
    //'http://localhost:3333' não funciona no Android como funciona no web
    //url base, td que for adicional vem depois dela
})

import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333'
    //passando o endereço do nosso localhost
    //url base, td que for adicional vem depois dela
})

//acessar namespace do reat
export declare global {
    namespace ReactNavigation {
        interface RootParamList { //aqui deixa claro as rotas disponiveis
            home: undefined; //pq não tem nenhum parametro
            new: undefined;
            habit: { //a data selecionada será passada como parametro
                date: string;
            }
        }
    }
}
//não é boa pratica colocar muitas informações, ideal dados simples, id, data

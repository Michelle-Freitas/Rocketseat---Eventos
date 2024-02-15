type Message = { pollOptionId: string, votes: number } //qual opção e qts votos tem
type Subscriber = (message: Message) => void; //cada Sub receberá essa msg

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {}
  // canais serão objetos<id_enquete, chamar_varias_funções_q_estão_ouvindo>
  // Subscriber[] cada enquete pode ter varios subs -> []

    subscribe(pollId: string, subscriber: Subscriber) {
        if (!this.channels[pollId]) { // se nenhuma pessoa assinou criar o []
            this.channels[pollId] = []
        }

        this.channels[pollId].push(subscriber)
    }

    publish(pollId: string, message: Message) {
        if (!this.channels[pollId]) {
            return;
        }

        for (const subscriber of this.channels[pollId]) {
            subscriber(message)
        }
    }
}

export const voting = new VotingPubSub()

//publico mensagens, e tenho funções ouvindo essas msgs (publicações)

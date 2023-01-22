import { useState , useCallback} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View , Text, ScrollView, Alert} from "react-native";
import { HabitDay , DAY_SIZE } from "../components/HabitDay";

import dayjs from "dayjs";

import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

import { api } from '../lib/axios';

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";


const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSize = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

type SummaryProps = Array <{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home(){
    const { navigate } = useNavigation()

    const [ loading, setLoading ] = useState(true) //true pq abriu tela ele vai estar buscando dados do backend
    const [ summary, setSummary ] = useState<SummaryProps  |  null>(null)

    async function fecthData() { //pra buscar os dados
        //vamos usar o try catch para não travar em caso de erro
        try {
            setLoading(true) //a função precisa ser chamada novamente, por ex: se voltarmos do popover então setamos true

            const response = await api.get('/summary')   //resposta que vai vir da api
            console.log(response.data)
            setSummary(response.data) //passar para summary os dados da response

        } catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar o sumário de hábitos') //importando Alert do react-native (titulo msg, msg)
            console.log(error)
        } finally {
            setLoading(false) //se der algo de errado será desativado
        }
    }

    useFocusEffect(useCallback(() => { //useFocusEffect para chamar de novo qd o foco voltar pra essa tela home
        /*quando usa o useFocusEffect documentação recomenda usar tbm useCallback ->
        melhor performace (pega referencia da função, pra nçao executar de forma desnecessária )
        */
        fecthData();
    }, []));

    if (!loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">

            <Header />

            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="flex-row mt-6 mb-2">
                    {
                        weekDays.map((weekDay, i) => (
                            <Text key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }} //mesmo espaço entre os quadr
                            >
                                {weekDay}
                            </Text>
                        ))
                    }
                </View>

                {/*Quadradinhos */}
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStart.map(date => {

                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })

                                return (
                                    <HabitDay
                                        key={date.toISOString()}
                                        date={date}
                                        amountOfHabits={dayWithHabits?.amount}
                                        amountCompleted={dayWithHabits?.completed}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                    />
                                )
                            })
                        }
                        {
                            amountOfDaysToFill > 0 && Array
                            .from({ length: amountOfDaysToFill})
                            .map((_, index) => (
                                <View
                                    key={index}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{ width: DAY_SIZE, height: DAY_SIZE}}
                                />
                            ))
                        }
                    </View>
                    }
            </ScrollView>

        </View>
    )
}

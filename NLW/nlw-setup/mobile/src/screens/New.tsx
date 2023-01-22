//Para cadastrar
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";

import { api } from "../lib/axios";


const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

export function New(){
    const [weekDays, setWeekDays] = useState<number[]>([])
    //definindo a tipagem do vetor numeros -> <number[]>

    const [title, setTitle] = useState('')

    function handleToggleWeekDay(weekDayIndex: number){ //saber quais dias selecionados
        if (weekDays.includes(weekDayIndex)){ //para desmarcar
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
            //fazer um filtro no estado anterior e retornar tds != weekDayIndex

        } else { //marcar
            setWeekDays(prevState => [...prevState, weekDayIndex])
            //recuperar o estado anterior e jogar usando spread operator
        }
    }

    async function handleCreatedNewHabit() {
        try {
            if (!title.trim() || weekDays.length === 0){
                return Alert.alert('Novo Hábito', 'Informe o nome do hábito e escolha a periodicidade')
            }

            await api.post('/habits', {title, weekDays})
            setTitle('')
            setWeekDays([])

            Alert.alert('Novo Hábito', 'Hábito criado com sucesso!')

        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel criar o novo hábito')
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16" >
            <ScrollView
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = { {paddingBottom: 100 } }
                >

                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Exercícios, dormir bem, etc ..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle} //ele já entende q qremos atualizar o title
                    value={title}
                    />

                <Text className="mt-4 mb-3 text-white font-semibold text-base">
                    Qual a recorrência?
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <Checkbox
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(index)} //ver se está checked
                            onPress={ () => handleToggleWeekDay(index)}
                            //OnPress para funcionar, no checkbox precisa definir TouchableOpacityProps
                        />
                    ))
                }

                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={handleCreatedNewHabit}
                >
                    <Feather
                        name="check"
                        size={20}
                        color = {colors.white}
                    />

                    <Text className="ml-2 text-white font-semibold text-base">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </View>

    )
}

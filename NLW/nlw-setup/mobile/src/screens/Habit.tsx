import { useEffect, useState } from "react";
import { Text, ScrollView, View, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";

import dayjs from "dayjs";
import clsx from "clsx";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitEmpty } from "../components/HabitEmpty";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { api } from "../lib/axios";



interface Params {
    date: string;

}

interface DayInfoProps {
    completedHabit: string[];
    possiblehabits: {
        id: string;
        title: string;
    }[];
}

export function Habit(){

    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps  |  null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute()
    const { date } = route.params as Params
    console.log(date)

    const parsedDate = dayjs()

    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())

    const dayOfWeek = parsedDate.format('dddd')

    const dayAndMonth = parsedDate.format('DD/MM')

    const habitsProgress = dayInfo?.possiblehabits.length
        ? generateProgressPercentage(dayInfo.possiblehabits.length, completedHabits.length)
        : 0

    async function fetchHabits() {
        try {
            setLoading(true)

            const response = await api.get('/day', { params: { date }})

            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)

        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel carregar as informações dos hábitos')

        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)

            if (completedHabits.includes(habitId)){
            setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel atualizar o status do hábito')
        }
    }

    useEffect(() => {
        fetchHabits()
    }, [])


    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16" >

            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>

                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress}/>

                <View className={clsx("m-6", {
                    ['opacity-50'] : isDateInPast
                })}>

                    {
                        dayInfo?.possiblehabits ?
                        dayInfo?.possiblehabits.map(habit => (
                            <Checkbox
                                key={habit.id}
                                title={habit.title}
                                checked={completedHabits.includes(habit.id)}
                                disabled={isDateInPast}
                                onPress={() => handleToggleHabit(habit.id)}
                            />
                        ))
                        : <HabitEmpty />
                    }

                </View>

                {
                    isDateInPast && (
                        <Text className="text-white m-10 text-center">
                            Você não pode editar hábitos de data passada;
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    )
}

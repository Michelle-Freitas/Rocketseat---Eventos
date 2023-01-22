import { TouchableOpacity , Dimensions, TouchableOpacityProps} from "react-native";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import clsx from "clsx";
import dayjs from "dayjs";

const WEEK_DAYS = 7 //por linha 7 quadradinhos (dias)
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5
//de cada lado tem 32 e divide por 5 espaçamento entre cada

export const DAY_MARGIN_BETWEEN = 8 //espaçamento entre quadradinhos
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)
//DAY_SIZE tam de cada quadr
// podemos pegar a dimensão do cel e vamos dividir por 7 -> descontar o padding

interface Props extends TouchableOpacityProps {
    amountOfHabits?: number;
    amountCompleted?: number;
    date: Date;
}

export function HabitDay({amountOfHabits = 0, amountCompleted = 0, date, ...rest }: Props ){

    const amountAccomplishedPercentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0
    const today = dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(date).isSame(today) // se for o dia de hj ficar com contorno o quadradinho

    return(

        <TouchableOpacity
        className={clsx("rounded-lx border-2 m-1", {
            ["bg-zinc-900 border-zinc-800"] : amountAccomplishedPercentage == 0,
            ["bg-violet-900 border-violet-700"] : amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
            ["bg-violet-800 border-violet-600"] : amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
            ["bg-violet-700 border-violet-500"] : amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
            ["bg-violet-600 border-violet-500"] : amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
            ["bg-violet-500 border-violet-400"] : amountAccomplishedPercentage >= 80,
            ["border-white border-4"] : isCurrentDay,
        })}
        style={{ width: DAY_SIZE, height: DAY_SIZE}}
        activeOpacity={0.7}
        {...rest}
        />

    )
}

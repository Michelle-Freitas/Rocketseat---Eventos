import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";

import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"


interface Props extends TouchableOpacityProps{
    title: string;
    checked?: boolean; //? quer dizer que pode ser nula

}

export function Checkbox( {title, checked = false, ...rest} : Props ){ //rest tds outras

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row mb-2 items-center"
            {...rest}
        >
            {//CHECKBOX
                checked
                ?
                <Animated.View
                    className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
                    entering={ZoomIn}
                    exiting={ZoomOut}
                    >

                    <Feather
                        name="check"
                        size={20}
                        color = {colors.white}
                    />
                </Animated.View>
                :
                <View className="h-8 w-8 bg-zinc-900 rounded-lg font-semibold"/>
            }
        <Text className="text-white text-base ml-3">
            {title}
        </Text>

        </TouchableOpacity>
    )
}

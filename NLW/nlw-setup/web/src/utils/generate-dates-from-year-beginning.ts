import dayjs from 'dayjs'

export function generateDatesFromYearBeginning(){
        const firtsDayOfTheYear = dayjs().startOf('year')
        const today = new Date()

        const dates = []
        let compareDate = firtsDayOfTheYear

        while(compareDate.isBefore(today)) {
            //enqto 1ºdate for antes de hoje isBefore() é do dayjs
            dates.push(compareDate.toDate())
            compareDate = compareDate.add(1, 'day')
        }

    return dates
}

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";

interface Prompt {
    id: string,
    template: string,
    title: string,
}

interface PromptSelectProps {
    onPromptSelected: (template: string) => void //é uma função q recebe template q é string e não retorna nada
  }

export function PromptSelect( props: PromptSelectProps){

    const [prompts, setPrompts] = useState<Prompt[] | null>(null)

    useEffect(() => {
        api.get('/prompts').then(response => setPrompts(response.data))
    }, [])


    //o value do select é o id, e vamos passar o template
    function handlePromptSelected(promptId:string){

        const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

        if (!selectedPrompt){
            return
        }

        props.onPromptSelected(selectedPrompt.template)
    }

    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
                <SelectValue placeholder="Selecione um prompt..."/>
            </SelectTrigger>

            <SelectContent>
                {prompts?.map(prompt => {
                    return (
                        <SelectItem value={prompt.id} key={prompt.id}> {prompt.title} </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}

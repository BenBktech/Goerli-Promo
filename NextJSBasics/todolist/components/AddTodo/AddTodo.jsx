import { Text, Flex, Input, Button } from '@chakra-ui/react'
import { useState } from 'react'

export default function AddTodo({ todos, setTodos}) {

    const [task, setTask] = useState('')

    const addTodo = () => {
        setTodos(current => [...current, {
            "id": crypto.randomUUID(),
            "name": task,
            "isDone": false
        }])
    }

    return (
        <Flex mt="2rem" width="100%">
            <Input placeholder="your task" onChange={(e) => setTask(e.target.value)} />
            <Button onClick={() => addTodo()}colorScheme="purple">Add Task</Button>
        </Flex>
    )
}
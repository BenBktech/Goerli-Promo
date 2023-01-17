import { Flex, UnorderedList } from '@chakra-ui/react'
import Todo from '../Todo/Todo'

export default function TodoList({ todos, setTodos }) {
    return (
        <Flex direction="column"mt="1rem">
            <UnorderedList>
                {todos.map((todo) => {
                    return (
                        <Todo 
                            todos={todos}
                            setTodos={setTodos}
                            key={todo.id}
                            todo={todo}
                        />
                    )
                })}
            </UnorderedList>
        </Flex>
    )
}
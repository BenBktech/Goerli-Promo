import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Text, Flex, Heading, Input, Button, UnorderedList, ListItem } from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout'
import AddTodo from '@/components/AddTodo/AddTodo'
import TodoList from '@/components/TodoList/TodoList'
import { useState } from 'react'

export default function Home() {

  const [todos, setTodos] = useState([])

  return (
    <>
      <Head>
        <title>TodoList App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Flex direction="column" p="2rem" alignItems="center" width="100%">
          <Heading as='h1' size='xl'>
            TODO APP
          </Heading>
          <AddTodo todos={todos} setTodos={setTodos} />
          <TodoList todos={todos} setTodos={setTodos} />
        </Flex>
      </Layout>  
    </>
  )
}
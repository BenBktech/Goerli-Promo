import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { WalletProvider } from '@/context/walletProvider'

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WalletProvider>
  )
}

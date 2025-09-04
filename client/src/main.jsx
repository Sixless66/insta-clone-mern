import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from './context/UserProvider.jsx'
import PostProvider from './context/PostProvider.jsx'
import { ChatContextProvider } from './context/ChatProvider.jsx'
import SocketProvider from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  
 <BrowserRouter>     
   <UserProvider>
     <SocketProvider>
      <PostProvider>  
        <ChatContextProvider>
             <App/>
        </ChatContextProvider>   
       </PostProvider>    
     </SocketProvider>
   </UserProvider>
</BrowserRouter>

  
)

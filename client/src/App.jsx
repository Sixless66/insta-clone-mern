
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Feed from './pages/Feed'
import CreateStory from './pages/CreateStory'
import Profile from './pages/Profile'
import Posts from './pages/Posts'
import Followings from './pages/Followings'
import Followers from './pages/Followers'
import {Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import SearchUser from './pages/SearchUser'
import Message from './pages/Message'
import Notification from './pages/Notification'


const App = () => {

  return (
   <div className="bg-gray-800">
      <Toaster/>
      <Routes>
        <Route path='/' element={
           <PrivateRoute>
            <Layout /> 
          </PrivateRoute> 
        } >
          <Route index element={ <Feed/> } />
          <Route path='create' element={ <CreateStory />} />
          <Route path='profile/:username' element={ <Profile />} />

          {/* ✅ independent routes but still private */}
          <Route path='posts' element={ <Posts />} />
          <Route path='followers' element={ <Followers /> } />
          <Route path='followings' element={ <Followings /> } />
          <Route path='search' element={ <SearchUser /> } />
          <Route path='message' element={ <Message /> } />
          <Route path='notification' element={ <Notification/>} />
        </Route>

        <Route path='/login' element={<Login/>} />
      </Routes> 
    </div>
  )
}

export default App 

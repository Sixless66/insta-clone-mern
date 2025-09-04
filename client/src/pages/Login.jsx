import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'


const Login = () => {
  const [state, setState] = useState('register') // register | login
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login} = useContext(UserContext)

  const handleSubmit =  (e) => {
    e.preventDefault()

    if (state === 'register') {
       login('register', { userName, email, password })
    } else {
       login(state, { email, password })
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[350px] gap-5 p-8 px-5 border border-gray-400 rounded-2xl"
      >
        <p className="text-center text-green-800 text-lg font-semibold">
          {state === 'register' ? 'Sign Up' : 'Login'}
        </p>

        {state === 'register' && (
          <input
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            value={userName}
            placeholder="Enter Name"
            className="px-3 py-3 rounded outline-none border border-gray-300"
          />
        )}

        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter Email"
          className="px-3 py-3 rounded outline-none border border-gray-300"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="px-3 py-3 rounded outline-none border border-gray-300"
        />

        <button
          type="submit"
          className="bg-green-800 text-white px-3 py-2 rounded"
        >
          {state === 'register' ? 'Register' : 'Login'}
        </button>

        <div className="text-center">
          {state === 'register' ? (
            <p className="text-gray-600">
              Already have an account?{' '}
              <span
                onClick={() => setState('login')}
                className="text-blue-800 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <div className="text-gray-600">
              Don&apos;t have an account?{' '}
              <span
                onClick={() => setState('register')}
                className="text-blue-800 cursor-pointer"
              >
                Create account
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login

import { Landing, Register, Error, ProtectedRoute, ProtectedLogReg, ProtectedSet } from './pages'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import {
  Set,
  Sets,
  Todos,
  Progress,
  Profile,
  SharedLayout
} from './pages/dashboard'
import { ForgotPassword, ResetPassword } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
        Including "index" for one of the nested routes is optional.
        If it is indluded, the path will match the root exactly.
        */}
        <Route path="/" element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Sets />} />
          <Route path="todos" element={<Todos />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="set/:id" element={
            <ProtectedSet>
              <Set />
            </ProtectedSet>
          } />
        </Route>
        <Route path="/register" element={
          <ProtectedLogReg>
            <Register />
          </ProtectedLogReg>
        } />
        <Route path="/landing" element={
          <ProtectedLogReg>
            <Landing />
          </ProtectedLogReg>
        } />
        <Route path="/forgot-password" element={
          <ProtectedLogReg>
            <ForgotPassword />
          </ProtectedLogReg>
        } />
        <Route path="/reset-password" element={
          <ProtectedLogReg>
            <ResetPassword />
          </ProtectedLogReg>
        } />
        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
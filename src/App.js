import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import TeamList from './components/TeamList'
import TeamDetails from './components/TeamDetails'
import TeamChat from './components/TeamChat'
import IdeaVerification from './components/IdeaVerification'
import CreateTeam from './components/createTeam'
import Login from './components/loginForm'
import { AuthProvider } from "./context/AuthContext";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/teams/:id/details" element={<TeamDetails />} />
          <Route path="/teams/:id/chat" element={<TeamChat />} />
          <Route path="/idea-verification" element={<IdeaVerification />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
import {useEffect, useState} from 'react'
import { Routes, Route, Router } from 'react-router-dom'
import Home from './views/Home.jsx'
import LevelHouse from './levels/LevelHouse.jsx'
import LevelTransport from './levels/LevelTransport.jsx'
import LevelIndustry from './levels/LevelIndustry.jsx'
import LevelFood from './levels/LevelFood.jsx'
import Signin from './views/Signin.jsx'
import Profile from './views/Profile.jsx'
import Logout from './views/Logout.jsx'
import Signup from './views/Signup.jsx'
import APropos from './views/Apropos.jsx'
import Sponsors from './views/Sponsors.jsx'
import GameHub from './views/GameHub.jsx'
import {ThemeProvider, useTheme} from "./logic/ThemeContext.jsx";



function App() {
    const [count, setCount] = useState(42)


  return (
      <div >
        <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="profile" element={<Profile />} />
        <Route path="logout" element={<Logout />} />
        <Route path="apropos" element={<APropos />} />"
        <Route path="sponsors" element={<Sponsors />} />
        <Route path="gameHub" element={<GameHub />} />
        <Route path="level1" element={<LevelHouse />} />
        <Route path="level2" element={<LevelTransport />} />
        <Route path="level3" element={<LevelIndustry />} />
        <Route path="level4" element={<LevelFood />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
)
}

export default App

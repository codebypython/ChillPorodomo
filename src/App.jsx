import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AnimationLibrary from './pages/AnimationLibrary'
import SoundLibrary from './pages/SoundLibrary'
import PresetManager from './pages/PresetManager'
import FocusPage from './pages/FocusPage'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animations" element={<AnimationLibrary />} />
          <Route path="/sounds" element={<SoundLibrary />} />
          <Route path="/presets" element={<PresetManager />} />
          <Route path="/focus" element={<FocusPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App


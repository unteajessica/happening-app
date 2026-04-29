import {Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EventsTablePage from './pages/EventsTablePage'
import AddEventPage from './pages/AddEventPage'
import EventDetailsPage from './pages/EventDetailsPage'
import EditEventPage from './pages/EditEventPage'
import EventsCardsPage from './pages/EventsCardsPage'
import StatisticsPage from './pages/StatisticsPage'
import FavoritesPage from './pages/FavoritesPage'
import PickYourNightPage from './pages/PickYourNightPage'
import SpliViewPage from './pages/SplitViewPage'

function App() {
  return (
    <Routes>
      <Route path="*" element={<LandingPage/>} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/events-table" element={<EventsTablePage />} />
      <Route path="/add-event" element={<AddEventPage />} />
      <Route path="/event-details/:id" element={<EventDetailsPage />} />
      <Route path="/edit-event/:id" element={<EditEventPage />} />
      <Route path="/events-cards-view" element={<EventsCardsPage/>} />
      <Route path="/statistics-page" element={<StatisticsPage/>} />
      <Route path="/favorites-page" element={<FavoritesPage/>} />
      <Route path="/pick-your-night" element={<PickYourNightPage/>} />
      <Route path='/split-view' element={<SpliViewPage/>} />
    </Routes>
  )
}

export default App

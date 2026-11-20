import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ContactPage from './pages/ContactPage.jsx';

// Sets up the shared site layout and page routes.
export default function App() {
  return <><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /></>;
}

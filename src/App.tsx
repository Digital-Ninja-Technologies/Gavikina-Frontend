import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ModalProvider } from './context/ModalContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Catalogue from './pages/Catalogue';
import HowItWorks from './pages/HowItWorks';
import Agent from './pages/Agent';
import Careers from './pages/Careers';
import Investors from './pages/Investors';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import CalculatorPage from './pages/CalculatorPage';
import AssessmentPage from './pages/AssessmentPage';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ModalProvider>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', color: '#14375E' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      <Modal />
    </ModalProvider>
  );
}

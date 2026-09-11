import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Innovation from './components/Innovation/Innovation';
import Pipeline from './components/Pipeline/Pipeline';
import Simulation from './components/Simulation/Simulation';
import TechStack from './components/TechStack/TechStack';
import Impact from './components/Impact/Impact';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Innovation />
        <Pipeline />
        <Simulation />
        <TechStack />
        <Impact />
      </main>
      <Footer />
    </>
  );
}

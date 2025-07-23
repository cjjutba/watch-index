import { Header } from '../components/layout/Header';
import Home from './Home';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
};

export default Index;

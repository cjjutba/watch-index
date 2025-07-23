import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion, ChevronLeft } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center bg-card p-10 rounded-lg cinema-shadow">
          <FileQuestion className="w-24 h-24 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The page you are looking for doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gold-gradient">
              <Link to="/">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/movies">
                Browse Movies
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;

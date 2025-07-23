import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, Users, AlertTriangle, Scale, Calendar, Mail } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground cinema-transition mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileText className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using WatchIndex. By using our service, 
              you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  By accessing and using WatchIndex ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") govern your use of our website and services provided by WatchIndex.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Description of Service</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>WatchIndex is a movie and TV show discovery platform that provides:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Information about movies, TV shows, cast, and crew</li>
                  <li>Search and discovery features for entertainment content</li>
                  <li>Personal favorites and watchlist functionality</li>
                  <li>Ratings, reviews, and recommendations</li>
                  <li>Streaming availability information</li>
                </ul>
                <p>
                  Our service is provided free of charge and is supported by data from The Movie Database (TMDB).
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">User Responsibilities</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>As a user of WatchIndex, you agree to:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Use the service for lawful purposes only</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not use automated tools to scrape or download content</li>
                  <li>Respect intellectual property rights of content creators</li>
                  <li>Not interfere with the proper functioning of the service</li>
                  <li>Provide accurate information when contacting us</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Our Content</h3>
                  <p>
                    The WatchIndex website design, logo, and original content are owned by WatchIndex and 
                    protected by copyright and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Third-Party Content</h3>
                  <p>
                    Movie and TV show information, images, and metadata are provided by The Movie Database (TMDB) 
                    and are subject to their terms of use. All movie and TV show content is owned by their 
                    respective copyright holders.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Fair Use</h3>
                  <p>
                    We use movie and TV show information under fair use provisions for informational and 
                    educational purposes only.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Disclaimers</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Service Availability</h3>
                  <p>
                    We strive to keep WatchIndex available 24/7, but we cannot guarantee uninterrupted service. 
                    We may need to suspend the service for maintenance or updates.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Information Accuracy</h3>
                  <p>
                    While we work to provide accurate information, we cannot guarantee the completeness or 
                    accuracy of all movie and TV show data. Information is provided "as is" from third-party sources.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Streaming Availability</h3>
                  <p>
                    Streaming availability information may not be current or accurate. We recommend verifying 
                    availability directly with streaming platforms.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  WatchIndex and its operators shall not be liable for any direct, indirect, incidental, 
                  special, or consequential damages resulting from:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Use or inability to use the service</li>
                  <li>Inaccurate or incomplete information</li>
                  <li>Service interruptions or technical issues</li>
                  <li>Loss of data or personal information</li>
                  <li>Third-party actions or content</li>
                </ul>
                <p>
                  Your use of WatchIndex is at your own risk. The service is provided "as is" without 
                  warranties of any kind.
                </p>
              </div>
            </section>

            {/* Privacy */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Privacy</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how we 
                  collect, use, and protect your information.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                    Read our Privacy Policy →
                  </Link>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We reserve the right to modify these Terms of Service at any time. When we make changes:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>We will update the "Last updated" date</li>
                  <li>Significant changes will be communicated through our website</li>
                  <li>Continued use of the service constitutes acceptance of new terms</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Mail className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>If you have questions about these Terms of Service, please contact us:</p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p><strong className="text-foreground">Email:</strong> legal@watchindex.com</p>
                  <p><strong className="text-foreground">Contact Form:</strong> <Link to="/contact" className="text-primary hover:underline">Visit our Contact page</Link></p>
                </div>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground mb-6">
              Questions about our terms? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gold-gradient">
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;

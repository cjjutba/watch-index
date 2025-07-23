import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, Eye, Database, Lock, Mail, Calendar } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';

const PrivacyPolicy = () => {
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
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how WatchIndex collects, 
              uses, and protects your information.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Information We Collect */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
              </div>
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Personal Information</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Information you provide when contacting us (name, email address)</li>
                    <li>Preferences and settings you configure in our application</li>
                    <li>Feedback and communications you send to us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Usage Information</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Pages you visit and features you use</li>
                    <li>Search queries and browsing patterns</li>
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and general location information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Local Storage</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Favorite movies and TV shows (stored locally in your browser)</li>
                    <li>User preferences and settings</li>
                    <li>Recently viewed content</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Provide and improve our movie and TV show discovery service</li>
                  <li>Personalize your experience and remember your preferences</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Analyze usage patterns to improve our application</li>
                  <li>Ensure the security and proper functioning of our service</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </div>
            </section>

            {/* Data Protection */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Data Protection & Security</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We implement appropriate security measures to protect your information:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Secure data transmission using HTTPS encryption</li>
                  <li>Local storage of personal preferences (no server-side storage of personal data)</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                  <li>No sale or sharing of personal information with third parties</li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Third-Party Services</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>WatchIndex uses the following third-party services:</p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">The Movie Database (TMDB)</h3>
                  <p>We use TMDB's API to provide movie and TV show information. Please review TMDB's privacy policy at <a href="https://www.themoviedb.org/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">themoviedb.org/privacy-policy</a></p>
                </div>
                <p>We do not share your personal information with these services beyond what is necessary for functionality.</p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Your Rights</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Access and review the information we have about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of certain data collection practices</li>
                  <li>Clear your local storage data at any time through your browser</li>
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
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p><strong className="text-foreground">Email:</strong> privacy@watchindex.com</p>
                  <p><strong className="text-foreground">Contact Form:</strong> <Link to="/contact" className="text-primary hover:underline">Visit our Contact page</Link></p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">Policy Updates</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We may update this Privacy Policy from time to time. When we do, we will:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Update the "Last updated" date at the top of this policy</li>
                  <li>Notify users of significant changes through our website</li>
                  <li>Continue to protect your information in accordance with this policy</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground mb-6">
              Have questions about our privacy practices?
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

export default PrivacyPolicy;

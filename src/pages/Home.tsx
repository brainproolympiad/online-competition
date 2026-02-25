import Hero from '../components/Hero';
import CompetitionSection from '../components/CompetitionSection';
import StudentBenefits from '../components/StudentBenefits';
import AwardsComponent from '../components/AwardComponent';
import Rules from '../components/Rule';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Hero />
          </div>
        </section>

        {/* Competition Section */}
        <section className="w-full py-8 md:py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <CompetitionSection />
          </div>
        </section>

        {/* Student Benefits */}
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StudentBenefits />
          </div>
        </section>

        {/* Awards */}
        <section className="w-full py-8 md:py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AwardsComponent />
          </div>
        </section>

        {/* Rules */}
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Rules />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </footer>
    </div>
  );
}

export default Home;
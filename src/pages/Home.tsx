
import Hero from '../components/Hero'
import CompetitionSection from '../components/CompetitionSection'
import StudentBenefits from '../components/StudentBenefits'
import AwardsComponent from '../components/AwardComponent'
import Rules from '../components/Rule'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div>
    <Navbar />
    <Hero />
    <CompetitionSection />
    <StudentBenefits />
    <AwardsComponent />
    <Rules />
    <Footer/>
    </div>
  )
}

export default Home
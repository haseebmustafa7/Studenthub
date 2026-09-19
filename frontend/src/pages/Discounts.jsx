import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Tag,
  Laptop,
  Coffee,
  Plane,
  Music,
  ArrowRight,
  ExternalLink,
  MapPin,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

const categories = [
  {
    id: 'software',
    icon: Laptop,
    iconClass: 'text-blue-600',
    title: 'Software & Tech',
    description: 'Premium tools and services for developers, students, and designers',
    examples: 'GitHub, Adobe, Microsoft, Canva, JetBrains'
  },
  {
    id: 'food',
    icon: Coffee,
    iconClass: 'text-amber-600',
    title: 'Food & Dining',
    description: 'Demo student deals at restaurants, cafes, and food delivery services',
    examples: "McDonald's, Subway, Foodpanda, local cafes"
  },
  {
    id: 'travel',
    icon: Plane,
    iconClass: 'text-purple-600',
    title: 'Travel',
    description: 'Demo student-friendly rates for flights, hotels, buses, and transport',
    examples: 'Emirates, Daewoo Express, Airblue, Sastaticket'
  },
  {
    id: 'entertainment',
    icon: Music,
    iconClass: 'text-green-600',
    title: 'Entertainment',
    description: 'Demo student savings on streaming, cinema, music, and entertainment',
    examples: 'Spotify, Netflix, Cinepax, local cinemas'
  }
]

// These are DEMO/SAMPLE offers for the StudentHub prototype.
// They are not claims that the named brands currently offer these exact student discounts.
const offers = {
  software: [
    { brand: 'GitHub', title: 'Student Developer Pack', discount: 'Demo: Up to 100% off selected developer tools', detail: 'Sample student access to GitHub and partner developer tools.', location: 'Online', url: 'https://github.com/education/students' },
    { brand: 'Adobe', title: 'Creative Cloud Student Offer', discount: 'Demo: 65% off', detail: 'Sample student pricing for Photoshop, Illustrator, Premiere Pro and more.', location: 'Online', url: 'https://www.adobe.com/creativecloud/buy/students.html' },
    { brand: 'Microsoft', title: 'Microsoft 365 Student', discount: 'Demo: Free / discounted student access', detail: 'Sample offer for productivity tools including Word, Excel and PowerPoint.', location: 'Online', url: 'https://www.microsoft.com/education/products/office' },
    { brand: 'Canva', title: 'Canva for Education', discount: 'Demo: Free for eligible students', detail: 'Sample access to premium design and presentation features.', location: 'Online', url: 'https://www.canva.com/education/' },
    { brand: 'JetBrains', title: 'Student Developer License', discount: 'Demo: 100% off', detail: 'Sample student access to professional IDEs and developer tools.', location: 'Online', url: 'https://www.jetbrains.com/community/education/' }
  ],
  food: [
    { brand: "McDonald's Pakistan", title: 'Student Meal Deal', discount: 'Demo: 15% off', detail: 'Sample student offer on selected meals with valid student ID.', location: 'Pakistan', url: 'https://www.mcdonalds.com.pk/' },
    { brand: 'Subway Pakistan', title: 'Student Sub Combo', discount: 'Demo: 10% off', detail: 'Sample student pricing on selected subs and combo meals.', location: 'Pakistan', url: 'https://www.subway.com/' },
    { brand: 'foodpanda Pakistan', title: 'Student Delivery Deal', discount: 'Demo: 20% off selected orders', detail: 'Sample student promo for selected restaurants and delivery orders.', location: 'Pakistan', url: 'https://www.foodpanda.pk/' },
    { brand: 'Local Campus Cafes', title: 'Campus Coffee Discount', discount: 'Demo: 15% off', detail: 'Sample offer for participating cafes near universities.', location: 'Pakistan', url: 'https://www.google.com/maps' },
    { brand: 'StudentHub Partner Cafe', title: 'Coffee & Snacks Deal', discount: 'Demo: Buy 1 Get 1', detail: 'Sample local partner offer for verified students.', location: 'Pakistan', url: 'https://www.google.com/maps' }
  ],
  travel: [
    { brand: 'Emirates', title: 'Student Travel Fare', discount: 'Demo: Up to 10% off', detail: 'Sample student travel offer for selected routes and fare classes.', location: 'International', url: 'https://www.emirates.com/' },
    { brand: 'Daewoo Express', title: 'Student Bus Fare', discount: 'Demo: 15% off', detail: 'Sample student discount for selected intercity routes with student ID.', location: 'Pakistan', url: 'https://daewooexpress.com.pk/' },
    { brand: 'Airblue', title: 'Student Flight Offer', discount: 'Demo: 10% off', detail: 'Sample student fare for selected domestic routes.', location: 'Pakistan', url: 'https://www.airblue.com/' },
    { brand: 'Sastaticket.pk', title: 'Student Booking Deal', discount: 'Demo: PKR 1,000 off', detail: 'Sample promotion for selected flights and travel bookings.', location: 'Pakistan', url: 'https://www.sastaticket.pk/' },
    { brand: 'StudentHub Hotel Partners', title: 'Student Hotel Rate', discount: 'Demo: 15% off', detail: 'Sample partner rate for verified students at participating hotels.', location: 'Pakistan', url: 'https://www.google.com/travel/hotels' }
  ],
  entertainment: [
    { brand: 'Spotify', title: 'Student Premium', discount: 'Demo: 50% off', detail: 'Sample student pricing for Premium music streaming.', location: 'Online', url: 'https://www.spotify.com/student/' },
    { brand: 'Netflix', title: 'Student Streaming Deal', discount: 'Demo: 20% off', detail: 'Sample StudentHub promotional offer for streaming.', location: 'Online', url: 'https://www.netflix.com/' },
    { brand: 'Cinepax Pakistan', title: 'Student Cinema Ticket', discount: 'Demo: 20% off', detail: 'Sample student ticket discount for selected screenings.', location: 'Pakistan', url: 'https://cinepax.com/' },
    { brand: 'Local Cinemas', title: 'Student Movie Night', discount: 'Demo: 15% off', detail: 'Sample student pricing at participating local cinemas.', location: 'Pakistan', url: 'https://www.google.com/maps' },
    { brand: 'StudentHub Entertainment Partners', title: 'Student Weekend Deal', discount: 'Demo: 25% off', detail: 'Sample offer covering selected entertainment experiences.', location: 'Pakistan', url: 'https://www.google.com/maps' }
  ]
}

const Discounts = () => {
  const [selectedCategory, setSelectedCategory] = useState('software')

  const selected = useMemo(
    () => categories.find((category) => category.id === selectedCategory) || categories[0],
    [selectedCategory]
  )

  const selectedOffers = offers[selectedCategory] || []

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} /> Demo Student Offers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Discounts</h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Explore sample student discounts across technology, food, travel, and entertainment.
          </p>
          <p className="text-sm text-amber-100/90 mt-4">
            Prototype notice: offers and percentages below are demo content and should be verified with each partner before publication.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose a Discount Category</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Click any category to instantly view its available demo student offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {categories.map((category) => {
              const Icon = category.icon
              const active = selectedCategory === category.id
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-left bg-white p-7 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    active
                      ? 'border-amber-400 shadow-xl ring-1 ring-amber-200'
                      : 'border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-5">
                      <Icon className={category.iconClass} size={40} />
                    </div>
                    {active && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                        <CheckCircle2 size={14} /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Examples:</span> {category.examples}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Selected category</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">{selected.title}</h2>
              <p className="text-gray-600 mt-2">{selected.description}</p>
            </div>
            <span className="text-sm text-gray-500">{selectedOffers.length} demo offers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedOffers.map((offer) => (
              <article key={`${selectedCategory}-${offer.brand}`} className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">{offer.brand}</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{offer.title}</h3>
                  </div>
                  <span className="shrink-0 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-sm font-bold">
                    {offer.discount}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-5">{offer.detail}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} /> {offer.location}
                  </span>
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-semibold transition"
                  >
                    View Partner <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verify Student Status</h3>
              <p className="text-gray-600">Quick verification with your university email or student ID.</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Discounts</h3>
              <p className="text-gray-600">Select a category and compare the available demo offers.</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verify & Redeem</h3>
              <p className="text-gray-600">Open the partner site and confirm the real student offer before redeeming.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Tag size={64} className="mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">More Student Deals Coming</h2>
          <p className="text-xl text-amber-100 mb-8">
            StudentHub can expand these categories with verified local and international partners.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-amber-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Discounts

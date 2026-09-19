import { Link } from 'react-router-dom'
import { Briefcase, Target, Tag, ArrowRight, TrendingUp, Users, Award } from 'lucide-react'

const Home = () => {
  const services = [
    {
      icon: <Briefcase size={48} className="text-blue-600" />,
      title: 'Jobs & Internships',
      description: 'Browse 1000+ opportunities from top companies. Find your perfect match with our map-based search and personalized recommendations.',
      ctaText: 'Explore Jobs',
      ctaLink: '/jobs',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100'
    },
    {
      icon: <Target size={48} className="text-purple-600" />,
      title: 'Career Counselling',
      description: 'AI-powered career guidance tailored to your goals. Get personalized recommendations, skill analysis, and expert advice to accelerate your career.',
      ctaText: 'Start Assessment',
      ctaLink: '/career',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-100',
      badge: 'Coming Soon'
    },
    {
      icon: <Tag size={48} className="text-amber-600" />,
      title: 'Student Discounts',
      description: 'Exclusive deals on software, food, travel, and more. Verified students get access to premium services at student-friendly prices.',
      ctaText: 'Browse Discounts',
      ctaLink: '/discounts',
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      hoverBg: 'hover:bg-amber-100',
      badge: 'Coming Soon'
    }
  ]

  const stats = [
    { number: '1000+', label: 'Active Jobs' },
    { number: '500+', label: 'Companies' },
    { number: '50+', label: 'Student Discounts' },
    { number: '10k+', label: 'Students Helped' }
  ]

  const features = [
    {
      icon: <TrendingUp className="text-blue-600" size={32} />,
      title: 'Career Growth',
      description: 'Find opportunities that align with your career goals and aspirations'
    },
    {
      icon: <Users className="text-purple-600" size={32} />,
      title: 'Expert Guidance',
      description: 'Get personalized advice from career counselors and AI-powered insights'
    },
    {
      icon: <Award className="text-amber-600" size={32} />,
      title: 'Exclusive Benefits',
      description: 'Access student discounts and perks from leading brands and services'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Complete Career Companion
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            Find opportunities, get guidance, save money — all in one platform designed for students
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/jobs"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Primary Service Blocks */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              StudentHub brings together job opportunities, career guidance, and exclusive student benefits in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${service.hoverBg}`}
              >
                <div className="p-8">
                  {/* Icon */}
                  <div className={`${service.bgColor} w-20 h-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>

                  {/* Title with Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                    {service.badge && (
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    to={service.ctaLink}
                    className={`block w-full text-center bg-gradient-to-r ${service.gradient} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    {service.ctaText} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose StudentHub?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A comprehensive platform built specifically for students to navigate their career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-50 p-5 rounded-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students who are building successful careers with StudentHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

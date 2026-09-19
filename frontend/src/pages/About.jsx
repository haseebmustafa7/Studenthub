import { Users, Target, Award, Heart } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: <Target className="text-blue-600" size={40} />,
      title: 'Our Mission',
      description: 'Empowering students to build successful careers through access to opportunities, guidance, and resources.'
    },
    {
      icon: <Users className="text-purple-600" size={40} />,
      title: 'Student-First',
      description: 'Every feature and decision is made with students\' best interests and success in mind.'
    },
    {
      icon: <Award className="text-amber-600" size={40} />,
      title: 'Excellence',
      description: 'We partner with top companies and experts to provide the highest quality opportunities and advice.'
    },
    {
      icon: <Heart className="text-red-600" size={40} />,
      title: 'Community',
      description: 'Building a supportive community where students can grow, learn, and succeed together.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About StudentHub
          </h1>
          <p className="text-xl text-blue-100">
            Your trusted partner in building a successful career
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed space-y-4">
              <p>
                StudentHub was created with a simple yet powerful vision: to help students navigate their career journey with confidence. We understand the challenges students face when looking for internships, planning their careers, and managing student life on a budget.
              </p>
              <p>
                That's why we built a comprehensive platform that brings together job opportunities, career counselling, and student discounts — everything a student needs to succeed, all in one place.
              </p>
              <p>
                Today, we're proud to serve thousands of students, connecting them with top companies, expert career advisors, and exclusive student benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-gray-600 text-lg">
              Making a real difference in students' lives
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Job Placements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

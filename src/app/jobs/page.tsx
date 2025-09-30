export default function JobsPage() {
  const jobListings = [
    {
      id: 1,
      title: "Peer Support Specialist",
      organization: "NYC Recovery Centers",
      location: "Manhattan",
      type: "Full-time",
      salary: "$45,000 - $55,000",
      description: "Support individuals in their recovery journey through peer mentoring and guidance.",
      requirements: ["Lived experience with recovery", "Peer support certification preferred", "Strong communication skills"],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Community Outreach Coordinator",
      organization: "Brooklyn Community Health",
      location: "Brooklyn",
      type: "Part-time",
      salary: "$25 - $30/hour",
      description: "Connect community members with local resources and support services.",
      requirements: ["Experience in community work", "Bilingual preferred", "NYC residency required"],
      posted: "5 days ago"
    },
    {
      id: 3,
      title: "Mental Health Peer Counselor",
      organization: "Queens Wellness Center",
      location: "Queens",
      type: "Full-time",
      salary: "$42,000 - $48,000",
      description: "Provide peer counseling and support for individuals facing mental health challenges.",
      requirements: ["Mental health first aid certification", "2+ years peer support experience", "Group facilitation skills"],
      posted: "1 week ago"
    },
    {
      id: 4,
      title: "Recovery Coach",
      organization: "Bronx Support Network",
      location: "Bronx",
      type: "Contract",
      salary: "$35/hour",
      description: "Guide individuals through their recovery process with personalized coaching and support.",
      requirements: ["Certified Recovery Coach", "Trauma-informed care training", "Flexible schedule"],
      posted: "3 days ago"
    },
    {
      id: 5,
      title: "Peer Advocate",
      organization: "Staten Island Community Services",
      location: "Staten Island",
      type: "Full-time",
      salary: "$40,000 - $45,000",
      description: "Advocate for community members' rights and help navigate social services.",
      requirements: ["Advocacy experience", "Knowledge of NYC social services", "Empathy and patience"],
      posted: "1 day ago"
    },
    {
      id: 6,
      title: "Group Facilitator",
      organization: "Manhattan Peer Support",
      location: "Manhattan",
      type: "Part-time",
      salary: "$30 - $35/hour",
      description: "Facilitate peer support groups and community workshops.",
      requirements: ["Group facilitation certification", "Public speaking experience", "Evening availability"],
      posted: "4 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Peer Support Jobs in NYC
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find meaningful opportunities to make a difference in your community. Connect with organizations looking for peers with lived experience.
            </p>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>All Boroughs</option>
                <option>Manhattan</option>
                <option>Brooklyn</option>
                <option>Queens</option>
                <option>Bronx</option>
                <option>Staten Island</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>All Levels</option>
                <option>Entry Level</option>
                <option>1-2 years</option>
                <option>3+ years</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Filter Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobListings.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      job.type === 'Full-time' ? 'bg-green-100 text-green-800' :
                      job.type === 'Part-time' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.type}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m-5-10V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 6V9a2 2 0 012-2h4a2 2 0 012 2v6m-6 0h6" />
                    </svg>
                    <span className="font-medium">{job.organization}</span>
                    <span className="mx-2">"</span>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                    <span className="mx-2">"</span>
                    <span className="font-medium text-green-600">{job.salary}</span>
                  </div>

                  <p className="text-gray-700 mb-3">{job.description}</p>

                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Requirements:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-sm text-gray-500">Posted {job.posted}</div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 lg:flex-shrink-0">
                  <button className="w-full lg:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Don't See the Right Opportunity?
          </h3>
          <p className="text-gray-700 mb-6">
            New peer support positions are posted regularly. Join our community to get notified about opportunities that match your skills and interests.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Join Job Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
import React from 'react'
import { Calendar, Clock, User, MapPin } from 'lucide-react'

const Scheduling: React.FC = () => {
  const schedule = [
    {
      id: '1',
      date: '2024-02-01',
      jobs: [
        {
          id: '1',
          title: 'Fire Alarm Installation',
          customer: 'ABC Security Ltd',
          engineer: 'Mike Engineer',
          startTime: '09:00',
          endTime: '17:00',
          location: '123 Business Park, London',
          status: 'scheduled'
        },
        {
          id: '2',
          title: 'Emergency Lighting Test',
          customer: 'XYZ Business Park',
          engineer: 'Sarah Technician',
          startTime: '10:00',
          endTime: '12:00',
          location: '456 Industrial Estate, Manchester',
          status: 'scheduled'
        }
      ]
    },
    {
      id: '2',
      date: '2024-02-02',
      jobs: [
        {
          id: '3',
          title: 'CCTV System Service',
          customer: 'Tech Solutions Ltd',
          engineer: 'Mike Engineer',
          startTime: '13:00',
          endTime: '16:00',
          location: '789 Tech Park, Birmingham',
          status: 'scheduled'
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
        <div className="flex space-x-3">
          <button className="btn-secondary">Day View</button>
          <button className="btn-secondary">Week View</button>
          <button className="btn-primary">Month View</button>
        </div>
      </div>

      {/* Schedule Calendar */}
      <div className="grid grid-cols-1 gap-6">
        {schedule.map((day) => (
          <div key={day.id} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {new Date(day.date).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            <div className="space-y-4">
              {day.jobs.map((job) => (
                <div key={job.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.customer}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        {job.engineer}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.startTime} - {job.endTime}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Reschedule
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Available Engineers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Engineers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: '1',
              name: 'Mike Engineer',
              skills: ['Fire Alarms', 'CCTV', 'Access Control'],
              available: true,
              todayJobs: 2
            },
            {
              id: '2',
              name: 'Sarah Technician',
              skills: ['Emergency Lighting', 'Fire Extinguishers'],
              available: true,
              todayJobs: 1
            },
            {
              id: '3',
              name: 'David Specialist',
              skills: ['Gas Safety', 'Complex Systems'],
              available: false,
              todayJobs: 0
            },
            {
              id: '4',
              name: 'Lisa Installer',
              skills: ['Intruder Alarms', 'CCTV'],
              available: true,
              todayJobs: 1
            }
          ].map((engineer) => (
            <div key={engineer.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{engineer.name}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  engineer.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {engineer.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <p>Jobs today: {engineer.todayJobs}</p>
              </div>
              <div className="text-xs text-gray-500">
                {engineer.skills.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Scheduling

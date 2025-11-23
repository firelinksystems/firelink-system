import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar, User, Building } from 'lucide-react'

const Jobs: React.FC = () => {
  const jobs = [
    {
      id: '1',
      title: 'Fire Alarm Installation - Office Building',
      customer: 'ABC Security Ltd',
      jobType: 'INSTALLATION',
      status: 'SCHEDULED',
      priority: 'HIGH',
      scheduledStart: '2024-02-01T09:00:00Z',
      scheduledEnd: '2024-02-01T17:00:00Z',
      estimatedHours: 8,
      engineer: 'Mike Engineer'
    },
    {
      id: '2',
      title: 'Emergency Lighting Service',
      customer: 'XYZ Manufacturing',
      jobType: 'SERVICE',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      scheduledStart: '2024-01-31T10:00:00Z',
      scheduledEnd: '2024-01-31T14:00:00Z',
      estimatedHours: 4,
      engineer: 'Sarah Technician'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      EMERGENCY: 'bg-red-100 text-red-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <Link
          to="/jobs/new"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field pl-10"
            />
          </div>
        </div>
        <select className="input-field sm:w-32">
          <option>All Status</option>
          <option>Scheduled</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select className="input-field sm:w-32">
          <option>All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Emergency</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.customer}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {job.engineer}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(job.scheduledStart).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Job Type:</span>
                    <p className="font-medium">{job.jobType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estimated Hours:</span>
                    <p className="font-medium">{job.estimatedHours}h</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Scheduled Start:</span>
                    <p className="font-medium">
                      {new Date(job.scheduledStart).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Scheduled End:</span>
                    <p className="font-medium">
                      {new Date(job.scheduledEnd).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <Link
                to={`/jobs/${job.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Details
              </Link>
              <Link
                to={`/jobs/${job.id}/profitability`}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium"
              >
                View P&L
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Jobs

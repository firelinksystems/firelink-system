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
        <div className="flex space-x-

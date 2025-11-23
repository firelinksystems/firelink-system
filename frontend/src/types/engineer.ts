export interface Engineer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  hourlyRate: number;
  isActive: boolean;
  createdAt: string;
  availability?: {
    [date: string]: string[];
  };
}

export interface EngineerAvailability {
  engineerId: string;
  date: string;
  availableSlots: string[];
}

export interface ScheduleItem {
  id: string;
  jobId: string;
  title: string;
  start: string;
  end: string;
  engineer: string;
  customer: string;
  status: string;
}

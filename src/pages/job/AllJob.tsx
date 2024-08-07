import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchAllJobs, Job } from '../../services/JobService';

const localizer = momentLocalizer(moment);

const jobStatusColors: { [key: string]: string } = {
  NEWREQUEST: 'yellow',
  WAITINGFORCONFIRM: 'orange',
  CONFIRM: 'red',
  ASSIGN: 'blue',
  START: 'lightgreen',
  COMPLETE: 'green',
  DONE: 'gray',
};

const AllJob: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await fetchAllJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      }
    };

    fetchJobs();
  }, []);

  const events = jobs.map((job) => ({
    id: job.id,
    title: job.jobDescription,
    start: new Date(job.jobDateAndTime),
    end: new Date(moment(job.jobDateAndTime).add(job.estimateTime, 'hours').toString()),
    allDay: false,
    resource: job,
  }));

  const eventStyleGetter = (event: any) => {
    const backgroundColor = jobStatusColors[event.resource.jobStatus];
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <div>
      <h2>All Job</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default AllJob;

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Grid, Card, CardContent } from '@mui/material';
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

  const glassCardStyles = {
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const glassContentStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '16px',
  };

  return (
    <div>
      <Grid item xs={12} sm={12} md={12} paddingBottom={2}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}><h2>All Job</h2></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} paddingBottom={2}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                eventPropGetter={eventStyleGetter}
              />
            </CardContent>
          </Card>
        </Grid>
    </div>
  );
};

export default AllJob;

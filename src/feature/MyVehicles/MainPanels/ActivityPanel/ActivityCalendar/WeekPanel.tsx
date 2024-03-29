import React, { useContext, useState } from 'react';
import { Box, Chip, Fab, Grid, Link, Stack, Typography } from '@mui/material';
import { Activity } from '../../../../../store/model/Activity';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';
import { fetchActivity } from '../../../../../store/vehicleActivitiesSlice';
import { useAppDispatch } from '../../../../../App.hooks';
import { ErrorsContext } from '../ActivityContext';
import { timeFormatter } from '../../../../../App.utils';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { DATE_FORMAT } from '../../../../../App.constants';
import './WeekPanel.css';

interface Props {
  activities?: Activity[]
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function WeekPanel ({activities}:Props) {
  const [dateOfSun, setDateOfSun] = useState(dayjs().subtract(dayjs().day(), 'day'));
  const dispatch = useAppDispatch();
  const {setErrors} = useContext(ErrorsContext);

  const getWeekMonthYear = ():string => {
    return dateOfSun.format('MMMM YYYY');
  }

  const getWeekDate = (currentWeekDay:number):number => {
    return dateOfSun.add(currentWeekDay, 'day').date();
  }

  const isToday = (currentWeekDay:number):boolean => {
    return dateOfSun.add(currentWeekDay, 'day').format(DATE_FORMAT) === (dayjs().format(DATE_FORMAT));
  }

  const getColorName = (currentWeekDay:number):string => {
    return isToday(currentWeekDay) ? 'primary' : 'secondary';
  }

  const getFontWeight = (currentWeekDay:number):string => {
    return isToday(currentWeekDay) ? 'bold' : 'normal';
  }

  const filterActivitiesByDate = (activities:Activity[] | undefined, currentWeekDay:number):Activity[] => {
    const currentDate = dateOfSun.add(currentWeekDay, 'day').format(DATE_FORMAT);
    return activities?.filter(activity => activity.startDate?.startsWith(currentDate)) || [];
  }

  const handleClick = async (activityId: number): Promise<void> => {
    try {
      await dispatch(fetchActivity(activityId));
      setErrors({hasUpdate: false});
    } catch (error) {
      console.error(error);
    }
  }

  const handlePreviousClick = () => {
    setDateOfSun(prevDate => prevDate.subtract(7, 'day'));
  }

  const handleNextClick = () => {
    setDateOfSun(prevDate => prevDate.add(7, 'day'));
  }

  const handleTodayClick = () => {
    setDateOfSun(dayjs().subtract(dayjs().day(), 'day'));
  }

  return (
    <Box mb={1} mt={1}>
      <Stack alignItems='center'>
        <Typography variant='body1' fontWeight='bold'>{getWeekMonthYear()}</Typography>

        <Grid container spacing={0}>
          <Box className="calendar-previous-btn">
            <Fab
              size={'small'}
              aria-label="previous"
              variant="extended"
              onClick={handlePreviousClick}
            >
              <NavigateBefore/>
            </Fab>
          </Box>
          <Box className="calendar-today-btn">
            <Fab
              size={'small'}
              aria-label="previous"
              variant="extended"
              onClick={handleTodayClick}
            >
              Today
            </Fab>
          </Box>
          <Box className="calendar-next-btn">
            <Fab
              size={'small'}
              aria-label="next"
              variant="extended"
              onClick={handleNextClick}
            >
              <NavigateNext/>
            </Fab>
          </Box>

          {daysOfWeek.map((day, idx) => (
            <Grid key={idx} {...{ lg: 1.7143 }} item={true}>
              <Box
                mt={1}
                justifyContent='center'
                sx={{borderBottom: '1px solid', height: '33px', display: 'flex', alignItems: 'end'}}
              >
                <Typography
                  fontSize={isToday(idx) ? '22px' : '16px'}
                  fontWeight={isToday(idx) ? 'bold' : 'normal'}
                  color={getColorName(idx)}
                  textTransform='uppercase'
                  align="center"
                >
                  {day}
                </Typography>
              </Box>
              <Box pl={0.5} ml={0.2} height='83%' sx={{backgroundColor: isToday(idx) ? grey[700] : grey[900]}}>
                <Typography fontWeight={getFontWeight(idx)} variant='h6'>
                  {getWeekDate(idx)}
                </Typography>
                <Box key={idx} minHeight={129}>
                  { filterActivitiesByDate(activities, idx).map((activity, index) => (
                    <Box key={index}>
                      <Chip className="time-chip" label={timeFormatter(activity.startDate, true)}/>
                      <Link onClick={ ()=> handleClick(activity.id) } color="secondary" variant="body2">
                        {activity.name}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  )
}

export default WeekPanel;
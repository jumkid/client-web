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

  return (
    <Box mb={1} mt={1}>
      <Stack alignItems='center'>
        <Typography variant='body1' fontWeight='bold'>{getWeekMonthYear()}</Typography>

        <Grid container spacing={0}>
          {daysOfWeek.map((day, idx) => (
            <Grid {...{ lg: 1.7143 }}>
              <Fab
                size={'small'}
                sx={{position: 'absolute', top: 90, left: 6}}
                aria-label="previous"
                variant="circular"
                onClick={handlePreviousClick}
              >
                <NavigateBefore/>
              </Fab>
              <Fab
                size={'small'}
                sx={{position: 'absolute', top: 90, right: 6}}
                aria-label="next"
                variant="circular"
                onClick={handleNextClick}
              >
                <NavigateNext/>
              </Fab>

              <Box
                mt={1}
                justifyContent='center'
                sx={{borderBottom: '1px solid', height: '33px', display: 'flex', alignItems: 'end'}}
              >
                <Typography
                  fontSize={isToday(idx) ? '22px' : '16px'}
                  fontWeight={isToday(idx) ? 'bold' : 'normal'}
                  textTransform='uppercase'
                  align="center"
                >
                  {day}
                </Typography>
              </Box>
              <Box pl={0.5} ml={0.2} height='100%' sx={{backgroundColor: isToday(idx) ? grey[700] : grey[900]}}>
                <Typography fontWeight={getFontWeight(idx)} variant='h6'>
                  {getWeekDate(idx)}
                </Typography>
                <Box key={idx} minHeight={129}>
                  { filterActivitiesByDate(activities, idx).map(activity => (
                    <>
                      <Chip className="time-chip" label={timeFormatter(activity.startDate, true)}/>
                      <Link onClick={ ()=> handleClick(activity.id) } color="secondary" variant="body2">
                        {activity.name}
                      </Link>
                    </>
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
import React from 'react';
import { Activity } from '../../../../../store/model/Activity';
import WeekPanel from './WeekPanel';

interface Props {
  mode: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR',
  activities?: Activity[]
}

function ActivityCalendar ({mode, activities}:Props) {
  return (
    <>
      {mode === 'WEEK' && <WeekPanel activities={activities}/>}
    </>
  )
}

export default ActivityCalendar;
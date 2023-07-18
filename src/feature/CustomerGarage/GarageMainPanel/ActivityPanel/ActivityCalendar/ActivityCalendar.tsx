import React from 'react';
import { Activity } from '../../../../../store/model/Activity';
import WeekPanel from './WeekPanel';
import * as C from '../../../../../App.constants';

interface Props {
  mode: typeof C.DAY | typeof C.WEEK | typeof C.MONTH | typeof C.YEAR
  activities?: Activity[]
}

function ActivityCalendar ({mode, activities}:Props) {
  return (
    <>
      { mode === C.WEEK && <WeekPanel activities={activities}/> }
    </>
  )
}

export default ActivityCalendar;
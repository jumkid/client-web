import React, { useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  Icon, IconButton,
  Link,
  TextField
} from '@mui/material';
import * as C from '../../../App.constants';
import { Clear, PlayArrow, Search } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { changePick, fetchUserVehicles } from '../../../store/userVehiclesSlice';

interface Props {
  searchKeyword:string
  changeSearchKeyword: (value:string) => void
}

function VehicleListViewer ({searchKeyword, changeSearchKeyword}:Props) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const userVehicles = useAppSelector(state => state.userVehicles.vehicles);
  const dispatch = useAppDispatch();

  const handleClick = (index:number) => {
    // the first two index (0 and 1) of tabs are used for specific actions
    dispatch(changePick(index + 2));
  };

  const handleSearch = (event:React.FormEvent<HTMLFormElement> | undefined) => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    const pagingSearch = { keyword: searchKeyword, page: 1, size: C.DEFAULT_PAGE_SIZE }
    dispatch(fetchUserVehicles(pagingSearch)).then(() => {
      setIsSubmitted(false);
    });
    event && event.preventDefault();
  }

  const handleClearClick = ():void => {
    changeSearchKeyword('');
    setIsSubmitted(true);
    const pagingSearch = { keyword: '*', page: 1, size: C.DEFAULT_PAGE_SIZE }
    dispatch(fetchUserVehicles(pagingSearch)).then(() => {
      setIsSubmitted(false);
    });
  }

  const handleSearchChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    const { value } = event.target;
    changeSearchKeyword(value);
  }

  return (
    <Box>
      <form onSubmit={handleSearch}>
        <FormControl>
          <Box sx={{ p: 2 }}>
            <TextField
              sx={{ width: "480px", mt: 2 }}
              name="search"
              placeholder="search vehicles in your garage"
              variant="standard"
              value={searchKeyword}
              onChange={handleSearchChange}
              disabled={isSubmitted}
              InputProps={{
                endAdornment: (<IconButton
                  sx={{visibility: searchKeyword? "visible": "hidden"}}
                  onClick={handleClearClick}><Clear/></IconButton>)
              }}
            />
            <IconButton sx={{ mt: 2 }} type="submit" aria-label="search" disabled={isSubmitted}>
              <Search color="primary" fontSize="medium" />
            </IconButton>
          </Box>
        </FormControl>
      </form>

      <Box sx={{ p: 1 }}>
        { userVehicles && userVehicles.map((vehicle, index) => (
          <Card raised key={index}>
            <CardHeader
              titleTypographyProps={{ fontWeight: 'bold', noWrap: true, width: 328 }}
              title={vehicle.name}
              subheader={vehicle.trimLevel}
            />
            <CardContent>
              <Chip
                icon={<Icon sx={{ background: `url(${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicle.make}.png) no-repeat top left`, backgroundSize: "contain" }} />}
                label={vehicle.make}
              />
              <Chip label={vehicle.model} />
              <Chip label={vehicle.modelYear} />
            </CardContent>
            <CardActions>
              <PlayArrow fontSize="small"/><Link onClick={ ()=> handleClick(index) } color="secondary" variant="body1">Details</Link>
            </CardActions>
          </Card>
        ))
        }
      </Box>
    </Box>
  );
}

export default VehicleListViewer;

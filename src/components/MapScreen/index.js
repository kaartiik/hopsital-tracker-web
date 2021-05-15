import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientLocation } from '../../providers/actions/Users';

import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

function MapScreen(props) {
  const dispatch = useDispatch();
  const query = new URLSearchParams(props.location.search);
  const patientUuid = query.get('patientUuid');
  const [latitude, setLatitude] = useState(3.1221418660839215);
  const [longitude, setLongitude] = useState(101.68764824075234);

  const { patientLocation, isLoading } = useSelector((state) => ({
    patientLocation: state.usersReducer.patientLocation,
    isLoading: state.userReducer.isLoading,
  }));

  useEffect(() => {
    if (
      patientUuid !== '' &&
      patientUuid !== null &&
      patientUuid !== undefined
    ) {
      dispatch(getPatientLocation(patientUuid));
    }
  }, [dispatch, patientUuid]);

  useEffect(() => {
    if (
      patientLocation !== '' &&
      patientLocation !== null &&
      patientLocation !== undefined
    ) {
      console.log(patientLocation);
      setLatitude(patientLocation.latitude);
      setLongitude(patientLocation.longitude);
    }
  }, [patientLocation]);

  return (
    <div>
      <Helmet>
        <title>Map</title>
      </Helmet>
      <Map
        google={props.google}
        zoom={14}
        style={{
          width: '100%',
          height: '100%',
        }}
        center={{
          lat: latitude,
          lng: longitude,
        }}
        initialCenter={{
          lat: 3.1221418660839215,
          lng: 101.68764824075234,
        }}
      >
        <Marker
          onClick={() => alert('clicked')}
          name={'This is test name'}
          position={{ lat: latitude, lng: longitude }}
        />
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAg9-AnXSb_LMmhY0_s6UhVF9NY3K3X5pk',
})(MapScreen);

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { Updates } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Region } from 'react-native-maps';
import BreweryMap from './components/BreweryMap';
import BreweryList from './components/BreweryList';
// import MyLocationButton from './components/MyLocationButton';
import { StoreProvider, useBreweries, useMapRegion } from './hooks';
import { connect } from './db';

const filterBreweries = (breweries: any[], region: Region) => {
  const latDif = region.latitudeDelta / 2;
  const lngDif = region.longitudeDelta / 2;
  return breweries.filter((brewery) => {
    if (brewery.lat < region.latitude - latDif
        || brewery.lat > region.latitude + latDif
        || brewery.lng < region.longitude - lngDif
        || brewery.lng > region.longitude + lngDif) {
      return false;
    }

    return true;
  });
}

export default function App() {
  connect();

  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (err) {
        console.log(err);
      }
      if (!__DEV__) {
        const result = await Updates.checkForUpdateAsync();
        console.log(result)
        setUpdateIsAvailable(result.isAvailable);
      }
    })()
  }, [])

  const breweries = useBreweries();
  const [mapRegion, setMapRegion] = useMapRegion();
  const [updateAvailable, setUpdateIsAvailable] = useState(false);

  const breweriesInMap = filterBreweries(breweries, mapRegion);

  return (
    <StoreProvider>
      <View style={styles.container}>
        <BreweryMap 
          breweries={breweries} 
          initialRegion={mapRegion}
          onRegionChangeComplete={(region => setMapRegion(region))}
        />
        <View style={styles.bottom} >
          { updateAvailable && 
            <Button 
              title="update"
              onPress={async () => {
                await Updates.reload();
              }}
            />
          }
          <BreweryList breweries={breweriesInMap} />
        </View>
      </View>
      {/* <MyLocationButton /> */}
    </StoreProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end'
  },
  bottom: {
    height: '20%',
    width: '100%',
  },
});

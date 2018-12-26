import React from 'react';
import { GoogleMapsContext } from '../GoogleMaps';

export interface IGoogleMapsMarkerProps {
  draggable?: boolean;
  lat: number;
  lng: number;
  title: string;
}

export default class GoogleMapsMarker extends React.Component<IGoogleMapsMarkerProps> {
  public addMarkerOnClick = (map: google.maps.Map) => {
    const marker = new google.maps.Marker();
    marker.setMap(map);
    google.maps.event.addListener(map, 'click', (evt: any) => {
      marker.setPosition(evt.latLng);
    });
  };
  public render() {
    return (
      <GoogleMapsContext.Consumer>
        {({ map }) => {
          const { draggable, lat, lng, title } = this.props;
          const position = { lat, lng };
          // tslint:disable-next-line:no-unused-expression
          new google.maps.Marker({
            draggable,
            map,
            position,
            title
          });
          return null;
        }}
      </GoogleMapsContext.Consumer>
    );
  }
}

import { withStyles, WithStyles } from '@material-ui/core';
import React from 'react';

export interface IGoogleMapsProps extends WithStyles<typeof styles> {
  lat: number;
  lng: number;
  zoom?: number;
  // passes location coordinations from marker to parent
  onPickLocation: (coords: [number, number]) => void;
}

export interface IGoogleMapsContext {
  map?: google.maps.Map;
  markers: Map<string, google.maps.Marker>;
}

export interface IGoogleMapState extends IGoogleMapsContext {
  mapsLoaded: boolean;
  selectedLocation: {
    lat: number;
    lng: number;
  };
}

export const GoogleMapsContext = React.createContext<IGoogleMapsContext>({
  map: undefined,
  markers: new Map()
});

class GoogleMap extends React.Component<IGoogleMapsProps, IGoogleMapState> {
  public state = {
    map: undefined,
    mapsLoaded: false,
    markers: new Map(),
    // initial state from passed location (maybe it isn't needed)
    selectedLocation: {
      lat: this.props.lat,
      lng: this.props.lng
    }
  };
  private wrapper?: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.wrapper = React.createRef();
  }

  public componentDidMount = () => {
    /**
     * Import the Google Maps script, but only if we haven't already loaded it once before
     */
    if (
      'undefined' === typeof google ||
      //
      !(google && google.maps)
    ) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.onload = this.waitForMapsScript;
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDbGrQPofvzeiuUkX-66RLlmh3udAjEBd0';
      document.body.appendChild(script);
    } else {
      this.waitForMapsScript();
    }
  };

  public waitForMapsScript = () => {
    if ('undefined' !== typeof google && google.maps && this.wrapper) {
      const { zoom = 8, lat = 0, lng = 0 } = this.props;
      const center = { lat, lng };
      const map = new google.maps.Map(this.wrapper.current, {
        center,
        zoom
      });

      // Remove this part: marker and marker.setMap() 
      const marker = new google.maps.Marker();
      marker.setMap(map);
      google.maps.event.addListener(map, 'click', (evt: any) => {
        const coords: [number, number] = [evt.latLng.lat(), evt.latLng.lng()];
        marker.setPosition(evt.latLng);
        this.setState({ selectedLocation: { lat: coords[0], lng: coords[1] } });
        this.props.onPickLocation(coords);
      });

      this.setState({ map, mapsLoaded: true });
    } else {
      // Fall back scenario in case this function gets called before the Google Maps script is fully parsed, probably won't happen
      window.setTimeout(this.waitForMapsScript, 100);
    }
  };

  public addMarkerToState = ({ id, marker }: { id: string; marker: google.maps.Marker }) => {
    this.setState(currState => {
      const markers = new Map(Array.from(currState.markers));
      markers.set(id, marker);
      return {
        ...currState,
        markers
      };
    });
  };

  public render() {
    return (
      <div className={this.props.classes.googleMapsWrapper}>
        <div className={this.props.classes.holder} ref={this.wrapper} />
        {this.state.mapsLoaded && (
          <GoogleMapsContext.Provider
            value={{
              map: this.state.map,
              markers: this.state.markers
            }}
          >
            {this.props.children}
          </GoogleMapsContext.Provider>
        )}
      </div>
    );
  }
}

const styles = {
  googleMapsWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '100%'
  },
  holder: {
    minHeight: '350px',
    width: '100%'
  }
};

export default withStyles(styles)(GoogleMap);

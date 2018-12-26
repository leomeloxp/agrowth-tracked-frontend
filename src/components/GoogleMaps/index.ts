import GoogleMapsMap, { GoogleMapsContext } from './GoogleMapsMap';
import GoogleMapsMarker from './GoogleMapsMarker';
/**
 * Make Google Maps related components work both as a namespace (`export default class¦) and as a named export (`export { name }`)
 */

export default class GoogleMaps {
  public static Map = GoogleMapsMap;
  public static Marker = GoogleMapsMarker;
  public static GoogleMapsContext = GoogleMapsContext;
}

export { GoogleMapsContext, GoogleMapsMap, GoogleMapsMarker };

import dotIcon from '$src/assets/icons/dot.svg';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api';
import { useState } from 'react';

type Point = { lat: number; lng: number };

export type MapProps = {
  /** center of map */
  center: Point;
  /** Zoom level of map */
  zoom: number;
  /** Markers to place on map */
  markers: {
    position: Point;
    name: string;
    url: string;
  }[];
};

const MAP_STYLES = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e9e9e9'
      },
      {
        lightness: 17
      }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5'
      },
      {
        lightness: 20
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff'
      },
      {
        lightness: 17
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#ffffff'
      },
      {
        lightness: 29
      },
      {
        weight: 0.2
      }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff'
      },
      {
        lightness: 18
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff'
      },
      {
        lightness: 16
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5'
      },
      {
        lightness: 21
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dedede'
      },
      {
        lightness: 21
      }
    ]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'on'
      },
      {
        color: '#ffffff'
      },
      {
        lightness: 16
      }
    ]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        saturation: 36
      },
      {
        color: '#333333'
      },
      {
        lightness: 40
      }
    ]
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f2f2f2'
      },
      {
        lightness: 19
      }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#fefefe'
      },
      {
        lightness: 20
      }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#fefefe'
      },
      {
        lightness: 17
      },
      {
        weight: 1.2
      }
    ]
  }
];

/**
 * ### Google map with markers
 */
export function Map({ center, zoom = 8, markers = [] }: MapProps) {
  const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string
    }),
    [map, setMap] = useState<GoogleMap | null>(null),
    [openMarker, setOpenMarker] = useState<any>(null);

  return isLoaded ? (
    <div className="w-full aspect-w-3 aspect-h-2">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        options={{
          styles: MAP_STYLES,
          streetViewControl: false,
          mapTypeControl: false
        }}
        center={center}
        zoom={zoom}
        onLoad={() => setMap(map)}
        onUnmount={() => setMap(null)}
      >
        <>
          {markers.map((marker, i) => (
            <Marker
              onClick={() => setOpenMarker(marker)}
              icon={dotIcon}
              position={marker.position}
              title={marker.name}
              key={i}
            />
          ))}
          {openMarker && (
            <InfoWindow
              position={openMarker.position}
              onCloseClick={() => setOpenMarker(null)}
            >
              <div className="py-1">
                <a
                  className="inline-block font-medium text-black border-b border-red-700"
                  href={openMarker.url}
                >
                  {openMarker.name}
                </a>
              </div>
            </InfoWindow>
          )}
        </>
      </GoogleMap>
    </div>
  ) : null;
}

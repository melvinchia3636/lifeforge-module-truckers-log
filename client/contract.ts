export type EndpointSessionsList_OutputOK = {
  id: string;
  client_id: string;
  game: "ets2" | "ats" | "unknown";
  status: "active" | "completed" | "interrupted";
  started_at: string;
  started_game_min: number | null;
  finished_at: string | null;
  finished_game_min: number | null;
  truck_id: string;
  truck_name: string;
  truck_brand: string;
  truck_plate: string;
  created: string;
  updated: string;
}[];
export type EndpointEventsList_OutputOK = {
  id: string;
  session_id: string | null;
  job_id: string | null;
  kind: "fine" | "refuel" | "tollgate" | "ferry" | "train";
  game_min: number;
  amount: number;
  detail: string;
  created: string;
  x: number | null;
  z: number | null;
}[];
export type EndpointScreenshotsRemove_OutputNO_CONTENT = void;

export interface Contract {
  telemetry: {
    ingest: EndpointTelemetryIngest;
  };
  settings: {
    get: EndpointSettingsGet;
    rotate: EndpointSettingsRotate;
  };
  sessions: {
    get: EndpointSessionsGet;
    list: EndpointSessionsList;
    route: EndpointSessionsRoute;
  };
  jobs: {
    clearInterrupted: EndpointJobsClearInterrupted;
    get: EndpointJobsGet;
    list: EndpointJobsList;
    merge: EndpointJobsMerge;
  };
  events: {
    list: EndpointEventsList;
  };
  screenshots: {
    get: EndpointScreenshotsGet;
    list: EndpointScreenshotsList;
    remove: EndpointScreenshotsRemove;
    upload: EndpointScreenshotsUpload;
  };
  tiles: {
    get: EndpointTilesGet;
  };
}
export interface EndpointTelemetryIngest {
  method: "post";
  input: {
    body?: EndpointTelemetryIngest_InputBody;
  };
  output: any;
  media: null;
}
export interface EndpointTelemetryIngest_InputBody {
  token: string;
  clientId: string;
  messages: (
    | {
        type: "connected";
      }
    | {
        type: "disconnected";
      }
    | {
        type: "frame";
        frame: {
          t_ms: number;
          game_min?: number;
          speed_kmh?: number;
          rpm?: number;
          gear?: number;
          throttle?: number;
          brake?: number;
          steer?: number;
          clutch?: number;
          fuel_l?: number;
          adblue_l?: number;
          odometer_km?: number;
          cargo_damage?: number;
          x?: number;
          y?: number;
          z?: number;
          heading_deg?: number;
          cruise_control?: boolean;
          engine_on?: boolean;
          park_brake?: boolean;
          game?: "ets2" | "ats" | "unknown";
          truck_id?: string;
          truck_name?: string;
          truck_brand?: string;
          truck_plate?: string;
        };
      }
    | {
        type: "job-started";
        job: {
          game?: "ets2" | "ats" | "unknown";
          started_game_min?: number | null;
          cargo?: string;
          cargo_id?: string;
          cargo_mass_kg?: number;
          city_src?: string;
          city_src_id?: string;
          comp_src?: string;
          comp_src_id?: string;
          city_dst?: string;
          city_dst_id?: string;
          comp_dst?: string;
          comp_dst_id?: string;
          job_market?: string;
          special_job?: boolean;
          unit_count?: number;
          unit_mass_kg?: number;
          planned_distance_km?: number | null;
          income?: number;
          truck_id?: string;
          truck_name?: string;
          truck_brand?: string;
          truck_plate?: string;
          trailer_body_type?: string;
          trailer_id?: string;
          trailer_name?: string;
          trailer_brand?: string;
        };
      }
    | {
        type: "job-delivered";
        job: {
          finished_game_min?: number | null;
          delivered_distance_km?: number | null;
          delivery_time_min?: number | null;
          cargo_damage?: number;
          revenue?: number;
          xp?: number;
          autopark?: boolean;
          autoload?: boolean;
        };
      }
    | {
        type: "job-cancelled";
        job: {
          finished_game_min?: number | null;
          penalty?: number;
        };
      }
    | {
        type: "game-event";
        event: {
          kind: "fine" | "refuel" | "tollgate" | "ferry" | "train";
          game_min?: number;
          amount?: number;
          detail?: string;
        };
      }
  )[];
}
export interface EndpointSettingsGet {
  method: "get";
  input: {};
  output: {
    OK: EndpointSettingsGet_OutputOK;
  };
  media: null;
}
export interface EndpointSettingsGet_OutputOK {
  tokenLast4: string | null;
  tokenCreated: string | null;
}
export interface EndpointSettingsRotate {
  method: "post";
  input: {};
  output: {
    OK: EndpointSettingsRotate_OutputOK;
  };
  media: null;
}
export interface EndpointSettingsRotate_OutputOK {
  token: string;
  tokenLast4: string;
}
export interface EndpointSessionsGet {
  method: "get";
  input: {
    query?: EndpointSessionsGet_InputQuery;
  };
  output: {
    OK: EndpointSessionsGet_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsGet_InputQuery {
  id: string;
}
export interface EndpointSessionsGet_OutputOK {
  id: string;
  client_id: string;
  game: "ets2" | "ats" | "unknown";
  status: "active" | "completed" | "interrupted";
  started_at: string;
  started_game_min: number | null;
  finished_at: string | null;
  finished_game_min: number | null;
  truck_id: string;
  truck_name: string;
  truck_brand: string;
  truck_plate: string;
  created: string;
  updated: string;
}
export interface EndpointSessionsList {
  method: "get";
  input: {
    query?: EndpointSessionsList_InputQuery;
  };
  output: {
    OK: EndpointSessionsList_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsList_InputQuery {
  game?: "ets2" | "ats" | "unknown";
  status?: "active" | "completed" | "interrupted";
  from?: string;
  to?: string;
}
export interface EndpointSessionsRoute {
  method: "get";
  input: {
    query?: EndpointSessionsRoute_InputQuery;
  };
  output: {
    OK: EndpointSessionsRoute_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsRoute_InputQuery {
  sessionId: string;
  from?: string;
  to?: string;
}
export interface EndpointSessionsRoute_OutputOK {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: {
      [k: string]: unknown;
    };
    geometry: {
      type: string;
      coordinates: unknown;
    };
  }[];
}
export interface EndpointJobsClearInterrupted {
  method: "post";
  input: {};
  output: {
    OK: EndpointJobsClearInterrupted_OutputOK;
  };
  media: null;
}
export interface EndpointJobsClearInterrupted_OutputOK {
  cleared: number;
}
export interface EndpointJobsGet {
  method: "get";
  input: {
    query?: EndpointJobsGet_InputQuery;
  };
  output: {
    OK: EndpointJobsGet_OutputOK;
  };
  media: null;
}
export interface EndpointJobsGet_InputQuery {
  id: string;
}
export interface EndpointJobsGet_OutputOK {
  id: string;
  session_id: string | null;
  game: "ets2" | "ats" | "unknown";
  status: "active" | "delivered" | "cancelled" | "interrupted";
  started_at: string;
  started_game_min: number | null;
  finished_at: string | null;
  finished_game_min: number | null;
  cargo: string;
  cargo_id: string;
  cargo_mass_kg: number;
  city_src: string;
  city_src_id: string;
  comp_src: string;
  comp_src_id: string;
  city_dst: string;
  city_dst_id: string;
  comp_dst: string;
  comp_dst_id: string;
  job_market: string;
  special_job: boolean;
  unit_count: number;
  unit_mass_kg: number;
  planned_distance_km: number | null;
  delivered_distance_km: number | null;
  revenue: number;
  income: number;
  penalty: number;
  xp: number;
  cargo_damage: number;
  autopark: boolean;
  autoload: boolean;
  delivery_time_min: number | null;
  truck_id: string;
  truck_name: string;
  truck_brand: string;
  truck_plate: string;
  trailer_body_type: string;
  trailer_id: string;
  trailer_name: string;
  trailer_brand: string;
  created: string;
  updated: string;
  sample_count: number;
  distance_km: number | null;
  max_speed_kmh: number | null;
  avg_speed_kmh: number | null;
  fuel_used_l: number;
  adblue_used_l: number;
  idle_min: number;
  mergeable_count: number;
}
export interface EndpointJobsList {
  method: "get";
  input: {
    query?: EndpointJobsList_InputQuery;
  };
  output: {
    OK: EndpointJobsList_OutputOK;
  };
  media: null;
}
export interface EndpointJobsList_InputQuery {
  sessionId?: string;
  game?: "ets2" | "ats" | "unknown";
  status?: "active" | "delivered" | "cancelled" | "interrupted";
  from?: string;
  to?: string;
  page?: string;
  perPage?: string;
}
export interface EndpointJobsList_OutputOK {
  items: {
    id: string;
    session_id: string | null;
    game: "ets2" | "ats" | "unknown";
    status: "active" | "delivered" | "cancelled" | "interrupted";
    started_at: string;
    started_game_min: number | null;
    finished_at: string | null;
    finished_game_min: number | null;
    cargo: string;
    cargo_id: string;
    cargo_mass_kg: number;
    city_src: string;
    city_src_id: string;
    comp_src: string;
    comp_src_id: string;
    city_dst: string;
    city_dst_id: string;
    comp_dst: string;
    comp_dst_id: string;
    job_market: string;
    special_job: boolean;
    unit_count: number;
    unit_mass_kg: number;
    planned_distance_km: number | null;
    delivered_distance_km: number | null;
    revenue: number;
    income: number;
    penalty: number;
    xp: number;
    cargo_damage: number;
    autopark: boolean;
    autoload: boolean;
    delivery_time_min: number | null;
    truck_id: string;
    truck_name: string;
    truck_brand: string;
    truck_plate: string;
    trailer_body_type: string;
    trailer_id: string;
    trailer_name: string;
    trailer_brand: string;
    created: string;
    updated: string;
    sample_count: number;
    distance_km: number | null;
    max_speed_kmh: number | null;
    avg_speed_kmh: number | null;
    fuel_used_l: number;
    adblue_used_l: number;
    idle_min: number;
    mergeable_count: number;
  }[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
export interface EndpointJobsMerge {
  method: "post";
  input: {
    body?: EndpointJobsMerge_InputBody;
  };
  output: {
    OK: EndpointJobsMerge_OutputOK;
  };
  media: null;
}
export interface EndpointJobsMerge_InputBody {
  id: string;
}
export interface EndpointJobsMerge_OutputOK {
  merged: number;
}
export interface EndpointEventsList {
  method: "get";
  input: {
    query?: EndpointEventsList_InputQuery;
  };
  output: {
    OK: EndpointEventsList_OutputOK;
  };
  media: null;
}
export interface EndpointEventsList_InputQuery {
  sessionId?: string;
  jobId?: string;
  kind?: "fine" | "refuel" | "tollgate" | "ferry" | "train";
}
export interface EndpointScreenshotsGet {
  method: "get";
  input: {
    query?: EndpointScreenshotsGet_InputQuery;
  };
  output: {
    OK: EndpointScreenshotsGet_OutputOK;
  };
  media: null;
}
export interface EndpointScreenshotsGet_InputQuery {
  id: string;
}
export interface EndpointScreenshotsGet_OutputOK {
  id: string;
  session_id: string | null;
  job_id: string | null;
  client_id: string;
  game: "ets2" | "ats" | "unknown";
  captured_at: string;
  game_min: number | null;
  x: number | null;
  y: number | null;
  z: number | null;
  heading_deg: number | null;
  speed_kmh: number | null;
  truck_id: string;
  truck_name: string;
  truck_brand: string;
  truck_plate: string;
  filename: string;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  file_key: string;
  content_hash: string | null;
  created: string;
  updated: string;
  lon: number | null;
  lat: number | null;
  file: {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    thumbs: {
      size: string;
      key: string;
      width: number;
      height: number;
    }[];
  } | null;
}
export interface EndpointScreenshotsList {
  method: "get";
  input: {
    query?: EndpointScreenshotsList_InputQuery;
  };
  output: {
    OK: EndpointScreenshotsList_OutputOK;
  };
  media: null;
}
export interface EndpointScreenshotsList_InputQuery {
  jobId?: string;
  sessionId?: string;
  game?: "ets2" | "ats" | "unknown";
  from?: string;
  to?: string;
  page?: string;
  perPage?: string;
}
export interface EndpointScreenshotsList_OutputOK {
  items: {
    id: string;
    session_id: string | null;
    job_id: string | null;
    client_id: string;
    game: "ets2" | "ats" | "unknown";
    captured_at: string;
    game_min: number | null;
    x: number | null;
    y: number | null;
    z: number | null;
    heading_deg: number | null;
    speed_kmh: number | null;
    truck_id: string;
    truck_name: string;
    truck_brand: string;
    truck_plate: string;
    filename: string;
    mime: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    file_key: string;
    content_hash: string | null;
    created: string;
    updated: string;
    lon: number | null;
    lat: number | null;
    file: {
      key: string;
      originalName: string;
      mimeType: string;
      size: number;
      thumbs: {
        size: string;
        key: string;
        width: number;
        height: number;
      }[];
    } | null;
  }[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
export interface EndpointScreenshotsRemove {
  method: "post";
  input: {
    body?: EndpointScreenshotsRemove_InputBody;
  };
  output: {
    NO_CONTENT: EndpointScreenshotsRemove_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointScreenshotsRemove_InputBody {
  id: string;
}
export interface EndpointScreenshotsUpload {
  method: "post";
  input: {
    body?: EndpointScreenshotsUpload_InputBody;
  };
  output: {
    OK: EndpointScreenshotsUpload_OutputOK;
  };
  media: {file: {optional: false}};
}
export interface EndpointScreenshotsUpload_InputBody {
  token: string;
  clientId: string;
  metadata: string;
}
export interface EndpointScreenshotsUpload_OutputOK {
  id: string;
  file: {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    thumbs: {
      size: string;
      key: string;
      width: number;
      height: number;
    }[];
  } | null;
  duplicate: boolean;
}
export interface EndpointTilesGet {
  method: "get";
  input: {
    query?: EndpointTilesGet_InputQuery;
  };
  output: any;
  media: null;
}
export interface EndpointTilesGet_InputQuery {
  file: string;
}

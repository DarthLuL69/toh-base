export interface MarvelResponse {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: MarvelCharacter[];
  };
}

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{ name: string }>;
  };
  series: {
    available: number;
    items: Array<{ name: string }>;
  };
  stories: {
    available: number;
    items: Array<{ name: string }>;
  };
}

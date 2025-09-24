export type SearchItem = {
  id: string;
  title: string;
  description: string;
};

export type SearchResponse = {
  query: string;
  items: SearchItem[];
};

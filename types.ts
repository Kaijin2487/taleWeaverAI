
export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface Comment {
    id: string;
    name: string;
    text: string;
    date: string;
}

export interface StoryBook {
  id: string;
  title: string;
  pages: StoryPage[];
  comments?: Comment[];
}

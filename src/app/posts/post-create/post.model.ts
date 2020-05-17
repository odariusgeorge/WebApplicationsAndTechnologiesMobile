import { Message } from './message.model';

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
  university: string;
  course: string;
  author: string;
  messages: Array<Array<Message>>;
  startingPrice: number;
  minimumAllowedPrice: number;
  winner: string;
  date: Date;
  bought: boolean;
  bidders: Array<string>;
}

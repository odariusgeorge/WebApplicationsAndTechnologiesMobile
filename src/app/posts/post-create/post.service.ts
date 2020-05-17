import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../../environments/environment";
import { Message } from './message.model';


const BACKEND_URL = environment.apiUrl + "/posts";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number, userId: string, author: string, title: string, university: string, course: string, minPrice: number, maxPrice: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&creatorId=${userId}&author=${author}&title=${title}&university=${university}&course=${course}&date=${true}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }

  getPostsSelling(postsPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&owner=${userId}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }

  getPostsBiding(postsPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&bidder=${userId}&date=${true}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            winner: post.winner,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }

  getPostsWon(postsPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&winner=${userId}&date=${false}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            winner: post.winner,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.posts = this.posts.filter((post: Post) => post.startingPrice>=post.minimumAllowedPrice && post.bought == false)
        this.postsUpdated.next({posts: [...this.posts], postCount: this.posts.length});
      });
  }

  getPostsBought(postsPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&boughter=${userId}&date=${false}&bought=${true}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            winner: post.winner,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }

  getPostsExpired(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            winner: post.winner,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.posts = this.posts.filter((post: Post) => new Date(post.date) < new Date(Date.now()) && post.minimumAllowedPrice > post.startingPrice)
        this.postsUpdated.next({posts: [...this.posts], postCount: this.posts.length});
      });
  }


  getPostsSold(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&sold=${true}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL+queryParams
      )
      .pipe(map(postData => {
        return {
          posts: postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            course: post.course,
            university: post.university,
            author: post.author,
            startingPrice: post.startingPrice,
            minimumAllowedPrice: post.minimumAllowedPrice,
            winner: post.winner,
            date: new Date(post.date),
            bought: post.bought
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe( transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string, course: string, university: string, author: string, messages: Array<Array<Message>>, startingPrice: number, minimumAllowedPrice: number, winner: string, date: Date, bought: boolean, bidders: Array<string> }>(BACKEND_URL+ "/" + id);
  }

  addPost(title: string, content: string, image: File, course: string, university: string, author: string, startingPrice: number, minimumAllowedPrice: number, date: Date) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    postData.append("course", course);
    postData.append("university", university);
    postData.append("author", author);
    postData.append("startingPrice", JSON.stringify(startingPrice));
    postData.append("minimumAllowedPrice", JSON.stringify(minimumAllowedPrice));
    postData.append("winner", null);
    postData.append("date", new Date(date).toISOString());
    postData.append("bought", JSON.stringify(false));
    this.http
    .post<{message: string, post: Post}>(BACKEND_URL,
    postData)
    .subscribe( (responseData) => {
      this.router.navigate(["/postList"], {skipLocationChange: true});
    });
  }

  updatePost(id: string, titleUpdated: string, contentUpdated: string, imageUpdated: File | string, courseUpdated: string, universityUpdated: string, authorUpdated: string, messages: Array<Array<Message>>, startingPrice: number, minimumAllowedPrice: number, winner: string, date: Date, bidders: Array<string>) {
    let postData: Post | FormData;
    if (typeof(imageUpdated) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", titleUpdated);
      postData.append("content", contentUpdated);
      postData.append("image", imageUpdated, titleUpdated);
      postData.append("course", courseUpdated);
      postData.append("university", universityUpdated);
      postData.append("author", authorUpdated);
      postData.append("messages", JSON.stringify(messages));
      postData.append("startingPrice", JSON.stringify(startingPrice));
      postData.append("minimumAllowedPrice", JSON.stringify(minimumAllowedPrice));
      postData.append("winner", winner);
      postData.append("date", JSON.stringify(date));
      postData.append("bought", JSON.stringify(false));
    } else {
        postData =  {
        id: id,
        title: titleUpdated,
        content: contentUpdated,
        imagePath: imageUpdated,
        creator: null,
        course: courseUpdated,
        university: universityUpdated,
        author: authorUpdated,
        messages: messages,
        startingPrice: startingPrice,
        minimumAllowedPrice: minimumAllowedPrice,
        winner: winner,
        date: date,
        bought: false,
        bidders: bidders
      }
    }
    this.http.put(BACKEND_URL + "/" + id, postData)
    .subscribe(response => {
      this.router.navigate(["/postList"], {skipLocationChange: true});
    })
  }

  updatePostMessage(id: string, titleUpdated: string, contentUpdated: string, imageUpdated: string, courseUpdated: string, universityUpdated: string, authorUpdated: string, messages: Array<Array<Message>>, startingPrice: number, minimumAllowedPrice: number, winner: string, date: Date, bidders: Array<string>) {
    let postData: Post = {
        id: id,
        title: titleUpdated,
        content: contentUpdated,
        imagePath: imageUpdated,
        creator: null,
        course: courseUpdated,
        university: universityUpdated,
        author: authorUpdated,
        messages: messages,
        startingPrice: startingPrice,
        minimumAllowedPrice: minimumAllowedPrice,
        winner: winner,
        date: date,
        bought: false,
        bidders: bidders
      }
    this.http.put(BACKEND_URL + "/" + id, postData)
    .subscribe(response => {
    })
  }

  updateBid(id: string, titleUpdated: string, contentUpdated: string, imageUpdated: string, courseUpdated: string, universityUpdated: string, authorUpdated: string, messages: Array<Array<Message>>, startingPrice: number, minimumAllowedPrice: number, winner: string, date: Date, bidders: Array<string>) {
    let postData: Post = {
        id: id,
        title: titleUpdated,
        content: contentUpdated,
        imagePath: imageUpdated,
        creator: null,
        course: courseUpdated,
        university: universityUpdated,
        author: authorUpdated,
        messages: messages,
        startingPrice: startingPrice,
        minimumAllowedPrice: minimumAllowedPrice,
        winner: winner,
        date: date,
        bought: false,
        bidders: bidders
      }
    this.http.put(BACKEND_URL + "/" + id, postData)
    .subscribe(response => {
    })
  }


  buyProduct(id: string, titleUpdated: string, contentUpdated: string, imageUpdated: string, courseUpdated: string, universityUpdated: string, authorUpdated: string, messages: Array<Array<Message>>, startingPrice: number, minimumAllowedPrice: number, winner: string, date: Date, bidders: Array<string>) {
    let postData: Post = {
      id: id,
      title: titleUpdated,
      content: contentUpdated,
      imagePath: imageUpdated,
      creator: null,
      course: courseUpdated,
      university: universityUpdated,
      author: authorUpdated,
      messages: messages,
      startingPrice: startingPrice,
      minimumAllowedPrice: minimumAllowedPrice,
      winner: winner,
      date: date,
      bought: true,
      bidders: bidders
    }
  this.http.put(BACKEND_URL + "/" + id, postData)
  .subscribe(response => {
  })
  }


  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + "/" + postId)
  }

}

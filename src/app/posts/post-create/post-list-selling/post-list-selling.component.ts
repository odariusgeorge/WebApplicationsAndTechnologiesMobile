import {Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model'
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import * as io from 'socket.io-client';

@Component({
  templateUrl: './post-list-selling.component.html',
  styleUrls: ['./post-list-selling.component.css']
})

export class PostListSellingComponent implements OnInit, OnDestroy {
  socket;
  posts: Post[] = [];

  isLoading = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userIsAdmin = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  searchTitle: string;
  searchAuthor: string;
  searchUniversity: string;
  searchCourse: string;
  today = Date.now();


  constructor(public postsService: PostsService, private authService: AuthService, private http: HttpClient) {
    setInterval(() => {this.today = Date.now()}, 1);
    this.socket = io(environment.api);
  }


  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPostsSelling(this.postsPerPage, this.currentPage, this.userId);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe(
      (postData: {posts: Post[], postCount: number}) =>  {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      }
    );

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.getIsAdmin();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });

    this.socket.once('postUpdated', () => {
      this.ngOnInit();
      window.alert("someone bid/bought one of your post!")
    })

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPostsSelling(this.postsPerPage, this.currentPage, this.userId);
  }
}

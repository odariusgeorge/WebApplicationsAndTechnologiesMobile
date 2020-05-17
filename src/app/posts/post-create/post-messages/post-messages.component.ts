import {Component, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormControlDirective, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Message } from '../message.model';

@Component({
  templateUrl: './post-messages.component.html',
  styleUrls: ['./post-messages.component.css']
})
export class PostMessagesComponent implements OnInit {

  constructor(public postsService: PostsService, public authService: AuthService, public route: ActivatedRoute) {}
  private postId: string;
  userId: string;
  public post: Post;
  public isLoading = false;
  public addedMessage: Message;
  public addedReply: Message;
  form: FormGroup;
  isChecked: boolean;

  ngOnInit() {
    this.isChecked = false;
    this.userId = this.authService.getUserId();
    this.form = new FormGroup({
      message: new FormControl(null, {validators: [Validators.required]}),
      replies: new FormArray([new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null),
                              new FormControl(null)])
    });
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
            course: postData.course,
            university: postData.university,
            author: postData.author,
            messages: postData.messages,
            startingPrice: postData.startingPrice,
            minimumAllowedPrice: postData.minimumAllowedPrice,
            winner: postData.winner,
            date: postData.date,
            bought: postData.bought,
            bidders: postData.bidders
          };
        });
      }
    });
  }

  OnChange($event){
    this.isChecked = !this.isChecked
}

  onPostReply(index: number) {
    this.addedReply = {
      content: this.form.value.replies[index],
      creator: this.userId,
      public: true
    }
    this.post.messages[index].push(this.addedReply);
    this.postsService.updatePostMessage(
      this.post.id,
      this.post.title,
      this.post.content,
      this.post.imagePath,
      this.post.course,
      this.post.university,
      this.post.author,
      this.post.messages,
      this.post.startingPrice,
      this.post.minimumAllowedPrice,
      this.post.winner,
      this.post.date,
      this.post.bidders
    );
    this.form.reset();
  }

  onPostMessage() {
    if(this.form.invalid) {
      return;
    }
    this.addedMessage = {
      content: this.form.value.message,
      creator: this.userId,
      public: !this.isChecked
    }
    this.post.messages.push([this.addedMessage]);
    this.postsService.updatePostMessage(
      this.post.id,
      this.post.title,
      this.post.content,
      this.post.imagePath,
      this.post.course,
      this.post.university,
      this.post.author,
      this.post.messages,
      this.post.startingPrice,
      this.post.minimumAllowedPrice,
      this.post.winner,
      this.post.date,
      this.post.bidders
    );
    this.form.reset();
  }
}

import {Component, OnInit, AfterViewChecked} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

declare let paypal: any;

@Component({
  templateUrl: './post-bid.component.html',
  styleUrls: ['./post-bid.component.css']
})
export class PostBidComponent implements OnInit {

  constructor(public postsService: PostsService, public authService: AuthService, public route: ActivatedRoute) {}
  private postId: string;
  public post: Post;
  public isLoading = false;
  form: FormGroup;
  finalAmount: number = 1;
  currentUser: string;

  ngOnInit() {
    this.form = new FormGroup({
      amount: new FormControl(null)
    });
    this.currentUser = this.authService.getUserId();
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
          this.finalAmount = postData.startingPrice;
        });
      }
    });
  }

  onPostBid() {
    if(this.form.invalid || this.form.value.amount <= this.finalAmount) {
      alert("Ammount should be bigger than current price!");
      return;
    }
    this.post.winner = this.authService.getUserId();
    this.post.startingPrice = this.form.value.amount;

    if(!this.post.bidders.includes(this.authService.getUserId())) {this.post.bidders.push(this.authService.getUserId());}
    this.postsService.updateBid(
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
    this.finalAmount = this.post.startingPrice;
    this.form.reset();
  }
}

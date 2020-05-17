const Post = require("../models/post")

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const io = req.app.get('io');
  let query = {};

  if(!(req.query.author=='undefined' || req.query.author == undefined)) { query.author = {$regex: req.query.author, $options: 'i' }}
  if(!(req.query.title=='undefined' || req.query.title == undefined)) { query.title = {$regex: req.query.title, $options: 'i'} }
  if(!(req.query.university=='undefined' || req.query.university == undefined)) { query.university = { $regex: req.query.university, $options: 'i'}}
  if(!(req.query.course=='undefined' || req.query.course == undefined)) { query.course = { $regex: req.query.course, $options: 'i' }}
  if(!(req.query.minPrice=='undefined' || req.query.minPrice == undefined)) { query.startingPrice = { $gte: req.query.minPrice }}
  if(!(req.query.maxPrice=='undefined' || req.query.maxPrice == undefined)) { query.startingPrice = { $lte: req.query.maxPrice }}
  if(!(req.query.maxPrice=='undefined' || req.query.maxPrice == undefined) && !(req.query.minPrice=='undefined' || req.query.minPrice == undefined)) { query.startingPrice = { $lte: req.query.maxPrice, $gte:req.query.minPrice }}
  if(!(req.query.creatorId =='null' || req.query.creatorId == 'undefined' || req.query.creatorId == undefined)) { query.creator = {$ne: req.query.creatorId}}
  if(req.query.date == 'true') { query.date = { $gte: new Date(Date.now())}} else if(req.query.date == 'false') { query.date = { $lt: new Date(Date.now())} }
  if(!(req.query.owner == undefined ||req.query.owner == 'undefined')) { query.creator = {$eq: req.query.owner}}
  if(!(req.query.bidder == undefined || req.query.bidder == 'undefined')) { query.bidders = {$eq: req.query.bidder}}
  if(!(req.query.winner == undefined || req.query.winner == 'undefined')) { query.winner = {$eq: req.query.winner}}
  if(!(req.query.boughter == undefined || req.query.boughter == 'undefined')) { query.winner = {$eq: req.query.boughter}}
  if(req.query.bought == 'true') { query.bought = {$eq: req.query.bought}}
  if(req.query.sold == 'true') { query.bought = {$eq: req.query.sold}}

  const postQuery = Post.find(query);
  const counter = Post.find(query).countDocuments();
  let fetchedPosts;
  if (pageSize && currentPage) {
      postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery
  .then( documents => {
    fetchedPosts = documents;
    return counter;
  }).then( count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
    io.emit('listUpdated');
  })
  .catch(error => {
    res.status(500).json({
    message: "Fetching posts failed!"
    });
  });
}


exports.createPost =  (req, res, next) => {
  const io = req.app.get('io');
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    course: req.body.course,
    university: req.body.university,
    author: req.body.author,
    messages: req.body.messages,
    startingPrice: req.body.startingPrice,
    minimumAllowedPrice: req.body.minimumAllowedPrice,
    winner: null,
    date: req.body.date,
    bought: req.body.bought,
    bidders: req.body.bidders
  });
  post.save().then(createdPost => {
    res.status(201).json({
    message: 'Post added successfully',
    post: {
      id: createdPost._id,
      title: createdPost.title,
      content: createdPost.content,
      imagePath: createdPost.imagePath,
      course: createdPost.course,
      university: createdPost.university,
      author: createdPost.author,
      messages: createdPost.messages,
      startingPrice: createdPost.startingPrice,
      minimumAllowedPrice: createdPost.minimumAllowedPrice,
      winner: createdPost.winner,
      date: createdPost.date,
      bought: createdPost.bought,
      bidders: createdPost.bidders
    }
    });
    io.emit('newPostAdded');
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
};

exports.updatePost = (req, res, next) => {
  const io = req.app.get('io');
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    course: req.body.course,
    university: req.body.university,
    author: req.body.author,
    messages: req.body.messages,
    startingPrice: req.body.startingPrice,
    minimumAllowedPrice: req.body.minimumAllowedPrice,
    winner: req.body.winner,
    date: req.body.date,
    bought: req.body.bought,
    bidders: req.body.bidders
  })

  Post.updateOne({_id: req.params.id},post).then( result => {
      if(result.n > 0) {
        res.status(200).json({message: 'Update successful!'});
      } else {
        res.status(401).json({message:"Wrong"});
      }

  });
  io.emit('postUpdated');
  };

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, isAdmin: req.userData.isAdmin}).then( result => {
      if(result.n > 0) {
        res.status(200).json({message: 'Deletion successful!'});
      } else {
        res.status(401).json({message: 'Not authorized!'});
      }
    });
  };

  exports.getPost =  (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
  });
  }

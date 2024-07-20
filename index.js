const express = require('express');
const app = express();
const port = 8080;
const path = require("path");

const methodOverride = require("method-override");
app.use(methodOverride('_method'))

const { send } = require('process');

//to get uniqe id for every user
const {v4: uuidv4} = require('uuid')

app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.listen(port,() => {
    console.log(`Listening to port : ${port}`);
});


app.get("/home",(req,res) => {
    res.render("home.ejs")
})

app.get("/home/newuser",(req,res) => {

    res.render("createuser.ejs")
})

app.get("/home/:username",(req,res) => {
    let {username}= req.params;
    let user= u.find((p) => p.username === username);
    res.render("about.ejs", {user} );
})

app.post("/home/newuser",(req,res) => {
    let {username, password, description} = req.body;
    u.push(new User( username, password, description ))
    res.redirect("/login");
})

app.get("/login",(req,res) => {
    res.render("login.ejs")
})

app.get("/home/:username/newpost",(req,res) => {
    let {username}= req.params;
    let user= u.find((p) => p.username === username);
    res.render("post.ejs", {user} );
})

app.get("/home/:username/view-profile/:view",(req,res) => {
    let { username , view }= req.params;
    let me= u.filter((p) => p.username === username);
    let user= u.filter((p) => p.username === view);
    res.render("view.ejs", {user , me} );
})

///home/<%= me[0].username %>/view-profile/<%= user.username %>/follow
app.post("/home/:username/view-profile/:follow/follow",(req,res) => {
    let {username,follow}= req.params;
    // let {comment} = req.body;//empty body

// need to check for user not found
    //user -> folowing++
    let user= u.filter((p) => p.username === username);
    if (user[0]) {
        user[0].following.push(follow);        
    } else {
        console.log(`user not found ${username}`)        
    }

    //follow ->folower++
    let use2= u.filter((p) => p.username === follow);
    if (use2) {
        use2[0].follower.push(username);        
    } else {
        console.log(`user not found ${username}`)                
    }

    res.status(204).end();
})

//add comment
app.post("/home/:username/:postid/comment",(req,res) => {
    let {username,postid}= req.params;
    let {comment} = req.body;
    let user= u.filter((p) => p.username === username);
    console.log(`comment on post ${postid}`);
    user[0].addComment(postid,username,comment);
    res.status(204).end();
})

//like post
app.post("/home/:username/:postid/like",(req,res) => {
    let {username,postid}= req.params;
    let user= u.filter((p) => p.username === username);
    console.log(`like post ${postid}`);
    user[0].likePost(postid);
    res.status(204).end();
})

// make feed
app.get("/home/:username/feed",(req,res) => {
    let {username}= req.params;
    let userfeed= u.filter((p) => p.username != username);
    let me= u.filter((p) => p.username == username);
    console.log(me)
    res.render("feed.ejs", {userfeed , me} );
})


app.post("/home/:username/newpost",(req,res) => {
    let {username}= req.params;
    let {caption,location} = req.body;
    let user= u.find((p) => p.username === username);
    user.addPost(caption,location);
    res.render("about.ejs", {user} );
})

app.delete("/home/:username/:id",(req,res) => {
    let {username,id}= req.params;
    let user= u.find((p) => p.username === username);
    user.deletePost(id);    
    res.status(204).end();
})


app.post("/login",(req,res) => {
    let {username,password} = req.body;
    for (let user of u) {
        if(user.username == username && user.password == password){
            res.redirect(`/home/${user.username}`)
        }
    }
    let invalid = "Invalid username or password"
    res.render("login.ejs",{invalid});
})

app.get("*",(req,res) => {
    res.send("INvalid server")
})

//User
class User{
    constructor(name,password,description ){ 
        this.username = name;
        this.password= password;
        this.description = description;
        this.post =[];
        this.follower = []; 
        this.following =[];
    }
    addPost(caption,location, like = 0, comment = 0) {
        // Create a new post object
        let newPost = {
            postid: uuidv4(),
            location: location,
            caption: caption,
            like: like,
            comment: []
        };
        this.post.push(newPost);
    }

    deletePost(postid){
        this.post = this.post.filter((p) => p.postid != postid )
    }

    likePost(postid) {
        // Find the post by postid
        let pos = this.post.find(post => post.postid === postid);
        if (pos) {
            // Increment the like count
            pos.like++;
        } else {
            console.log(`Post with id ${postid} not found.`);
        }
    }
    addComment(postid,username,com){
        let pos = this.post.find(post => post.postid === postid);
        if (pos) {
            let newcomment = {
                username: username,
                comment: com,
                like: 0
            };    
            pos.comment.push(newcomment);
        } else {
            console.log(`Post with id ${postid} not found.`);
        }
    }
}

//data base
let u =[
    new User("Ehtisham","12345","A good description by Ehtisham"),
    new User("Tahir","12345","A good description by Tahir"),
    new User("Ahmed","12345","A good description by Ahmed")
]

u[0].addPost("hi my first post",'lahore');

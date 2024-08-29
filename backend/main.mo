import Func "mo:base/Func";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import List "mo:base/List";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

actor {
  // Define the Post type
  public type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    Debug.print("New post added: " # title);
    post.id
  };

  // Function to get all posts
  public query func getPosts() : async [Post] {
    Array.reverse(posts)
  };

  // System functions for upgrades
  system func preupgrade() {
    Debug.print("Preparing to upgrade. Total posts: " # debug_show(posts.size()));
  };

  system func postupgrade() {
    Debug.print("Upgrade complete. Total posts: " # debug_show(posts.size()));
  };
}

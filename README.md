# Impulse
<b>Impulse is a platform that mitigates impulsive spending and brings consciousness to consumerism.</b> </br>
<b>Note:</b> The chrome extension's repo can be found [here](https://github.com/rwang99/impulse_extension). The web app's repo can be found [here](https://github.com/bephrem1/impulse)
__________________________________________

## The Team: </br>
<b>[Michael Weinberger:](https://github.com/mwein99)</b> The Frontend Wizard </br>
<b>[Benyam Ephrem:](https://github.com/bephrem1)</b> The [Mongod](https://docs.mongodb.com/manual/reference/program/mongod/) (aka the backend guy) </br>
<b>[Richard Wang:](https://github.com/rwang99)</b> Mr. Versatile (the man does everything) </br>

**School Year:** All Freshman @ University of Maryland (class of 2021) </br>

__________________________________________

## The Event: </br>
[BitCamp 2018](https://bit.camp/)

## Challenges Entered: </br>
Best Financial Hack - <b>Capital One</b> </br>
Best Use of MongoDB Stitch - <b>MongoDB</b>

## The Mission: </br>
Bring Consciousness To Consumerism.

## The Idea/Problem

<a href="https://imgbb.com/"><img src="https://image.ibb.co/cgUBrc/creativity.png" alt="creativity" border="0" width="100" height="100"></a>

Online **one-click purchases often lead to buyers making impulse purchases** that are unnecessary or that they may later regret. Our goal is to make buyers more aware and allow them to see how much they can save with conscious spending. We also give users the ability to compare their justifications for purchasing a product against how they feel about the purchase present day. Our goal is to mitigate a user's unconscious spending habits for a more fiscally responsible life.

## The Solution

<a href="https://imgbb.com/"><img src="https://image.ibb.co/gEHpBc/puzzle.png" alt="puzzle" border="0" width="100" height="100"></a>

Create an application that stops a buyer in the online purchasing process and requires them to answer a simple but important question. **"Why Are You Buying This?"** The user must enter up to a certain threshold of characters before they may continue on with the purchase process. BUT, if they stop mid-typing and decide to ditch the purchase they may click a button that says "This Is An Impulse Purchase" and abandon the purchase. Either way, the decision is tracked so that the user may later reflect on how many *impulses* they stopped and how many items they really needed and therefore bought anyway.

Even if the user catches very few impulses...that is still an improvement. The goal is to introduce a gap of thinking. A gap in which a user ponders their consumption habits and really thinks about what they want out of what they buy with their hard earned money.

### Initial Execution:

<a href="https://imgbb.com/"><img src="https://image.ibb.co/jHLgPx/stairs.png" alt="stairs" border="0" width="100" height="100"></a>

This is a large idea so it needs to be narrowed down. <b>Let's narrow it now to this:</b> </br>

Create an simple web portal for a user to sign up and view their dashboard that holds their consumption data and account settings. We will also need to create a chrome web extension so that we can execute actions on the DOM for stopping purchases and injecting our pop-up html, etc.

The initial version is a success if we can: </br>
<b>1.)</b> Stop a user before purchasing and require them to provide a quick and painless justification for the purchase </br>
<b>2.)</b> Collect that behavioral data and process it </br>
<b>3.)</b> Present that data to the user so that they can learn about how they spend and where they can improve </br>

### Screenshots:

<a href="https://imgbb.com/"><img src="https://image.ibb.co/mQavHH/photo_camera.png" alt="photo_camera" border="0" width="100" height="100"></a>

Before we get into the technical explanation (to scare you away) of how this project was created, what is good about it, what is technically unstable about it, etc. We will look at some pretty screenshots:

#### Web Portal

<img src = "https://i.imgur.com/MGHxyWw.png">

The first thing we had to design was the main website. We need to implement user authentication, user authorization and data analytics. This site would be the central hub of impluse, containg a dashboard that generated analytics for each user based on their activity. This is what it looks like:

<img src="https://preview.ibb.co/kEwkHH/Screen_Shot_2018_04_08_at_1_43_23_AM.png">

#### Chrome Extension

We also had to create a chrome extension that had two main components to it as well. The chrome extension needs a modal that acted as a middleman between the consumer and the ecommerce site. We wanted to pause the user's activity, and help them really think about what actions they were about to take. We also had to create the chrome extension pop up section that allow a user to login (so their information could be stored and pushed to the database). 

Here is what the modal looks like:

<img src="https://preview.ibb.co/fZrfjx/Screen_Shot_2018_04_08_at_1_45_05_AM.png">

Here is what the extension popup looks like:

<img src="https://preview.ibb.co/cCvO4x/Screen_Shot_2018_04_08_at_1_47_19_AM.png">

______________________________________________

### The Technical Explanation

<a href="https://imgbb.com/"><img src="https://image.ibb.co/iBgfjx/professor.png" alt="professor" border="0" width="100" height="100"></a>

So now I will be going through the project thoroughly and I will explain each component and how it works extensively. Let us keep in mind there is nothing ground breaking going on here. Only simple CRUD operations and the storing + moving of data and making it meaningful to the user at the end of the day. Despite this simplicity, we believe the project delivers on its intended goal and holds promise for expansion later on.

The hackathon is a very rushed and intense process so yes...the code isn't perfect. Much is repeated. Much could be refactored into modular functions. Some variables could be extracted into a file with global scope. And on and on and on...either way we tried our best to hit the deliverables and have a working application with decent structure.

I will be walking through the components and just be looking at the code and explain what is happening as I go.

#### The Web Portal
The web portal runs on a Node.js and uses Express for serving static assets and managing endpoints that the chrome extension and web portal both use for access. We create a connection to the remote mongo database, partition off session data into its own data store so that it doesn't take up server RAM using [connect-mongo](https://www.npmjs.com/package/connect-mongo), configure global middleware, add error handlers, and start the server. We also extracted all endpoints into their own routes file to make things easier to work with.

<a href="https://imgbb.com/"><img src="https://image.ibb.co/e7KKBc/hurdle1.png" alt="hurdle1" border="0" width="100" height="100"></a>
#### Challenge #1:
When designing the endpoints we had to decide if the Node server would just heavily serve the web portal (pulling db data, passing it in the model to the view, rendering the view) or be more system oriented (serve as a RESTful API that served JSON to authenticated users and both the extension and web portal would send requests to it for the data they need).

In short, we kind of did both just to get things working and up and running. It was hard to decide. So we started out with the former and later when designing the chrome extension (which we did 2nd) we realized that the latter was a better solution to avoid repeated code. The key here is that we know about this and kept in mind to make no operations too tightly coupled so later changes can be made easily.

Anyway, yes, so we have basic routes for rendering pages. We also have custom middleware that runs on the '/dashboard', '/sign-in', and 'sign-up' pages to ensure that: </br>

<b>1.)</b> If a user is signed in they don't need to sign-up or sign-in. They can be redirected to the dashboard if they hit that endpoint. </br>
<b>2.)</b> If they aren't signed in then they can't see the dashboard. Send them to the sign-in page. </br>

For sign-up and authentication we would simple get the user to sign up with email and password. The password is hashed in a pre-save hook (hook that runs before the document is saved) with 13 rounds of [Bcrypt](https://www.npmjs.com/package/bcrypt) (which takes about 1 second to make a pretty secure hash) and saved to the database. Upon signup the unique value on the mongo document '\_id' is used to create a session cookie that is checked for to ensure authentication (middleware uses this global value). The 'userId' value is globally avaliable to all views for consumption via the res.locals object. For signing in we simply hash the password entered and compare it to what the database holds.

<a href="https://imgbb.com/"><img src="https://image.ibb.co/hH0yMc/hurdle2.png" alt="hurdle2" border="0" width="100" height="100"></a>
#### Challenge #2:
So for me (Ben) a challenge was working with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and deciding what the database schema would be. For previous projects I used services like [mLab](https://mlab.com/) for MongoDB. I had to learn how to create a cluster, hook up the cluster to a Stitch Application, setting permissions, connecting to the cluster's shards and visualizing the db with [RoboMongo](https://robomongo.org/)...it was a pain because each component would have a different version of the MongoDB driver (between my terminal, the [mongoose](https://www.npmjs.com/package/mongoose) library, RoboMongo, etc.). But eventually I SSH'ed in and could ensure login worked, seed some documents with purchase data, and just view the database to work with it.

I kept the purchase data on the user document for simplicity but going back I might possibly reconsider that and move the purchase data into its own collection and map the documents to user documents. Then again it really depends on how much data we intend a user document to store and unnecessarily splitting the data into 2 separate but linked documents might just be overkill. It was just something that I had to mill over. Continuing on...yes, we also have the public folder that holds images, js, and stylesheets too.

<a href="https://imgbb.com/"><img src="https://image.ibb.co/ntUuSH/hurdle3.png" alt="hurdle3" border="0" width="100" height="100"></a>
#### Challenge #3:
For the frontend we had to decide between using [Angular](https://angular.io/) and [EJS](http://ejs.co/) for dynamic templating. We just went with the lightweight solution of EJS since we would have a relitively simple dashboard with graphs and tables of course. I personally like Angular better since it is a more natural solution to dynamic web pages but EJS sufficed for our purposes.

Next we will talk about the Chrome Extension. This is the part that caused more of a problem since the whole team was pretty inexperienced in making chrome extensions and how the environment would behave. Here is a chart I made that describes this (as well as my whole existence spent programming):

<a href="https://ibb.co/gXGKux"><img src="https://preview.ibb.co/g97QZx/Screen_Shot_2018_04_08_at_4_31_51_AM.png" alt="Screen_Shot_2018_04_08_at_4_31_51_AM" border="0" width="500" height="500"></a>

#### The Chrome Extension
The Google Chrome Extension was...well a chrome extension. The whole team had little to 0 experience making a chrome extension but we do know javascript and html so we thought it'd be a breeze!! Well...it was actually a lot harder than we thought.

<a href="https://imgbb.com/"><img src="https://image.ibb.co/d079ux/hurdle4.png" alt="hurdle4" border="0" width="100" height="100"></a>
#### Challenge #4:
Contexts and sharing data. So the chrome extension has two components: the main dashboard that pops up when the extension icon is clicked (extension component) and the html that is injected into the webpage (webpage component). Here is the problem...**each component runs in a totally isolated context**...aka a variable name 'var1' set to 1 in the webpage component *does not exist* in the extension component's context.

Since it is a separate context...*there is literally another whole console* for the extension component on top of the actual webpage's console. It took Michael and I nearly an hour and half to realize this was the root of our problems when we were working on setting up login (on the extension component) and data just wouldn't move between the files. We searched google chrome documentation for nearly 2 hours and exhaustively went through 10+ Stack Overflow article attempts at solutions as well as the official Google Chrome Extension docs on cross-extension messaging [found here](https://developer.chrome.com/apps/messaging).

Nothing worked. No code worked. It was *really* frustrating.

So call us crazy, call us naive developers...so be it...in the spirit of a *hackathon* we decided to get creative and hack/enginner our own (I think funny) solution to sharing data between the two isolated components. So what we basically knew is that each of these components could talk to the Node.js server and hence have access to the database.

Michael proposed that we create a Auth database collection and when a user sign's in on the chrome extension we map the client's id to the '\_id' on the user's document that is retrieved from a successful sign-in. Then when the webpage component wants to post data it can post it to the correct user id that is logged in by asking an auth endpoint (passing the client ip as a path param) what user id is authenticated on the client ip. When a user logs out or the extension closes the auth document is disposed of.

We both agreed that this was a very hacky solution to a problem that should be solved by some form of messaging inherent to the Google Chrome Extension API but decided to try it just for the challenge and the heck of it and it turned out that it worked pretty well.

But yes, it is not a stable way to auth a user (what if another user authenticates on the same ip...that'd be a one to many relationship which cannot be tolerated, what if a hacker knows the ip of someone logged in and can pull their id then manipulate another user's document? Then they can manipulate a document that is not theirs).

Either way with just a few more hours of researching this aspect of the application could be secured so it was just an experimental thing for us since this is not a production application or even near it.

<a href="https://imgbb.com/"><img src="https://image.ibb.co/c02dMc/hurdle5.png" alt="hurdle5" border="0" width="100" height="100"></a>
#### Challenge #5:
Importing libraries and global variable scope naming problems. The biggest problem with this is how insidious it is. Javascript will hoist variables and functions leading to a clouding of the global namespace and if you are loose with your naming conventions it could come back to bite later.

You will not get a specific line that your code if failing on. You will only see something resolve as undefined and have no reason why and all you can do is move script files around and rename things until the problem resolves. This happened when we were loading the [MongoDB Stitch](https://www.mongodb.com/cloud/stitch) minified js. It had variable names in it that when loaded after certain scripts led to the script being rendered useless and throwing an error internally.

We found that issue just from speculation and it turned out to solve the problem. On top of that when working with the Chrome Extension we could not make use of npm and require('') statements in the way we could easily import and manage libraries on our Node server. I don't personally know too much about importing libraries into js files so it was a challenge working with moving data around different files and working with libraries.

<a href="https://imgbb.com/"><img src="https://image.ibb.co/kA93nH/hurdle6.png" alt="hurdle6" border="0" width="100" height="100"></a>
#### Challenge #6:
Getting MongoDB Stitch to work was definitely a challenge. There was a good amount of documentation reading and question asking that had to take place to get Stitch to work in our frontend but I don't attribute this to the platform as much as to our naiveness when it comes to working with frontend JS for a Google Chrome Extension.

For example we would hold the logged in user's "\_id" in a global field as a string but it turns out the when executing a search against the "\_id" field you must use an [ObjectId object](https://docs.mongodb.com/manual/reference/bson-types/#objectid) format of the string or else the search just won't come up with anything even if a document's "\_id" field as a string matches the string being searched for.

We tried many libraries to convert the string into an ObjectId object but even after converting it still did not work for some reason so we just added another field to user documents that was a string representation of the "\_id" field to search against.

So again, another tiny work around that can be solved easily with a more thought out patch that *actually* solves the core issue.

______________________________________________

## Future Updates

<a href="https://imgbb.com/"><img src="https://image.ibb.co/kCnjBc/magic_ball.png" alt="magic_ball" border="0" width="100" height="100"></a>

- Supporting more than just Amazon. Expanding support to other serviecs where impulsive purchases may take place online.
- Remove tiny bugs that are still in some places

## Conclusion

<a href="https://imgbb.com/"><img src="https://image.ibb.co/c5vCEx/notebook.png" alt="notebook" border="0" width="100" height="100"></a>

Despite all of the technical challenges that we faced I am proud of my team and I. We had our arguments, we made our naive decisions, we insulted each other, we complimented each other, we had fun, and we created the idea that we had set out to create. There is nothing else like a hackathon environment where it is just pure *focus* at least for me. Just the human and the machine. A clean slate.

I used to believe that I knew everything but what I have realized overtime is that everyone has their great competencies. I am pretty competent with Node.js and MongoDB and have seen so many ways a server can crash that many bugs I just know instantly like it is common knowledge. But I'm weak at some aspects of frontend.

This is where Michael filled the gap. He is excellent at frontend and seeing where things can go wronng there and where solutions can be found. Richard is also very competent at this and is a critical thinker. These are things that I cannot do myself and can do much better working with individuals with said competence.

Basically, when we can find an intersection between these specials skills we have the recipe to create something elegant...something that matters. When team members support each other and see where one can excel and where they themselves fit in and contribute...it just creates an environment where everyone feels like they have a part and they matter just as much as the next person.

I could ask for nothing more than the teammates that I believe in and trust. And the trust that you give is as important as the trust you get in return.

And this is what I think we learned during Bitcamp. We learned to cooperate, we persevered through the insurmountable, grew as people, and had a good time doing what we have dedicated so much of our lives to.

Technology.

## Built With

* [Node.js](https://nodejs.org/en/) - Event-Driver Server-side Platform used
* [Express.js](https://expressjs.com/) - Node.js web application framework used
* [MongoDB](https://www.mongodb.com/) - MongoDB for Database
* [MongoDB Stitch](https://www.mongodb.com/cloud/stitch) - Backend as a Service for executing frontend db operations
* [RoboMongo](https://robomongo.org/) - MongoDB GUI for Database Seeding, Cluster Visualization, & Testing
* [EJS](http://ejs.co/) - Dynamic Templating and Interpolation
* [Bootstrap](https://getbootstrap.com/) - Bootstrap for Frontend
* [jQuery](https://jquery.com/) - Client-Side Document Object Model (DOM) Manipulations and Asynchronous JavaScript & XML (AJAX) Requests
* [Chart.js](https://www.chartjs.org/) - Frontend chart library
* [npm](https://www.npmjs.com/) - Package Manager
* [WebStorm](https://www.jetbrains.com/webstorm/) - WebStorm IDE
* [Atom](https://atom.io/) - Text Editor
* [VSCode](https://code.visualstudio.com/) - Text Editor

## Credits
* [Flaticon](https://www.flaticon.com/) - Icon assets
* The guys at the MongoDB booth. They were super friendly and helped us with some issues. We <3 you.
* Ben - You made a really sexy readme. Good job.

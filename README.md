# Impulse
<b>Impulse is a platform that mitigates impulsive spending and brings consciousness to consumerism.</b>
__________________________________________

## The Team: </br>
<b>Michael Weinberger:</b> The Frontend Wizard </br>
<b>Benyam Ephrem:</b> The [Mongod](https://docs.mongodb.com/manual/reference/program/mongod/) (aka the backend guy) </br>
<b>Richard Wang:</b> The Company Intern (he does everything) </br>

**School Year:** All Freshman @ University of Maryland (class of 2021) </br>

__________________________________________

## The Event: </br>
[BitCamp 2018](https://bit.camp/)

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










# Components

Homepage
<img src = "https://i.imgur.com/MGHxyWw.png">

- The first thing we had to design was the main website. We need to implement user authentication, user authorization and data analytics. This site would be the central hub of impluse, containg a dashboard that generated analytics for each user based on their activity. This is what it looks like:

<br> 

<img src="https://preview.ibb.co/kEwkHH/Screen_Shot_2018_04_08_at_1_43_23_AM.png">

<br>

- We also had to create a chrome extension that had two main components to it as well. The chrome extension needs a modal that acted as a middleman between the consumer and the ecommerce cite. We wanted to pause the user's activity, and help them really think about what actions they were about to take. We also had to create the chrome extension pop up section that allow a user to login (so their information could be stored and pushed to the database). 

<br>

This is what the modal looks like:

<img src="https://preview.ibb.co/fZrfjx/Screen_Shot_2018_04_08_at_1_45_05_AM.png">

<br>

This is what the extension popup looks like:

<img src="https://preview.ibb.co/cCvO4x/Screen_Shot_2018_04_08_at_1_47_19_AM.png">

<br>

# Features
- Users can create accounts, login to the dashboard and extension, and keep track of their impulse purchases and analytics associated with them

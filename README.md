# Daily

A static meal planner website for GitHub Pages. `index.html` is the public Daily landing page; `app.html` is the separate workspace for recipes, the weekly planner, and the personal dashboard. It uses TheMealDB's V1 API for recipes and Firebase Authentication + Cloud Firestore for accounts and saved meals.

## Connect Firebase

1. Create a Firebase project and register a Web app.
2. Copy the Web app config into `firebase-config.js`, replacing the `YOUR_...` values.
3. In Firebase Console, enable **Authentication → Email/Password** and **Authentication → Google**. For Apple sign-in, follow the Apple setup below.
4. Create a **Cloud Firestore** database.
5. Publish the rules in `firestore.rules` from Firebase Console → Firestore Database → Rules to enable private household membership, expiring invites, and family recipe feedback.
6. Add your GitHub Pages hostname (for example, `your-name.github.io`) under **Authentication → Settings → Authorized domains**.
7. To enable **Sign in with Apple**, enroll in the Apple Developer Program and create a **Services ID** for the website. Associate it with a primary App ID that has the **Sign in with Apple** capability enabled.
8. In the Services ID settings, enable **Sign in with Apple** and register your Firebase auth domain as a website domain. Add this return URL exactly: `https://<your-auth-domain>/__/auth/handler` (replace `<your-auth-domain>` with the `authDomain` value in `firebase-config.js`).
9. In Firebase Console → **Authentication → Sign-in method → Apple**, enable Apple and enter the Apple Services ID, Apple Team ID, Key ID, and private key from the Apple Developer account. Save the provider, then try Apple sign-in on the published HTTPS site.

## Suggestions inbox

Suggestions use Cloud Firestore directly, so there is no Cloud Function, webhook, or Firebase billing account to configure. The form requires sign-in and explicit consent before saving the account email with the note. Firestore rules let signed-in visitors create a suggestion but block clients from reading, editing, or deleting suggestions. The project owner can review them in Firebase Console → Firestore Database → Data → `userFeedback`.

Firestore's Spark plan includes a free quota of 1 GiB stored data, 20,000 writes per day, and 50,000 reads per day. Those limits apply to the whole database, not only suggestions, so check the Firestore Usage tab occasionally. Suggestions stay in the inbox until the project owner deletes them. [Firestore free quota and billing](https://firebase.google.com/docs/firestore/pricing) · [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started).

1. In Firebase Console → Firestore Database → Rules, publish the rules from `firestore.rules`.
2. Publish the website to GitHub Pages. The suggestion form is linked from the home page, planner, and account footers.
3. Open Firestore Database → Data to review incoming entries in `userFeedback`.

The Firebase web config is client-side configuration. Do not put a Firebase Admin SDK key or other server secret in this repository. The Firestore rules restrict personal plan data to the authenticated owner. Household data is shared only with signed-in household members; child accounts can read their own swipes, while organizer accounts can review household feedback. Invite links expire after seven days.

## Run locally

Because the site uses JavaScript modules, open it through a local web server rather than `file://`. For example, with Python installed:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000` for the landing page, `/app.html` for recipes and your planner, or `/shopping.html` for your shopping list, or `/household.html` for family planning. Add `localhost` to Firebase Authentication's authorized domains if needed.

## Features

- Search TheMealDB recipes by dish, ingredient, cuisine, or category; browse suggestions, inspect ingredients and source links, and adjust servings.
- Create an account with email and password, sign in with Google or Apple, and reset a password.
- Add recipes to a dated weekly plan, move meals between weekdays, and mark meals as cooked.
- Track this week's planned and cooked meals, saved recipes, and a personal cooking goal on the dashboard.
- Reopen recipes from the planner or saved-recipe collection. Plan, favorite, and goal data are stored under `users/{uid}` in Cloud Firestore.
- Build a synced shopping list from this week's planned recipes, add items manually, and check items off on mobile.
- Switch the interface between English and German, and toggle dark mode from the footer. Both preferences are saved in the browser.
- Save suggestions and the signed-in user's email to a private Firestore inbox, only after explicit consent.

The Firebase features remain inactive until `firebase-config.js` is filled in and the Firebase project is configured as above. Apple sign-in also requires the Apple Developer and Firebase provider setup above. TheMealDB's free key `1` is intended for development and learning; its docs recommend a supporter key for a publicly shipped app. Search and detail requests use its `search.php` and `lookup.php` endpoints.


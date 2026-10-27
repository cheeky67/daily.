# Daily

A static meal planner website using Forkify API v2 for recipes and Firebase Authentication + Cloud Firestore for accounts and saved meals.

## Connect Firebase

1. Create a Firebase project and register a Web app.
2. Copy the Web app config into `firebase-config.js`, replacing the `YOUR_...` values.
3. In Firebase Console, enable **Authentication → Email/Password** and **Authentication → Google**.
4. Create a **Cloud Firestore** database and publish the rules from `firestore.rules`.
5. Add your GitHub Pages hostname (for example, `your-name.github.io`) under **Authentication → Settings → Authorized domains**.

The Firebase web config is client-side configuration. Do not put a Firebase Admin SDK key or other server secret in this repository. The Firestore rules restrict plan and saved-recipe data to the authenticated owner.

## Run locally

Because the site uses JavaScript modules, open it through a local web server rather than `file://`. For example, with Python installed:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Add `localhost` to Firebase Authentication's authorized domains if needed.

## Features

- Search Forkify recipes and view ingredients and source links.
- Create an account with email and password, sign in with either method, reset a password, or use Google sign-in.
- Add recipes to a weekday meal plan, save favorites, and remove either from your account.
- Plan and saved-recipe data are stored under `users/{uid}` in Cloud Firestore.

The Firebase features remain inactive until `firebase-config.js` is filled in and the Firebase project is configured as above. Forkify API v2 also applies request limits and a restricted set of search terms.

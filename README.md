# Team Team - KARMA - Developer Manual

# Front-End Developer installation
## Development Environment Setup
### macOS
Requirements:
- Node - `brew install node`
- Watchman - `brew install watchman`
- Java Development Kit (> JDK 8) - `brew cask install adoptopenjdk/openjdk/adoptopenjdk8`

### Windows
Requirements:
- Node
- Python2
- Java Development Kit (> JDK 8)
It is recommended to install these using Chocolatey, which is a package manager for Windows
Run this command in the Administrator Command Prompt - `choco install -y nodejs.install python2 jdk8`

### Linux
Requirements:
- Node - Distribution specific instructions can be found [here](https://nodejs.org/en/download/package-manager/)
- Java Development Kit (> JDK 8) - Distribution specific binaries can be found [here](https://adoptopenjdk.net/) or via the system package manager

### iOS
Please note that only macOS machines are able to develop for iOS devices.
- Xcode (Mac App Store)
- CocoaPods - `sudo gem install cocoapods`

### Android
- [Android Studio](https://developer.android.com/studio/index.html)
  - Choose "Custom" setup and ensure that `Android SDK`, `Android SDK Platform` and `Android Virtual Device` are checked
  - Install Android SDK
  - Configure `ANDROID_HOME` environment variables
  - Add `platform-tools` to path

## General Installation Notes
There are two environment variables within a `.env` file that are used within the app. The environment variables necessary are `ANDROID_MAPS_KEY` for Google Maps usage and `REACT_APP_API_URL` for letting the app know where to send requests to.

Here are the necessary environment variables:
```
ANDROID_MAPS_KEY
# If localhost does not work, use your local network IP
REACT_APP_API_URL=http://localhost:8000
```

### Initialise Project
```sh
git clone "https://github.com/a-vorontsov/team-team/"
cd app/Karma
npm i
# If you are developing for iOS
cd ios/
pod install
```

### Running the bundler
```sh
npm start
```

Sometimes, the bundler cache will need to be reset. In this case, use:
```sh
npx react-native start --reset-cache
```

### Running on a device
```sh
npm run ios
```
or
```sh
npm run android
```

### Cleaning and formatting code
```sh
npm run lint
```
This will run ESLint on the front-end javascript codebase to ensure that the code format is consistent across all files.

## Building The App
### iOS
When deploying for iOS devices, you will need to have an Apple Developer account that is registered for [App Store connect](https://appstoreconnect.apple.com/login) with a build certificate.
#### Generating an iOS release
You'll first need to create a bundle identifier which will be shown on both App Store and iOS devices.
- Navigate to the [developer portal](https://developer.apple.com/) and log in
- Go to *Identifiers* and click on the `+` in the top right of the screen
- Name the App ID to be the same as the app and make sure that the Bundle ID follows a reverse url strcture
- Verify services and submit the bundle identifier

#### Generating a certificate
You will also be required to generate a certificate before building an application package. Firstly, you have to create a certificate signing request that is used to link your computer to your Apple developer account.
- Open the KeyChain Access application
- Click *Certificate Assistant* in the top left menu and click *Request a Certificate From a Certificate Authority*
- Fill in the details

Once this is done, you can generate an app store production certificate that is used to link iOS apps to your developer account.
- Navigate to the [developer portal](https://developer.apple.com/) and log in
- Go to *Certificates* and click on the `+` in the top right of the screen
- Choose *App Store and Ad Hoc* option in the *Production* section
- Upload the Certificate Signing Request that was created previously
- Download the Certificate and install it. Be sure to keep this file for later

#### Building an IPA for distribution

To share the packaged app, either as a release or via TestFlight, you must create an archived IPA.
- In Xcode, go to *Product*, then *Archive*, which will rebuild the app.
- Once this is done, select *Distribute*, and then the certificate which you generated earlier with the matching Bundle ID.

This should automatically validate the app, and you can then select the distribution method, e.g. *Upload to TestFlight*.

Once the build has uploaded to App Store Connect, it will be validated on Apple's side - you may have to then fill in a survey about the use of encryption to conform to standards and Apple's requirements, after which you can distribute the app.

#### Creating an App Store Listing
In order to create an App Store listing, you wil have to create a Production Provisioning Profile which is packaged with iOS apps so devices can install them.
- Navigate to the [developer portal](https://developer.apple.com/) and log in
- Go to *Provisioning Profiles* and click on the `+` in the top right of the screen
- Click *App Store Distribution* then select the bundle ID and certificate that you set up earlier
- Ensure that the Profile Name follows the standard app naming convention
- Select *App Store Distribution*, generate, download and install the profile
- Be sure to keep this file for later

Once all of the previous steps have been completed, you are able to reserve a slot in the App Store for the app.
- Navigate to [iTunes Connect](https://itunesconnect.apple.com/) and log in
- Go to *My Apps* and click on the `+` in the top right of the screen
- Click *New iOS App* and choose the bundle ID that was created earlier and make the SKU match it
- Now you can create the first version listing

### Android
Publishing to the Google Play Store requires a registered Google Developer Account.
#### Generating a signed APK
Ensure that you have generated an upload key using the following command within the `android/` directory.
```sh
keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
If you **do not** have the JDK `bin` folder in your path, then `keytool` must be run from `C:\Program Files\Java\jdkx.x.x_x\bin` using **Windows**, or `/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home` using **macOS**. Once the keystore has been generated, move it into the `android/` directory

More information can be found [here](https://reactnative.dev/docs/signed-apk-android).<br/>
You may be required to edit the `gradle.properties` file in `app/Karma/android/` with your `STORE_PASSWORD` and `KEY_PASSWORD`. The included variables are there to serve as a placeholder and are not indented to be used in production.

#### Building signed APK
```sh
cd android
./gradlew assembleRelease
```
This will generate a signed APK in `android/app/build/outputs/apk/release/` that can be copied or sent to Android phones directly instead of having to go through the Google Play Store.

#### Building release APK
```sh
cd android
./gradlew bundleRelease
```
This will generate a signed AAB (Android App Bundle) in `android/app/build/outputs/bundle/release/`. This file can then be uploaded to the Google Play Store.

#### Publishing to Google Play Store
If you have a Google Developer account with access to the Google Play Console, you are able to publish the app.
- Navigate to [Play Console](https://play.google.com/apps/publish/signup/) and log in
- Click on *Create new app* within *All apps* and fill in the required information
- Upload the AAB or APK that was built earlier and submit for review

---

# Back-End Developer installation
## Environment setup
### Database

Requirements:
- Docker and docker-compose OR PostgreSQL server


Karma uses a PostgreSQL database for data persistance. The easiest way to start a
DB instance is to navigate the `resources/docker/dev` directory and run the command
`docker-compose up`. This will start a Docker container that is already pre-configured
to work on Karma.

Alternatively you can manually install PostgreSQL server and create and configure the database
and user to match the environment variable values.


### Server
Requirements:
- Node.js v12.x.x

These are the environment variables that should be `.env` file at the root of your `server` directory. The values should be obtained yourself.
```
DB_HOST
DB_DATABASE
DB_USER
DB_PASS
TWILIO_ACCOUND_SID
TWILIO_AUTH_TOKEN
TWILIO_SERVICE_SID
MAPQUEST_API
EMAIL_ADDRESS
BUG_REPORT_EMAIL_ADDRESS
EMAIL_PASSWORD
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
LINKEDIN_KEY
LINKEDIN_SECRET
STRIPE_SECRET
STRIPE_ACC_ID
SESSION_SECRET
SESSION_TOKEN_KEY
# enable OAuth2 for user auth
ENABLE_OAUTH
# skip password strength tests
SKIP_PASSWORD_CHECKS
# skip gocoding of addresses
SKIP_GEOCODING
# skip authentication checks on routes
SKIP_AUTH_CHECKS_FOR_TESTING
# skip sending mail for tests that reference mailSender
SKIP_MAIL_SENDING_FOR_TESTING
# skip needing to send FE's public key
SKIP_ASYNC_KEY_EXCHANGE
S3_SECRET_ACCESS
S3_KEY_ID
S3_REGION
S3_BUCKET_NAME
# Key import is required if sessions are to be preserved
PRESERVE_SESSIONS_ON_REBOOT
PRIVATE_KEY_PASSPHRASE
```
These will be passed to the server at runtime and used for configuration.


Run `npm ci` to install necessary dependencies


The server can now be run using either
- `npm start` to run it in production mode
- `npm run dev` to run it in debug mode

## Deployment
### Automatic deployment
Currently, deployment to our AWS server is fully automated and happens whenever a pull request is merged into the `master` branch.

If you wish to set up automated deployment to a different server:
1. Install Docker and docker-compose on the server
```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
2. Set up the following [secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) in your GitHub repository:
```
DOCKER_USERNAME - username of Docker Hub account Docker images are deployed to
DOCKER_PASSWORD - password of Docker Hub account
SSH_HOST - host (ip/domain) of new server
SSH_USER - user ssh'd into on host machine
SSH_KEY - private key used to ssh
SSH_PORT - ssh port on host
```
3. Add a `.env` file containing production values to the server. These are forwarded to Docker containers on startup.


Now, whenever something is merged into the master branch it will be automatically deployed to the new production environment.

![](https://codimd.s3.shivering-isles.com/demo/uploads/upload_09293189b75799a0f654a71b1d8e7292.png)

### Manual deployment
It might happen that manual deployment is needed in case something needs to be urgently patched. In that case:
1. On your development machine build a new Docker image for the server:
1.1 Uncomment lines 26-28 in `resources/docker/prod/docker-compose.yml` regarding building the server image
1.2 Run `docker-compose build`
1.2 Publish the created images `docker-compose push teamteamkarma/server`
2. `ssh` into your server
3. Run `docker-compose pull` to pull the published images
4. Run `docker-compose up` to restart the server with the new images

# Web
The Karma admin page extension task was created in React. To run it, set the `.env` file in your `web` directory to be
```
REACT_APP_API_URL=http://localhost:8000
```
this will use your local backend server for API communication.


Install local dependencies with `npm install` and run the application with `npm start` and you can start development on the admin page.

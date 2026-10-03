# FitFlow Frontend

React Native and Expo mobile application for FitFlow.

## Registration and profile setup

After registration, users complete age, height (cm), weight (kg), and a fitness
goal before entering Home. Back navigation preserves values within the setup
flow. Continue saves all four values through authenticated `PATCH /auth/onboarding`
and marks the profile complete in MongoDB. Failed saves keep the user on the goal
step so they can retry. Restart the backend when adding this endpoint.

Login and session restoration route incomplete profiles to setup and completed
profiles to Home. Unsubmitted values are not saved across sign-out or app restart.
Home includes goal-based workout browsing, a profile summary, and sign-out.
Activity stats start empty; guided workout tracking, meal logging, challenges,
community, and nutrition are not implemented yet and are labeled accordingly.

## Run on an Android phone

This project uses **Expo SDK 57**. Install the Android Expo Go build for SDK 57
from https://expo.dev/go. The installed Expo Go app must support the project's
SDK version; installing dependencies on the computer does not update the phone.

From this directory, install dependencies with `npm.cmd ci`, then run:

```powershell
npm.cmd run start:clear
```

Keep the phone and computer on the same Wi-Fi network and scan the new QR code
inside Expo Go. Stop any previous Metro server with Ctrl+C first.

If the phone uses mobile data or cannot reach the computer over Wi-Fi, use:

```powershell
npm.cmd run start:tunnel
```

The tunnel exposes the development server while it runs. It does not tunnel the
backend: `EXPO_PUBLIC_API_URL` must separately be reachable from the phone for
login and workouts to work. `localhost` on the phone refers to the phone itself.

## If Android says "Expo Go keeps stopping"

This message is a native crash and does not identify its cause. First verify the
SDK 57-compatible Expo Go installation, force-stop Expo Go, clear its cache in
Android Settings > Apps > Expo Go > Storage, and reopen it before scanning again.
Check whether it also crashes without opening the project.

If it still crashes, record the phone model, Android version, and Expo Go version.
With Android platform-tools installed and USB debugging authorized on the phone,
reproduce the crash and collect the crash log:

```powershell
adb logcat -b crash -d > expo-go-crash.txt
```

Review the log for private information before sharing it. A successful bundle or
TypeScript check does not prove that a native crash has been fixed on the device.

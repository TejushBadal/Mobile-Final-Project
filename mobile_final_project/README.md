1. cd into the project folder
2. run npm install (ensure node v>18.x)
3. ensure adb is in 'path' system variable 
4. ensure android sdk is in 'ANDROID_HOME' system variable 
5. ensure android emulator is running (add emulator to path variable)
run emulator -list-avds
run emulator -avd <wtv came up from prev cmd>

6. run npx expo run:android

after the first time you can just run npx expo run:android
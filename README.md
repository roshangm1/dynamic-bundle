## Dynamic Bundle

Load the bundle dynamically in react native using qrcode or branch name (source branch involved in the PR).

Inspired by the blog from shopify:

https://shopify.engineering/tophatting-react-native

`artifacts.zip` which contains assets should be hosted inside a folder name with the branch name involved in the pr. Eg: `addnewfeature/artifacts.zip`

This repository is not exported as a library and cannot be used in other libraries. Also, everything that I implemented is for iOS only.

This is just a POC that I tried. You can however test this by just following normal `yarn ios`. Github CI should also be working.

On every PR targeting main branch:

1. New bundle is created and and uploaded to a server
2. After successful PR, pull request is updated with QR code
3. In the app, turn on the `Enable offline Bundle` button
4. Scan with camera (buggy and should be manually restarted) or use the branch name involved in the PR in the input box.
5. Your app will be restarted and you can see new changes

Caution again: There could be a lot of bugs! :)

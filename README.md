# TwitterBookmarkMediaDownloader

[Credits goes to FarisHijazi/TwitterDownloader](https://github.com/FarisHijazi/TwitterDownloader)

## How to use

❗ MAKE SURE TO UNTICK `Ask where to save each file before downloading` in chrome://settings/downloads (idk where it is in firefox) ❗

1. copy the content of index.js
1. go to https://twitter.com/i/bookmarks
1. press F12
1. go into console if necessary
1. paste into the devtool console
1. profit

## Another method

1. go to https://twitter.com/i/bookmarks
1. press F12
1. go to network
1. scroll your bookmarks until you can't no more
1. export HAR
1. `grep -Po "https.+?(?=\?format=jpg&name)" file.har > jpgmedia`
1. `sort finish | uniq > jpgmedia.uniq`
1. clean up the file & add `?format=jpg&name=orig` at the end of each media line
1. `aria2c -j20 jpgmedia.uniq`

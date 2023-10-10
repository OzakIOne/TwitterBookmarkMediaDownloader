async function download() {
    const urls = [];
    const names = [];
    document.body.scrollIntoView();
    const sleep = (ms)=>new Promise((r)=>setTimeout(r, ms));
    const getParam = (u, p)=>new URL(u).searchParams.get(p);
    const setParam = (u, p, v)=>{
        const urlObj = new URL(u);
        urlObj.searchParams.set(p, v);
        return urlObj.toString();
    };
    const getTweetID = (url)=>new URL(url).pathname.split('/').pop();
    const downloadBlob = (bloburl, filename)=>{
        const a = Object.assign(document.createElement('a'), {
            style: 'display: none',
            href: bloburl,
            download: filename
        });
        document.body.appendChild(a);
        a.click();
    };
    const downloadTweet = (url, authorName)=>fetch(url).then((resp)=>resp.blob()).then((blob)=>{
            let bloburl = window.URL.createObjectURL(blob);
            let filename;
            const tweetID = getTweetID(url);
            const formatParam = getParam(url, 'format');
            if (tweetID !== null && formatParam !== null) {
                if (authorName) {
                    filename = authorName + '_' + tweetID + formatParam;
                } else {
                    filename = tweetID + formatParam;
                }
                downloadBlob(bloburl, filename);
                window.URL.revokeObjectURL(bloburl);
            }
        }).catch(()=>console.error(`${url} download failed`));
    do {
        // somehow without var script throw error when running in browser
        var newImgs = Array.from(document.querySelectorAll('img')).filter((img)=>/\.mp4|media/.test(img.src) && !urls.includes(img.src));
        console.log(newImgs);
        for (const img of newImgs){
            let authorName = '';
            let url = img.src;
            url = setParam(url, 'name', 'orig');
            url = setParam(url, 'format', 'jpg');
            urls.push(url);
            const tweetContainer = img.closest('article');
            if (!tweetContainer) continue;
            const username = tweetContainer.querySelectorAll('[data-testid="User-Name"] span')[3];
            if (username) {
                authorName = username.textContent || '';
            } else authorName = '';
            names.push(authorName);
            console.log(urls.length, url, authorName);
            img.scrollIntoView();
            // downloadTweet(url, authorName);
            await sleep(200);
        }
    }while (newImgs.length)
    console.log(Array.from(urls).join('\n'));
}

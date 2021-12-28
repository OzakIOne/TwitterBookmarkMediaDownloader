(async function () {
  let urls = [];
  let names = [];
  document.body.scrollIntoView();

  // css prop : currentSrc

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // replace 360x360 with orig to have the original image
  const normalizeUrl = (url) => url.replace(/\&name=[^&]+/, '&name=orig');

  // always returns jpeg
  const getExtension = (url) => new URL(url).searchParams.get('format');

  const download = (url, fname) =>
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        let bloburl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = bloburl;
        if (!fname) {
          fname = new URL(url).pathname.split('/').pop() + '.jpg';
          // fname += getExtension(url);
        } else {
          fname += '_' + new URL(url).pathname.split('/').pop() + '.jpg';
          // '_' + new URL(url).pathname.split('/').pop() + getExtension(url);
        }
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(bloburl);
      })
      .catch(() => console.error(`${url} download failed`));

  do {
    // somehow without var script throw error when running in browser
    var newImgs = Array.from(document.querySelectorAll('img')).filter(
      (img) =>
        /\.mp4|media/.test(img.src) && !urls.includes(normalizeUrl(img.src)),
    );
    for (const img of newImgs) {
      // fname equals to author @name
      let filename = '';
      let url = normalizeUrl(img.src);
      urls.push(url);
      try {
        filename = img
          .closest('[data-testid="tweet"]')
          .innerText.split('\n')
          .slice(1, 2);
        // '.' +
        // getExtension(url);
      } catch (e) {
        // if there is an error in getting the author name, just use the img id as the filename
        filename = '';
      }
      names.push(filename);
      console.log(urls.length, url, filename);
      img.scrollIntoView();
      download(url, filename);
      await sleep(700);
    }
  } while (newImgs.length);

  console.log(Array.from(urls).join('\n'));
})();

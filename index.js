// TwitterBookmarkMediaDownloader
// Paste this whole file into the DevTools console while you are on
// https://x.com/i/bookmarks (or any X/Twitter timeline). It runs immediately.
//
// Credits: https://github.com/FarisHijazi/TwitterDownloader

async function download() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Real tweet media lives under pbs.twimg.com/media/...
  const MEDIA_SRC = /\/media\//;

  // 360x360 (and every other thumbnail) -> original resolution.
  const normalizeUrl = (url) => {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('name', 'orig');
      return parsed.toString();
    } catch {
      return url;
    }
  };

  const getExtension = (url) => {
    try {
      return new URL(url).searchParams.get('format') || 'jpg';
    } catch {
      return 'jpg';
    }
  };

  // The author handle is the first @-prefixed line of the tweet header.
  const getAuthor = (img) => {
    const tweet = img.closest('[data-testid="tweet"]');
    if (!tweet) return '';
    const handle = tweet.innerText
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.startsWith('@'));
    return handle ? handle.replace(/[^\w.@-]+/g, '') : '';
  };

  const getFilename = (url, img) => {
    const mediaId = new URL(url).pathname.split('/').pop();
    const author = getAuthor(img);
    return `${author ? `${author}_` : ''}${mediaId}.${getExtension(url)}`;
  };

  const saveMedia = (url, filename) =>
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = blobUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        // Keep the blob alive until the browser has started the download.
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      })
      .catch((error) =>
        console.error(`${url} download failed: ${error.message || error}`),
      );

  const seen = new Set();
  window.scrollTo(0, 0); // walk the timeline from the top
  await sleep(500);

  // X virtualises the timeline: old posts unmount and new ones load as you
  // scroll, so a single empty pass does not mean we reached the end.
  const MAX_EMPTY_PASSES = 3;
  let emptyPasses = 0;

  while (emptyPasses < MAX_EMPTY_PASSES) {
    const fresh = Array.from(document.querySelectorAll('img')).filter(
      (img) => MEDIA_SRC.test(img.src) && !seen.has(normalizeUrl(img.src)),
    );

    if (fresh.length === 0) {
      emptyPasses += 1;
      window.scrollBy(0, window.innerHeight);
    } else {
      emptyPasses = 0;
      for (const img of fresh) {
        const url = normalizeUrl(img.src);
        seen.add(url);
        img.scrollIntoView({ block: 'center' });
        const filename = getFilename(url, img);
        console.log(seen.size, filename);
        await saveMedia(url, filename);
        await sleep(700);
      }
    }

    await sleep(1200);
  }

  console.log(`Done. ${seen.size} media file(s) requested.`);
  console.log(Array.from(seen).join('\n'));
  return Array.from(seen);
}

download();


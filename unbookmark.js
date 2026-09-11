// Paste this into the DevTools console while you are on
// https://x.com/i/history (Bookmarks tab), then run:  removeTweets(50)
//
// This deletes bookmarks, so it never runs on its own.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// X exposes the bookmark control with a stable test id:
// "removeBookmark" while the post is bookmarked, "bookmark" once it is not.
const BOOKMARKED_SELECTOR = '[data-testid="removeBookmark"]';

async function removeTweets(amount = 5) {
  let removed = 0;

  while (removed < amount) {
    const button = document.querySelector(BOOKMARKED_SELECTOR);

    if (!button) {
      // New bookmarks may still be lazy-loading further down the timeline.
      window.scrollBy(0, window.innerHeight);
      await sleep(1000);
      if (!document.querySelector(BOOKMARKED_SELECTOR)) break;
      continue;
    }

    button.scrollIntoView({ block: 'center' });
    button.click();
    removed += 1;
    console.log(`${removed} deleted`);
    await sleep(750);
  }

  console.log(`Done. ${removed} bookmark(s) removed.`);
  return removed;
}


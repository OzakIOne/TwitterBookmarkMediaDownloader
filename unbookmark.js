async function removeTweets(amount = 5) {
  if (amount < 0) return;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let i = 0;
  do {
    let btn = [
      ...document.querySelectorAll('.css-1dbjc4n.r-18u37iz.r-1h0z5md'),
    ].filter((el) => el.innerHTML.includes('Share Tweet'));
    btn[0].firstChild.click();
    let span = [
      ...document.querySelectorAll(
        '.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0',
      ),
    ].filter((el) => el.innerHTML.includes('Remove Tweet from Bookmarks'))[0];
    span.closest('[role="menuitem"]').click();
    await sleep(750);
    if (amount % 10 === 0) {
      console.log(`${i} deleted`);
    }
    i++;
  } while (amount-- > 0);
}

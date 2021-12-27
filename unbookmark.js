(async function () {
  let number = 100;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    await sleep(1000);
    if (number % 10 === 0) {
      console.log(number);
    }
  } while (number-- > 0);
})();

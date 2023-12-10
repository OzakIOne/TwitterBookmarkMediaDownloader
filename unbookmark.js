const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const bookMarkButtonSelector = 'div.css-175oi2r.r-18u37iz.r-1h0z5md.r-1b7u577 > div > div > div > div';

async function removeTweets(amount = 5) {
  if(amount <= 0) return;

  let i = 0;
  do {
    let btn = [
      ...document.querySelectorAll(bookMarkButtonSelector),
    ]
    btn[0].click();
    await sleep(750);
    if (amount % 10 === 0) {
      console.log(`${i} deleted`);
    }
    i++;
  } while (amount-- > 0);
};

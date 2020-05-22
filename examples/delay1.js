import Pro from "../index.js";

let delay = function (ms, callback) {
  setTimeout(() => {
    let msg = `Pro resolved after ${ms}ms`;
    callback(msg);
  }, ms);
};

let twoSecondLater = () => {
  return new Pro((resolve, reject) => {
    let ms = 2000;
    delay(ms, resolve);
  });
};

twoSecondLater()
  .then((msg) => {
    console.log(`inside 1st then`);
    console.log(msg);

    return new Pro((resolve, reject) => {
      let ms = 750;
      delay(ms, resolve);
    });
  })
  .then((msg) => {
    console.log(`inside 2nd then`);
    console.log(msg);
    return Pro.resolve("Hello Test 99!!!");
  })
  .then((msg) => {
    console.log(`inside 3rd then`);
    console.log(msg);
  })
  .catch((err) => console.log(err.message));

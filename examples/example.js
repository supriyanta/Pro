import Pro from "../index.js";

let somethingWentWrong = () => {
  return new Pro((resolve, reject) => {
    let p = Math.random();
    if (p < 0.5) {
      resolve(p);
    } else {
      reject(p);
    }
  });
};

somethingWentWrong()
  .then((p) => {
    throw new Error("Error occured!!!");
  })
  .catch((err) => console.log(err.message));

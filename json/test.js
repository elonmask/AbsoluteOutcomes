new Promise(function (resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function (result) {

  console.log(`// 1`, result);

  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function (result) { // (**)

  console.log(`// 2`, result);


  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function (result) {

  console.log(`// 4`, result);

});
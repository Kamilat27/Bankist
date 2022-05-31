'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function displayMovements(movements, sort) {
  containerMovements.innerHTML = '';

  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  mov.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${move}€</div>    
    </div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function createUsernames(accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

function updateUI(account) {
  // Display movements
  displayMovements(account.movements);

  // Display summary
  calcDisplaySummary(account);

  //Display balance
  displayBalance(account);
}

createUsernames(accounts);

function displayBalance(account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = account.balance + '€';
}

function calcDisplaySummary(account) {
  const calcIn = account.movements
    .filter(cur => cur > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = calcIn + '€';

  const out = account.movements
    .filter(cur => cur < 0)
    .reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = Math.abs(out) + '€';

  const interest = account.movements
    .filter(cur => cur > 0)
    .map(cur => (cur * account.interestRate) / 100)
    .filter(cur => cur >= 1)
    .reduce((acc, cur) => acc + cur);

  labelSumInterest.textContent = interest + '€';
}

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // DIsplay UI mesage
    labelWelcome.textContent =
      'Welcome back, ' + currentAccount.owner.split(' ')[0];

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(
    cur => inputTransferTo.value === cur.username
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    // Delete account
    accounts.splice(
      accounts.findIndex(cur => cur.username === currentAccount.username, 0),
      1
    );

    inputCloseUsername.value = inputClosePin.value = '';

    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
//*/Doesn't change the orginal array
// console.log(arr.slice(2));
// console.log(arr.slice(2, 3));
// console.log(arr.slice(1, -2));
// console.log(arr.slice(1));
// console.log(arr.slice(-5, 2));
// console.log(arr.slice(-5));
// console.log([...arr]);

// SPLICE
//*Changes the original array
// console.log(arr.splice(2, 3));
// console.log(arr.splice(-5, 1));
// console.log(arr.splice(-4));
// console.log(arr.splice(4));

// // REVERSE
// //*Changes the original array
// let arr2 = ['k', 'j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// //*Doesn't change the original array
// console.log(arr.concat(arr2));
// console.log(arr);
// console.log(arr2);

// // AT
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log('access the last element');
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

/*
//////////FOREACH///////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) console.log(i + 1 + '. You deposited: ' + movement);
  else console.log(i + 1 + '. You withdrew: ' + Math.abs(movement));
}

console.log('-----------FOREACH-------------');

// Arrays
movements.forEach(function (movement, i, arr) {
  if (movement > 0) console.log(i + 1 + '. You deposited: ' + movement);
  else console.log(1 + i + '. You withdrew: ' + Math.abs(movement));
});

// Maps
console.log('---------MAPS----------');
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(key + ' : ' + value);
});

// Sets
console.log('-----------SETS----------');
const uniqueCurrencies = new Set([
  'USD',
  'EUR',
  'SOM',
  'USD',
  'CAD',
  'CAD',
  'RUS',
]);
uniqueCurrencies.forEach(function (value, _, set) {
  console.log(_ + ' : ' + value);
});
*/
/*
///////////CHALLENGE 1/////////////
function checkDogs(dogsJulia, dogsKate) {
  const correctedJulia = dogsJulia.slice(1, -2);
  const bothData = [...correctedJulia, ...dogsKate];
  bothData.forEach(function (dog, i) {
    console.log(
      `Dog number ${i + 1} is ${
        dog >= 3 ? 'an adult, and' : 'still a puppy:'
      } ${dog} years old`
    );
  });
  console.log(correctedJulia);
}
const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];
const julia2 = [9, 16, 6, 8, 3];
const kate2 = [10, 5, 6, 1, 4];
checkDogs(julia2, kate2);
*/

// let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
///////////////MAP////////////////
const convRate = 1.1;
const movementsUSD = movements.map(function (mov) {
  return mov * convRate;
});

console.log(movementsUSD);
*/
/*
//////////////////FILTER//////////////////
const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);

const deposits1 = [];
for (const mov of movements) {
  if (mov > 0) deposits1.push(mov);
}

console.log(deposits1);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

/////////////////////REDUCE//////////////////////
*/

/*
/////////////////////CHALLENGE 2//////////////////
const calcAverageHumanAge = ages =>
  ages
    .map(cur => (cur <= 2 ? cur * 2 : cur * 4 + 16))
    .filter(cur => cur >= 18)
    .reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/
/*
///////////////FIND////////////////
movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements.find(mov => mov < 0));

console.log(accounts.find(account => account.owner === 'Jonas Schmedtmann'));
*/
// const array = [1, [2, 3, [4, 5, [6, 7, [8]]]]];
/*
/////////////////MAP FLATMAP///////////////////

console.log(
  accounts
    .map(cur => cur.movements)
    .flat()
    .reduce((acc, cur) => acc + cur)
);

console.log(
  accounts.flatMap(cur => cur.movements).reduce((acc, cur) => acc + cur)
);


console.log(array.flat(4));
*/
/*
////////////////SORT//////////////////

const array2 = [5, 3, 8, 9, 15, 1, 5];
const strAr = ['Kamila', 'Zilola', 'Karina', 'Damir', 'Parvina', 'Iskandar'];
console.log(strAr.sort());

console.log(array2.sort((a, b) => a - b));
*/
///////////USING THE FROM AND FILL METHODS ON ARRAYS/////////////

// const arr = new Array(10);
// arr.fill(12, 5, 8);

// const diceRoll = Array.from({ length: 100 }, (_, i) => i + 1);
// console.log(diceRoll);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     cur => Number(cur.textContent.replace('€', ''))
//   );

//   console.log(movementsUI);
// });

// /////////////// Array methods in practice//////////////////

// const calcOverallBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, cur) => acc + cur);

// console.log(calcOverallBalance);

// const calcWithdrawals = accounts
//   .flatMap(cur => cur.movements)
//   .reduce((acc, cur) => (cur < 0 ? acc + 1 : acc), 0);

// console.log(calcWithdrawals);

// const calcWithdrawalsAndDeposits1 = accounts
//   .flatMap(cur => cur.movements)
//   .reduce(
//     (acc, cur) => {
//       acc[cur > 0 ? 'deposits' : 'withdrawals']++;

//       return acc;
//     },
//     { withdrawals: 0, deposits: 0 }
//   );

// const { withdrawals, deposits } = accounts
//   .flatMap(cur => cur.movements)
//   .reduce(
//     (acc, cur) => {
//       acc[cur > 0 ? 'deposits' : 'withdrawals']++;

//       return acc;
//     },
//     { withdrawals: 0, deposits: 0 }
//   );
// console.log(calcWithdrawalsAndDeposits1);
// console.log(deposits, withdrawals);
// console.log(accounts.flatMap(cur => cur.movements));

// function titileCase(str) {
//   const exceptions = ['and', 'or', 'a', 'an', 'the', 'but', 'on', 'in', 'with'];

//   function capitalize(word) {
//     return word[0].toUpperCase() + word.slice(1);
//   }
//   return capitalize(
//     str
//       .toLowerCase()
//       .split(' ')
//       .map(cur => (exceptions.includes(cur) ? cur : capitalize(cur)))
//       .join(' ')
//   );
// }

// console.log(titileCase('this is a nice title'));
// console.log(titileCase('chain of gold'));
// console.log(titileCase('the infernal devices'));
// console.log(titileCase('think like a monk'));
// console.log(titileCase('is it true story?'));
// console.log(titileCase('and it continues...'));
// console.log(titileCase('in the shadows'));

/////////////////CHALLENGE #4////////////////////////////
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

/*1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate 
the recommended food portion and add it to the object as a new property. Do 
not create a new array, simply loop over the array. Forumla: 
recommendedFood = weight ** 0.75 * 28. (The result is in grams of 
food, and the weight needs to be in kg*/

console.log('Task 1');
const calcRecommendedFood = dogs.map(cur => {
  cur.recommended = Math.trunc(cur.weight ** 0.75 * 28);
  return cur;
});

console.log(calcRecommendedFood);

/*
2. Find Sarah's dog and log to the console whether it's eating too much or too 
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in 
the owners array, and so this one is a bit tricky (on purpose) 
 */
console.log('Task 2');
function findOwnersDog(owner) {
  return dogs.find(cur => cur.owners.includes(owner));
}

function dogEatingPortion(dog) {
  if (dog.curFood < dog.recommended * 0.9) return 'too little';
  else if (dog.curFood > dog.recommended * 1.1) return 'too much';
  else return 'Ok';
}

console.log("Sarah's dog eating " + dogEatingPortion(findOwnersDog('Sarah')));

/*
3. Create an array containing all owners of dogs who eat too much 
('ownersEatTooMuch') and an array with all owners of dogs who eat too little 
('ownersEatTooLittle')
*/
// const {ownerEatTooMuch, ownerEatTooLittle}
console.log('Task 3');
const { ownersEatTooMuch, ownersEatTooLittle } = dogs
  .flatMap(dog => dog.owners)
  .reduce(
    (acc, curOwner) => {
      const dogEats = dogEatingPortion(findOwnersDog(curOwner));
      if (dogEats === 'too little') acc.ownersEatTooLittle.push(curOwner);
      else if (dogEats === 'too much') acc.ownersEatTooMuch.push(curOwner);

      return acc;
    },
    { ownersEatTooMuch: [], ownersEatTooLittle: [] }
  );

console.log(ownersEatTooMuch, ownersEatTooLittle);

/**
 * 4. Log a string to the console for each array created in 3., like this: "Matilda and 
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
too little!"
 */
console.log('Task 4');
function intoSentence(arr) {
  return arr
    .map((cur, i) => (i === arr.length - 1 ? cur + "'s " : cur + ' and'))
    .join(' ');
}

console.log(intoSentence(ownersEatTooLittle) + 'dogs eat too little!');
console.log(intoSentence(ownersEatTooMuch) + 'dogs eat too much!');

/**
 * 5. Log to the console whether there is any dog eating exactly the amount of food 
that is recommended (just true or false)
 */
console.log('Task 5');
console.log(dogs.some(cur => cur.recommended === cur.curFood));

/**
 * 6. Log to the console whether there is any dog eating an okay amount of food 
(just true or false)
 */
console.log('Task 6');
console.log(dogs.some(dog => dogEatingPortion(dog) === 'Ok'));

/**
 * 7. Create an array containing the dogs that are eating an okay amount of food (try 
to reuse the condition used in 6.)
 */
console.log('Task 7');
const okAmmountOfFood = dogs.filter(dog => dogEatingPortion(dog) === 'Ok');
console.log(okAmmountOfFood);

/**
 * 8. Create a shallow copy of the 'dogs' array and sort it by recommended food 
portion in an ascending order (keep in mind that the portions are inside the 
array's objects �
 */
console.log('Task 8');
const dogsSortedByRecFood = [...dogs].sort(
  (a, b) => a.recommended - b.recommended
);
console.log(dogsSortedByRecFood);

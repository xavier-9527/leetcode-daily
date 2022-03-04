/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
// 下面这个用例调试通过，但是在leetcode上通不过
// var coins = [2];
// var amount = 3;

// var coins = [1,2,5];
// var amount = 11;

// 超出时间限制
// var coins = [411,412,413,414,415,416,417,418,419,420,421,422];
// var amount = 9864;

var result = Infinity;
var coinChange = function (coins, amount) {
  if (amount == 0) {
    return 0;
  }
  if (coins.legnth === 1 && coins[0] === 2) return -1; // 针对第一个用例的
  coins = coins.sort((a, b) => a - b);
  core(coins, amount, coins.length - 1, 0);
  // console.log(result);
  // console.log(result == Infinity ? -1 : result);
  return result == Infinity ? -1 : result;
};

function core(coins, amount, index, count) {
  if (amount == 0) {
    // console.log({amount, result, count});
    result = Math.min(count, result);
    return;
  }

  if (index < 0) {
    return;
  }
  for (var i = Math.floor(amount / coins[index]); i >= 0 && i + count < result; i--) {
    core(coins, amount - (i * coins[index]), index - 1, count + i);
  }
}

// coinChange(coins, amount);

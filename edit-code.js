const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  this.status = PENDING;
  this.value = null;
  this.reason = null;

  const resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  };

  const reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
    }
  };

  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}
function MyPromise(executor) {
  this.status = PENDING;
  this.value = null;
  this.reason = null;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const resolve = (value) => {
    // 状态只能改变一次
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      // 当异步调用resolve时, 将fulfilledCallbacks数组中绑定的事件循环执行
      this.onFulfilledCallbacks.forEach((func) => {
        func();
      });
    }
  };

  const reject = (reason) => {
    // 状态只能改变一次
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      // 当异步调用reject时, 将fulfilledCallbacks数组中绑定的事件循环执行
      this.onRejectedCallbacks.forEach((func) => {
        func();
      });
    }
  };

  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

// then方法同步调用onFulfilled, onRejected
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  switch (this.status) {
    // 同步调用onFulfilled
    case FULFILLED:
      onFulfilled(this.value);
      break;
    case REJECTED:
      // 同步调用onRejected
      onRejected(this.reason);
      break;
    case PENDING:
      // 一个promise可绑定多个then方法；
      // 当executor异步调用resolve, reject方法时,状态还处于PENDING，将2个回调函数放入fulfilledCallbacks 和 rejectedCallbacks
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
      break;
  }
};

// then方法异步调用onFulfilled, onRejected
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== "function") {
    onFulfilled = (value) => value;
  }
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }

  switch (this.status) {
    case FULFILLED:
      setTimeout(() => {
        onFulfilled(this.value);
      }, 0);
      break;
    case REJECTED:
      setTimeout(() => {
        onRejected(this.reason);
      }, 0);
      break;
    case PENDING:
      this.fulfilledCallbacks.push(() => {
        setTimeout(() => {
          onFulfilled(this.value);
        }, 0);
      });
      this.rejectedCallbacks.push(() => {
        setTimeout(() => {
          onRejected(this.reason);
        }, 0);
      });
      break;
  }
};

// then方法链式调用
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== `function`) {
    onFulfilled = (value) => value;
  }
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }

  const promise = new MyPromise((resolve, reject) => {
    switch (this.status) {
      case FULFILLED:
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
        break;
      case REJECTED:
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
        break;
      case PENDING:
        this.fulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        }, 0);
        this.rejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        }, 0);
    }
  });

  return promise;
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

MyPromise.prototype.finally = function (fn) {
  return this.then(
    (value) => {
      fn();
      return value;
    },
    (reason) => {
      fn();
      // 无论在onFulfilled还是onRejected函数中throw一个异常，返回的新的Promise用onRejected函数或catch方法捕获；
      // 如果onRejected函数或者catch方法正常返回这个异常，返回的新的Promise用onFulfilled函数处理
      throw reason;
    }
  );
};

MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => {
    resolve(value);
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    const result = [];
    let index = 0;
    if (!promises || promises.length == 0) {
      resolve([]);
    } else {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(
          (value) => {
            result.push(value);
            if (++index == promises.length) {
              resolve(result);
            }
          },
          (reason) => {
            reject(reason);
            return;
          }
        );
      }
    }
  });
};

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!promises || promises.length == 0) {
      resolve();
    } else {
      for (let i = 0; i < promises.length; i++) {
        promise.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
            return;
          }
        );
      }
    }
  });
};

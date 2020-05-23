let PENDING = "pending",
  FULLFILLED = "fullfilled";

export default class Pro {
  constructor(executorFn) {
    this.status = PENDING;
    this.thenCallbacks = [];
    this.catchCallback = undefined;

    setTimeout(() => {
      executorFn(this.resolver.bind(this), this.rejector.bind(this));
    }, 0);
  }

  then(_callback) {
    this.thenCallbacks.push(_callback);
    return this;
  }

  catch(_callback) {
    this.catchCallback = _callback;
    //   return this;
  }

  resolver(_value) {
    this.value = _value;
    this.status = FULLFILLED;
    let retValue = _value;

    for (let i = 0; i < this.thenCallbacks.length; ++i) {
      let thenCallback = this.thenCallbacks[i];

      if (retValue instanceof Pro) {
        // When another Promise is returned
        if (retValue.status === PENDING) {
          retValue.thenCallbacks = [...this.thenCallbacks.slice(i)];
          retValue.catchCallback = this.catchCallback;
          this.thenCallbacks.length = 0;
        } else {
          try {
            thenCallback.call(retValue, retValue.value);
          } catch (err) {
            this.rejector.call(retValue, err);
            retValue.thenCallbacks.length = 0;
          }
        }
      } else {
        // When returned value is not a Promise
        try {
          retValue = thenCallback.call(this, retValue);
        } catch (err) {
          this.rejector.call(this, err);
          this.thenCallbacks.length = 0;
        }
      }
    }
    this.thenCallbacks.length = 0;
    this.thenCallbacks = undefined;
  }

  rejector(_value) {
    if (this.catchCallback) {
      this.catchCallback(_value);
    } else {
      throw new Error("Promise rejection does not handled.");
    }
  }

  static resolve(_value) {
    return new Pro((resolve) => resolve(_value));
  }

  static reject(_value) {
    return new Pro((_, reject) => reject(_value));
  }
}

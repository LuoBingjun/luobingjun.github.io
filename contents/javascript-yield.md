# JavaScript的Generator和yield

JavaScript ES6规范引入了Generator（生成器）函数和yield关键字，这个新特性允许我们控制函数的执行权，在必要时暂停函数，并在下一次调用时从暂停的位置继续，方便了异步任务的封装过程。

## Generator函数简介
Generator函数的定义和普通函数差不多，只是需要在function后加一个*号，同时在需要暂停（返回）的位置应该使用yield关键字。

```javascript
function* f(x){
    yield x+1;
    yield x+2;
    yield x+3;
}
```

以这段代码为例，第一次调用f()函数，会从函数开始执行到第一个yield关键字处，暂停并返回yield的值，此后每一次调用f()函数，都会从上一次暂停的位置恢复执行，直到遇到下一个yield关键字为止。

## Generator函数调用
在调用Generator函数时，要首先构造迭代器对象，这个的next()方法会执行迭代过程，并返回value和done，其中value就是本次迭代中的返回值，而done则是判断迭代是否已经完成的变量。通过反复调用迭代器的next()方法，就可以持续进行迭代过程。以上面的f()函数为例：

```javascript
var iter = f(1);
console.log(iter.next());   // { value: 2, done: false }
console.log(iter.next());   // { value: 3, done: false }
console.log(iter.next());   // { value: 4, done: false }
console.log(iter.next());   // { value: undefined, done: true }
```

## yield*与递归调用
在Generator函数中，我们会遇到递归调用Generator函数或者其他可迭代对象的情形，在这种情况下，yield*关键字就派上了用场，它能够将本函数的迭代器托管给其他Generator函数或者其他可迭代对象，实现Generator函数的递归调用。

```javascript
function* f1(x){
    yield x+1;
    yield x+2;
}

function* f(x){
    yield* f1(x);
    yield x+3;
}

var iter = f(1);
console.log(iter.next());   // { value: 2, done: false }
console.log(iter.next());   // { value: 3, done: false }
console.log(iter.next());   // { value: 4, done: false }
console.log(iter.next());   // { value: undefined, done: true }
```

在f(x)中，遇到yield*关键字时，iter就会被托管给f1(x)函数，直到f1(x)中的所有yield关键字都被迭代完成后，又会被交还给f(x)，继续迭代过程。
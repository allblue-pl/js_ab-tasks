
var abTasks = require('../index.js');


var tasker = new abTasks.Tasker();

var t1 = function(arg) {
    return new abTasks.Task('chain.t1', (args_array) => {
        console.log('Task `t1` triggered with args:', args_array);
            })
        .chain(t2(), arg);
};

var t2 = function() {
    return new abTasks.Task('chain.t2', (args_array) => {
        console.log('Task `t2` triggered with args:', args_array);
    });
};

var t3 = function() {
    return new abTasks.Task('chain.t3', (args_array) => {
        console.log('Task `t3` triggered with args:', args_array);
        return false;
            })
        .chain(t2(), 'from t3');
}

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('\n\nCHAIN\n');
        console.log('Expected result:');
        console.log('t1 [ 0, 1, 2, 3 ], t2 [ 0, 1, 2, 3 ]');
        console.log('t1 [ 4, 5 ], t2 [ 4, 5 ]');
        console.log('t3 []\n');

        tasker.call(t1(0), 0);
        tasker.call(t1(1), 1);

        setTimeout(function() {
            tasker.call(t1(2), 2);
            tasker.call(t1(3), 3);
        }, 90);

        setTimeout(function() {
            tasker.call(t1(4), 4);
            tasker.call(t1(5), 5);
        }, 300);

        setTimeout(function() {
            tasker.call(t3());
        }, 400);

        setTimeout(function() {
            resolve();
        }, 1000);
    });
};

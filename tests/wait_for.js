
var abTasks = require('../index.js');


var tasker = new abTasks.Tasker();

var t1 = function() {
    return new abTasks.Task('chain.t1', (args_array) => {
        console.log('Task `t1` triggered with args:', args_array);
    });
};

var t2 = function() {
    return new abTasks.Task('chain.t2', (args_array) => {
        console.log('Task `t2` triggered with args:', args_array);
            })
        .waitFor('chain.t1');

};

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('\nWAIT FOR\n');
        console.log('Expected result:');
        console.log('t1 [ 0, 1, 2, 3 ]');
        console.log('t2 [ 4, 5 ]\n');

        [ 0, 1, 2, 3 ].forEach(function(i) {
            setTimeout(function() {
                tasker.call(t1(), i);
            }, i * 90);
        });

        tasker.call(t2(), 4);
        tasker.call(t2(), 5);

        setTimeout(function() {
            resolve();
        }, 1500);
    });
};

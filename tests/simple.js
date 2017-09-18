
var abTasks = require('../index.js');


var tasker = new abTasks.Tasker();

var t = function() {
    return new abTasks.Task('simple.t', (args_array) => {
        console.log('Task `t` triggered with args:', args_array);
    });
};

module.exports = function() {
    return new Promise(function(resolve, reject) {
        console.log('\n\nSIMPLE\n');
        console.log('Expected result: [ 0, 1, 2, 3 ], [ 4, 5 ]\n');

        tasker.call(t(), 0);
        tasker.call(t(), 1);

        setTimeout(function() {
            tasker.call(t(), 2);
            tasker.call(t(), 3);
        }, 90);

        setTimeout(function() {
            tasker.call(t(), 4);
            tasker.call(t(), 5);
        }, 300);

        setTimeout(function() {
            resolve();
        }, 500);
    });
};

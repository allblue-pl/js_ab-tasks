
var abTasks = require('../index.js');


var tasker = new abTasks.Tasker();

var t = function() {
    return new abTasks.Task('promise.t', function(args_array) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                console.log('Task `t` triggered with args:', args_array);
                resolve();
            }, 3000);
        });
    });
};

module.exports = function() {
    return new Promise((resolve, reject) => {
        console.log('\nPROMISES\n');
        console.log('Expected result: [ 0, 1, 2, 3 ] -> 3000 break -> [ 4, 5 ]\n');

        tasker.call(t(), 0);
        tasker.call(t(), 1);

        setTimeout(function() {
            tasker.call(t(), 2);
            tasker.call(t(), 3);
        }, 90);

        setTimeout(function() {
            tasker.call(t(), 4);
            tasker.call(t(), 5);
        }, 500);

        setTimeout(function() {
            resolve();
        }, 7000);
    });
};

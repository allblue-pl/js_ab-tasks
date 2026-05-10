import Task from "../ts-lib/Task.ts";
import Tasker from "../ts-lib/Tasker.ts";


let tasker = new Tasker();

let t = (): Task<number> => {
    return new Task('promise.t', function(args_array) {
        return new Promise<boolean>(function(resolve, reject) {
            setTimeout(() => {
                console.log('Task `t` triggered with args:', args_array);
                resolve(true);
            }, 3000);
        });
    });
};

export default () => {
    return new Promise<void>((resolve, reject) => {
        console.log('\nPROMISES\n');
        console.log('Expected result: [ 0, 1, 2, 3 ] -> 3000 break -> [ 4, 5 ]\n');

        tasker.call(t(), 0);
        tasker.call(t(), 1);

        setTimeout(() => {
            tasker.call(t(), 2);
            tasker.call(t(), 3);
        }, 90);

        setTimeout(() => {
            tasker.call(t(), 4);
            tasker.call(t(), 5);
        }, 500);

        setTimeout(() => {
            resolve();
        }, 7000);
    });
};

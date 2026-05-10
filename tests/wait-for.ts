import Task from "../ts-lib/Task.ts";
import Tasker from "../ts-lib/Tasker.ts";

let tasker = new Tasker();

let t1 = (delay: number): Task<number> => {
    // console.log('Running t1 with delay:', delay);
    
    return new Task('chain.t1', (args_array): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Task `t1` triggered with args:', args_array);
                resolve(true);
            }, delay);
        });
    });
};

let t2 = (): Task<number> => {
    return new Task('chain.t2', (args_array): boolean => {
        console.log('Task `t2` triggered with args:', args_array);
        return true;
            })
        .waitFor('chain.t1');

};

export default () => {
    return new Promise<void>(function(resolve, reject) {
        console.log('\nWAIT FOR\n');
        console.log('Expected result:');
        console.log('t1 [ 0, 1, 2, 3 ]');
        console.log('t2 [ 4, 5 ]\n');

        tasker.call(t1(90), 0);
        for (let i = 1; i < 4; i++) {
            setTimeout(() => {
                tasker.call(t1(90 + i * 90), i);
            }, i * 10);
        }

        tasker.call(t2(), 4);
        tasker.call(t2(), 5);

        setTimeout(() => {
            resolve();
        }, 1500);
    });
};

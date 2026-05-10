import Task from "../ts-lib/Task.ts";
import Tasker from "../ts-lib/Tasker.ts";


let tasker = new Tasker();

let t1 = (arg: number): Task<number> => {
    return new Task<number>('chain.t1', (args): boolean => {
        console.log('Task `t1` triggered with args:', args);
        return true;
            })
        .chain<string>(t2(), String(arg));
};

let t2 = (): Task<string> => {
    return new Task('chain.t2', (args): boolean => {
        console.log('Task `t2` triggered with args:', args);
        return true;
    });
};

let t3 = () => {
    return new Task<number>('chain.t3', (args): boolean => {
        console.log('Task `t3` triggered with args:', args);
        return false;
            })
        .chain(t2(), 'from t3');
}

export default () => {
    return new Promise<void>(function(resolve, reject) {
        console.log('\n\nCHAIN\n');
        console.log('Expected result:');
        console.log('t1 [ [ 0, 0 ], [ 1, 1 ], [ 2, 2 ], [ 3, 3] ], t2 [ [ 0 ], [ 1 ], [ 2 ], [ 3 ] ]');
        console.log('t1 [ [ 4, 4 ], [ 5, 5 ] ], t2 [ [ 4 ], [ 5 ] ]');
        console.log('t3 []\n');

        tasker.call(t1(0), 0);
        tasker.call(t1(1), 1);

        setTimeout(() => {
            tasker.call(t1(2), 2);
            tasker.call(t1(3), 3);
        }, 90);

        setTimeout(() => {
            tasker.call(t1(4), 4);
            tasker.call(t1(5), 5);
        }, 300);

        setTimeout(() => {
            tasker.call(t3());
        }, 400);

        setTimeout(() => {
            resolve();
        }, 1000);
    });
};

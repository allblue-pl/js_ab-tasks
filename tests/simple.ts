import Task from "../ts-lib/Task.ts";
import Tasker from "../ts-lib/Tasker.ts";

let tasker = new Tasker();

let t0 = (): Task<number> => {
    return new Task('simple0.t', (argsArray): boolean => {
        console.log('Task `t0` triggered with args:', argsArray);
        return true;
    });
};

type Args_T1 = {
    arg0: string;
    arg1: number;
};

let t1 = (): Task<Args_T1> => {
    return new Task('simple1.t', (argsArr): boolean => {
        console.log('Task `t1` triggered with args:', argsArr);
        return true;
    });
}

export default () => {
    return new Promise<void>(function(resolve, reject) {
        console.log('\n\nSIMPLE\n');
        console.log('Expected result: [ [ 0, 0 ], [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ], [ [ 4, 4 ], [ 5, 5 ] ]\n');

        tasker.call(t0(), 0);
        tasker.call(t0(), 1);

        setTimeout(() => {
            tasker.call(t0(), 2);
            tasker.call(t0(), 3);

            tasker.call(t1(), { arg0: 'My String', arg1: 6 });
        }, 90);

        setTimeout(() => {
            tasker.call(t0(), 3);
            tasker.call(t0(), 5);
        }, 300);

        setTimeout(() => {
            resolve();
        }, 500);
    });
};

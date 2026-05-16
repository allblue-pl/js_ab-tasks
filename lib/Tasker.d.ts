import Task from "./Task.ts";
export default class Tasker {
    #private;
    constructor(waitTime?: number);
    call<TaskArgs>(task: Task<TaskArgs>, args: TaskArgs): void;
    getActiveTaskNames(): {
        executing: Array<string>;
        waiting: Array<string>;
    };
    setWaitTime(waitTime: number): void;
}
//# sourceMappingURL=Tasker.d.ts.map
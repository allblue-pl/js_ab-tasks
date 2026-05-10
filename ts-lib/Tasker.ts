import abLog from "ab-log";

import Task, { TaskCall, TaskInfo } from "./Task.ts";

export default class Tasker {
    #waitTime: number;

    #taskInfos_Waiting: Map<string, TaskInfo<any>>;
    #taskInfos_Executing: Map<string, TaskInfo<any>>;

    #processCalls: number;

    constructor(waitTime = 100) {
        this.#waitTime = waitTime;

        this.#taskInfos_Waiting = new Map();
        this.#taskInfos_Executing = new Map();

        this.#processCalls = 0;
    }

    call<TaskArgs>(task: Task<TaskArgs>, args: TaskArgs): void {
        this.#addWaitingTask(task, args, Date.now());

        this.#processCalls++;
        setTimeout(() => {
            this.#processCalls--;
            // console.log('Process', task.name);
            this.#processWaitingTasks();
        }, this.#waitTime + 1);
    }

    setWaitTime(waitTime: number): void {
        this.#waitTime = waitTime; 
    }


    #addChainedTaskCalls(taskInfo: TaskInfo<any>): void {
        for (let i = 0; i < taskInfo.chainedTaskCalls.length; i++) {
            let taskCall = taskInfo.chainedTaskCalls[i];
            this.#addWaitingTask(taskCall.task, taskCall.args, -1);
        }
    }

    #addWaitingTask<TaskArgs>(task: Task<TaskArgs>, args: TaskArgs, lastCall: number): 
            TaskInfo<TaskArgs> {
        let taskInfo = this.#taskInfos_Waiting.get(task.name);
        if (taskInfo === undefined) {
            taskInfo = new TaskInfo();
            this.#taskInfos_Waiting.set(task.name, taskInfo);
        }

        taskInfo.addTask(task, args, lastCall);

        return taskInfo;
    }

    #areWaitForsFinished(taskInfo: TaskInfo<any>): boolean {
        if (taskInfo.task === null)
            return true;

        let waitFors = taskInfo.task._waitFors;

        for (let i = 0; i < waitFors.length; i++) {
            let waitForRegexp = new RegExp(this.#waitForToRegExp(waitFors[i]));

            for (let [taskName_T, taskInfo_T] of this.#taskInfos_Waiting) {
                if (taskInfo_T.task === null)
                    return false;

                if (taskName_T !== taskInfo.task.name)
                    if (waitForRegexp.test(taskName_T))
                        return false;
            }

            for (let [taskName_T, taskInfo_T] of this.#taskInfos_Executing) {
                if (taskInfo_T.task === null)
                    return false;

                if (taskName_T !== taskInfo.task.name)
                    if (waitForRegexp.test(taskName_T))
                        return false;
            }
        }

        return true;
    }

    #execTaskInfo(taskInfo: TaskInfo<any>): void {
        if (taskInfo.task === null)
            return;

        /* Think about debug mode. */
        this.#taskInfos_Waiting.delete(taskInfo.task.name);
        this.#taskInfos_Executing.set(taskInfo.task.name, taskInfo);

        let result = taskInfo.task.fn.call(null, taskInfo.argsArray);

        if (result instanceof Promise) {
            result
                .then(() => {
                    if (taskInfo.task !== null)
                        this.#taskInfos_Executing.delete(taskInfo.task.name);

                    this.#addChainedTaskCalls(taskInfo);
                    // console.log('Process A', task_info.task.name);
                    this.#processWaitingTasks();
                })
                .catch((err) => {
                    if (taskInfo.task !== null) {
                        this.#taskInfos_Executing.delete(taskInfo.task.name);

                        if (!taskInfo.task.execCatch(err)) {
                            if (err instanceof Error)
                                err = err.stack;

                            console.log(abLog.cError('Unhandled task promise rejection:'), err);
                        }
                    } else 
                        abLog.error('Unhandled task promise rejection. Task is null.');

                    // console.log('Process B', task_info.task.name);
                    this.#processWaitingTasks();
                });
        } else {
            this.#taskInfos_Executing.delete(taskInfo.task.name);

            if (result !== false)
                this.#addChainedTaskCalls(taskInfo);

            // console.log('Process C', task_info.task.name);
            this.#processWaitingTasks();
        }
    }

    #isTaskInfoReadyToExec(taskInfo: TaskInfo<any>): boolean {
        // console.log('isTaskInfoReadyToExec', task_info.task.name);

        if (taskInfo.lastCall !== -1) {
            if (Date.now() < taskInfo.lastCall + this.#waitTime)
                return false;
        }

        if (taskInfo.task === null)
            return true;

        if (this.#taskInfos_Executing.has(taskInfo.task.name)) {
            // console.log('B');
            return false;
        }

        if (!this.#areWaitForsFinished(taskInfo)) {
            // console.log('C');
            return false;
        }

        // console.log('D');
        return true;
    }

    #processWaitingTasks(): void {
        for (let [taskName_T, taskInfo_T] of this.#taskInfos_Waiting) {
            if (taskInfo_T === undefined)
                throw new Error(`Task info '${taskName_T}' does not exist.`);

            if (!this.#isTaskInfoReadyToExec(taskInfo_T))
                continue;

            this.#execTaskInfo(taskInfo_T);
        }

        if (Object.keys(this.#taskInfos_Waiting).length > 0 &&
                Object.keys(this.#taskInfos_Executing).length === 0 &&
                this.#processCalls === 0) {
            console.warn('Unexecuted tasks in waiting queue:',
                    Object.keys(this.#taskInfos_Waiting));
        }
    }

    #waitForToRegExp(str: string): string {
        return '^' + str.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&")
                .replace('*', '.*') + '$';
    }
}

export default class Task {
    static get TaskCall() {
        return TaskCall;
    }
    static get TaskInfo() {
        return TaskInfo;
    }
    #catches;
    #chainedTaskCalls;
    #fn;
    #name;
    #waitFors;
    get _chainedTaskCalls() {
        return this.#chainedTaskCalls;
    }
    get _waitFors() {
        return this.#waitFors;
    }
    get fn() {
        return this.#fn;
    }
    get name() {
        return this.#name;
    }
    constructor(taskName, fn) {
        this.#name = taskName;
        this.#fn = fn;
        this.#catches = [];
        this.#waitFors = [];
        this.#chainedTaskCalls = [];
    }
    catch(catchFn) {
        this.#catches.push(catchFn);
        return this;
    }
    chain(task, args) {
        this.#chainedTaskCalls.push(new TaskCall(task, args));
        return this;
    }
    execCatch(err) {
        if (this.#catches.length === 0)
            return false;
        for (let catchFn of this.#catches)
            catchFn(err);
        return true;
    }
    waitFor(taskNamesPattern) {
        this.#waitFors.push(taskNamesPattern);
        return this;
    }
}
export class TaskCall {
    #task;
    #args;
    get args() {
        return this.#args;
    }
    get task() {
        return this.#task;
    }
    constructor(task, args) {
        this.#task = task;
        this.#args = args;
    }
}
export class TaskInfo {
    #lastCall;
    #task;
    #argsArr;
    #chainedTaskCalls;
    #waitFors;
    get argsArray() {
        return this.#argsArr;
    }
    get chainedTaskCalls() {
        return this.#chainedTaskCalls;
    }
    get lastCall() {
        return this.#lastCall;
    }
    get task() {
        return this.#task;
    }
    constructor() {
        this.#lastCall = -1; /* Timestamp of last call. */
        this.#task = null;
        this.#argsArr = [];
        this.#chainedTaskCalls = [];
        this.#waitFors = [];
    }
    addTask(task, args, lastCall = -1) {
        if (lastCall !== -1)
            this.#lastCall = lastCall;
        this.#task = task;
        this.#argsArr.push(args);
        for (let i = 0; i < task._chainedTaskCalls.length; i++)
            this.#chainedTaskCalls.push(task._chainedTaskCalls[i]);
        for (let i = 0; i < task._waitFors.length; i++) {
            if (this.#waitFors.indexOf(task._waitFors[i]) === -1)
                this.#waitFors.push(task._waitFors[i]);
        }
    }
}

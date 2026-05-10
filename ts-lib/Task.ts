export default class Task<TaskArgs> {
    static get TaskCall() {
        return TaskCall;
    }

    static get TaskInfo()  {
        return TaskInfo;
    }


    #catches: Array<(err: Error) => void>;
    #chainedTaskCalls: Array<TaskCall<any>>;
    #fn: (argsArr: Array<TaskArgs>) => boolean|Promise<boolean>;
    #name: string;
    #waitFors: Array<string>;

    get _chainedTaskCalls() {
        return this.#chainedTaskCalls;
    }

    get _waitFors(): Array<string> {
        return this.#waitFors;
    }

    get fn(): (argsArr: Array<TaskArgs>) => boolean|Promise<boolean> {
        return this.#fn;
    }

    get name(): string {
        return this.#name;
    }


    constructor(taskName: string, fn: (argsArr: Array<TaskArgs>) => boolean|Promise<boolean>) {
        this.#name = taskName;

        this.#fn = fn;

        this.#catches = [];
        this.#waitFors = [];
        this.#chainedTaskCalls = [];
    }

    catch(catchFn: () => void): Task<TaskArgs> {
        this.#catches.push(catchFn);

        return this;
    }

    chain<ChainTaskArgs>(task: Task<ChainTaskArgs>, args: ChainTaskArgs): 
            Task<TaskArgs> {
        this.#chainedTaskCalls.push(new TaskCall<ChainTaskArgs>(task, args));

        return this;
    }

    execCatch(err: Error): boolean {
        if (this.#catches.length === 0)
            return false;

        for (let catchFn of this.#catches)
            catchFn(err);

        return true;
    }

    waitFor(taskNamesPattern: string): Task<TaskArgs> {
        this.#waitFors.push(taskNamesPattern);

        return this;
    }

}

export class TaskCall<TaskArgs> {
    #task: Task<TaskArgs>;
    #args: TaskArgs;


    get args(): TaskArgs {
        return this.#args;
    }

    get task(): Task<TaskArgs> {
        return this.#task;
    }


    constructor(task: Task<TaskArgs>, args: TaskArgs) {
        this.#task = task;
        this.#args = args;
    }
}

export class TaskInfo<TaskArgs> {
    #lastCall: number;
    #task: Task<TaskArgs>|null;

    #argsArr: Array<TaskArgs>;

    #chainedTaskCalls: Array<TaskCall<TaskArgs>>;
    #waitFors: Array<string>;


    get argsArray(): Array<TaskArgs> {
        return this.#argsArr;
    }

    get chainedTaskCalls(): Array<TaskCall<TaskArgs>> {
        return this.#chainedTaskCalls;
    }

    get lastCall(): number {
        return this.#lastCall;
    }

    get task(): Task<TaskArgs>|null {
        return this.#task;
    }


    constructor() {
        this.#lastCall = -1; /* Timestamp of last call. */
        this.#task = null;

        this.#argsArr = [];

        this.#chainedTaskCalls = [];
        this.#waitFors = [];
    }

    addTask(task: Task<TaskArgs>, args: TaskArgs, lastCall: number = -1) {
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
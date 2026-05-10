export default class Task<TaskArgs> {
    #private;
    static get TaskCall(): typeof TaskCall;
    static get TaskInfo(): typeof TaskInfo;
    get _chainedTaskCalls(): TaskCall<any>[];
    get _waitFors(): Array<string>;
    get fn(): (argsArr: Array<TaskArgs>) => boolean | Promise<boolean>;
    get name(): string;
    constructor(taskName: string, fn: (argsArr: Array<TaskArgs>) => boolean | Promise<boolean>);
    catch(catchFn: () => void): Task<TaskArgs>;
    chain<ChainTaskArgs>(task: Task<ChainTaskArgs>, args: ChainTaskArgs): Task<TaskArgs>;
    execCatch(err: Error): boolean;
    waitFor(taskNamesPattern: string): Task<TaskArgs>;
}
export declare class TaskCall<TaskArgs> {
    #private;
    get args(): TaskArgs;
    get task(): Task<TaskArgs>;
    constructor(task: Task<TaskArgs>, args: TaskArgs);
}
export declare class TaskInfo<TaskArgs> {
    #private;
    get argsArray(): Array<TaskArgs>;
    get chainedTaskCalls(): Array<TaskCall<TaskArgs>>;
    get lastCall(): number;
    get task(): Task<TaskArgs> | null;
    constructor();
    addTask(task: Task<TaskArgs>, args: TaskArgs, lastCall?: number): void;
}
//# sourceMappingURL=Task.d.ts.map
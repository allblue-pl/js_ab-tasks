import Task from "./Task.ts";
import Tasker from "./Tasker.ts";
declare class abTasks_Class {
    #private;
    get Task(): typeof Task;
    get Tasker(): typeof Tasker;
    constructor();
    call<TaskArgs>(task: Task<TaskArgs>, args: TaskArgs): void;
}
declare const abTasks: abTasks_Class;
export default abTasks;
export { abTasks_Class };
//# sourceMappingURL=index.d.ts.map
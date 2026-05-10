import Task from "./Task.ts";
import Tasker from "./Tasker.ts";

class abTasks_Class {
    #defaultTasker: Tasker|null

    
    get Task(): typeof Task {
        return Task;
    }

    get Tasker(): typeof Tasker {
        return Tasker;
    }
    

    constructor() {
        this.#defaultTasker = null;
    }

    call<TaskArgs>(task: Task<TaskArgs>, args: TaskArgs) {
        if (this.#defaultTasker === null)
            this.#defaultTasker = new Tasker();

        this.#defaultTasker.call(task, args);
    }
};
const abTasks = new abTasks_Class();
export default abTasks;
export { abTasks_Class };

import Task from "./Task.js";
import Tasker from "./Tasker.js";
class abTasks_Class {
    #defaultTasker;
    get Task() {
        return Task;
    }
    get Tasker() {
        return Tasker;
    }
    constructor() {
        this.#defaultTasker = null;
    }
    call(task, args) {
        if (this.#defaultTasker === null)
            this.#defaultTasker = new Tasker();
        this.#defaultTasker.call(task, args);
    }
}
;
const abTasks = new abTasks_Class();
export default abTasks;
export { abTasks_Class };

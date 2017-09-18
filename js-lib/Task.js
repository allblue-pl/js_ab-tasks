'use strict';

const abTypes = require('ab-types');


class Task {

    constructor(task_name, fn)
    {
        abTypes.argsE(arguments, 'string', [ 'function', Promise ]);

        Object.defineProperties(this, {
            name: { value: task_name, },

            _fn: { value: fn, },

            _catches: { value: [], },
            _waitFors: { value: [], },
            _chainedTaskCalls: { value: [], },
        });
    }

    catch(catch_fn)
    {
        this._catches.push(catch_fn);

        return this;
    }

    chain(task, ...args)
    {
        abTypes.argsE(arguments, Task);

        this._chainedTaskCalls.push(new Task.Call(task, args));

        return this;
    }

    waitFor(task_names_pattern)
    {
        this._waitFors.push(task_names_pattern);

        return this;
    }

}
module.exports = Task;


Object.defineProperties(Task, {

    Call: { value:
    class {

        constructor(task, args)
        {
            abTypes.argsE(arguments, Task, 'object');

            Object.defineProperties(this, {
                task: { value: task, },
                args: { value: args, },
            });
        }

    }},

    Info: { value:
    class {

        constructor()
        {
            this.lastCall = -1; /* Timestamp of last call. */
            this.task = null; /* Last called task. */

            this.argsArray = [];

            this.chainedTaskCalls = [];
            this.waitFors = [];
        }

        addTask(task, args, last_call = -1)
        {
            abTypes.argsE(arguments, Task, 'object', 'number');

            if (last_call !== -1)
                this.lastCall = last_call;

            this.task = task;
            this.argsArray.push(args);

            for (var i = 0; i < task._chainedTaskCalls.length; i++)
                this.chainedTaskCalls.push(task._chainedTaskCalls[i]);

            for (var i = 0; i < task._waitFors.length; i++) {
                if (this.waitFors.indexOf(task._waitFors[i]) === -1)
                    this.waitFors.push(task._waitFors[i]);
            }
        }

    }},

});

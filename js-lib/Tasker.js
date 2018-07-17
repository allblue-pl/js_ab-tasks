'use strict';

const abLog = require('ab-log');
const js0 = require('js0');

const Task = require('./Task');


class Tasker
{

    constructor(waitTime = 100)
    {
        this._waitTime = waitTime;

        Object.defineProperties(this, {
            _taskInfos_Waiting: { value: new Map(), editable: true, },
            _taskInfos_Executing: { value: new Map(), },

            _processCalls: { value: 0, writable: true, },
        });
    }

    apply(task, args)
    {
        js0.args(arguments, Task);

        this._addWaitingTask(task, args, Date.now());

        var self = this;
        this._processCalls++;
        setTimeout(function() {
            self._processCalls--;
            // console.log('Process', task.name);
            self._processWaitingTasks();
        }, this._waitTime + 1);
    }

    call(task, ...args)
    {
        js0.args(arguments, Task);

        return this.apply(task, args);
    }

    setWaitTime(waitTime)
    {
        this._waitTime = waitTime; 
    }


    _addChainedTaskCalls(task_info)
    {
        for (var i = 0; i < task_info.chainedTaskCalls.length; i++) {
            var task_call = task_info.chainedTaskCalls[i];
            this._addWaitingTask(task_call.task, task_call.args, -1);
        }
    }

    _addWaitingTask(task, args, last_call)
    {
        if (!(task.name in this._taskInfos_Waiting))
            this._taskInfos_Waiting[task.name] = new Task.Info();

        var task_info = this._taskInfos_Waiting[task.name];
        task_info.addTask(task, args, last_call);

        return task_info;
    }

    _areWaitForsFinished(task_info)
    {
        var wait_fors = task_info.task._waitFors

        for (var i = 0; i < wait_fors.length; i++) {
            var wait_for_regexp = new RegExp(this._waitForToRegExp(wait_fors[i]));

            var task_name;

            for (task_name in this._taskInfos_Waiting) {
                if (task_name !== task_info.task.name)
                    if (wait_for_regexp.test(task_name))
                        return false;
            }

            for (task_name in this._taskInfos_Executing) {
                if (task_name !== task_info.task.name)
                    if (wait_for_regexp.test(task_name))
                        return false;
            }
        }

        return true;
    }

    _execTaskInfo(task_info)
    {
        // task_info.callsCount--;
        // if (task_info.callsCount > 0)
        //     return;

        /* Think about debug mode. */
        delete this._taskInfos_Waiting[task_info.task.name];
        this._taskInfos_Executing[task_info.task.name] = task_info;

        var result = task_info.task._fn.call(null, task_info.argsArray);

        if (result instanceof Promise) {
            var self = this;

            result
                .then(function() {
                    delete self._taskInfos_Executing[task_info.task.name];

                    self._addChainedTaskCalls(task_info);
                    // console.log('Process A', task_info.task.name);
                    self._processWaitingTasks();
                })
                .catch(function(err) {
                    delete self._taskInfos_Executing[task_info.task.name];

                    if (task_info.task._catches.length > 0) {
                        for (let catch_fn of task_info.task._catches)
                            catch_fn(err);
                    } else {
                        if (err instanceof Error)
                            err = err.stack;

                        console.log(abLog.cError('Unhandled task promise rejection:'), err);
                    }

                    // console.log('Process B', task_info.task.name);
                    self._processWaitingTasks();
                });
        } else {
            delete this._taskInfos_Executing[task_info.task.name];

            if (result !== false)
                this._addChainedTaskCalls(task_info);

            // console.log('Process C', task_info.task.name);
            this._processWaitingTasks();
        }
    }

    _waitForToRegExp(str)
    {
        return '^' + str.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&")
                .replace('*', '.*') + '$';
    }

    _processWaitingTasks()
    {
        for (var task_name in this._taskInfos_Waiting) {
            var task_info = this._taskInfos_Waiting[task_name];

            if (!this._isTaskInfoReadyToExec(task_info))
                continue;

            this._execTaskInfo(task_info);
        }

        if (Object.keys(this._taskInfos_Waiting).length > 0 &&
                Object.keys(this._taskInfos_Executing).length === 0 &&
                this._processCalls === 0) {
            console.warn('Unexecuted tasks in waiting queue:',
                    Object.keys(this._taskInfos_Waiting));
        }
    }

    _isTaskInfoReadyToExec(task_info)
    {
        // console.log('isTaskInfoReadyToExec', task_info.task.name);

        if (task_info.lastCall !== -1) {
            if (Date.now() < task_info.lastCall + this._waitTime)
                return false;
        }

        if (task_info.task.name in this._taskInfos_Executing) {
            // console.log('B');
            return false;
        }

        if (!this._areWaitForsFinished(task_info)) {
            // console.log('C');
            return false;
        }

        // console.log('D');
        return true;
    }

}
module.exports = Tasker;

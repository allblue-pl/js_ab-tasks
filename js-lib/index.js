'use strict';

const Task = require('./Task');
const Tasker = require('./Tasker');


const tasks = new class tasks
{

    get Task() {
        return Task;
    }

    get Tasker() {
        return Tasker;
    }


    constructor()
    {
        this._defaultTasker = null;
    }

    apply(...args)
    {
        if (this._defaultTasker === null)
            this._defaultTasker = new Tasker();

        this._defaultTasker.apply.apply(this._defaultTasker, args);
    }

    call(...args)
    {
        if (this._defaultTasker === null)
            this._defaultTasker = new Tasker();

        this._defaultTasker.call.apply(this._defaultTasker, args);
    }

}();
module.exports = tasks;

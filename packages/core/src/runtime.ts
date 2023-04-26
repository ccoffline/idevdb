import { EventEmitter } from 'events';
import sqlite3 from 'better-sqlite3'
import {
    newOidGenerator,
    ObjStorage,
    ObjStorageRegistry
} from './storage';
import {
    Obj,
    TaskRuntimeObj,
    TaskStatus
} from './obj';

export type DataBlock = object[]

export type BlockEmitter = (data: DataBlock) => void

export type BlockReceiver = (receiver: (data: DataBlock) => void) => void

export const NullBlockEmitter: BlockEmitter = () => { }

export const NullBlockReceiver: BlockReceiver = () => { }

export class TaskRuntime {

    private obj: TaskRuntimeObj
    private storageRegistry: ObjStorageRegistry
    private storeObj: ObjStorage<TaskRuntimeObj>

    public emit: BlockEmitter = NullBlockEmitter
    public receive: BlockReceiver = NullBlockReceiver

    static createRootTaskRuntime(
        storageRegistry: ObjStorageRegistry
    ): TaskRuntime {
        let runtime = new TaskRuntime()
        runtime.storeObj = storageRegistry.get(TaskRuntimeObj)
        runtime.obj = runtime.storeObj({
            oid: null,
            name: '', // TODO
            parent_oid: null,
            estimate_subtasks: '?', // TODO
            submit_time: new Date(),
            update_time: new Date(),
            status: TaskStatus.Running,
            error: '',
        })
        return runtime
    }

    public get<T extends Obj>(type: Function): ObjStorage<T> {
        return this.storageRegistry.get(type)
    }

    public createSubtaskRuntime(): TaskRuntime {
        let runtime = new TaskRuntime()
        runtime.storeObj = this.storeObj
        runtime.obj = this.storeObj({
            oid: null, // TODO
            name: '', // TODO
            parent_oid: this.obj.oid,
            estimate_subtasks: '?', // TODO
            submit_time: new Date(),
            update_time: new Date(),
            status: TaskStatus.Pending,
            error: '',
        })
        return runtime
    }

    public connectSubtaskRuntime(source: TaskRuntime, sink: TaskRuntime) {
        const emitter = new EventEmitter()
        const event = Symbol()
        source.emit = (data: DataBlock) => emitter.emit(event, data)
        sink.receive = (receiver: (data: DataBlock) => void) => emitter.on(event, receiver)
    }
}

export function createTempSqlite3TaskRuntime(): TaskRuntime {
    const db: sqlite3.Database = sqlite3(':memory:');
    db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);
    const insert = db.prepare(`
        INSERT INTO users (name, email, password)
        VALUES (@name, @email, @password);
    `);
    insert.run({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123'
    });

    const a = TaskRuntimeObj
    console.log(a)

    const registry = new ObjStorageRegistry()
    registry.register(TaskRuntimeObj, (obj: TaskRuntimeObj) => {
        if (!obj.oid) {
            obj.oid = oidGenerator.next().value
        }
        // TODO store
        return obj
    })

    const x = registry.get<TaskRuntimeObj>(TaskRuntimeObj);

    const oidGenerator = newOidGenerator()
    const root = TaskRuntime.createRootTaskRuntime(null)

    return root
}

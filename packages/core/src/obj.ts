import Long from 'long'

export type Oid = number | Long | string
export type ORef<T extends Obj> = T | Oid
export type Objs<T extends Obj> = T[] | T | null
export type ORefs<T extends Obj> = ORef<T>[] | ORef<T> | null

export interface Obj {
    oid: Oid | null
}

export interface NamedObj extends Obj {
    name: string
}

export interface TaskObj extends NamedObj {
    dependencies: ORefs<TaskObj>
}

export enum TaskStatus {
    Pending,
    Running,
    Finished,
    Failed
}

export class TaskRuntimeObj implements NamedObj {
    oid: Oid | null
    name: string
    parent_oid: Oid | null
    estimate_subtasks
    submit_time: Date
    update_time: Date
    status: TaskStatus
    error: string
}

export interface OptionQueryObj<T extends Obj> extends TaskObj {
    source: T
    option: string
}

export interface BatchInsertObj<T extends Obj> extends TaskObj {
    target: T
    // data: DataBlock
}

export interface MysqlConnectionObj extends NamedObj {
    host: string
    port: number | string | null
    username: string
    password: string
}

export interface MysqlDatabaseObj extends NamedObj {
    connection: MysqlConnectionObj
}

export interface Sqlite3DatabaseObj extends NamedObj {
}
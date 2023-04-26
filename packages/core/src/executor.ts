import { Obj, Sqlite3DatabaseObj } from "./obj";
import { TaskRuntime } from "./runtime";


export abstract class TaskExecutor {
    // public abstract init(runtime: TaskRuntime): void
    public abstract open(runtime: TaskRuntime): void
    // public abstract close(runtime: TaskRuntime): void
}

export class MainTaskExecutor extends TaskExecutor {
    public open(runtime: TaskRuntime): void {
        throw new Error('Method not implemented.');
    }

}

export class MysqlDatabaseQueryExecutor extends TaskExecutor {
    // private param: SqlQuery<MysqlDatabase>
    public open(runtime: TaskRuntime): void {
        throw new Error('Method not implemented.');
    }
}

export class Sqlite3DatabaseQueryExecutor extends TaskExecutor {
    // private param: SqlQuery<Sqlite3Database>

    private obj: Sqlite3DatabaseObj
    public open(runtime: TaskRuntime): void {
        // const conn: sqlite3.Database = sqlite3(this.obj.sql);
        // const statement = conn.prepare(this.sql);
        // const result = statement.all() as object[]
        // runtime.emit(result)
    }
}
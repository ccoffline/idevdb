import Long from 'long'
import sqlite3 from 'better-sqlite3'

import './obj'
import {
    Obj,
    Oid,
    TaskRuntimeObj,
} from './obj';

export type OidGenerator = Generator<Oid, never, Oid>

export function* newOidGenerator(begin: Oid = Long.UZERO): OidGenerator {
    function toLong(oid: Oid): Long {
        if (Long.isLong(oid)) {
            return oid
        } else if (typeof oid === 'string') {
            return Long.fromString(oid, true)
        } else if (typeof oid === 'number') {
            return Long.fromNumber(oid, true)
        } else {
            throw new Error('Type not implemented.');
        }
    }

    let now = toLong(begin)
    while (true) {
        now = now.add(Long.UONE)
        const next = yield now
        if (next !== undefined) {
            now = toLong(next)
        }
    }
}

export type ObjStorer<T extends Obj> = (obj: T) => T
export type ObjFetcher<T extends Obj> = (oid: Oid) => T

export interface ObjStorage<T extends Obj> {
    store: ObjStorer<T>
    fetch: ObjFetcher<T>
}

export class Storage {
    private storages: Map<Function, ObjStorage<Obj>> = new Map()

    public register<T extends Obj>(type: Function, store: ObjStorage<T>) {
        this.storages.set(type, store)
    }

    public get<T extends Obj>(type: Function): ObjStorage<T> {
        const storage = this.storages.get(type)
        if (!storage) {
            throw new Error(`No registered storage for ${type.name}`)
        }
        return storage as ObjStorage<T>
    }
}

export function createTempSqlite3Storage(): Storage {
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

    const registry = new Storage()
    registry.register(TaskRuntimeObj, {
        store(obj: TaskRuntimeObj): TaskRuntimeObj {
            return 
        },
        fetch(oid: Oid): TaskRuntimeObj {
            return 
        }
    })

    const x = registry.get<TaskRuntimeObj>(TaskRuntimeObj);

    const oidGenerator = newOidGenerator()

    return registry
}
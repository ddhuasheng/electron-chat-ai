import GoDB from 'godb';

interface Data {
  id: number
  [key: string]: any
}

export const useIndexedDB = <T extends Data>(table: string) => {
  const db = new GoDB('db')
  const favorites = db.table(table)

  const add = (data: T) => {
    return favorites.add(data)
  }

  const get = (id: number) => {
    return favorites.get(id)
  }

  const getAll = () => {
    return favorites.getAll()
  }

  const put = (data: T) => {
    return favorites.put(data)
  }

  const remove = (id: number) => {
    return favorites.delete(id)
  }

  return {
    add,
    get,
    getAll,
    put,
    remove
  }
}
import { Db, MongoClient } from 'mongodb';

export class DBUtils {
  private static db: Db;
  private static client: MongoClient;

  static async connect() {
    const dbName = process.env.MONGO_DB_NAME;
    const connectionString = process.env.MONGO_CONNECTION_STRING;

    if (!dbName || `${dbName}`.length === 0) {
      throw new Error('Environment Variable Missing: [MONGO_DB_NAME]');
    }

    if (!connectionString || `${connectionString}`.length === 0) {
      throw new Error(
        'Environment Variable Missing: [MONGO_CONNECTION_STRING]'
      );
    }

    if (!DBUtils.client) {
      DBUtils.client = new MongoClient(connectionString);
      await DBUtils.client.connect();
      DBUtils.db = DBUtils.client.db(dbName);
    }
  }

  static async getCollection<T>(name: string) {
    await DBUtils.connect();
    return DBUtils.db.collection<T>(name);
  }
}

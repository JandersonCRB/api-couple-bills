import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

console.log(__dirname);
const configAndDatabase = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env.test', '.env.test.local'],
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
  }),
];

const clearDatabase = async (dataSource: DataSource) => {
  // Fetch all the entities
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name); // Get repository
    await repository.clear(); // Clear each entity table's content
  }
};

export { configAndDatabase, clearDatabase };

module.exports = {
  tables: [
    {
      TableName: 'Todos-dev',
      KeySchema: [
        { AttributeName: 'todoId', KeyType: 'HASH'},
        { AttributeName: 'userId', KeyType: 'RANGE'} 
      ],
      AttributeDefinitions: [
        { AttributeName: 'todoId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'TodosUserIdIndex',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        }
      ]
    },
  ],
  port: 8000
};

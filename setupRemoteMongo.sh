# Setup file template to upload data to MongoDB Atlas
mongoimport --uri "mongodb://qkart-node-shard-00-00.g7rca.mongodb.net:27017,qkart-node-shard-00-01.g7rca.mongodb.net:27017,qkart-node-shard-00-02.g7rca.mongodb.net:27017/?replicaSet=atlas-9ixddm-shard-0" --ssl --authenticationDatabase admin --username chandanverma0905 --password Lumia@535 --drop --collection users --file data/export_qkart_users.json
mongoimport --uri "mongodb://qkart-node-shard-00-00.g7rca.mongodb.net:27017,qkart-node-shard-00-01.g7rca.mongodb.net:27017,qkart-node-shard-00-02.g7rca.mongodb.net:27017/?replicaSet=atlas-9ixddm-shard-0" --ssl --authenticationDatabase admin --username chandanverma0905 --password Lumia@535 --drop --collection products --file data/export_qkart_products.json


from datetime import datetime
import bcrypt
from pymongo import MongoClient
from bson.objectid import ObjectId
import names

CONNECTION_STRING = "mongodb://root:password@localhost:27017/"

client = MongoClient(CONNECTION_STRING)

database = client["test"]
collection_users = database["users"]

user_1 = {
  "_id" : ObjectId("000000000000000000000001"),
  "email" : "email1@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "doctor"
}

user_2 = {
  "_id" : ObjectId("000000000000000000000002"),
  "email" : "email2@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "doctor"
}

user_3 = {
  "_id" : ObjectId("000000000000000000000003"),
  "email" : "email3@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "doctor"
}

user_4 = {
  "_id" : ObjectId("000000000000000000000004"),
  "email" : "email4@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "customer"
}

user_5 = {
  "_id" : ObjectId("000000000000000000000005"),
  "email" : "email5@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "customer"
}

user_6 = {
  "_id" : ObjectId("000000000000000000000006"),
  "email" : "email6@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "customer"
}

user_7 = {
  "_id" : ObjectId("000000000000000000000007"),
  "email" : "email7@email.com",
  "password" : bcrypt.hashpw(b"password", bcrypt.gensalt(10)),
  "name" : names.get_full_name(),
  "userType" : "admin"
}

collection_users.insert_many([user_1,user_2,user_3,user_4,user_5,user_6,user_7])

collection_appointments = database["appointments"]

app_1 = {
    "_id": ObjectId("000000000000000000000101"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 8:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_1["_id"],
    "userId": user_4["_id"]
}

app_2 = {
    "_id": ObjectId("000000000000000000000102"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 8:30:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_1["_id"],
    "userId": user_4["_id"]
}

app_3 = {
    "_id": ObjectId("000000000000000000000103"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 10:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_1["_id"],
    "userId": user_4["_id"]
}

app_4 = {
    "_id": ObjectId("000000000000000000000104"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 11:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_1["_id"],
    "userId": user_4["_id"]
}

app_5 = {
    "_id": ObjectId("000000000000000000000105"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 13:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_1["_id"],
    "userId": user_4["_id"]
}

app_6 = {
    "_id": ObjectId("000000000000000000000106"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 9:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_2["_id"],
    "userId": user_5["_id"]
}

app_7 = {
    "_id": ObjectId("000000000000000000000107"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 9:30:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_2["_id"],
    "userId": user_5["_id"]
}

app_8 = {
    "_id": ObjectId("000000000000000000000108"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 15:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_2["_id"],
    "userId": user_5["_id"]
}

app_9 = {
    "_id": ObjectId("000000000000000000000109"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 16:00:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_2["_id"],
    "userId": user_5["_id"]
}

app_10 = {
    "_id": ObjectId("000000000000000000000110"),
    "description": "Description",
    "date": datetime.strptime("2023-05-10 16:30:00", "%Y-%m-%d %H:%M:%S"),
    "doctorId": user_2["_id"],
    "userId": user_5["_id"]
}

collection_appointments.insert_many([app_1,app_2,app_3,app_4,app_5,app_6,app_7,app_8,app_9,app_10])

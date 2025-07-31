from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['tasktrail_db']

# Collections
tasks_collection = db['tasks']
users_collection = db['users']

# Route to update task priority
@app.route('/tasks/<task_id>/set_priority', methods=['PATCH'])
def set_task_priority(task_id):
    try:
        priority = request.json.get('priority')
        if not priority:
            return jsonify({'error': 'Priority not provided'}), 400

        # Update the task's priority
        result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': {'priority': priority}}
        )

        if result.modified_count == 1:
            return jsonify({'message': 'Task priority updated successfully'}), 200
        else:
            return jsonify({'error': 'Task not found or no changes made'}), 404

    except Exception as e:
        print(f"Error: {e}")  # Log error for debugging
        return jsonify({'error': str(e)}), 500

@app.route('/users-with-tasks', methods=['GET'])
def get_users_with_tasks():
    try:
        pipeline = [
            {
                "$lookup": {
                    "from": "tasks",
                    "localField": "_id",
                    "foreignField": "assigned_user",
                    "as": "assigned_tasks"
                }
            },
            {
                "$project": {
                    "username": 1,
                    "email": 1,
                    "full_name": 1,
                    "assigned_tasks.title": 1,
                    "assigned_tasks.description": 1,
                    "assigned_tasks.priority": 1,
                    "assigned_tasks.status": 1,
                    "assigned_tasks.dueDate": 1
                }
            }
        ]

        users_with_tasks = list(users_collection.aggregate(pipeline))

        for user in users_with_tasks:
            user['_id'] = str(user['_id'])
            for task in user.get('assigned_tasks', []):
                task['_id'] = str(task.get('_id'))

        return jsonify(users_with_tasks), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/tasks', methods=['GET'])
def get_all_tasks():
    try:
        tasks = []

        task_cursor = tasks_collection.find()
        for task in task_cursor:
            user = users_collection.find_one({'_id': ObjectId(task.get('assigned_user'))}) if task.get('assigned_user') else None
            task_info = {
                'id': str(task['_id']),
                'title': task.get('title'),
                'status': task.get('status'),
                'priority': task.get('priority'),
                'dueDate': task.get('dueDate'),
                'assigned_user': {
                    'user_id': str(user['_id']),
                    'username': user['username']
                } if user else None
            }
            tasks.append(task_info)

        return jsonify(tasks), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/task/<task_id>/update_status", methods=['PATCH'])
def update_task_status(task_id):
    try:
        status = request.json.get('status')
        if not status:
            return jsonify({'error': 'Status not provided'}), 400

        # Update the task's status
        result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': {'status': status}}
        )

        if result.modified_count == 1:
            return jsonify({'message': 'Task status updated successfully'}), 200
        else:
            return jsonify({'error': 'Task not found or no changes made'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

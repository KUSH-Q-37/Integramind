import pytest
from flask import Flask
from app import app  # Import your Flask app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    with app.test_client() as client:
        yield client

from pymongo.results import UpdateResult

@pytest.mark.parametrize("task_id, priority, expected_status, expected_response", [
    ('5f50c31b1c9d440000a9c222', 'High', 200, {'message': 'Task priority updated successfully'}),
    ('5f50c31b1c9d440000a9c222', None, 400, {'error': 'Priority not provided'})
])
def test_set_task_priority(client, mocker, task_id, priority, expected_status, expected_response):
    # Mock the UpdateResult of MongoDB update_one operation
    mock_update_result = mocker.Mock(spec=UpdateResult)
    mock_update_result.modified_count = 1 if priority else 0

    # Mock tasks_collection.update_one to return this mock result
    mock_update_one = mocker.patch('app.tasks_collection.update_one')
    mock_update_one.return_value = mock_update_result

    # Define the payload
    json_data = {'priority': priority} if priority else {}
    response = client.patch(f'/tasks/{task_id}/set_priority', json=json_data)

    # Validate the status and response
    assert response.status_code == expected_status
    assert response.json == expected_response


def test_get_users_with_tasks(client, mocker):
    mock_aggregate = mocker.patch('app.users_collection.aggregate')
    mock_aggregate.return_value = [
        {
            '_id': 'user123',
            'username': 'testuser',
            'email': 'testuser@example.com',
            'full_name': 'Test User',
            'assigned_tasks': [
                {'title': 'Task 1', 'description': 'Description 1', 'priority': 'High', 'status': 'Pending', 'dueDate': '2024-09-30'}
            ]
        }
    ]

    response = client.get('/users-with-tasks')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['username'] == 'testuser'

def test_get_all_tasks(client, mocker):
    mock_find = mocker.patch('app.tasks_collection.find')
    mock_find.return_value = [
        {
            '_id': '5f50c31b1c9d440000a9c222',
            'title': 'Task 1',
            'status': 'Pending',
            'priority': 'High',
            'dueDate': '2024-09-30',
            'assigned_user': '5f50c31b1c9d440000a9c123'
        }
    ]
    mock_find_one = mocker.patch('app.users_collection.find_one')
    mock_find_one.return_value = {'_id': '5f50c31b1c9d440000a9c123', 'username': 'testuser'}

    response = client.get('/tasks')
    assert response.status_code == 200
    tasks = response.json
    assert len(tasks) == 1
    assert tasks[0]['title'] == 'Task 1'
    assert tasks[0]['assigned_user']['username'] == 'testuser'

@pytest.mark.parametrize("task_id, status, expected_status, expected_response", [
    ('5f50c31b1c9d440000a9c222', 'Completed', 200, {'message': 'Task status updated successfully'}),
    ('5f50c31b1c9d440000a9c222', None, 400, {'error': 'Status not provided'})
])
def test_update_task_status(client, mocker, task_id, status, expected_status, expected_response):
    # Mock the UpdateResult of MongoDB update_one operation
    mock_update_result = mocker.Mock(spec=UpdateResult)
    mock_update_result.modified_count = 1 if status else 0

    # Mock tasks_collection.update_one to return this mock result
    mock_update_one = mocker.patch('app.tasks_collection.update_one')
    mock_update_one.return_value = mock_update_result

    # Define the payload
    json_data = {'status': status} if status else {}
    response = client.patch(f'/task/{task_id}/update_status', json=json_data)

    # Validate the status and response
    assert response.status_code == expected_status
    assert response.json == expected_response

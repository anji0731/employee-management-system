from fastapi.testclient import TestClient

def test_invalid_login(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@jala.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data

def test_register_success(client: TestClient):
    # Use a dynamic/unique email to avoid conflict if tests are run repeatedly
    import uuid
    email = f"user_{uuid.uuid4().hex}@example.com"
    response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "securepassword", "full_name": "New User"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "message" in data
    assert "pending administrator approval" in data["message"].lower()

def test_register_duplicate(client: TestClient):
    import uuid
    email = f"user_{uuid.uuid4().hex}@example.com"
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "securepassword", "full_name": "Duplicate User"}
    )
    response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "securepassword", "full_name": "Duplicate User"}
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "A user with this email address already exists."

from security import *

password = "Hari123"

hashed = hash_password(password)

print("HASH:")
print(hashed)

print()

print("VERIFY:")
print(verify_password(password, hashed))

print()

token = create_access_token(
    {"email": "hari@gmail.com"}
)

print(token)

print()

print(verify_token(token))
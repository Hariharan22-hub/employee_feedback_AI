from database import SessionLocal, User
from security import verify_password

db = SessionLocal()

user = db.query(User).filter(User.email == "hari@gmail.com").first()

print(user)

if user:
    print(verify_password("Hari123", user.hashed_password))
from database import SessionLocal, User

db = SessionLocal()

users = db.query(User).all()

for u in users:
    print("Username:", u.username)
    print("Email:", u.email)
    print("Hash:", u.hashed_password)
    print("----------------")
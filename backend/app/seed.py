from .database import Base, engine, SessionLocal
from .models.core import Case

Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    try:
        if db.query(Case).count() == 0:
            db.add_all([
                Case(case_number="AC-24-1001", claimant_name="John Smith", client_name="Claims Management", status="Active", investigator="Mike D.", address="101 Allenhurst Rd, Buffalo, NY 14226", injury="Lower Back, Neck", primary_vehicle="Gray Toyota SUV — NY KHE9462"),
                Case(case_number="AC-24-1002", claimant_name="Robert Johnson", client_name="TruView Insurance", status="Active", investigator="Sarah K.", address="Orchard Park, NY", injury="Right Shoulder", primary_vehicle="Black Honda SUV — unknown tag"),
            ])
            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
    print("Seeded Atlantic CaseOps database")

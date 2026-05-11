from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.core import DailyUpdate, Case
from ..schemas.core import DailyUpdateCreate, DailyUpdateOut

router = APIRouter(prefix="/daily-updates", tags=["daily updates"])

@router.get("", response_model=list[DailyUpdateOut])
def list_updates(db: Session = Depends(get_db)):
    return db.query(DailyUpdate).order_by(DailyUpdate.created_at.desc()).all()

@router.post("", response_model=DailyUpdateOut)
def create_update(payload: DailyUpdateCreate, db: Session = Depends(get_db)):
    if not db.get(Case, payload.case_id):
        raise HTTPException(status_code=404, detail="Case not found")
    update = DailyUpdate(**payload.model_dump())
    db.add(update)
    db.commit()
    db.refresh(update)
    return update

@router.patch("/{update_id}/submit", response_model=DailyUpdateOut)
def submit_update(update_id: int, db: Session = Depends(get_db)):
    update = db.get(DailyUpdate, update_id)
    if not update:
        raise HTTPException(status_code=404, detail="Update not found")
    update.status = "Submitted for Review"
    db.commit()
    db.refresh(update)
    return update

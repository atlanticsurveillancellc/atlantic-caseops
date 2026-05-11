from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True)
    claimant_name = Column(String, index=True)
    client_name = Column(String)
    status = Column(String, default="Active")
    investigator = Column(String)
    address = Column(Text)
    injury = Column(String)
    primary_vehicle = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updates = relationship("DailyUpdate", back_populates="case")

class DailyUpdate(Base):
    __tablename__ = "daily_updates"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    date = Column(String)
    weather = Column(String)
    start_time = Column(String)
    end_time = Column(String)
    narrative = Column(Text)
    status = Column(String, default="Draft")
    submitted_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    case = relationship("Case", back_populates="updates")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    filename = Column(String)
    s3_key = Column(String)
    content_type = Column(String)
    uploaded_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class BillingEntry(Base):
    __tablename__ = "billing_entries"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    employer = Column(String)
    onsite_hours = Column(Float, default=0)
    travel_hours = Column(Float, default=0)
    mileage = Column(Float, default=0)
    total = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

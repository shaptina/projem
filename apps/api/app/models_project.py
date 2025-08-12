from __future__ import annotations

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text, Float, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .models import Base


class ProjectType(str, enum.Enum):
    part = "part"
    assembly = "assembly"


class ProjectStatus(str, enum.Enum):
    draft = "draft"
    planning = "planning"
    cad_ready = "cad_ready"
    cam_ready = "cam_ready"
    sim_ok = "sim_ok"
    post_ok = "post_ok"
    queued = "queued"
    running = "running"
    done = "done"
    error = "error"


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    idempotency_key = Column(String(255), nullable=True, index=True)
    name = Column(String(200), nullable=False)
    type = Column(Enum(ProjectType), nullable=False, default=ProjectType.part)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.draft)
    owner_id = Column(Integer, nullable=True)
    summary_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    files = relationship("ProjectFile", back_populates="project", cascade="all, delete-orphan")


class FileKind(str, enum.Enum):
    cad = "cad"
    cam = "cam"
    sim = "sim"
    gcode = "gcode"
    package = "package"
    doc = "doc"


class ProjectFile(Base):
    __tablename__ = "project_files"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    kind = Column(Enum(FileKind), nullable=False)
    s3_key = Column(String(512), nullable=False)
    size = Column(Integer, nullable=True)
    sha256 = Column(String(128), nullable=True)
    version = Column(String(64), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship("Project", back_populates="files")


class AIQnA(Base):
    __tablename__ = "ai_qna"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    missing_fields = Column(JSONB, nullable=True)
    resolved_at = Column(DateTime, nullable=True)


class Fixture(Base):
    __tablename__ = "fixtures"
    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    type = Column(Text, nullable=False)
    model_path = Column(Text, nullable=True)
    jaw_open_mm = Column(Float, nullable=True)
    clamp_height_mm = Column(Float, nullable=True)
    safety_clear_mm = Column(Float, nullable=False, default=10.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Setup(Base):
    __tablename__ = "setups"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(Text, nullable=False)
    orientation_rx_deg = Column(Float, nullable=False, default=0.0)
    orientation_ry_deg = Column(Float, nullable=False, default=0.0)
    orientation_rz_deg = Column(Float, nullable=False, default=0.0)
    wcs = Column(Text, nullable=False, default="G54")
    fixture_id = Column(Integer, ForeignKey("fixtures.id", ondelete="SET NULL"), nullable=True)
    stock_override_json = Column(JSONB, nullable=True)
    status = Column(Text, nullable=False, default="draft")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Op3D(Base):
    __tablename__ = "ops_3d"
    id = Column(Integer, primary_key=True)
    setup_id = Column(Integer, ForeignKey("setups.id", ondelete="CASCADE"), nullable=False)
    op_type = Column(Text, nullable=False)
    target_faces_json = Column(JSONB, nullable=True)
    tool_id = Column(Integer, nullable=True)
    params_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Collision(Base):
    __tablename__ = "collisions"
    id = Column(Integer, primary_key=True)
    setup_id = Column(Integer, ForeignKey("setups.id", ondelete="CASCADE"), nullable=False)
    phase = Column(Text, nullable=False)
    type = Column(Text, nullable=False)
    severity = Column(Text, nullable=False, default="warn")
    details_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class PostRun(Base):
    __tablename__ = "posts_runs"
    id = Column(Integer, primary_key=True)
    setup_id = Column(Integer, ForeignKey("setups.id", ondelete="CASCADE"), nullable=False)
    processor = Column(Text, nullable=False)
    nc_path = Column(Text, nullable=False)
    line_count = Column(Integer, nullable=False)
    lint_json = Column(JSONB, nullable=True)
    duration_ms = Column(Integer, nullable=False, default=0)
    ok = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)



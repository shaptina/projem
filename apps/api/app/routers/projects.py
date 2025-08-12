from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException
from sqlalchemy.orm import Session

from ..db import db_session
from ..models_project import Project, ProjectType, ProjectStatus
from ..schemas.project import ProjectCreate, ProjectOut


router = APIRouter(prefix="/api/v1/projects", tags=["Projeler"])


@router.post("", response_model=ProjectOut)
def create_project(
    payload: ProjectCreate,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
):
    if not idempotency_key:
        raise HTTPException(status_code=400, detail="Idempotency-Key zorunludur.")
    with db_session() as s:
        exist = s.query(Project).filter_by(idempotency_key=idempotency_key).first()
        if exist:
            return ProjectOut(id=exist.id, name=exist.name, type=exist.type.value if hasattr(exist.type,'value') else str(exist.type), status=exist.status.value if hasattr(exist.status,'value') else str(exist.status))
        try:
            p = Project(
                name=payload.name,
                type=ProjectType(payload.type),
                status=ProjectStatus.draft,
                idempotency_key=idempotency_key,
            )
            s.add(p)
            s.commit()
            s.refresh(p)
            return ProjectOut(id=p.id, name=p.name, type=p.type.value if hasattr(p.type,'value') else str(p.type), status=p.status.value if hasattr(p.status,'value') else str(p.status))
        except Exception as e:
            s.rollback()
            raise HTTPException(status_code=500, detail=f"projects.create failed: {e}")



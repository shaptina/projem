from __future__ import annotations

from sqlalchemy import Column, Float, Integer, String, UniqueConstraint

from .models import Base


class CuttingData(Base):
    __tablename__ = "cutting_data"

    id = Column(Integer, primary_key=True)
    material = Column(String, nullable=False)
    tool_type = Column(String, nullable=False)  # endmill_flat, drill, chamfer
    tool_dia_min_mm = Column(Float, nullable=False)
    tool_dia_max_mm = Column(Float, nullable=False)
    operation = Column(String, nullable=False)  # face, pocket, contour, drill, chamfer
    rpm = Column(Integer, nullable=False)
    feed_mm_min = Column(Float, nullable=False)
    plunge_mm_min = Column(Float, nullable=False)
    stepdown_mm = Column(Float, nullable=False)
    stepover_pct = Column(Float, nullable=False)
    notes = Column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "material",
            "tool_type",
            "operation",
            "tool_dia_min_mm",
            "tool_dia_max_mm",
            name="uix_cutting",
        ),
    )



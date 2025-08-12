from __future__ import annotations

from sqlalchemy.orm import Session

from ..models_cutting import CuttingData


def pick_cut(db: Session, material: str, tool_type: str, dia_mm: float, operation: str):
    q = (
        db.query(CuttingData)
        .filter(
            CuttingData.material == material,
            CuttingData.tool_type == tool_type,
            CuttingData.operation == operation,
            CuttingData.tool_dia_min_mm <= dia_mm,
            CuttingData.tool_dia_max_mm >= dia_mm,
        )
        .order_by(CuttingData.tool_dia_max_mm - CuttingData.tool_dia_min_mm)
    )
    row = q.first()
    if not row:
        # Güvenli default
        if tool_type == "drill":
            return dict(rpm=2500, feed=120, plunge=120, stepdown=dia_mm, stepover=0)
        if tool_type == "chamfer":
            return dict(rpm=8000, feed=350, plunge=150, stepdown=0.5, stepover=0)
        return dict(rpm=10000, feed=600, plunge=150, stepdown=max(1.0, dia_mm * 0.25), stepover=60)
    return dict(
        rpm=row.rpm,
        feed=row.feed_mm_min,
        plunge=row.plunge_mm_min,
        stepdown=row.stepdown_mm,
        stepover=row.stepover_pct,
    )



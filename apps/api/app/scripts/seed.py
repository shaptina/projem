from __future__ import annotations

from sqlalchemy.orm import Session

from app.db import db_session
from app.models import User


def main() -> None:
    with db_session() as session:
        assert isinstance(session, Session)
        if not session.query(User).filter_by(email="dev@local").first():
            user = User(email="dev@local", role="engineer", locale="tr")
            session.add(user)
            session.commit()
            print("[seed] dev@local eklendi")
        else:
            print("[seed] dev@local mevcut")


if __name__ == "__main__":
    main()



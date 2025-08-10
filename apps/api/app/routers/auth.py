from fastapi import APIRouter, Depends

from ..auth import dev_login, get_current_user
from ..schemas import TokenPair, UserOut


router = APIRouter(prefix="/api/v1/auth", tags=["Kimlik Doğrulama"]) 


@router.post("/dev-login", response_model=TokenPair)
def dev_login_route(token_pair: TokenPair = Depends(dev_login)) -> TokenPair:
    return token_pair


@router.get("/me", response_model=UserOut)
def me(user: UserOut = Depends(get_current_user)) -> UserOut:
    return user



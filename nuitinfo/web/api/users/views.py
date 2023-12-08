from fastapi import APIRouter, Depends
from starlette.responses import JSONResponse, Response

from nuitinfo.db.dao.inventory_dao import InventoryDAO
from nuitinfo.db.dao.quizz_dao import QuizzDAO

# from nuitinfo.db.models.users import auth_cookie  # type: ignore
from nuitinfo.db.models.users import User  # type: ignore
from nuitinfo.db.models.users import UserCreate  # type: ignore
from nuitinfo.db.models.users import UserRead  # type: ignore
from nuitinfo.db.models.users import UserUpdate  # type: ignore
from nuitinfo.db.models.users import api_users  # type: ignore
from nuitinfo.db.models.users import auth_jwt  # type: ignore
from nuitinfo.db.models.users import current_active_user  # type: ignore
from nuitinfo.db.models.users import google_oauth_client  # type: ignore

router = APIRouter()

router.include_router(
    api_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
router.include_router(
    api_users.get_auth_router(auth_jwt),
    prefix="/auth/jwt",
    tags=["auth"],
)

"""
router.include_router(
    api_users.get_oauth_router(
        google_oauth_client,
        auth_jwt,
        settings.users_secret,
        associate_by_email=True,
    ),
    prefix="/auth/google",
    tags=["auth"],
)

router.include_router(
    api_users.get_oauth_associate_router(
        google_oauth_client,
        UserRead,
        settings.users_secret,
    ),
    prefix="/auth/associate/google",
    tags=["auth"],
)
"""


router_invent = APIRouter()


@router_invent.put(
    "/invent",
    response_model=UserRead,
    response_model_exclude_none=True,
    tags=["invent"],
)
async def add_to_invent(
    boule_id: int,
    user: User = Depends(current_active_user),
    inventory_dao: InventoryDAO = Depends(),
) -> Response:
    """
    Add a boule to the user's invent.
    """
    await inventory_dao.add_to_inventory(user.id, boule_id)
    inventory = await inventory_dao.get_inventory(user.id)
    return JSONResponse({"id": str(user.id), "inventory": inventory})


@router_invent.get(
    "/invent",
    response_model=UserRead,
    response_model_exclude_none=True,
    tags=["invent"],
)
async def get_invent(
    user: UserRead = Depends(current_active_user),
    inventory_dao: InventoryDAO = Depends(),
) -> Response:
    """
    Get the user's invent.
    """
    inventory = await inventory_dao.get_inventory(user.id)
    return JSONResponse({"id": str(user.id), "inventory": inventory})


router.include_router(router_invent)


router_points = APIRouter()


@router_points.put(
    "/points",
    response_model=UserRead,
    response_model_exclude_none=True,
    tags=["points"],
)
async def add_points(
    points: int,
    level: int,
    user: UserUpdate = Depends(current_active_user),
    points_dao: QuizzDAO = Depends(),
) -> Response:
    """
    Add points to the user's points.
    """
    points_max = await points_dao.update_a_score_for_user_and_level(
        user.id,
        level,
        points,
    )
    return JSONResponse({"id": str(user.id), "points": points_max})


@router_points.get(
    "/points",
    response_model=UserRead,
    response_model_exclude_none=True,
    tags=["points"],
)
async def get_points(
    level: int,
    user: UserRead = Depends(current_active_user),
    points_dao: QuizzDAO = Depends(),
) -> Response:
    """
    Get the user's points.
    """
    points = await points_dao.get_user_previous_score(user.id, level)
    return JSONResponse({"id": str(user.id), "points": points})


@router_points.post(
    "/level",
    response_model=UserRead,
    response_model_exclude_none=True,
    tags=["points"],
)
async def add_level(
    level: int,
    name: str,
    user: UserUpdate = Depends(current_active_user),
    points_dao: QuizzDAO = Depends(),
) -> Response:
    """
    Add a level to the user's levels.
    """
    result = await points_dao.add_level(level, name)
    return JSONResponse({"is_added": result})


router.include_router(router_points)

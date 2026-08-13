from typing import Optional
from fastapi import Header, Query

def get_current_user_id(
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[int] = Query(None)
) -> int:
    """
    Extracts active user ID from X-User-Id request header or user_id query param.
    Defaults to 1 if neither is provided.
    """
    if x_user_id:
        try:
            return int(x_user_id)
        except ValueError:
            pass
    if user_id is not None:
        return user_id
    return 1

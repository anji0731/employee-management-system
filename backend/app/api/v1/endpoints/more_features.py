from fastapi import APIRouter, Depends, Query, UploadFile, File, HTTPException
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
import os
import shutil
import uuid
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.location import Country, City
from app.models.employee import EmployeeSkill
from app.schemas.dashboard import AutocompleteResult, MenuItemSchema

router = APIRouter()

@router.get("/menu-structure", response_model=List[MenuItemSchema])
async def get_menu_structure(current_user = Depends(get_current_user)):
    return [
        {
            "id": "1",
            "title": "Dashboard Overview",
            "icon": "LayoutDashboard",
            "path": "/dashboard"
        },
        {
            "id": "2",
            "title": "Employee Management",
            "icon": "Users",
            "children": [
                {"id": "2-1", "title": "Employee Directory", "path": "/employees"},
                {"id": "2-2", "title": "Register Employee", "path": "/employees/create"}
            ]
        },
        {
            "id": "3",
            "title": "More Showcase Features",
            "icon": "Layers",
            "children": [
                {"id": "3-1", "title": "Multiple Tabs", "path": "/more/tabs"},
                {"id": "3-2", "title": "Nested Submenus", "path": "/more/menus"},
                {"id": "3-3", "title": "Async Autocomplete", "path": "/more/autocomplete"},
                {"id": "3-4", "title": "Collapsible Accordions", "path": "/more/accordions"},
                {"id": "3-5", "title": "Media & Image Studio", "path": "/more/media"},
                {"id": "3-6", "title": "Range Sliders", "path": "/more/sliders"},
                {"id": "3-7", "title": "Tooltips & Popovers", "path": "/more/tooltips"},
                {"id": "3-8", "title": "Modals & Dialogs", "path": "/more/modals"},
                {"id": "3-9", "title": "Hyperlink Mechanics", "path": "/more/links"},
                {"id": "3-10", "title": "Live CSS Theme Engine", "path": "/more/css-engine"},
                {"id": "3-11", "title": "Sandboxed iFrames", "path": "/more/iframe"}
            ]
        }
    ]

@router.get("/autocomplete-search", response_model=List[AutocompleteResult])
async def autocomplete_search(
    query: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    results = []
    fmt = f"%{query}%"
    
    # Search countries
    countries = (await db.execute(select(Country).where(Country.name.ilike(fmt)).limit(5))).scalars().all()
    for c in countries:
        results.append(AutocompleteResult(id=c.id, label=c.name, category="Country", subtitle=f"Country Code: {c.code}"))
        
    # Search cities
    cities = (await db.execute(select(City).where(City.name.ilike(fmt)).limit(5))).scalars().all()
    for ci in cities:
        results.append(AutocompleteResult(id=ci.id, label=ci.name, category="City", subtitle=f"Located in country"))
        
    # Search skills
    skills = (await db.execute(select(EmployeeSkill.skill_name).where(EmployeeSkill.skill_name.ilike(fmt)).distinct().limit(5))).scalars().all()
    for s in skills:
        results.append(AutocompleteResult(id=s, label=s, category="Skill Tag", subtitle="Skill Catalog"))
        
    return results

@router.post("/media/upload")
async def upload_media_file(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_name = f"media_{file_id}{file_ext}"
    target_path = os.path.join(settings.UPLOAD_DIR, saved_name)
    
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "id": file_id,
        "filename": file.filename,
        "url": f"/uploads/{saved_name}",
        "size": os.path.getsize(target_path),
        "mime_type": file.content_type
    }

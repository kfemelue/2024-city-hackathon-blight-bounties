from pydantic import BaseModel, Field
from typing import Optional, List, Dict


# Updated CleanupRequest Model
class CleanupRequest(BaseModel):
    id: Optional[str] = Field(alias="_id")  # MongoDB's ObjectId
    address1: str
    category: str
    city: str
    created_by: str
    created_by_user: str
    creation_date: str
    department: str
    district: str
    division: str
    full_address: str
    group_name: str
    incident_id: str
    incident_number: str
    incident_type_id: str
    last_modified_date: str
    last_update_date: str
    last_update_login: str
    last_updated_by: str
    location_1: str
    map_page: Optional[str]
    number_of_tasks: Optional[str]
    owner_name: Optional[str]
    postal_code: str
    reported_date: str
    request_priority: str
    request_status: str
    request_type: str
    sr_creation_channel: Optional[str]
    state: str
    street_name: Optional[str]
    sub_district: Optional[str]
    location1: Dict[str, List[float]]  # GeoJSON Point type
    claimed_by: Optional[str] = None
    before_photo: Optional[str] = None
    after_photo: Optional[str] = None
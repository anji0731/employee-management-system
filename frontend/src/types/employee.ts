export interface Designation {
  id: string;
  department_id: string;
  title: string;
  code?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  designations: Designation[];
}

export interface City {
  id: string;
  state_id: string;
  name: string;
}

export interface State {
  id: string;
  country_id: string;
  code?: string;
  name: string;
  cities: City[];
}

export interface Country {
  id: string;
  code: string;
  name: string;
  phone_code?: string;
  states: State[];
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface EmployeeSkill {
  id: string;
  skill_id: string;
  proficiency_percentage: number;
  skill?: Skill;
}

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  date_of_birth: string;
  joining_date: string;
  department_id: string;
  designation_id: string;
  country_id: string;
  state_id?: string;
  city_id: string;
  address?: string;
  avatar_url?: string;
  status: string;
  department?: Department;
  designation?: Designation;
  country?: Country;
  state?: State;
  city?: City;
  employee_skills: EmployeeSkill[];
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
}

export interface PaginatedEmployeeResponse {
  items: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

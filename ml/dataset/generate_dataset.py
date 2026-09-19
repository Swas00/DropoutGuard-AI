"""
DropoutGuard AI - Dataset Generator
Generates a realistic educational dataset of 1,250 students with academic and engagement signals.
Calibrated to reflect the hackathon plan distribution:
- Total Students: 1,250
- High Risk: ~84
- Medium Risk: ~213
- Low Risk: ~953
Anchored to exact benchmark demo record: STU1024 (MCA, Sem 3, 78% risk).
"""

import os
import random
import numpy as np
import pandas as pd

np.random.seed(42)
random.seed(42)

COURSES = ["B.Tech Computer Science", "MCA", "BCA", "B.Tech Electronics", "MBA", "B.Tech Mechanical"]
FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Atharva", "Dhruv", "Kabir", "Rohan", "Ananya", "Diya", "Saanvi", "Aadhya", "Pari",
    "Fatima", "Isha", "Navya", "Riya", "Myra", "Meera", "Pooja", "Sneha", "Tanvi", "Zoya",
    "Rahul", "Kavya", "Deepak", "Vikram", "Neha", "Priya", "Amit", "Manish", "Shreya", "Simran"
]
LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Mehta", "Singh", "Kumar", "Iyer", "Nair", "Reddy", "Rao",
    "Gupta", "Das", "Joshi", "Bose", "Chatterjee", "Mishra", "Malhotra", "Kapoor", "Chopra", "Kulkarni"
]

def generate_students(n=1250):
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    
    students = []
    
    n_high = 84
    n_med = 213
    n_low = n - n_high - n_med # 953
    
    # 1. Low Risk Students (953)
    for i in range(1, n_low + 1):
        stu_id = f"STU{i:04d}"
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        course = random.choice(COURSES)
        semester = random.randint(1, 8)
        
        attendance = int(np.clip(np.random.normal(87, 5), 76, 99))
        prev_gpa = round(float(np.clip(np.random.normal(8.2, 0.5), 7.2, 9.8)), 2)
        gpa_shift = float(np.clip(np.random.normal(0.15, 0.2), -0.3, 0.8))
        curr_gpa = round(float(np.clip(prev_gpa + gpa_shift, 7.0, 10.0)), 2)
        assignment_rate = int(np.clip(np.random.normal(92, 5), 80, 100))
        internal_marks = int(np.clip(np.random.normal(86, 6), 72, 99))
        backlogs = 0 if random.random() < 0.94 else 1
        engagement = int(np.clip(np.random.normal(85, 7), 70, 98))
        dropout = 0
        
        students.append({
            "student_id": stu_id,
            "name": name,
            "course": course,
            "semester": semester,
            "attendance": attendance,
            "previous_gpa": prev_gpa,
            "current_gpa": curr_gpa,
            "assignment_rate": assignment_rate,
            "internal_marks": internal_marks,
            "backlogs": backlogs,
            "engagement": engagement,
            "dropout": dropout
        })
        
    # 2. Medium Risk Students (213)
    for i in range(n_low + 1, n_low + n_med + 1):
        stu_id = f"STU{i:04d}"
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        course = random.choice(COURSES)
        semester = random.randint(1, 8)
        
        attendance = int(np.clip(np.random.normal(70, 4), 62, 77))
        prev_gpa = round(float(np.clip(np.random.normal(7.3, 0.4), 6.4, 8.2)), 2)
        gpa_shift = float(np.clip(np.random.normal(-0.4, 0.25), -0.9, 0.1))
        curr_gpa = round(float(np.clip(prev_gpa + gpa_shift, 5.8, 7.8)), 2)
        assignment_rate = int(np.clip(np.random.normal(68, 6), 55, 78))
        internal_marks = int(np.clip(np.random.normal(68, 6), 54, 78))
        backlogs = random.choice([0, 1, 1, 2])
        engagement = int(np.clip(np.random.normal(65, 7), 52, 75))
        dropout = 1 if random.random() < 0.25 else 0
        
        students.append({
            "student_id": stu_id,
            "name": name,
            "course": course,
            "semester": semester,
            "attendance": attendance,
            "previous_gpa": prev_gpa,
            "current_gpa": curr_gpa,
            "assignment_rate": assignment_rate,
            "internal_marks": internal_marks,
            "backlogs": backlogs,
            "engagement": engagement,
            "dropout": dropout
        })
        
    # 3. High Risk Students (84)
    start_high = n_low + n_med + 1
    for i in range(start_high, start_high + n_high):
        stu_id = f"STU{i:04d}"
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        course = random.choice(COURSES)
        semester = random.randint(2, 8)
        
        attendance = int(np.clip(np.random.normal(55, 6), 35, 64))
        prev_gpa = round(float(np.clip(np.random.normal(7.0, 0.5), 6.0, 7.8)), 2)
        gpa_shift = float(np.clip(np.random.normal(-0.9, 0.25), -1.5, -0.4))
        curr_gpa = round(float(np.clip(prev_gpa + gpa_shift, 4.5, 6.4)), 2)
        assignment_rate = int(np.clip(np.random.normal(50, 7), 30, 62))
        internal_marks = int(np.clip(np.random.normal(58, 6), 40, 68))
        backlogs = int(np.clip(np.random.choice([1, 2, 2, 3], p=[0.2, 0.5, 0.2, 0.1]), 1, 4))
        engagement = int(np.clip(np.random.normal(52, 7), 30, 60))
        dropout = 1
        
        students.append({
            "student_id": stu_id,
            "name": name,
            "course": course,
            "semester": semester,
            "attendance": attendance,
            "previous_gpa": prev_gpa,
            "current_gpa": curr_gpa,
            "assignment_rate": assignment_rate,
            "internal_marks": internal_marks,
            "backlogs": backlogs,
            "engagement": engagement,
            "dropout": dropout
        })
        
    df = pd.DataFrame(students)
    
    # Exact anchor student from the Hackathon specification (Page 4, 7, 8):
    # STU1024, Course: MCA, Semester: 3, Attendance: 58%, Current GPA: 6.2, Previous GPA: 7.1,
    # Assignment rate: 50% (5/10), Backlogs: 2, Internal marks: 61, Engagement: 55%, Dropout: 1
    target_idx = df.index[df['student_id'] == 'STU1024']
    if len(target_idx) > 0:
        idx = target_idx[0]
        df.loc[idx, 'name'] = "Kavya Sharma"
        df.loc[idx, 'course'] = "MCA"
        df.loc[idx, 'semester'] = 3
        df.loc[idx, 'attendance'] = 58
        df.loc[idx, 'previous_gpa'] = 7.1
        df.loc[idx, 'current_gpa'] = 6.2
        df.loc[idx, 'assignment_rate'] = 50
        df.loc[idx, 'internal_marks'] = 61
        df.loc[idx, 'backlogs'] = 2
        df.loc[idx, 'engagement'] = 55
        df.loc[idx, 'dropout'] = 1
    
    df['gpa_trend'] = (df['current_gpa'] - df['previous_gpa']).round(2)
    
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "students_dataset.csv")
    df.to_csv(output_path, index=False)
    print(f"Generated dataset with {len(df)} rows saved to: {output_path}")
    return df

if __name__ == "__main__":
    generate_students()

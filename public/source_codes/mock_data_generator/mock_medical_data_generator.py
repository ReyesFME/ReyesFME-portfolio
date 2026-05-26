import pandas as pd
import random
import os
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker('en_PH')

NUM_RECORDS = 500

# 1. Clinical Data Dictionaries (Mapped by Service)
CLINICAL_DATA = {
    "Occupational Therapy": {
        "diagnoses": ["Sensory Processing Disorder", "Fine Motor Delay", "Dyspraxia"],
        "traits": ["Fine Motor Grasp", "Sensory Regulation", "Hand-Eye Coordination",
                   "Activities of Daily Living (ADLs)"],
        "observations": [
            "Patient demonstrated {level} independence in fine motor tasks. Exhibited sensory seeking behaviors when presented with tactile stimuli.",
            "Struggled with bilateral coordination during play. Required {level} prompting to complete the puzzle.",
            "Showed improved focus when using a weighted lap pad. ADL task (buttoning) was completed with {level} assistance."
        ],
        "home_tasks": [
            "Practice buttoning shirts and tying shoelaces for 10 minutes daily.",
            "Use resistive therapy putty to strengthen grip while watching TV.",
            "Incorporate heavy work activities (like pushing a laundry basket) before seated tasks."
        ],
        "future_plans": [
            "Introduce scissors skills using safety scissors and thick paper.",
            "Increase sensory integration exercises focusing on vestibular input.",
            "Target independent utensil use during a simulated feeding activity."
        ]
    },
    "Speech-Language Pathology": {
        "diagnoses": ["Expressive Language Delay", "Childhood Apraxia of Speech", "Autism Spectrum Disorder (ASD)"],
        "traits": ["Expressive Language (Mands/Tacts)", "Receptive Language", "Articulation", "Oral Motor Strength"],
        "observations": [
            "Patient was able to produce bilabial sounds with {level} prompting. Receptive understanding is progressing.",
            "Used {level} verbal approximations to request desired items during play-based therapy.",
            "Oral motor tone appears low. Required {level} modeling to complete blowing/sucking exercises."
        ],
        "home_tasks": [
            "Read interactive books at home and ask simple 'Wh-' questions.",
            "Practice blowing bubbles or using a straw for thick liquids to build oral motor strength.",
            "Encourage pointing and labeling (Tacting) common household items."
        ],
        "future_plans": [
            "Target 3-word sentence formulation using visual sentence strips.",
            "Introduce trials for an Augmentative and Alternative Communication (AAC) device.",
            "Focus on articulation of fricative sounds (/f/, /s/) in isolation."
        ]
    },
    "Physical Therapy": {
        "diagnoses": ["Cerebral Palsy", "Gross Motor Delay", "Hypotonia"],
        "traits": ["Gross Motor Output", "Postural Control", "Dynamic Balance", "Gait Pattern"],
        "observations": [
            "Patient displayed {level} balance during single-leg stance. Gait pattern shows slight toe-walking.",
            "Postural control is emerging. Required {level} physical support to maintain a seated position on the therapy ball.",
            "Successfully navigated the clinic stairs with {level} assistance. Lower extremity strength is improving."
        ],
        "home_tasks": [
            "Perform a supervised obstacle course in the living room using couch cushions.",
            "Practice walking up and down stairs while holding the railing.",
            "Encourage 'tummy time' or crawling through play tunnels to build core strength."
        ],
        "future_plans": [
            "Focus on core strengthening exercises using the pediatric balance board.",
            "Progress to walking on uneven surfaces (mats, wedges).",
            "Target jumping with two feet clearing the ground."
        ]
    },
    "Special Education SPED": {
        "diagnoses": ["ADHD", "Global Developmental Delay", "Specific Learning Disability"],
        "traits": ["Joint Attention", "Task Completion", "Following Directions", "Pre-academic Skills"],
        "observations": [
            "Patient completed the matching task with {level} redirection. Attention span was approximately {minutes} minutes.",
            "Required {level} visual prompts to transition between the desk and the play area.",
            "Demonstrated emerging pre-academic skills. Identified 4 out of 5 primary colors with {level} prompting."
        ],
        "home_tasks": [
            "Implement a visual schedule for morning and bedtime routines.",
            "Practice sorting objects by color or shape for 5 minutes a day.",
            "Play 'Simon Says' to practice following multi-step auditory directions."
        ],
        "future_plans": [
            "Introduce tracing worksheets for pre-writing skills.",
            "Increase independent, seated work time to 10 consecutive minutes.",
            "Target rote counting from 1 to 20 using physical manipulatives."
        ]
    },
    "Behavioral Therapy": {
        "diagnoses": ["Autism Spectrum Disorder (ASD)", "Oppositional Defiant Disorder (ODD)", "ADHD"],
        "traits": ["Frustration Tolerance", "Emotional Regulation", "Peer Interaction", "Transitioning"],
        "observations": [
            "Patient experienced minor behavioral outbursts lasting {minutes} minutes when denied access to a preferred item. Responded to {level} de-escalation.",
            "Successfully shared a toy with a peer using {level} verbal prompting. Frustration tolerance is improving.",
            "Transitioning away from the iPad required {level} physical guidance and a visual timer."
        ],
        "home_tasks": [
            "Use a 'First/Then' board at home (e.g., First eat vegetables, Then iPad).",
            "Reinforce positive behavior immediately using a token economy or sticker chart.",
            "Practice deep breathing exercises together when the child appears visibly agitated."
        ],
        "future_plans": [
            "Role-play social scenarios focusing on losing a game gracefully.",
            "Fade continuous reinforcement to an intermittent reinforcement schedule.",
            "Introduce self-monitoring checklists for emotional states (e.g., the 'Zones of Regulation')."
        ]
    }
}

# 2. Medical History Components
BIRTH_HISTORIES = ["Full-term, uncomplicated delivery", "Premature (34 weeks), 1 week NICU stay",
                   "Cesarean section, full-term", "Premature (36 weeks), no complications"]
ALLERGIES = ["None", "Peanuts", "Dairy", "Dust and Pollen", "Amoxicillin"]
MEDICATIONS = ["None", "Methylphenidate (10mg)", "Melatonin (1mg at night)", "Risperidone (0.5mg)",
               "Multivitamins only"]
LEVELS = ["Full Physical", "Partial Physical", "Visual", "Verbal", "Independent"]

print("Generating Comprehensive Medical Records...")

data = []

for _ in range(NUM_RECORDS):
    # Core Profile
    patient_id = f"HC-{random.randint(10000, 99999)}"
    service = random.choice(list(CLINICAL_DATA.keys()))
    service_data = CLINICAL_DATA[service]

    # Medical History Strings
    med_history = f"Birth: {random.choice(BIRTH_HISTORIES)} | Allergies: {random.choice(ALLERGIES)} | Meds: {random.choice(MEDICATIONS)}"

    # Select random traits and assign a status to them
    selected_traits = random.sample(service_data["traits"], 2)
    trait_string = f"1. {selected_traits[0]} ({random.choice(['Emerging', 'Delayed', 'Progressing'])}), 2. {selected_traits[1]} ({random.choice(['Emerging', 'Delayed', 'Progressing'])})"

    # Generate Notes with dynamic variables
    observation = random.choice(service_data["observations"]).format(
        level=random.choice(LEVELS).lower(),
        minutes=random.randint(2, 15)
    )

    evaluation = {
        "Record_ID": f"REC-{random.randint(1000, 9999)}",
        "Patient_ID": patient_id,
        "Patient_Name": fake.name(),
        "Date_of_Session": fake.date_between(start_date='-30d', end_date='today').strftime("%Y-%m-%d"),
        "Service_Provided": service,
        "Primary_Diagnosis": random.choice(service_data["diagnoses"]),
        "Basic_Medical_History": med_history,
        "Traits_Tracked_Today": trait_string,
        "Therapist_Observation_Notes": observation,
        "Parent_Home_Task": random.choice(service_data["home_tasks"]),
        "Future_Session_Roadmap": random.choice(service_data["future_plans"])
    }

    data.append(evaluation)

# Convert to Pandas DataFrame
df = pd.DataFrame(data)

print("\nExporting to separate CSV files...")

# --- NEW FOLDER LOGIC ---
folder_name = "MyHakbang Sample Data"

# Ensure the folder exists (creates it if you ever run this in a new directory)
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

# 3. Export to Separate Files inside the folder
for service in CLINICAL_DATA.keys():
    # Filter the dataframe for only the current service
    service_df = df[df['Service_Provided'] == service]

    # Create a safe, lowercase filename without spaces or special characters
    safe_filename_format = service.replace(" ", "_").replace("-", "_").lower()
    output_filename = f"hakbang_records_{safe_filename_format}.csv"

    # Combine the folder name and the file name into a full path
    full_path = os.path.join(folder_name, output_filename)

    # Export the filtered data to that specific path
    service_df.to_csv(full_path, index=False)

    print(f" - Saved {len(service_df)} records to '{full_path}'")

print("\nProcess complete!")
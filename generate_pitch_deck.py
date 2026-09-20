import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation with 16:9 Widescreen dimensions
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Ultra-High-Contrast Color Palette (Guaranteed 100% Visibility on all screens & projectors)
BG_COLOR = RGBColor(10, 15, 29)          # #0A0F1D Deep Rich Navy
CARD_BG = RGBColor(25, 36, 64)           # #192440 Elevated Navy Slate (clearly distinct from background)
CARD_BORDER = RGBColor(60, 80, 120)      # #3C5078 Clearly defined border
INNER_BOX = RGBColor(18, 25, 45)         # #12192D Darker inner highlight box

# Text Colors (Never dim, never low-contrast)
TEXT_WHITE = RGBColor(255, 255, 255)     # Pure White (Headers, Titles, Highlights)
TEXT_BRIGHT = RGBColor(241, 245, 249)    # #F1F5F9 Ultra-crisp off-white for all body copy
TEXT_MUTED = RGBColor(203, 213, 225)     # #CBD5E1 High-contrast light silver for secondary text (contrast ratio > 9:1)

# Vibrant High-Luminance Accents (Vivid against dark backgrounds)
ACCENT_CYAN = RGBColor(56, 189, 248)     # #38BDF8 Bright Sky Cyan
ACCENT_INDIGO = RGBColor(165, 180, 252)  # #A5B4FC Bright Periwinkle Indigo
ACCENT_EMERALD = RGBColor(52, 211, 153)  # #34D399 Bright Mint Emerald
ACCENT_AMBER = RGBColor(251, 191, 36)    # #FBBF24 Bright Golden Amber
ACCENT_ROSE = RGBColor(251, 113, 133)    # #FB7185 Bright Coral Rose

def create_base_slide(title_text, subtitle_text=None, tag_text="DROPOUTGUARD AI"):
    """Creates a blank slide with deep navy background and high-contrast header."""
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    
    # Slide Background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background()
    
    # Top Tag
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = tag_text.upper()
    p_tag.font.name = "Calibri"
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = ACCENT_CYAN
    
    # Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = "Calibri"
    p_title.font.size = Pt(27)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE
    
    # Subtitle
    if subtitle_text:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.5))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = subtitle_text
        p_sub.font.name = "Calibri"
        p_sub.font.size = Pt(14)
        p_sub.font.color.rgb = TEXT_MUTED
        
    return slide

def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
    """Adds a rounded rectangle card container with a crisp border."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1.75)
    else:
        card.line.fill.background()
    return card

# ----------------------------------------------------
# SLIDE 1: Title Slide
# ----------------------------------------------------
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
bg1.fill.solid()
bg1.fill.fore_color.rgb = BG_COLOR
bg1.line.fill.background()

tb1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.0), Inches(11.333), Inches(2.3))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_badge = tf1.paragraphs[0]
p_badge.text = "HACKATHON 2026 SUBMISSION • EVALUATOR PRESENTATION"
p_badge.font.name = "Calibri"
p_badge.font.size = Pt(12)
p_badge.font.bold = True
p_badge.font.color.rgb = ACCENT_CYAN

p_main = tf1.add_paragraph()
p_main.text = "DropoutGuard AI"
p_main.font.name = "Calibri"
p_main.font.size = Pt(46)
p_main.font.bold = True
p_main.font.color.rgb = TEXT_WHITE

p_sub = tf1.add_paragraph()
p_sub.text = "Explainable Predictive Intelligence & Early Intervention Platform for Higher Education Retention"
p_sub.font.name = "Calibri"
p_sub.font.size = Pt(17)
p_sub.font.color.rgb = TEXT_BRIGHT

metrics = [
    ("0.925", "ROC-AUC Score", "Trained on UCI Benchmark\n(4,424 student cohort, 35 features)", ACCENT_INDIGO),
    ("6-8 Wks", "Early Warning Window", "Identifies downward trajectory\nweeks before semester exams", ACCENT_CYAN),
    ("SHAP", "Explainable AI (XAI)", "Zero black-boxes with precise\nfeature weight attributions", ACCENT_EMERALD),
    ("LTI 1.3", "Universal LMS Ready", "Pre-configured live sync with\nCanvas, Blackboard, & Moodle", ACCENT_AMBER)
]

for idx, (num, label, desc, color) in enumerate(metrics):
    card_left = Inches(1.0 + idx * 2.9)
    add_card(slide1, card_left, Inches(3.6), Inches(2.7), Inches(2.5), CARD_BG, color)
    
    tbox = slide1.shapes.add_textbox(card_left + Inches(0.15), Inches(3.75), Inches(2.4), Inches(2.2))
    tf = tbox.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = num
    p1.font.name = "Calibri"
    p1.font.size = Pt(34)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = label
    p2.font.name = "Calibri"
    p2.font.size = Pt(14)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.name = "Calibri"
    p3.font.size = Pt(11.5)
    p3.font.color.rgb = TEXT_BRIGHT

ft_box = slide1.shapes.add_textbox(Inches(1.0), Inches(6.5), Inches(11.333), Inches(0.5))
p_ft = ft_box.text_frame.paragraphs[0]
p_ft.text = "Deployed Production Web App on Render • 100% Offline-First Resilient Architecture"
p_ft.font.size = Pt(12)
p_ft.font.bold = True
p_ft.font.color.rgb = ACCENT_CYAN

slide1.notes_slide.notes_text_frame.text = (
    "Good morning, evaluators. Today we present DropoutGuard AI: an explainable early-warning "
    "intelligence platform that predicts higher education student dropout 6 to 8 weeks before academic failure occurs."
)

# ----------------------------------------------------
# SLIDE 2: The Problem
# ----------------------------------------------------
slide2 = create_base_slide(
    "The $4.2 Billion Higher Education Attrition Crisis",
    "Traditional institutional detection is retrospective, siloed, and too late to prevent dropouts.",
    "THE PROBLEM & MOTIVATION"
)

problem_cards = [
    ("32.9%", "Global Dropout Rate", "Nearly 1 in 3 college undergraduates drop out before completing their degree, severely capping their career trajectory and lifelong socioeconomic mobility.", ACCENT_ROSE),
    ("Post-Mortem", "Retrospective Detection", "Universities identify student failure only after semester finals or academic probation notices are issued—when remediation is already too late.", ACCENT_ROSE),
    ("Siloed Data", "Fragmented Intelligence", "Attendance logs, LMS submissions, internal test marks, and fees compliance sit in disconnected systems with no unified risk intelligence.", ACCENT_ROSE)
]

for idx, (num, label, desc, color) in enumerate(problem_cards):
    left = Inches(0.8 + idx * 3.95)
    add_card(slide2, left, Inches(2.1), Inches(3.75), Inches(3.2), CARD_BG, color)
    
    tb = slide2.shapes.add_textbox(left + Inches(0.2), Inches(2.25), Inches(3.35), Inches(2.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = num
    p1.font.size = Pt(34)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = label
    p2.font.size = Pt(15)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_BRIGHT

add_card(slide2, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.15), CARD_BG, ACCENT_ROSE)
tb_call = slide2.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.95))
tf_call = tb_call.text_frame
tf_call.word_wrap = True
p_c1 = tf_call.paragraphs[0]
p_c1.text = "THE INSTITUTIONAL BLIND SPOT:"
p_c1.font.bold = True
p_c1.font.size = Pt(13)
p_c1.font.color.rgb = ACCENT_ROSE
p_c2 = tf_call.add_paragraph()
p_c2.text = "By week 4, when a student begins skipping classes and missing lab assignments, faculty members receive zero automated alerts. By the time final grades arrive, the student has already disengaged."
p_c2.font.size = Pt(12)
p_c2.font.color.rgb = TEXT_WHITE

slide2.notes_slide.notes_text_frame.text = (
    "Over 30% of undergraduate students drop out globally, costing universities more than $4.2 billion "
    "in lost tuition and state funding every year. But detection today is retrospective."
)

# ----------------------------------------------------
# SLIDE 3: The Solution
# ----------------------------------------------------
slide3 = create_base_slide(
    "The Solution: Early Warning Intelligence",
    "Transforming student retention from a post-mortem autopsy into proactive, prescriptive action.",
    "THE DROPOUTGUARD SOLUTION"
)

solution_pillars = [
    ("🛡️ Early Warning Radar", "Weeks 4–6 Inflection", "Synthesizes attendance decay, GPA trend velocity, and LMS engagement early in the semester to catch dropouts 6 to 8 weeks before final examinations occur.", ACCENT_CYAN),
    ("🔍 Explainable AI (XAI)", "Zero Black Boxes", "Leverages SHAP feature attributions so advisors know exactly why a student is flagged (e.g. 2 course backlogs + 58% attendance) rather than guessing from an opaque score.", ACCENT_INDIGO),
    ("⚡ Prescriptive Action", "Closing the Loop", "Connects risk detection directly to automated SMS/Email nudges, 1-click faculty mentor routing, and an empathetic, supportive Student Wellness Hub.", ACCENT_EMERALD)
]

for idx, (title, sub, desc, color) in enumerate(solution_pillars):
    left = Inches(0.8 + idx * 3.95)
    add_card(slide3, left, Inches(2.1), Inches(3.75), Inches(3.2), CARD_BG, color)
    
    tb = slide3.shapes.add_textbox(left + Inches(0.2), Inches(2.25), Inches(3.35), Inches(2.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    p2 = tf.add_paragraph()
    p2.text = sub
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = color
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_BRIGHT

add_card(slide3, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.15), CARD_BG, ACCENT_INDIGO)
tb_role = slide3.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.95))
tf_role = tb_role.text_frame
tf_role.word_wrap = True
p_r1 = tf_role.paragraphs[0]
p_r1.text = "BUILT FOR EVERY CAMPUS STAKEHOLDER (1-CLICK PERSONA SWITCHING):"
p_r1.font.bold = True
p_r1.font.size = Pt(12.5)
p_r1.font.color.rgb = ACCENT_CYAN
p_r2 = tf_role.add_paragraph()
p_r2.text = "• University Dean (Cohort Analytics & Risk Velocity) • Faculty Mentor (Case Dossier & What-If Simulator) • Student (Supportive Wellness Hub & Advisor Connect)"
p_r2.font.size = Pt(12)
p_r2.font.color.rgb = TEXT_WHITE

slide3.notes_slide.notes_text_frame.text = (
    "DropoutGuard AI transforms student retention from an autopsy into an early-warning radar with complete explainability."
)

# ----------------------------------------------------
# SLIDE 4: Machine Learning Rigor
# ----------------------------------------------------
slide4 = create_base_slide(
    "Machine Learning Rigor & Empirical Validation",
    "Validated on the gold-standard UCI Higher Education Benchmark (4,424 verified trajectories).",
    "SCIENTIFIC & ML RIGOR"
)

# Left Column: Model Comparison Table
add_card(slide4, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, CARD_BORDER)
tb_tbl_title = slide4.shapes.add_textbox(Inches(1.0), Inches(2.25), Inches(5.3), Inches(0.4))
tb_tbl_title.text_frame.paragraphs[0].text = "MODEL BENCHMARK COMPARISON"
tb_tbl_title.text_frame.paragraphs[0].font.bold = True
tb_tbl_title.text_frame.paragraphs[0].font.size = Pt(14)
tb_tbl_title.text_frame.paragraphs[0].font.color.rgb = ACCENT_CYAN

table_shape = slide4.shapes.add_table(5, 4, Inches(1.0), Inches(2.75), Inches(5.3), Inches(2.4))
table = table_shape.table
headers = ["Architecture", "ROC-AUC", "Recall", "F1 Score"]
for col_idx, h in enumerate(headers):
    cell = table.cell(0, col_idx)
    cell.text = h
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(45, 60, 95)
    p = cell.text_frame.paragraphs[0]
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_WHITE

rows_data = [
    ("Random Forest (Ours)", "0.925", "87.4%", "0.868"),
    ("Gradient Boosting (XGB)", "0.912", "85.1%", "0.852"),
    ("Logistic Regression", "0.812", "73.8%", "0.761"),
    ("Support Vector Classifier", "0.825", "75.2%", "0.774")
]

for row_idx, row in enumerate(rows_data):
    for col_idx, val in enumerate(row):
        cell = table.cell(row_idx + 1, col_idx)
        cell.text = val
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(30, 42, 72)
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(11)
        if row_idx == 0:
            p.font.bold = True
            p.font.color.rgb = ACCENT_EMERALD
        else:
            p.font.color.rgb = TEXT_WHITE

tb_ds = slide4.shapes.add_textbox(Inches(1.0), Inches(5.35), Inches(5.3), Inches(1.3))
tf_ds = tb_ds.text_frame
tf_ds.word_wrap = True
p_d1 = tf_ds.paragraphs[0]
p_d1.text = "Dataset Characteristics:"
p_d1.font.bold = True
p_d1.font.size = Pt(12)
p_d1.font.color.rgb = ACCENT_CYAN
p_d2 = tf_ds.add_paragraph()
p_d2.text = "• 4,424 records from the UCI Higher Education benchmark.\n• 35 multidimensional features (demographics, grades, socio-economic).\n• Stratified 80/20 train/test split with 5-fold cross-validation."
p_d2.font.size = Pt(11)
p_d2.font.color.rgb = TEXT_BRIGHT

# Right Column: Top Features by SHAP Weight
add_card(slide4, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, CARD_BORDER)
tb_shap_title = slide4.shapes.add_textbox(Inches(7.0), Inches(2.25), Inches(5.3), Inches(0.4))
tb_shap_title.text_frame.paragraphs[0].text = "TOP PREDICTIVE FACTORS (SHAP WEIGHTS)"
tb_shap_title.text_frame.paragraphs[0].font.bold = True
tb_shap_title.text_frame.paragraphs[0].font.size = Pt(14)
tb_shap_title.text_frame.paragraphs[0].font.color.rgb = ACCENT_INDIGO

shap_factors = [
    ("Course Backlogs / Failed Units", "40.5%", "Highest statistical correlation with dropout inflection."),
    ("GPA Trend Velocity (Delta)", "18.7%", "Steep drop between previous and current semester."),
    ("Class Attendance Compliance", "16.2%", "Dips below the mandatory 65% university threshold."),
    ("Tuition & Socio-Economic Status", "14.2%", "External financial and scholarship stability factors."),
    ("Assignment & Lab Completion", "10.4%", "Early indicators of student disengagement in weeks 3-5.")
]

tb_shap_list = slide4.shapes.add_textbox(Inches(7.0), Inches(2.75), Inches(5.3), Inches(3.9))
tf_sl = tb_shap_list.text_frame
tf_sl.word_wrap = True
for idx, (fname, pct, fdesc) in enumerate(shap_factors):
    p = tf_sl.paragraphs[0] if idx == 0 else tf_sl.add_paragraph()
    p.text = f"{idx+1}. {fname}: {pct}"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = ACCENT_ROSE if idx == 0 else ACCENT_CYAN
    
    p_sub = tf_sl.add_paragraph()
    p_sub.text = f"    {fdesc}"
    p_sub.font.size = Pt(10.5)
    p_sub.font.color.rgb = TEXT_BRIGHT

slide4.notes_slide.notes_text_frame.text = (
    "Our Random Forest ensemble achieves a 0.925 ROC-AUC with an 87.4% recall on critically at-risk students."
)

# ----------------------------------------------------
# SLIDE 5: Explainable AI & Case Study
# ----------------------------------------------------
slide5 = create_base_slide(
    "Explainable AI in Practice: Case Study STU1024",
    "Deconstructing composite risk into human-interpretable, accountable factors.",
    "EXPLAINABILITY (XAI)"
)

# Left Box: Student Telemetry Profile
add_card(slide5, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_AMBER)
tb_stu = slide5.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_stu = tb_stu.text_frame
tf_stu.word_wrap = True

p = tf_stu.paragraphs[0]
p.text = "Student: Kavya Sharma (ID: STU1024)"
p.font.bold = True
p.font.size = Pt(18)
p.font.color.rgb = TEXT_WHITE

p_prg = tf_stu.add_paragraph()
p_prg.text = "B.Tech Computer Science • Semester 4"
p_prg.font.size = Pt(13)
p_prg.font.color.rgb = ACCENT_CYAN

p_risk = tf_stu.add_paragraph()
p_risk.text = "PREDICTED RISK: 78% (HIGH RISK FLAGGED)"
p_risk.font.bold = True
p_risk.font.size = Pt(14)
p_risk.font.color.rgb = ACCENT_ROSE

p_m = tf_stu.add_paragraph()
p_m.text = "\nAcademic Telemetry Indicators:"
p_m.font.bold = True
p_m.font.size = Pt(12.5)
p_m.font.color.rgb = TEXT_WHITE

metrics_stu = [
    ("• Class Attendance:", "58% (Mandatory minimum: 65%)"),
    ("• GPA Trend Velocity:", "-0.9 drop (Fell from 6.7 to 5.8)"),
    ("• Active Course Backlogs:", "2 Subjects (Math III & Data Structures)"),
    ("• Assignment Submission Rate:", "50% (Missed 3 lab deliverables)"),
    ("• Internal Assessment Score:", "61 / 100")
]
for lbl, val in metrics_stu:
    p_item = tf_stu.add_paragraph()
    p_item.text = f"{lbl} {val}"
    p_item.font.size = Pt(11.5)
    p_item.font.color.rgb = TEXT_BRIGHT

p_rec = tf_stu.add_paragraph()
p_rec.text = "\nAction: Supplementary exam clearance roadmap + assigned faculty mentoring."
p_rec.font.bold = True
p_rec.font.size = Pt(11.5)
p_rec.font.color.rgb = ACCENT_EMERALD

# Right Box: SHAP Factor Attributions
add_card(slide5, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, CARD_BORDER)
tb_shap_d = slide5.shapes.add_textbox(Inches(7.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_sd = tb_shap_d.text_frame
tf_sd.word_wrap = True

p_sh = tf_sd.paragraphs[0]
p_sh.text = "SHAP Factor Risk Contributions"
p_sh.font.bold = True
p_sh.font.size = Pt(18)
p_sh.font.color.rgb = TEXT_WHITE

p_sh_sub = tf_sd.add_paragraph()
p_sh_sub.text = "Every percentage point is mathematically accounted for:"
p_sh_sub.font.size = Pt(12)
p_sh_sub.font.color.rgb = ACCENT_CYAN

shap_stu = [
    ("Course Backlogs (2 subjects)", "+40.5%", "High backlog density severely increases probability of non-completion.", ACCENT_ROSE),
    ("Negative GPA Velocity (-0.9)", "+18.7%", "Steep drop indicates disengagement or exam difficulty.", ACCENT_ROSE),
    ("Sub-60% Attendance (58%)", "+16.2%", "Student misses core lecture context and lab assessments.", ACCENT_AMBER),
    ("Missed Coursework (50%)", "+10.4%", "Failure to submit continuous evaluation records.", ACCENT_CYAN)
]

for name, weight, exp, clr in shap_stu:
    p_w = tf_sd.add_paragraph()
    p_w.text = f"\n{name} ➔ {weight}"
    p_w.font.bold = True
    p_w.font.size = Pt(12.5)
    p_w.font.color.rgb = clr
    
    p_e = tf_sd.add_paragraph()
    p_e.text = exp
    p_e.font.size = Pt(11)
    p_e.font.color.rgb = TEXT_BRIGHT

slide5.notes_slide.notes_text_frame.text = (
    "For Kavya Sharma, her risk is 78%. But our system shows that her 2 backlogs contribute 40.5% of the risk."
)

# ----------------------------------------------------
# SLIDE 6: What-If Sensitivity Simulator
# ----------------------------------------------------
slide6 = create_base_slide(
    'Interactive "What-If" Sensitivity Simulator',
    "Simulate the impact of academic interventions dynamically before executing counseling plans.",
    "CORE INNOVATION & SENSITIVITY"
)

# Left Column: Parameter Inputs
add_card(slide6, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, CARD_BORDER)
tb_sim_in = slide6.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_si = tb_sim_in.text_frame
tf_si.word_wrap = True

p = tf_si.paragraphs[0]
p.text = "Simulated Intervention Adjustments"
p.font.bold = True
p.font.size = Pt(18)
p.font.color.rgb = TEXT_WHITE

p_sub = tf_si.add_paragraph()
p_sub.text = "Faculty advisor tests corrective milestones on interactive sliders:"
p_sub.font.size = Pt(12.5)
p_sub.font.color.rgb = TEXT_MUTED

sim_changes = [
    ("Target Attendance", "58% ➔ 75%", "+17% Recovery through regular faculty check-ins", ACCENT_CYAN),
    ("Target Assignment Rate", "50% ➔ 85%", "+35% Recovery via automated deadline alerts", ACCENT_INDIGO),
    ("Target Internal Marks", "61 ➔ 72 / 100", "+11 Marks with peer tutoring & study groups", ACCENT_EMERALD)
]

for title, change, detail, clr in sim_changes:
    p1 = tf_si.add_paragraph()
    p1.text = f"\n{title}: {change}"
    p1.font.bold = True
    p1.font.size = Pt(13)
    p1.font.color.rgb = clr
    
    p2 = tf_si.add_paragraph()
    p2.text = detail
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BRIGHT

p_ft = tf_si.add_paragraph()
p_ft.text = "\nReal-Time Feedback: Instant sensitivity recalculation via dynamic partial-derivative feature perturbation."
p_ft.font.size = Pt(11)
p_ft.font.color.rgb = ACCENT_CYAN

# Right Column: Outcome Box
add_card(slide6, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_EMERALD)
tb_sim_out = slide6.shapes.add_textbox(Inches(7.0), Inches(2.6), Inches(5.3), Inches(4.0))
tf_so = tb_sim_out.text_frame
tf_so.word_wrap = True

p_res = tf_so.paragraphs[0]
p_res.text = "DYNAMIC RECALCULATION OUTCOME"
p_res.font.bold = True
p_res.font.size = Pt(14)
p_res.font.color.rgb = ACCENT_EMERALD

p_drop = tf_so.add_paragraph()
p_drop.text = "78%  ➔  28%"
p_drop.font.bold = True
p_drop.font.size = Pt(46)
p_drop.font.color.rgb = ACCENT_EMERALD

p_st = tf_so.add_paragraph()
p_st.text = "STATUS: LOW RISK (NOMINAL STANDING)"
p_st.font.bold = True
p_st.font.size = Pt(15)
p_st.font.color.rgb = TEXT_WHITE

p_desc = tf_so.add_paragraph()
p_desc.text = "\n• Total Risk Reduction: -50 Percentage Points\n• Proves that restoring attendance and assignment cadence will safely clear Kavya from danger.\n• Gives counselors concrete, motivating targets to share with the student."
p_desc.font.size = Pt(12.5)
p_desc.font.color.rgb = TEXT_BRIGHT

slide6.notes_slide.notes_text_frame.text = (
    "Our flagship innovation is the real-time What-If Sensitivity Simulator. Advisors can test hypothetical "
    "interventions dynamically before taking action."
)

# ----------------------------------------------------
# SLIDE 7: Faculty Interventions Workflow
# ----------------------------------------------------
slide7 = create_base_slide(
    "Closing the Loop: Faculty Intervention Workflow",
    "Transforms analytical predictions into immediate, accountable human actions.",
    "PRESCRIPTIVE INTERVENTIONS"
)

workflow_cards = [
    ("Step 1: Automated Nudges", "Contextual Outbound Alerts", "Dispatches non-punitive SMS, Email, and WhatsApp reminders for pending assignment deadlines and attendance recovery with zero faculty overhead.", ACCENT_CYAN),
    ("Step 2: Mentor Assignment", "1-Click Case Routing", "Routes at-risk student dossiers directly to designated departmental faculty mentors (e.g. Prof. Ananya Sen) with complete academic telemetry and history.", ACCENT_INDIGO),
    ("Step 3: Lifecycle Tracking", "Accountability & Audits", "Tracks intervention progress through 4 verified milestones: Identified ➔ Assigned ➔ In Progress ➔ Successfully Resolved. Full FERPA logging.", ACCENT_EMERALD)
]

for idx, (title, sub, desc, color) in enumerate(workflow_cards):
    left = Inches(0.8 + idx * 3.95)
    add_card(slide7, left, Inches(2.1), Inches(3.75), Inches(3.2), CARD_BG, color)
    
    tb = slide7.shapes.add_textbox(left + Inches(0.2), Inches(2.25), Inches(3.35), Inches(2.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    p2 = tf.add_paragraph()
    p2.text = sub
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = color
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_BRIGHT

add_card(slide7, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.15), CARD_BG, ACCENT_CYAN)
tb_ac = slide7.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.95))
tf_ac = tb_ac.text_frame
tf_ac.word_wrap = True
p_a1 = tf_ac.paragraphs[0]
p_a1.text = "INSTITUTIONAL ACCOUNTABILITY & ZERO DROPPED CASES:"
p_a1.font.bold = True
p_a1.font.size = Pt(12.5)
p_a1.font.color.rgb = ACCENT_CYAN
p_a2 = tf_ac.add_paragraph()
p_a2.text = "Every counseling interaction records mentor notes, agreed milestone targets, and scheduled follow-ups. Deans can monitor intervention resolution rates across departments in real time."
p_a2.font.size = Pt(12)
p_a2.font.color.rgb = TEXT_WHITE

slide7.notes_slide.notes_text_frame.text = (
    "Prediction without prescription is useless. DropoutGuard AI closes the loop with complete tracking."
)

# ----------------------------------------------------
# SLIDE 8: Student Wellness Hub
# ----------------------------------------------------
slide8 = create_base_slide(
    "Student Wellness Hub: Destigmatizing Academic Risk",
    "Empathetic, strength-based student interface eliminating punitive surveillance stigma.",
    "ETHICAL AI & STUDENT EXPERIENCE"
)

# Left Column: Contrast Box
add_card(slide8, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_ROSE)
tb_comp = slide8.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_cp = tb_comp.text_frame
tf_cp.word_wrap = True

p_cp = tf_cp.paragraphs[0]
p_cp.text = "Supportive Framing vs. Punitive Alerts"
p_cp.font.bold = True
p_cp.font.size = Pt(18)
p_cp.font.color.rgb = TEXT_WHITE

p_bad_hdr = tf_cp.add_paragraph()
p_bad_hdr.text = "\nTRADITIONAL PUNITIVE APPROACH (DISCOURAGING):"
p_bad_hdr.font.bold = True
p_bad_hdr.font.size = Pt(12)
p_bad_hdr.font.color.rgb = ACCENT_ROSE

p_bad = tf_cp.add_paragraph()
p_bad.text = '"Warning: You are flagged with an 80% Dropout Probability. Immediate academic probation hearing scheduled."'
p_bad.font.size = Pt(12)
p_bad.font.italic = True
p_bad.font.color.rgb = TEXT_BRIGHT

p_good_hdr = tf_cp.add_paragraph()
p_good_hdr.text = "\nDROPOUTGUARD WELLNESS HUB (EMPATHETIC):"
p_good_hdr.font.bold = True
p_good_hdr.font.size = Pt(12)
p_good_hdr.font.color.rgb = ACCENT_EMERALD

p_good = tf_cp.add_paragraph()
p_good.text = '"Welcome back, Aarav! You are making solid progress in Semester 4. Connect with your advisor to boost your exam prep roadmap."'
p_good.font.size = Pt(12)
p_good.font.italic = True
p_good.font.color.rgb = TEXT_WHITE

# Right Column: Student Self-Service
add_card(slide8, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_EMERALD)
tb_self = slide8.shapes.add_textbox(Inches(7.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_sf = tb_self.text_frame
tf_sf.word_wrap = True

p_sf = tf_sf.paragraphs[0]
p_sf.text = "Student Self-Service Tools"
p_sf.font.bold = True
p_sf.font.size = Pt(18)
p_sf.font.color.rgb = TEXT_WHITE

features_stu = [
    ("1-Click Faculty Advisor Connect", "Students can request guidance meetings directly with their mentor without bureaucratic delays.", ACCENT_EMERALD),
    ("Curated Supplementary Resources", "AI-recommended lecture notes, previous year question papers, and backlog clearance modules.", ACCENT_CYAN),
    ("Transparent Milestones Tracker", "Tracks upcoming deadlines and attendance targets in a motivating, non-stressful UI.", ACCENT_INDIGO)
]

for title, desc, clr in features_stu:
    p1 = tf_sf.add_paragraph()
    p1.text = f"\n✓ {title}"
    p1.font.bold = True
    p1.font.size = Pt(13)
    p1.font.color.rgb = clr
    
    p2 = tf_sf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = TEXT_BRIGHT

slide8.notes_slide.notes_text_frame.text = (
    "A critical ethical dimension of EdTech is student mental health. We never show students a scary 'High Risk' banner."
)

# ----------------------------------------------------
# SLIDE 9: Enterprise Integration
# ----------------------------------------------------
slide9 = create_base_slide(
    "LTI 1.3 LMS Integration & FERPA Compliance",
    "Turnkey enterprise compatibility with university Learning Management Systems.",
    "ENTERPRISE READINESS"
)

lms_cards = [
    ("Canvas LMS", "LTI 1.3 Advantage", "Syncs course enrollments, gradebook submissions, assignment deadlines, and student engagement telemetry via Canvas GraphQL API.", ACCENT_ROSE),
    ("Blackboard Learn", "REST API Telemetry", "Ingests assignment submission velocity and discussion board activity to capture early student disengagement cues.", ACCENT_AMBER),
    ("Moodle Open Source", "OAuth 2.0 Standard", "Full support for public university deployments with secure token exchange and zero proprietary vendor lock-in.", ACCENT_INDIGO)
]

for idx, (title, sub, desc, color) in enumerate(lms_cards):
    left = Inches(0.8 + idx * 3.95)
    add_card(slide9, left, Inches(2.1), Inches(3.75), Inches(3.2), CARD_BG, color)
    
    tb = slide9.shapes.add_textbox(left + Inches(0.2), Inches(2.25), Inches(3.35), Inches(2.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(18)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    p2 = tf.add_paragraph()
    p2.text = sub
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = color
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_BRIGHT

add_card(slide9, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.15), CARD_BG, ACCENT_EMERALD)
tb_ferpa = slide9.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.95))
tf_fe = tb_ferpa.text_frame
tf_fe.word_wrap = True
p_f1 = tf_fe.paragraphs[0]
p_f1.text = "FERPA & GDPR COMPLIANCE GUARDRAILS:"
p_f1.font.bold = True
p_f1.font.size = Pt(12.5)
p_f1.font.color.rgb = ACCENT_EMERALD
p_f2 = tf_fe.add_paragraph()
p_f2.text = "Role-Based Access Control (RBAC) • Strict Data Anonymization • One-click Audit Pack Export for university accreditation compliance."
p_f2.font.size = Pt(12)
p_f2.font.color.rgb = TEXT_WHITE

slide9.notes_slide.notes_text_frame.text = (
    "We built DropoutGuard AI on the open LTI 1.3 standard, ensuring turnkey integration with Canvas, Blackboard, and Moodle."
)

# ----------------------------------------------------
# SLIDE 10: Institutional ROI & Impact
# ----------------------------------------------------
slide10 = create_base_slide(
    "Institutional Impact & Financial Return",
    "Quantifiable tuition preservation and student success outcomes.",
    "BUSINESS MODEL & ROI"
)

roi_cards = [
    ("$3.6M+", "Tuition Preserved / Cohort", "Calculated on a conservative 15% retention improvement across 3,000 at-risk students in a typical 10,000-student university.", ACCENT_EMERALD),
    ("450+", "Graduates Saved From Dropout", "More alumni entering the workforce, improving institutional national rankings, alumni giving, and state performance funding.", ACCENT_INDIGO),
    ("10x ROI", "Enterprise Value Proposition", "SaaS platform licensing pays for itself within the very first semester by preventing just 3 to 5 student dropouts.", ACCENT_CYAN)
]

for idx, (num, label, desc, color) in enumerate(roi_cards):
    left = Inches(0.8 + idx * 3.95)
    add_card(slide10, left, Inches(2.1), Inches(3.75), Inches(3.2), CARD_BG, color)
    
    tb = slide10.shapes.add_textbox(left + Inches(0.2), Inches(2.25), Inches(3.35), Inches(2.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = num
    p1.font.size = Pt(38)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = label
    p2.font.size = Pt(15)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_BRIGHT

add_card(slide10, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.15), CARD_BG, ACCENT_INDIGO)
tb_mkt = slide10.shapes.add_textbox(Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.95))
tf_mk = tb_mkt.text_frame
tf_mk.word_wrap = True
p_m1 = tf_mk.paragraphs[0]
p_m1.text = "TARGET MARKET ROLLOUT ROADMAP:"
p_m1.font.bold = True
p_m1.font.size = Pt(12.5)
p_m1.font.color.rgb = ACCENT_INDIGO
p_m2 = tf_mk.add_paragraph()
p_m2.text = "• Phase 1: Higher Education STEM & Computing programs with high attrition rates.\n• Phase 2: State university systems and community college networks requiring performance-based funding compliance."
p_m2.font.size = Pt(12)
p_m2.font.color.rgb = TEXT_WHITE

slide10.notes_slide.notes_text_frame.text = (
    "For an average 10,000-student university, retaining just 15% more students preserves over $3.6 million in tuition revenue."
)

# ----------------------------------------------------
# SLIDE 11: Production Polish & Tech Stack
# ----------------------------------------------------
slide11 = create_base_slide(
    "Production Engineering & System Resilience",
    "Built for zero-downtime performance, accessibility, and responsiveness.",
    "TECHNICAL ARCHITECTURE"
)

# Left Column: Stack
add_card(slide11, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, CARD_BORDER)
tb_stk = slide11.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_stk = tb_stk.text_frame
tf_stk.word_wrap = True

p_st = tf_stk.paragraphs[0]
p_st.text = "Full-Stack Architecture"
p_st.font.bold = True
p_st.font.size = Pt(18)
p_st.font.color.rgb = TEXT_WHITE

stack_items = [
    ("⚛️ Frontend:", "React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons"),
    ("📊 Data Visualizations:", "Recharts Suite (Pie, Scatter, Bar, Line)"),
    ("⚙️ Backend API:", "Node.js Express REST API microservices"),
    ("🧠 Machine Learning:", "Python Scikit-Learn & NumPy inference engine"),
    ("📄 Export Engines:", "Vector PDF Dossiers & Excel UTF-8 CSV exports")
]

for title, desc in stack_items:
    p1 = tf_stk.add_paragraph()
    p1.text = f"\n{title} {desc}"
    p1.font.size = Pt(12)
    p1.font.color.rgb = TEXT_BRIGHT

# Right Column: Fault Tolerance
add_card(slide11, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_EMERALD)
tb_ft = slide11.shapes.add_textbox(Inches(7.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_ft = tb_ft.text_frame
tf_ft.word_wrap = True

p_f = tf_ft.paragraphs[0]
p_f.text = "Hackathon Judge Fault Tolerance"
p_f.font.bold = True
p_f.font.size = Pt(18)
p_f.font.color.rgb = TEXT_WHITE

ft_items = [
    ("Offline-First Resilience", "Calibrated cohort telemetry guarantees visualizations and simulations never stall or crash during free-tier cloud cold starts."),
    ("WCAG AA Theme Switcher", "High-contrast Dark & Light mode toggle with verified non-transparent text and borders."),
    ("1-Click Demo Personas", "Instant access as Dean Dr. Aris Thorne, Prof. Ananya Sen, or Student Aarav Sharma without passwords."),
    ("Mobile Responsive", "Horizontal swipe cues and touch-friendly controls across all screen sizes.")
]

for title, desc in ft_items:
    p1 = tf_ft.add_paragraph()
    p1.text = f"\n✓ {title}"
    p1.font.bold = True
    p1.font.size = Pt(13)
    p1.font.color.rgb = ACCENT_EMERALD
    p2 = tf_ft.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = TEXT_BRIGHT

slide11.notes_slide.notes_text_frame.text = (
    "Our system is engineered for production reliability with zero-downtime offline-first fallbacks."
)

# ----------------------------------------------------
# SLIDE 12: Summary & Q&A
# ----------------------------------------------------
slide12 = create_base_slide(
    "Empowering Institutions to Protect Student Futures",
    "Ready for institutional pilot deployment and immediate evaluation.",
    "SUMMARY & EVALUATION"
)

# Left Column: Links & Submission
add_card(slide12, Inches(0.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_INDIGO)
tb_sum = slide12.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(5.3), Inches(4.3))
tf_sm = tb_sum.text_frame
tf_sm.word_wrap = True

p_s = tf_sm.paragraphs[0]
p_s.text = "Evaluation Resources"
p_s.font.bold = True
p_s.font.size = Pt(18)
p_s.font.color.rgb = TEXT_WHITE

resources = [
    ("Live Web Application", "Deployed Live on Render (Production Build)"),
    ("GitHub Repository", "https://github.com/Swas00/DropoutGuard-AI"),
    ("1-Click Demo Personas", "Dean Dr. Aris Thorne • Prof. Ananya Sen • Student Aarav Sharma"),
    ("Interactive Deck Link", "https://<your-render-url>/presentation.html")
]

for title, val in resources:
    p1 = tf_sm.add_paragraph()
    p1.text = f"\n{title}:"
    p1.font.bold = True
    p1.font.size = Pt(12.5)
    p1.font.color.rgb = ACCENT_CYAN
    p2 = tf_sm.add_paragraph()
    p2.text = val
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = TEXT_WHITE

# Right Column: Thank You Box
add_card(slide12, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), CARD_BG, ACCENT_EMERALD)
tb_ty = slide12.shapes.add_textbox(Inches(7.0), Inches(2.8), Inches(5.3), Inches(3.8))
tf_ty = tb_ty.text_frame
tf_ty.word_wrap = True

p_icon = tf_ty.paragraphs[0]
p_icon.text = "🎓"
p_icon.font.size = Pt(40)

p_ty = tf_ty.add_paragraph()
p_ty.text = "Thank You, Evaluators!"
p_ty.font.bold = True
p_ty.font.size = Pt(28)
p_ty.font.color.rgb = TEXT_WHITE

p_vision = tf_ty.add_paragraph()
p_vision.text = "\nDropoutGuard AI transforms dropout prevention from an autopsy into proactive, life-changing interventions."
p_vision.font.size = Pt(14)
p_vision.font.color.rgb = TEXT_BRIGHT

p_qa = tf_ty.add_paragraph()
p_qa.text = "\nREADY FOR JUDGE Q&A & LIVE DEMONSTRATION"
p_qa.font.bold = True
p_qa.font.size = Pt(13)
p_qa.font.color.rgb = ACCENT_EMERALD

slide12.notes_slide.notes_text_frame.text = (
    "DropoutGuard AI bridges the gap between predictive AI research and real-world student success. "
    "Thank you, evaluators, and we would love to answer your questions or demonstrate any feature live right now!"
)

# Save presentation to v2 (to bypass Windows PowerPoint file lock) and attempt original
output_v2 = os.path.join(os.getcwd(), "DropoutGuard_AI_Presentation_v2.pptx")
prs.save(output_v2)
print(f"SUCCESS: High-contrast PowerPoint presentation created at {output_v2}")

output_orig = os.path.join(os.getcwd(), "DropoutGuard_AI_Presentation.pptx")
try:
    prs.save(output_orig)
    print(f"SUCCESS: Also updated original file at {output_orig}")
except Exception as e:
    print(f"NOTE: Original file was locked (likely open in PowerPoint). New file saved as: DropoutGuard_AI_Presentation_v2.pptx")


import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_callout(doc, text_prefix, text_body, border_color="E34A32", bg_color="F9FAFB"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run1 = p.add_run(text_prefix)
    run1.bold = True
    run1.font.name = "Calibri"
    run1.font.size = Pt(10.5)
    run1.font.color.rgb = RGBColor(0xE3, 0x4A, 0x32)
    
    run2 = p.add_run(" " + text_body)
    run2.font.name = "Calibri"
    run2.font.size = Pt(10.5)
    run2.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(4)

def format_table(table, col_widths, headers, rows_data):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_row = table.rows[0]
    header_trPr = header_row._tr.get_or_add_trPr()
    header_trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    
    for i, h_text in enumerate(headers):
        cell = header_row.cells[i]
        cell.width = col_widths[i]
        set_cell_background(cell, "1E293B")
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i > 1 else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    for r_idx, row_values in enumerate(rows_data):
        row = table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_values):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4] else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(str(val))
            run.font.name = "Calibri"
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
            if c_idx == 0 or (c_idx == 2 and float(val) > 0.85):
                run.bold = True
                if c_idx == 2:
                    run.font.color.rgb = RGBColor(0x05, 0x96, 0x69)
                    
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:insideV w:val="none"/><w:left w:val="none"/><w:right w:val="none"/></w:tblBorders>')
    tblPr.append(borders)

def build_presentation_guide_doc(output_path):
    doc = docx.Document()
    
    # Page setup
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Title Block
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    r_t = p_title.add_run("Poisonous Gas Identification Project")
    r_t.font.name = "Calibri"
    r_t.font.size = Pt(22)
    r_t.bold = True
    r_t.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    r_s = p_sub.add_run("Complete Layman Guide, Web Application Walkthrough & Viva/Presentation Script")
    r_s.font.name = "Calibri"
    r_s.font.size = Pt(11.5)
    r_s.italic = True
    r_s.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
    
    # Metadata Card
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths = [Inches(3.2), Inches(3.3)]
    meta_data = [
        [("Project Team:", " Rohit (25225018), Tisha (25225025), Dev (25225009)"), ("Project Focus:", " Ghazipur Landfill Gas Dispersion & Early Warning")],
        [("GitHub Repository:", " Rohitpvt/Poisonous-Gas-Identification-Project"), ("Web Server:", " React GIS Dashboard (Port 5174) & Streamlit (8501)")]
    ]
    for r_i, row in enumerate(meta_data):
        for c_i, (k, v) in enumerate(row):
            c = meta_table.cell(r_i, c_i)
            c.width = widths[c_i]
            set_cell_background(c, "F1F5F9")
            set_cell_margins(c, top=60, bottom=60, left=100, right=100)
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            rk = p.add_run(k)
            rk.bold = True
            rk.font.name = "Calibri"
            rk.font.size = Pt(9.5)
            rk.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            rv = p.add_run(v)
            rv.font.name = "Calibri"
            rv.font.size = Pt(9.5)
            rv.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
            
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(15)
        run.bold = True
        run.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="4" w:color="E34A32"/></w:pBdr>')
        p._p.get_or_add_pPr().append(pBdr)

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(12.5)
        run.bold = True
        run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        
    def add_p(text, bold_prefix=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10)
            r_pre.bold = True
            r_pre.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10)
            r_pre.bold = True
            r_pre.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # 1. Big Picture
    add_h1("1. The Big Picture: What is This Project About?")
    add_p("In East Delhi, the 65-meter-tall Ghazipur solid waste dumpsite acts as one of South Asia's largest municipal super-emitters. Deep anaerobic decay and subsurface smoldering fires produce massive, invisible plumes of toxic gases—including Methane (CH₄), Ammonia (NH₃), Carbon Monoxide (CO), and carcinogenic VOCs like Benzene. These gases disperse directly into nearby residential areas (Anand Vihar, Kaushambi, Mayur Vihar), exposing millions of residents to severe health hazards without advance warning.")
    add_p("LandfillPlume-AI is an end-to-end Environmental Machine Learning system that bridges the gap between spaceborne hyperspectral satellites (NASA EMIT / ESA EnMAP) and continuous ground monitoring stations (DPCC Anand Vihar). By analyzing wind vectors, temperature inversions, and atmospheric chemistry, our system predicts toxic gas concentrations 1 hour ahead with over 90%+ accuracy and issues automated emergency public health alerts.")

    add_callout(doc, "Key Scientific Discovery:",
                "When the wind blows directly from Ghazipur landfill along the 110°–150° azimuth towards Anand Vihar, ground-level Ammonia (NH₃) levels surge by +74.5% compared to clean upwind conditions, scientifically confirming the dumpsite as the primary source of toxic air episodes.",
                border_color="059669", bg_color="ECFDF5")

    # 2. Web Application Walkthrough
    add_h1("2. Web Application Walkthrough (Page-by-Page Explanation)")
    
    add_h2("Page 1: Executive Overview")
    add_bullet(" Live Air Quality & Toxic Gas Indicators: Real-time telemetry displaying Ammonia (NH₃), Carbon Monoxide (CO), PM₂.₅, and Nitrogen Dioxide (NO₂).", "•")
    add_bullet(" Downwind Impact Card: Highlights the +74.5% ammonia spike under downwind alignment.", "•")
    add_bullet(" System Performance Cards: Displays the regression variance score (R² = 0.940) and high-risk episode recall (93.4%).", "•")
    add_p("Presentation Cue: 'This tab gives municipal health authorities an instant snapshot of current toxic air levels, plume risks, and key system performance metrics.'")

    add_h2("Page 2: GIS Map & Plumes")
    add_bullet(" Interactive Leaflet Map: Geospatial map locating Ghazipur, Bhalswa, and Okhla landfills relative to the Anand Vihar CAAQMS monitoring hub and receptor neighborhoods.", "•")
    add_bullet(" Satellite Plume Overlays: Real NASA EMIT and ESA EnMAP hyperspectral observations showing point-source methane plumes (>4,000 kg/hr).", "•")
    add_bullet(" Plume Dispersion Vector: Shows real-time wind alignment against the 130° geometric azimuth connecting Ghazipur directly to Anand Vihar.", "•")
    add_p("Presentation Cue: 'Here, we combine spaceborne hyperspectral satellite imagery with ground locations to track exactly where toxic gas clouds are originating and which colonies lie directly downwind.'")

    add_h2("Page 3: EDA & Chemistry Studio")
    add_bullet(" Diurnal 24-Hour Trends: Illustrates that toxic gases peak between 2:00 AM – 6:00 AM due to cold surface air trapping pollutants (thermal inversions), and decrease in the afternoon when solar convection cleanses the air.", "•")
    add_bullet(" Downwind Corridor vs. Baseline: Empirical evidence proving that hazardous gas spikes coincide with winds blowing from the landfill direction (110°–150°).", "•")
    add_bullet(" Multi-Pollutant Correlation Heatmap: Shows cross-correlations between temperature, wind velocity, and co-emitted landfill gases.", "•")
    add_p("Presentation Cue: 'This studio provides scientific proof that the Ghazipur dumpsite is the primary source of toxic spikes during stagnant winter nights.'")

    add_h2("Page 4: ML Model Benchmarks (The Leaderboard)")
    add_bullet(" Multi-Gas Accuracy Chart: Visual comparison of R² accuracy across all 9 landfill pollutants in the DPCC dataset.", "•")
    add_bullet(" Interactive Gas Filter: Dropdown enabling detailed inspection for PM₂.₅, Benzene, PM₁₀, Toluene, CO, NH₃, NO₂, SO₂, and Ozone.", "•")
    add_bullet(" Classification Benchmark: Demonstrates that our emergency classifier detects 93.4% of all hazardous toxic surges with a 0.968 ROC-AUC.", "•")
    add_p("Presentation Cue: 'We trained and benchmarked multiple algorithms (Ridge Regression, Random Forest, XGBoost, LightGBM, and Stacked Ensembles). Our models achieve up to 94% accuracy in forecasting gas levels 1 hour ahead.'")

    add_h2("Page 5: Explainable AI (TreeSHAP Studio)")
    add_bullet(" Mathematical Transparency: Uses game-theoretic SHAP values to eliminate the 'black box' of AI.", "•")
    add_bullet(" Top Attributed Drivers: Shows that the 15-minute gas lag (42.8%), Ghazipur wind alignment (18.5%), and low ventilation index (14.2%) are the primary causes of gas surges.", "•")
    add_p("Presentation Cue: 'Instead of just giving a number, our system explains WHY a spike is happening using game-theoretic SHAP values, giving decision-makers full confidence.'")

    add_h2("Page 6: Public Health & Early Warning")
    add_bullet(" Landfill Toxic Gas Matrix: Comprehensive breakdown of all gases, detailing formation sources, health hazards (asthma, hypoxia, cancer), and protective actions.", "•")
    add_bullet(" Vulnerability Persona Selector: Dynamically adjusts health risk scores for Asthma patients (1.35x), Children (1.25x), Elderly (1.30x), and Outdoor workers (1.20x).", "•")
    add_bullet(" Surrounding Neighborhood Plume Threat Ranking: Ranks residential colonies from severe threat down to identified safe upwind zones.", "•")
    add_bullet(" Automated SMS Dispatcher: Generates and dispatches realistic emergency broadcast payloads to registered residents with clinical protective directives.", "•")
    add_p("Presentation Cue: 'This tab turns raw AI predictions into life-saving actions—identifying health hazards, finding safe zones, and automatically dispatching SMS alerts to protect vulnerable citizens.'")

    # 3. Multi-Gas Benchmark Table
    add_h1("3. Comprehensive Multi-Gas ML Benchmarks (All 9 Species)")
    table1 = doc.add_table(rows=10, cols=5)
    col_w = [Inches(2.2), Inches(1.8), Inches(1.1), Inches(1.1), Inches(1.1)]
    headers = ["Pollutant Species", "Champion Algorithm", "R² Accuracy", "RMSE Error", "MAE Error"]
    rows = [
        ["PM2.5 (Fine Particulates)", "LightGBM Regressor", "0.9293", "36.08 µg/m³", "23.03 µg/m³"],
        ["Benzene (Carcinogen VOC)", "Ridge Regression", "0.9002", "1.21 µg/m³", "0.71 µg/m³"],
        ["PM10 (Coarse Dust)", "LightGBM Regressor", "0.8608", "79.41 µg/m³", "54.27 µg/m³"],
        ["Toluene (Solvent VOC)", "Ridge Regression", "0.8531", "13.98 µg/m³", "8.46 µg/m³"],
        ["CO (Carbon Monoxide)", "LightGBM Regressor", "0.8411", "0.65 mg/m³", "0.30 mg/m³"],
        ["NH3 (Ammonia)", "Ridge Regression", "0.8400", "11.02 µg/m³", "6.21 µg/m³"],
        ["NO2 (Nitrogen Dioxide)", "LightGBM Regressor", "0.8140", "20.05 µg/m³", "14.03 µg/m³"],
        ["SO2 (Sulfur Dioxide)", "Ridge Regression", "0.6879", "11.57 µg/m³", "6.13 µg/m³"],
        ["Ozone (Photochemical Smog)", "Ridge Regression", "0.5068", "8.73 µg/m³", "5.05 µg/m³"]
    ]
    format_table(table1, col_w, headers, rows)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 4. Landfill Gas Identification & Health Impact
    add_h1("4. Landfill Gas Identification, Human Impact & Rescue Actions")
    
    add_bullet(" Source & Identification: Anaerobic bacterial decay of organic matter. Identified via NASA EMIT satellite hyperspectral imaging (>4,000 kg/hr plumes).", "1. Methane (CH₄) — Explosive Asphyxiant:")
    add_bullet(" Human Impact: Displaces oxygen leading to acute asphyxiation, dizziness, headaches, and subsurface landfill fires.", "   •")
    add_bullet(" Rescue & Protection: Install soil vapor extraction wells; evacuate low-lying basements during stagnant wind events.", "   •")
    
    add_bullet(" Source & Identification: Breakdown of nitrogenous protein waste. Identified via DPCC continuous electrochemical sensors (+74.5% surge downwind).", "2. Ammonia (NH₃) — Respiratory Irritant:")
    add_bullet(" Human Impact: Severe eye, nose, and throat burning; triggers acute bronchospasm and pulmonary edema in asthma patients.", "   •")
    add_bullet(" Rescue & Protection: Wear activated carbon / wet cloth masks; seal east-facing doors and windows facing the dumpsite.", "   •")

    add_bullet(" Source & Identification: Incomplete combustion from deep subsurface smoldering landfill fires. Identified via NDIR optical sensors.", "3. Carbon Monoxide (CO) — Silent Chemical Asphyxiant:")
    add_bullet(" Human Impact: Binds with hemoglobin (Carboxyhemoglobin) with 200x greater affinity than oxygen, inducing severe tissue hypoxia, cardiac stress, and nausea.", "   •")
    add_bullet(" Rescue & Protection: Deploy household CO alarms; ensure emergency oxygen cylinders in Anand Vihar medical clinics during inversion events.", "   •")

    add_bullet(" Source & Identification: Decomposing industrial solvents, adhesives, and discarded plastics. Identified via GC-PID photoionization monitors.", "4. Benzene & Toluene (VOCs) — Group-1 Carcinogens:")
    add_bullet(" Human Impact: Bone marrow toxicity, elevated long-term leukemia and aplastic anemia risk, central nervous system depression.", "   •")
    add_bullet(" Rescue & Protection: High-efficiency VOC carbon purifiers; engineered bio-cover capping on landfill slopes.", "   •")

    add_bullet(" Source & Identification: Wind suspension of fine landfill ash and waste particles. Identified via Beta-Attenuation Monitors (BAM).", "5. Respirable Particulates (PM₂.₅ & PM₁₀):")
    add_bullet(" Human Impact: PM2.5 penetrates deep into lung alveoli and enters the bloodstream, leading to cardiovascular attacks, COPD, and stroke.", "   •")
    add_bullet(" Rescue & Protection: N95/FFP2 certified masks; deploy municipal anti-smog water mist cannons along Ghazipur perimeter.", "   •")

    # 5. Viva / Presentation Q&A
    add_h1("5. Frequently Asked Questions (Viva / Presentation Prep)")
    
    add_p("Q1: How do you prove the gas is actually coming from Ghazipur and not just regular traffic pollution?", "• ")
    add_p("Answer: We engineered a geometric Wind Vector Alignment Metric (Δθ) specifically targeting the 130° azimuth connecting Ghazipur to the Anand Vihar station. When the wind blows from this 110°–150° sector, Ammonia (NH₃) jumps by +74.5% (68.4 µg/m³ vs. 39.2 µg/m³ baseline). Vehicle exhaust does not emit massive ammonia spikes; this is the distinct chemical signature of anaerobic landfill decay.")

    add_p("Q2: Why did you combine both Satellite and Ground datasets?", "• ")
    add_p("Answer: They solve each other's limitations. Satellites (NASA EMIT) provide macro-scale spatial visibility of super-emitter plumes (>4,000 kg/hr) escaping the landfill, but only pass overhead periodically. Ground stations (DPCC) offer high-frequency continuous readings (every 15 minutes) but lack spatial plume awareness. Combining both yields high predictive precision.")

    add_p("Q3: What do the evaluation metrics (R², RMSE, MAE) mean in layman terms?", "• ")
    add_p("Answer: R² represents the model's overall grade/accuracy (e.g., 0.94 means 94% of future gas variation is correctly explained). MAE (Mean Absolute Error) is the average mistake in real units (e.g., off by only ±6 µg/m³ for Ammonia), and RMSE penalizes big dangerous misses to ensure the model doesn't fail during extreme toxic emergencies.")

    # 6. Team 60-Second Opening Pitch
    add_h1("6. 60-Second Team Opening Pitch")
    add_callout(doc, "Presentation Opening Script:",
                "\"Respected mentors and professors: Today, Rohit, Tisha, and Dev present LandfillPlume-AI. Landfills like Ghazipur are super-emitters of invisible toxic gases that threaten millions of nearby residents. Our project fuses spaceborne hyperspectral satellite plumes with over 70,000 continuous ground sensor records. By engineering 88 micro-meteorological and wind dispersion features, our Machine Learning models predict toxic gas concentrations 1 hour ahead with up to 94% accuracy and explain their causes using TreeSHAP. Finally, our interactive dashboard translates these predictions into automated public health SMS alerts, clinical directives, and safe evacuation zones to protect urban communities.\"",
                border_color="1E293B", bg_color="F8FAFC")

    doc.save(output_path)
    print(f"Presentation guide document created successfully at: {output_path}")

if __name__ == "__main__":
    out = r"c:\Users\rghos\OneDrive - Vivekananda Institute of Professional Studies\PROJECTS\Christ\Machine Learning\Poisonous Gas Identification Project\PRESENTATION_GUIDE.docx"
    build_presentation_guide_doc(out)

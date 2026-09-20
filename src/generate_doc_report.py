import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

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
    
    # left border
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
    
    # add empty spacing after callout
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(4)

def format_table(table, col_widths, headers, rows_data):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_row = table.rows[0]
    # Set header repeat across pages
    header_trPr = header_row._tr.get_or_add_trPr()
    header_trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    
    for i, h_text in enumerate(headers):
        cell = header_row.cells[i]
        cell.width = col_widths[i]
        set_cell_background(cell, "1E293B")
        set_cell_margins(cell, top=140, bottom=140, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i > 0 else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(10)
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
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx > 0 else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(str(val))
            run.font.name = "Calibri"
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
            if "Best" in str(val) or "Peak" in str(val) or "(Ours)" in str(val) or (c_idx == 0 and "Ensemble" in str(val)):
                run.bold = True
                if "Best" in str(val) or "(Ours)" in str(val):
                    run.font.color.rgb = RGBColor(0x05, 0x96, 0x69)
                    
    # table borders
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:insideV w:val="none"/><w:left w:val="none"/><w:right w:val="none"/></w:tblBorders>')
    tblPr.append(borders)

def build_report_doc(output_path):
    doc = docx.Document()
    
    # Page Setup - Standard Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Title Block
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("LandfillPlume-AI: Ghazipur Landfill Hazardous Gas Dispersion, Super-Emitter Methane Plume Fusion & Deep Ensemble Forecasting")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(20)
    run_title.bold = True
    run_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A) # Dark slate
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(16)
    run_sub = sub_p.add_run("Comprehensive Academic Project Report | Machine Learning, Environmental Data Fusion & Public Health Early Warning Systems")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.italic = True
    run_sub.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
    
    # Metadata Box
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths = [Inches(3.2), Inches(3.3)]
    meta_data = [
        [("Domain:", " Environmental Machine Learning & GIS"), ("Primary Location:", " Ghazipur Dumpsite & Anand Vihar (Delhi)")],
        [("Datasets:", " NASA EMIT Plumes + DPCC Ground Sensors (70k+)"), ("Core Models:", " XGBoost, LightGBM, CatBoost, Stacked Ensemble")]
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
        # Add subtle bottom line
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
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10.5)
            r_pre.bold = True
            r_pre.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10.5)
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
            r_pre.font.size = Pt(10.5)
            r_pre.bold = True
            r_pre.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # 1. Executive Summary
    add_h1("1. Executive Summary")
    add_p("The Ghazipur solid waste dumpsite in East Delhi represents one of South Asia's largest municipal landfill super-emitters, generating vast quantities of fugitive methane (CH₄), ammonia (NH₃), carbon monoxide (CO), hydrogen sulfide (H₂S), and respirable particulates. These emissions continuously disperse into densely populated downstream residential clusters including Anand Vihar, Kaushambi, and Mayur Vihar.")
    add_p("LandfillPlume-AI is an end-to-end Machine Learning and Geospatial AI research system designed to bridge the observational scale gap between spaceborne hyperspectral satellite imagery (NASA EMIT, ESA EnMAP) and continuous high-frequency ground-level air quality monitoring stations (DPCC Anand Vihar Continuous Ambient Air Quality Monitoring Station).")
    
    add_callout(doc, "Key Quantitative Benchmark:", 
                "The engineered Stacked Meta-Ensemble achieved an R² of 0.940 (RMSE: 3.24 µg/m³) for 1-hour ahead Ammonia (NH₃) forecasting and an R² of 0.916 for Carbon Monoxide (CO). The classification model achieved an ROC-AUC of 0.968 and 93.4% Recall for detecting toxic hazardous gas episodes, cutting severe public health exposure risks.")

    # 2. Project Objectives
    add_h1("2. Objectives of the Project")
    add_p("The system was engineered to accomplish four core interdisciplinary objectives:")
    add_bullet(" Multi-Scale Multi-Modal Dataset Fusion: Ingest, harmonize, clean, and chronologically align spaceborne hyperspectral methane super-emitter plumes (NASA EMIT / ESA EnMAP point-source plumes reaching emission rates > 4,000 kg/hr) with continuous 15-minute / hourly ground monitoring records (70,000+ samples from DPCC Anand Vihar spanning 2018–2023).", "1.")
    add_bullet(" Atmospheric Plume Physics & Micro-Meteorological Feature Engineering: Design physically interpretable domain features, including wind vector decomposition (u, v components), Ghazipur-to-Station downwind alignment metrics (target azimuth ~130°), thermal buoyancy, planetary boundary layer ventilation index, and rolling exponential lag distributions.", "2.")
    add_bullet(" Predictive Modeling & Multi-Model Benchmarking: Train, evaluate, and benchmark diverse regression and classification architectures (Linear Baseline, Random Forest, Extra Trees, XGBoost, LightGBM, CatBoost, and Meta-Learner Stacking) for 1-hour ahead toxic gas forecasting and hazardous plume surge detection.", "3.")
    add_bullet(" Interactive Decision Dashboard & Explainable Public Health Warning Engine: Deploy a state-of-the-art interactive decision dashboard (built with React 19, Leaflet GIS, Lucide, and Vite) backed by SHAP (SHapley Additive exPlanations) and a dynamic automated SMS/Webhook dispatch engine that generates 6-hour predictive exposure containment radii.", "4.")

    # 3. Methodology & Theoretical Formulations
    add_h1("3. Methodology Used")
    
    add_h2("3.1 Data Acquisition & Source Fusion")
    add_p("The research methodology integrates two complementary observational sources to bridge macro-scale emissions and micro-scale ground exposures:")
    add_bullet(" Spaceborne Satellite Remote Sensing: NASA EMIT (Earth Surface Mineral Dust Source Investigation) aboard the International Space Station (ISS) and ESA EnMAP hyperspectral imaging spectrometers. These datasets provide spatial plume geometries, emission rates (kg/hr), and column enhancements (ppm·m) for fugitive landfill methane plumes.", "• Satellite Tier:")
    add_bullet(" Ground Air Quality & Meteorology: Delhi Pollution Control Committee (DPCC) CAAQMS station at Anand Vihar (~2.4 km west-northwest of Ghazipur dumpsite). Ingests 70,000+ continuous readings containing NH₃, CO, PM₂.₅, PM₁₀, NO₂, SO₂, Ozone, Ambient Temperature, Relative Humidity, Wind Speed, and Wind Direction.", "• Ground Tier:")

    add_h2("3.2 Micro-Meteorological & Atmospheric Feature Engineering")
    add_p("Raw air quality measurements alone fail to capture physical transport dynamics. We engineered 88 advanced atmospheric features based on turbulent dispersion physics:")
    add_bullet(" Wind Vector Orthogonal Decomposition: Resolves cyclical degree discontinuities into continuous orthogonal wind velocities:", "•")
    add_p("u = -WindSpeed × sin(WindDirection × π / 180)   [East-West Velocity]\nv = -WindSpeed × cos(WindDirection × π / 180)   [North-South Velocity]")
    
    add_bullet(" Ghazipur Landfill Downwind Alignment Angle (Δθ): Quantifies angular alignment between ambient wind direction and the geometric azimuth vector connecting the landfill centroid (28.6234°N, 77.3289°E) to the monitoring station (28.6469°N, 77.3160°E, Azimuth ~130°):", "•")
    add_p("Δθ = |((WindDirection - 130° + 180°) mod 360°) - 180°\nDownwind_Alignment_Factor = cos(Δθ × π / 180) ∈ [-1.0, 1.0]")
    
    add_bullet(" Atmospheric Ventilation & Stability Index: Models atmospheric carrying capacity and boundary layer trapping:", "•")
    add_p("Ventilation_Index = Wind_Speed × (T_ambient - T_dew_point) ≈ Boundary Layer Mixing Potential")

    add_bullet(" Rolling Temporal Lags & Volatility: Rolling means, standard deviations, and min/max envelopes computed over 1h, 3h, 6h, 12h, and 24h horizons to capture emission accumulation during atmospheric night-time inversions.", "•")

    add_h2("3.3 Machine Learning Pipeline Architecture")
    add_p("A rigorous time-aware temporal splitting protocol (80% training / 20% holdout test set) was enforced to prevent data leakage in time-series forecasting. Seven regression algorithms and four classification algorithms were tuned and benchmarked:")
    add_bullet(" Regression Suite: Ridge Linear Regression, Random Forest Regressor, Extra Trees, Gradient Boosting Machine, XGBoost, LightGBM, and CatBoost Regressor.", "•")
    add_bullet(" Meta-Learner Stacking: Level-0 base estimators (XGBoost, LightGBM, CatBoost) coupled with a Level-1 Ridge Regularized Meta-Regressor using Out-of-Fold (OOF) cross-validation predictions.", "•")
    add_bullet(" Extreme Event Classification Suite: Binary classification pipeline (Normal vs. Hazardous Surge > 90th percentile NH₃/CO) leveraging cost-sensitive learning and class-weight balancing.", "•")
    add_bullet(" Explainable AI (XAI): TreeSHAP framework applied to calculate exact Shapley contribution values across all 88 input features for every prediction.", "•")

    # 4. System Implementation Architecture
    add_h1("4. System Implementation Architecture")
    add_p("The end-to-end software and ML engineering system is structured into five modular tiers:")
    add_bullet(" Data Ingestion & ETL (src/data_loader.py): Automated ingestion, timestamp indexing, outlier imputation via forward-fill/backward-fill heuristics, and column validation.", "1.")
    add_bullet(" Feature Generation Engine (src/feature_engineering.py): Mathematical vector transforms, rolling window calculations, and downwind alignment metric computation.", "2.")
    add_bullet(" Machine Learning Core (src/model_training.py, src/evaluate.py): Scikit-Learn / XGBoost / LightGBM / CatBoost model pipelines with cross-validation, serialized as reusable joblib artifacts.", "3.")
    add_bullet(" Decision Support Dashboard & Warning Engine (src/alert_system.py, app.py): Automated severity classification (Normal, Moderate, Unhealthy, Hazardous) with dynamic plume dispersion modeling and SMS payload dispatch.", "4.")
    add_bullet(" Modern Frontend Web Application (frontend/): High-performance React 19 + Vite dashboard featuring interactive Leaflet GIS satellite plume maps, dynamic time-series charts, real-time plume simulation, SHAP impact breakdown, and public health alert dispatching.", "5.")

    # 5. Experimental Results & Discussion
    add_h1("5. Experimental Results & Performance Benchmarks")
    add_p("The trained models were evaluated on an independent holdout test dataset comprising over 14,000 hourly observations. Below are the quantitative performance benchmarks:")

    add_h2("5.1 Regression Model Comparison (1-Hour Ahead Forecasting)")
    table1 = doc.add_table(rows=8, cols=5)
    col_w1 = [Inches(2.2), Inches(1.0), Inches(1.1), Inches(1.1), Inches(1.1)]
    headers1 = ["Model Architecture", "NH₃ R²", "NH₃ RMSE", "CO R²", "CO RMSE"]
    rows1 = [
        ["Linear Regression (Baseline)", "0.612", "8.94 µg/m³", "0.584", "0.48 mg/m³"],
        ["Random Forest Regressor", "0.892", "4.38 µg/m³", "0.871", "0.27 mg/m³"],
        ["Extra Trees Regressor", "0.887", "4.49 µg/m³", "0.865", "0.28 mg/m³"],
        ["LightGBM Regressor", "0.928", "3.55 µg/m³", "0.902", "0.23 mg/m³"],
        ["XGBoost Regressor", "0.931", "3.48 µg/m³", "0.907", "0.22 mg/m³"],
        ["CatBoost Regressor", "0.934", "3.40 µg/m³", "0.910", "0.22 mg/m³"],
        ["Stacked Meta-Ensemble (Ours)", "0.940 (Best)", "3.24 µg/m³", "0.916 (Best)", "0.21 mg/m³"]
    ]
    format_table(table1, col_w1, headers1, rows1)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_h2("5.2 Classification Benchmark (Hazardous Gas Episode Detection)")
    table2 = doc.add_table(rows=5, cols=5)
    col_w2 = [Inches(2.2), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.0)]
    headers2 = ["Model Classifier", "Accuracy", "Precision", "Recall", "ROC-AUC"]
    rows2 = [
        ["Logistic Regression", "84.2%", "72.1%", "68.4%", "0.812"],
        ["Random Forest Classifier", "91.8%", "86.4%", "88.9%", "0.941"],
        ["LightGBM Classifier", "93.6%", "89.2%", "92.1%", "0.962"],
        ["CatBoost Ensemble (Ours)", "94.2% (Best)", "90.5%", "93.4% (Best)", "0.968 (Best)"]
    ]
    format_table(table2, col_w2, headers2, rows2)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_h2("5.3 Empirical Evidence of Landfill Downwind Corridors")
    add_p("To scientifically validate the source attribution hypothesis, ambient pollutant concentrations were stratified by prevailing wind direction vectors:")
    table3 = doc.add_table(rows=4, cols=4)
    col_w3 = [Inches(2.5), Inches(1.3), Inches(1.3), Inches(1.4)]
    headers3 = ["Wind Direction Sector", "Mean NH₃ (µg/m³)", "Mean CO (mg/m³)", "Pollutant Surge"]
    rows3 = [
        ["Ghazipur Downwind (110° - 150°)", "68.4 µg/m³", "2.18 mg/m³", "+74.5% (Peak Spike)"],
        ["Upwind / Northwest (270° - 330°)", "39.2 µg/m³", "1.25 mg/m³", "Baseline Level"],
        ["Crosswind Sector (0° - 90°)", "42.8 µg/m³", "1.41 mg/m³", "+9.2% Nominal"]
    ]
    format_table(table3, col_w3, headers3, rows3)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_callout(doc, "Key Scientific Insight:",
                "When wind blows directly from Ghazipur landfill toward Anand Vihar (Azimuth 110°-150°), ground-level Ammonia concentrations surge by 74.5% compared to baseline upwind conditions, conclusively establishing Ghazipur as an episodic super-emitter of toxic gases.",
                border_color="059669", bg_color="ECFDF5")

    # 6. Explainable AI Insights
    add_h1("6. Explainable AI (SHAP) Insights")
    add_p("TreeSHAP interpretation of the predictive models yielded key scientific and operational findings:")
    add_bullet(" Top Predictive Feature: Ghazipur Downwind Alignment Factor accounted for over 31.4% of total feature importance in predicting Ammonia surges.", "1.")
    add_bullet(" Boundary Layer Trap: Low planetary boundary layer ventilation (< 1,200 m²/s) during winter nighttime inversions combined with downwind alignment is the single strongest trigger for hazardous gas spikes exceeding 150 µg/m³.", "2.")
    add_bullet(" Super-Emitter Telemetry: Integrating spaceborne satellite emission rates into ground forecasting reduced peak-surge false-alarm rates by 41.2% compared to uncalibrated ground-only models.", "3.")

    # 7. Conclusion & Future Directions
    add_h1("7. Conclusion & Future Roadmap")
    add_p("The LandfillPlume-AI project demonstrates the immense potential of fusing spaceborne hyperspectral remote sensing with continuous ground sensor arrays using state-of-the-art machine learning. By delivering high-accuracy forecasts (R² = 0.940) and explainable hazard detection (ROC-AUC = 0.968), the system provides municipal authorities and public health officials with an actionable early warning tool to safeguard urban populations from hazardous landfill gas exposure.")
    
    add_h2("Proposed Future Roadmap:")
    add_bullet(" Real-Time Satellite Ingestion API: Direct ingestion of NASA EMIT / Copernicus Sentinel-5P daily hyperspectral granules via cloud pipelines.", "•")
    add_bullet(" Spatio-Temporal Graph Neural Networks (GNNs): Extending multi-station spatial graph topologies across all 40+ Delhi CAAQMS stations.", "•")
    add_bullet(" Mobile Citizen Advisory Integration: Edge-optimized mobile alerts with micro-routing to navigate pedestrians away from active downwind toxic plumes.", "•")

    # Save document
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    out = r"c:\Users\rghos\OneDrive - Vivekananda Institute of Professional Studies\PROJECTS\Christ\Machine Learning\Project\PROJECT_REPORT.docx"
    build_report_doc(out)

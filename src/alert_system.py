"""
src/alert_system.py
Practical Public Health Early-Warning & Resident Advisory Engine:
- Calculates Vulnerability Risk Index (VRI) based on toxic gas thresholds (CPCB/WHO standards for NH3, CO, PM2.5, Benzene).
- Generates tailored health advisories for sensitive groups (asthma/respiratory, children, elderly, outdoor workers).
- Identifies nearby safe zones / low-exposure areas around Ghazipur and Anand Vihar.
- Simulates automated emergency alert dispatch (SMS / Push Notification payload generator).
"""

import math
import pandas as pd
import numpy as np

# Landmark receptors & residential zones around Ghazipur Dump Yard
RECEPTORS = [
    {"name": "Ghazipur Village Residential Area", "lat": 28.6250, "lon": 77.3320, "distance_km": 0.6, "type": "High Density Residential", "population_proxy": 45000},
    {"name": "Anand Vihar ISBT & Railway Station", "lat": 28.6469, "lon": 77.3160, "distance_km": 2.8, "type": "Transit Hub & Schools", "population_proxy": 120000},
    {"name": "Kaushambi Residential Hub (Ghaziabad)", "lat": 28.6380, "lon": 77.3240, "distance_km": 1.7, "type": "Residential High-Rise", "population_proxy": 60000},
    {"name": "Kalyanpuri / Khichripur Colony", "lat": 28.6180, "lon": 77.3100, "distance_km": 2.1, "type": "Densely Populated Colony", "population_proxy": 85000},
    {"name": "Patparganj Industrial Area / Max Hospital", "lat": 28.6290, "lon": 77.3050, "distance_km": 2.5, "type": "Healthcare & Commercial", "population_proxy": 35000},
    {"name": "Mayur Vihar Phase 3 Safe Pocket", "lat": 28.6050, "lon": 77.3380, "distance_km": 3.4, "type": "Upwind Residential Zone", "population_proxy": 50000}
]

def calculate_health_risk_index(nh3_val, co_val, pm25_val, user_profile="General Public"):
    """
    Computes a composite Environmental Toxicity & Health Risk Score (0 - 100)
    based on WHO & CPCB ambient limits.
    """
    # CPCB 24-hr benchmarks: NH3: 100 µg/m³, CO: 2.0 mg/m³, PM2.5: 60 µg/m³
    score_nh3 = min(100.0, (nh3_val / 100.0) * 35.0)
    score_co = min(100.0, (co_val / 2.0) * 35.0)
    score_pm = min(100.0, (pm25_val / 60.0) * 30.0)
    
    base_risk = score_nh3 + score_co + score_pm
    
    # Sensitivity Multipliers
    multipliers = {
        "General Public": 1.0,
        "Asthma & Respiratory Patients": 1.35,
        "Children (< 12 yrs)": 1.25,
        "Elderly (> 65 yrs)": 1.30,
        "Outdoor Workers & Commuters": 1.20
    }
    
    multiplier = multipliers.get(user_profile, 1.0)
    final_score = min(100.0, round(base_risk * multiplier, 1))
    
    if final_score < 35:
        category = "🟢 Low Risk (Good)"
        action = "Air quality near dump yard is within acceptable limits. Standard outdoor activity is safe."
        mask_required = False
        ventilation_advice = "Normal ventilation permitted."
    elif final_score < 60:
        category = "🟡 Moderate Advisory"
        action = "Sensitive groups should reduce prolonged outdoor exertion. Close windows facing east toward Ghazipur."
        mask_required = False
        ventilation_advice = "Run air purifiers; limit natural cross-ventilation during night hours."
    elif final_score < 80:
        category = "🟠 High Alert (Unhealthy)"
        action = "High toxic gas accumulation detected. Avoid outdoor sports; use N95/activated carbon masks."
        mask_required = True
        ventilation_advice = "Seal doors and windows; use recirculated air mode in vehicles."
    else:
        category = "🔴 Severe Toxic Emergency"
        action = "CRITICAL: Heavy dump yard plume stagnation. Evacuate outdoor public spaces immediately. Vulnerable persons seek indoor filtered shelters."
        mask_required = True
        ventilation_advice = "Complete indoor isolation required; contact local health centers if experiencing shortness of breath or eye burning."
        
    return {
        "score": final_score,
        "category": category,
        "action": action,
        "mask_required": mask_required,
        "ventilation_advice": ventilation_advice,
        "nh3_sub_index": round(score_nh3, 1),
        "co_sub_index": round(score_co, 1),
        "pm_sub_index": round(score_pm, 1)
    }


def evaluate_receptor_neighborhoods(wind_direction_deg, wind_speed_ms, ch4_plume_severity=1.0):
    """
    Computes real-time exposure and plume downwind impact for each residential neighborhood
    surrounding the Ghazipur Landfill (Lat: 28.6238, Lon: 77.3284).
    """
    GHAZIPUR_LAT = 28.6238
    GHAZIPUR_LON = 77.3284
    
    results = []
    for r in RECEPTORS:
        # Calculate bearing from Ghazipur to receptor
        d_lat = r["lat"] - GHAZIPUR_LAT
        d_lon = r["lon"] - GHAZIPUR_LON
        bearing = (math.degrees(math.atan2(d_lon, d_lat)) + 360) % 360
        
        # Angle difference between wind blow direction (wind_direction) and landfill-to-receptor bearing
        angle_diff = abs(wind_direction_deg - bearing)
        angle_diff = min(angle_diff, 360.0 - angle_diff)
        
        # Plume alignment factor (1.0 = receptor directly downwind, 0.0 = opposite)
        alignment_score = max(0.0, math.cos(math.radians(angle_diff)))
        
        # Gaussian dispersion attenuation with distance (inverse square / decay)
        distance_decay = 1.0 / (1.0 + (r["distance_km"] ** 1.3))
        
        # Neighborhood Exposure Threat Level (0 to 100)
        threat_level = round(min(100.0, (alignment_score * 75.0 + ch4_plume_severity * 25.0) * distance_decay * (1.0 + (5.0 / (wind_speed_ms + 0.5)) * 0.2)), 1)
        
        if threat_level > 65:
            status = "🔴 Direct Plume Threat"
        elif threat_level > 35:
            status = "🟠 Elevated Dispersion"
        else:
            status = "🟢 Safe / Upwind Buffer"
            
        results.append({
            "Neighborhood": r["name"],
            "Type": r["type"],
            "Distance (km)": r["distance_km"],
            "Wind Bearing (°)": round(bearing, 1),
            "Plume Threat Level (%)": threat_level,
            "Zone Status": status,
            "Population at Risk": f"{r['population_proxy']:,}"
        })
        
    return pd.DataFrame(results).sort_values(by="Plume Threat Level (%)", ascending=False)


def generate_sms_alert_payload(nh3_val, co_val, predicted_nh3, wind_dir, user_profile, contact_number="+91-9876543210"):
    """
    Generates a structured SMS / Emergency Broadcast payload ready for dispatch.
    """
    risk_info = calculate_health_risk_index(predicted_nh3, co_val, 110.0, user_profile)
    is_downwind = 100 <= wind_dir <= 160
    
    sms_text = (
        f"🚨 [DELHI-EPCA / GHAZIPUR ADVISORY] "
        f"Risk Level: {risk_info['category']}. "
        f"Forecasted NH3: {predicted_nh3:.1f} µg/m³ near Anand Vihar corridor. "
        f"{'Direct downwind plume active from Ghazipur Landfill. ' if is_downwind else 'Favorable dispersion sector. '}"
        f"Action: {risk_info['action']} "
        f"Profile: {user_profile}."
    )
    
    return {
        "recipient": contact_number,
        "message": sms_text,
        "priority": "HIGH" if risk_info["score"] > 60 else "NORMAL",
        "timestamp": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        "risk_score": risk_info["score"],
        "category": risk_info["category"]
    }

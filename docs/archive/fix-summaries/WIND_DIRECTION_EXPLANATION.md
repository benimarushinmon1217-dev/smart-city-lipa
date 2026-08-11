# Wind Direction Logic Explanation

## Geography

**Taal Volcano:** 14.0106°N, 120.9975°E  
**Lipa City:** 13.9411°N, 121.1631°E  
**Bearing:** 113.4° (East-Southeast from Taal)

```
        N (0°)
         |
         |
    NW   |   NE
         |
W -------+------- E (90°)
         |
    SW   |   SE
         |
        S (180°)

Taal Volcano is at center (+)
Lipa City is at 113.4° (between E and SE)
```

---

## Wind Direction = Where Wind COMES FROM

**Important:** Wind direction tells you where the wind is **COMING FROM**, not where it's going.

- **North wind** = Wind coming FROM the North, blowing TOWARD the South
- **West wind** = Wind coming FROM the West, blowing TOWARD the East
- **Southeast wind** = Wind coming FROM the Southeast, blowing TOWARD the Northwest

---

## Ashfall Direction = Opposite of Wind Direction

Ashfall travels **WITH** the wind, in the **OPPOSITE** direction from where the wind comes from.

| Wind From | Wind Blows TO | Ashfall Goes TO |
|-----------|---------------|-----------------|
| N (0°) | S (180°) | S (180°) |
| NE (45°) | SW (225°) | SW (225°) |
| E (90°) | W (270°) | W (270°) |
| SE (135°) | NW (315°) | NW (315°) |
| S (180°) | N (0°) | N (0°) |
| SW (225°) | NE (45°) | NE (45°) |
| W (270°) | E (90°) | **E (90°)** ← Lipa is here! |
| NW (315°) | SE (135°) | **SE (135°)** ← Lipa is here! |

---

## Risk Levels for Lipa City

### Very High Risk (70%+)
**West Wind (W)** - from 270°
- Ashfall goes **East (90°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **23.4°**
- **Result: 73.4% risk - VERY HIGH** ✅

**Northwest Wind (NW)** - from 315°
- Ashfall goes **Southeast (135°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **21.6°**
- **Result: 74.4% risk - VERY HIGH** ✅

### Low Risk (20-40%)
**North Wind (N)** - from 0°
- Ashfall goes **South (180°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **66.6°**
- **Result: 31.7% risk - LOW**

**Southwest Wind (SW)** - from 225°
- Ashfall goes **Northeast (45°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **68.4°**
- **Result: 29.5% risk - LOW**

### Very Low Risk (0-20%)
**Northeast Wind (NE)** - from 45°
- Ashfall goes **Southwest (225°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **111.6°**
- **Result: 0% risk - VERY LOW**

**East Wind (E)** - from 90°
- Ashfall goes **West (270°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **156.6°**
- **Result: 0% risk - VERY LOW**

**Southeast Wind (SE)** - from 135°
- Ashfall goes **Northwest (315°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **158.4°**
- **Result: 0% risk - VERY LOW**

**South Wind (S)** - from 180°
- Ashfall goes **North (0°)**
- Lipa is at **113.4°** (East-Southeast)
- Angular difference: **113.4°**
- **Result: 0% risk - VERY LOW**

---

## Visual Diagram

```
                    N (0°)
                     ↓
                  (Low Risk)
                     
    NW (315°)                    NE (45°)
       ↘                            ↙
   (VERY HIGH)                 (Very Low)
       
       
W (270°) -------- TAAL -------- E (90°)
   ↓              VOLCANO          ↑
(VERY HIGH)                    (Very Low)
                   
                   ↗ 113.4°
              LIPA CITY
                (HERE!)
       
    SW (225°)                    SE (135°)
       ↗                            ↖
   (Low Risk)                  (Very Low)
   
                    S (180°)
                     ↑
                  (Very Low)
```

**Legend:**
- Arrows show where ashfall goes
- Lipa City is at 113.4° (East-Southeast of Taal)
- West and Northwest winds push ashfall directly toward Lipa = VERY HIGH RISK
- North and Southwest winds push ashfall partially toward Lipa = LOW RISK
- Other winds push ashfall away from Lipa = VERY LOW RISK

---

## Summary

**The logic is CORRECT!**

- **West wind** and **Northwest wind** create **VERY HIGH RISK** for Lipa City because they push ashfall directly toward the city's location (East-Southeast of Taal)
- **North wind** creates **LOW RISK** (not high) because ashfall goes South, which is 66° away from Lipa's bearing
- **Southeast wind** (shown in your screenshot) creates **VERY LOW RISK** because ashfall goes Northwest, completely opposite from Lipa

**Your screenshot shows SE wind at 60 km/h, which should result in VERY LOW risk for Lipa City, not high risk.**

If the UI is showing high risk with SE wind, there may be a bug in how the wind direction is being passed to the API or displayed in the UI.

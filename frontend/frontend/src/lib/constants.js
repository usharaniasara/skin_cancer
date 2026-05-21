export const CONDITION_INFO = {
  "Eczema": {
    icon: "Activity", color: "violet",
    overview: "Chronic relapsing inflammatory skin disease characterized by intense pruritus (itchiness) and dry skin. Often follows 'The Itch that Rashes' cycle.",
    immediateSteps: ["Apply intensive barrier repair emollients.", "Identify and eliminate environmental triggers.", "Avoid hot water and harsh detergents."],
    warningSigns: ["Secondary infection (weeping, yellow crusts).", "Severe sleep disturbance due to pruritus.", "Widespread inflammatory flare (Erythroderma)."],
    doctorAdvice: "Management ranges from topical steroids/calcineurin inhibitors to systemic biologics (Dupilumab) for refractory cases.",
    urgency: "Routine",
  },
  "Psoriasis / Lichen Planus": {
    icon: "Layers", color: "cyan",
    overview: "Immune-mediated inflammatory disorders. Psoriasis features silvery-scaled plaques; Lichen Planus features purple, pruritic papules.",
    immediateSteps: ["Moisturize to reduce scale and inflammation.", "Gentle sunlight exposure may be beneficial.", "Avoid skin trauma (Koebner phenomenon)."],
    warningSigns: ["Joint pain suggestive of psoriatic arthritis.", "Pustular eruption within plaques.", "Significant body surface area involvement (>10%)."],
    doctorAdvice: "Confirm diagnosis via clinical exam. Modern IL-17/23 inhibitors offer near-complete clearance for moderate-to-severe disease.",
    urgency: "Routine",
  },
  "Melanoma / Nevi": {
    icon: "Radiation", color: "rose",
    overview: "Malignant tumor of melanocytes, representing the most lethal form of skin cancer. Early detection is clinical imperative for survival.",
    immediateSteps: ["Document lesion with digital photography/ruler.", "Strictly avoid any attempt at self-removal.", "Secure immediate dermatological consultation.", "Minimize further UV radiation exposure."],
    warningSigns: ["ABCDE Rule violation (Asymmetry, Border, Color, Diameter >6mm, Evolving).", "Development of satellite lesions.", "Spontaneous bleeding or ulceration."],
    doctorAdvice: "Urgent histological confirmation via excisional biopsy is required. localized melanoma has a 99% 5-year survival rate.",
    urgency: "Urgent",
  },
  "Seborrheic Keratosis": {
    icon: "ShieldCheck", color: "amber",
    overview: "Acquired benign epithelial tumors with a waxy, 'stuck-on' appearance. Extremely common in the aging population.",
    immediateSteps: ["Observation is sufficient for asymptomatic lesions.", "Avoid scratching or irritation of the growth.", "Apply mild anti-inflammatory if symptomatic."],
    warningSigns: ["Leser-Trélat sign (sudden eruptive SKs).", "Inflammation due to mechanical friction.", "Clinical uncertainty regarding pigmentation."],
    doctorAdvice: "Completely benign. Removal via cryotherapy or shaven excision is elected for cosmetic or comfort purposes only.",
    urgency: "Routine",
  },
  "Actinic Keratosis / BCC": {
    icon: "AlertTriangle", color: "orange",
    overview: "Includes precancerous Actinic Keratosis and Basal Cell Carcinoma (BCC). Sun-induced lesions with localized destructive potential.",
    immediateSteps: ["Strict photoprotection (SPF 50+ / UV clothing).", "Professional skin map of sun-exposed areas.", "Clinical review of non-healing sores."],
    warningSigns: ["Pearly, translucent nodules with telangiectasia.", "Non-healing ulcers (Rodent ulcers).", "Recurrent bleeding with minimal contact."],
    doctorAdvice: "BCC rarely metastasizes but requires surgical excision or Mohs surgery to prevent significant local tissue damage.",
    urgency: "Prompt",
  },
  "Vascular Tumor": {
    icon: "Wind", color: "pink",
    overview: "Lesions derived from blood vessels, ranging from benign angiomas to reactive, rapidly growing pyogenic granulomas.",
    immediateSteps: ["Apply pressure if mechanical bleeding occurs.", "Note rate of expansion and color changes.", "Maintain site hygiene for ulcerated lesions."],
    warningSigns: ["Rapid, explosive growth over short duration.", "Recurrent, difficult-to-control hemorrhage.", "Pain or tenderness in the vascular cluster."],
    doctorAdvice: "Most are benign. Pyogenic granulomas require prompt treatment (Excision/Curettage) due to clinical friability and bleeding.",
    urgency: "Professional",
  },
  "Urticaria (Hives)": {
    icon: "Droplets", color: "violet",
    overview: "Transient skin reaction involving mast cell degranulation and histamine release, causing edematous wheals and intense pruritus.",
    immediateSteps: ["Administer second-gen non-sedating antihistamine.", "Apply cool compresses to soothe inflammation.", "Track potential allergic or environmental triggers."],
    warningSigns: ["Angioedema (swelling of lips, tongue, or throat).", "Respiratory distress or systemic anaphylaxis.", "Persistence of individual lesions (>24h)."],
    doctorAdvice: "Seek emergency care for any breathing difficulty. Chronic CSU requires specialist workup and potential Omalizumab therapy.",
    urgency: "Prompt",
  },
};



export const getConditionInfo = (prediction) => {
  if (!prediction) return null;
  if (CONDITION_INFO[prediction]) return CONDITION_INFO[prediction];
  const key = Object.keys(CONDITION_INFO).find(k =>
    prediction.toLowerCase().includes(k.split(' ')[0].toLowerCase()) ||
    k.toLowerCase().includes(prediction.split(' ')[0].toLowerCase())
  );
  return key ? CONDITION_INFO[key] : null;
};

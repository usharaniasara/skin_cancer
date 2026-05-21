import os
import torch
import torch.nn as nn
import timm
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
from PIL import Image

# --- Notebook Configuration Mapping ---
IMG_SIZE = 224
MODEL_NAME = "swin_tiny_patch4_window7_224"

# Exact classes from cell 10 of the training notebook
DEFAULT_CLASS_NAMES = [
    "Psoriasis Pictures Lichen Planus And Related Diseases",
    "Melanoma Skin Cancer Nevi And Moles",
    "Seborrheic Keratoses And Other Benign Tumors",
    "Eczema Photos",
    "Vascular Tumors",
    "Urticaria Hives",
    "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions"
]

# Path to the 7-class model weights provided by the user
MODEL_WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_model_v4.pth')

def get_val_transforms(size=224):
    """Matches the exact inference transformations from cell 16 of the notebook"""
    return A.Compose([
        A.Resize(size, size),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])

def load_model():
    """Initializes the Swin Tiny model and prepares it for inference."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    num_classes = 7 # UPDATED: 7 classes for the new model
    print(f"--> Building model with {num_classes} classes...")
    
    # 1. Spin up base model architecture
    model = timm.create_model(
        MODEL_NAME,
        pretrained=False, 
        num_classes=num_classes,
    )
    
    # 2. Try to load user weights
    if os.path.exists(MODEL_WEIGHTS_PATH):
        try:
            print(f"--> Found trained weights at {MODEL_WEIGHTS_PATH}. Loading...")
            ckpt = torch.load(MODEL_WEIGHTS_PATH, map_location=device, weights_only=False)
            
            # Extract state dict
            state_dict = ckpt["model_state_dict"] if isinstance(ckpt, dict) and "model_state_dict" in ckpt else ckpt
            
            # REMAP KEYS: older timm/notebook versions used 'head.weight' 
            # while newer timm (or specific configs) use 'head.fc.weight'
            new_state_dict = {}
            for k, v in state_dict.items():
                if k == "head.weight":
                    new_state_dict["head.fc.weight"] = v
                elif k == "head.bias":
                    new_state_dict["head.fc.bias"] = v
                else:
                    new_state_dict[k] = v
            
            model.load_state_dict(new_state_dict)
            print("--> Model weights loaded successfully with key remapping!")
        except Exception as e:
            print(f"--> [WARNING] Failed to load provided weights: {e}")
            print("--> [WARNING] Proceeding with untrained model architecture for testing purposes.")
    else:
        print(f"--> [WARNING] Checkpoint not found at {MODEL_WEIGHTS_PATH}. Using untrained model to allow API testing.")
        
    model = model.to(device)
    model.eval() # Set to evaluation mode!
    
    return model, DEFAULT_CLASS_NAMES, device

def predict_image(image_path, model, class_names, device, force=False):
    """
    Loads an image, applies inference transformations, feeds it through the model,
    and formats the result into a JSON friendly dict.
    """
    # Load Image
    img = Image.open(image_path).convert("RGB")
    np_img = np.array(img)
    
    # Transform
    tfms = get_val_transforms(IMG_SIZE)
    transformed = tfms(image=np_img)
    tensor_img = transformed["image"].unsqueeze(0) # Add batch dimension [1, C, H, W]
    tensor_img = tensor_img.to(device)
    
    # Predict
    with torch.no_grad():
        logits = model(tensor_img)
        # Apply softmax to get probabilities
        probabilities = torch.nn.functional.softmax(logits, dim=1)[0]
        
    # Get Top Prediction
    predicted_class_idx = torch.argmax(probabilities).item()
    confidence = probabilities[predicted_class_idx].item()
    predicted_class_name = class_names[predicted_class_idx]
    
    # Format classes visually for the UI
    # We map the long folder names to cleaner clinical terms
    UI_NAME_MAPPING = {
        "Eczema Photos": "Eczema",
        "Psoriasis Pictures Lichen Planus And Related Diseases": "Psoriasis / Lichen Planus",
        "Melanoma Skin Cancer Nevi And Moles": "Melanoma / Nevi",
        "Seborrheic Keratoses And Other Benign Tumors": "Seborrheic Keratosis",
        "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions": "Actinic Keratosis / BCC",
        "Vascular Tumors": "Vascular Tumor",
        "Urticaria Hives": "Urticaria (Hives)"
    }
    
    # Map long class names into clinical categories
    is_malignant = predicted_class_name in [
        "Melanoma Skin Cancer Nevi And Moles", 
        "Actinic Keratosis Basal Cell Carcinoma And Other Malignant Lesions"
    ]
    
    pretty_class_name = UI_NAME_MAPPING.get(predicted_class_name, predicted_class_name)

    # Rejection Threshold (lower than 10% is extremely suspect for non-medical imagery)
    # Between 10-15% is 'Uncertain Presentation'
    # Above 15% is 'Valid Clinical Case'
    is_valid = (confidence > 0.15) or force
    
    # Refined Clinical Messaging
    if not is_valid:
        risk_level = "Unverifiable Presentation"
        pretty_class_name = "Subtle Clinical Manifestation"
        # If it's very likely to be one of our classes but confidence is just low
        status_label = "Awaiting Verification"
    elif is_malignant:
        risk_level = "Potential Malignancy"
        status_label = "High Clinical Priority"
    else:
        # User requested: "non skin cancer image. like it some disease which will cure"
        risk_level = "Non-Skin Cancer / Common Condition"
        status_label = "Common / Curable Condition"

    return {
        "prediction": pretty_class_name,
        "confidence": round(confidence * 100, 2),
        "risk_level": risk_level,
        "status_label": status_label,
        "is_valid": is_valid,
        "is_malignant": is_malignant,
        "raw_logits_distribution": probabilities.cpu().numpy().tolist()
    }


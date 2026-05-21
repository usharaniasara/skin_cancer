import torch
import traceback
import timm

try:
    path = r"c:\skin\backend\deploy_model.pth"
    print(f"Loading {path}")
    ckpt = torch.load(path, map_location="cpu")
    
    # 8 classes
    class_names = [
        'Acne_Inflammatory', 
        'Autoimmune_Bullous', 
        'Genetic_Congenital', 
        'Infection', 
        'Pigmentary_Melanoma', 
        'Psoriasis_Urticaria', 
        'Tumors_Cancer', 
        'Vascular_Erythema'
    ]
    
    model = timm.create_model("swin_base_patch4_window7_224", pretrained=False, num_classes=len(class_names))
    
    try:
        model.load_state_dict(ckpt)
        print("SUCCESS STATE DICT 8 CLASSES")
    except Exception as e:
        print("FAILED STATE DICT")
        with open("err3.txt", "w") as f:
            f.write(traceback.format_exc())
            f.write("\n\n")
            f.write(str(e))
except Exception as e:
    print("FAILED")

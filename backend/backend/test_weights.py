import torch
import traceback
import timm

try:
    path = r"c:\skin\backend\deploy_model.pth"
    print(f"Loading {path}")
    ckpt = torch.load(path, map_location="cpu")
    
    from model_utils import MODEL_NAME, DEFAULT_CLASS_NAMES
    
    model = timm.create_model(MODEL_NAME, pretrained=False, num_classes=len(DEFAULT_CLASS_NAMES))
    
    try:
        model.load_state_dict(ckpt)
        print("SUCCESS STATE DICT")
    except Exception as e:
        print("FAILED STATE DICT")
        with open("err2.txt", "w") as f:
            f.write(traceback.format_exc())
            f.write("\n\n")
            f.write(str(e))
except Exception as e:
    print("FAILED")

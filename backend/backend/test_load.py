import traceback
from model_utils import load_model

try:
    print("Testing load_model()")
    load_model()
except Exception as e:
    traceback.print_exc()

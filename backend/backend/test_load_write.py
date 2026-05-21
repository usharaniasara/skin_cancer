import traceback
from model_utils import load_model

try:
    load_model()
except Exception as e:
    with open("err.txt", "w") as f:
        f.write(traceback.format_exc())
        f.write("\n\n")
        f.write(str(e))

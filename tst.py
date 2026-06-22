import torch
import tensorflow as tf
import keras

print("PyTorch Version:", torch.__version__)
print("PyTorch CUDA verfügbar:", torch.cuda.is_available())

print("TensorFlow Version:", tf.__version__)
print("TensorFlow GPUs:", tf.config.list_physical_devices("GPU"))

print("Keras Version:", keras.__version__)
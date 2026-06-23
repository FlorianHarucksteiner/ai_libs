"""
CIFAR-10 mit Keras - kleines CNN ueber die High-Level-API (Sequential + .fit())

Das ist der Unterschied zur TensorFlow-Loesung (cifar10_tensorflow.py):
hier uebernimmt Keras den kompletten Trainings-Loop automatisch ueber
model.compile() + model.fit() - du musst Gradienten und Updates nicht
selbst programmieren.

Ausfuehren:
    pip install tensorflow
    python cifar10_keras.py
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# ----- Hyperparameter -----
EPOCHS     = 10
BATCH_SIZE = 64

# ----- Daten laden -----
(x_train, y_train), (x_test, y_test) = keras.datasets.cifar10.load_data()
x_train = x_train.astype("float32") / 255.0   # (50000, 32, 32, 3)
x_test  = x_test.astype("float32") / 255.0

# ----- Modell: kleines CNN -----
model = keras.Sequential([
    layers.Input(shape=(32, 32, 3)),            # 3 Farbkanaele
    layers.Conv2D(32, 3, padding="same", activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding="same", activation="relu"),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.25),
    layers.Dense(10, activation="softmax"),     # 10 Klassen
])

model.compile(
    optimizer="adam",                                   # Optimizer
    loss="sparse_categorical_crossentropy",             # Loss-Funktion
    metrics=["accuracy"],
)

model.summary()

# ----- Training (Keras macht den Loop selbst) -----
model.fit(x_train, y_train,
          epochs=EPOCHS,
          batch_size=BATCH_SIZE,
          validation_split=0.1)

# ----- Test-Accuracy -----
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
print(f"\n>>> Test-Accuracy (Keras): {100*test_accuracy:.2f} %")
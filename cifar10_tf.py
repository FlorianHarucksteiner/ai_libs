"""
CIFAR-10 mit TensorFlow - kleines CNN mit EIGENEM Trainings-Loop (tf.GradientTape)

Das ist der Unterschied zur Keras-Loesung (cifar10_keras.py):
hier wird NICHT model.fit() benutzt, sondern der Trainingsschritt
manuell mit tf.GradientTape ausprogrammiert - das ist die "tiefe"
TensorFlow-Ebene.

Ausfuehren:
    pip install tensorflow
    python cifar10_tensorflow.py
"""

import tensorflow as tf

# ----- Hyperparameter -----
EPOCHS     = 10
BATCH_SIZE = 64
LR         = 1e-3

# ----- Daten laden -----
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.cifar10.load_data()

# Pixel auf [0,1] normalisieren; Labels flach machen
x_train = x_train.astype("float32") / 255.0   # Shape: (50000, 32, 32, 3)
x_test  = x_test.astype("float32") / 255.0
y_train = y_train.flatten()
y_test  = y_test.flatten()

train_ds = (tf.data.Dataset.from_tensor_slices((x_train, y_train))
            .shuffle(10000).batch(BATCH_SIZE))
test_ds  = tf.data.Dataset.from_tensor_slices((x_test, y_test)).batch(BATCH_SIZE)

# ----- Modell: kleines CNN -----
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(32, 32, 3)),   # 3 Farbkanaele
    tf.keras.layers.Conv2D(32, 3, padding="same", activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64, 3, padding="same", activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.25),
    tf.keras.layers.Dense(10),                   # 10 Klassen (Logits)
])

optimizer = tf.keras.optimizers.Adam(learning_rate=LR)
loss_fn   = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
train_acc = tf.keras.metrics.SparseCategoricalAccuracy()
test_acc  = tf.keras.metrics.SparseCategoricalAccuracy()


# ----- Eigener Trainingsschritt -----
@tf.function
def train_step(images, labels):
    with tf.GradientTape() as tape:
        logits = model(images, training=True)
        loss = loss_fn(labels, logits)
    grads = tape.gradient(loss, model.trainable_variables)   # Gradienten
    optimizer.apply_gradients(zip(grads, model.trainable_variables))  # Update
    train_acc.update_state(labels, logits)
    return loss


# ----- Trainings-Loop -----
for epoch in range(EPOCHS):
    train_acc.reset_state()
    epoch_loss = 0.0
    steps = 0
    for images, labels in train_ds:
        epoch_loss += float(train_step(images, labels))
        steps += 1
    print(f"Epoche {epoch+1}/{EPOCHS} - Loss: {epoch_loss/steps:.4f} "
          f"- Train-Acc: {train_acc.result():.4f}")

# ----- Test-Accuracy -----
test_acc.reset_state()
for images, labels in test_ds:
    logits = model(images, training=False)
    test_acc.update_state(labels, logits)

print(f"\n>>> Test-Accuracy (TensorFlow): {100*float(test_acc.result()):.2f} %")


# ----- Visualisierung: 5 Beispiele mit Vorhersage -----
import matplotlib
matplotlib.use("Agg")          # kein Display noetig (Server)
import matplotlib.pyplot as plt
import numpy as np

CLASSES = ["airplane", "automobile", "bird", "cat", "deer",
           "dog", "frog", "horse", "ship", "truck"]

# erste 5 Testbilder klassifizieren
imgs5  = x_test[:5]
true5  = y_test[:5]
logits = model(imgs5, training=False)
preds5 = tf.argmax(logits, axis=1).numpy()
acc_val = 100 * float(test_acc.result())

fig, axes = plt.subplots(1, 5, figsize=(15, 3.5))
for i, ax in enumerate(axes):
    ax.imshow(imgs5[i])          # bereits in [0,1]
    ax.axis("off")
    true_lbl = CLASSES[int(true5[i])]
    pred_lbl = CLASSES[int(preds5[i])]
    color = "green" if int(true5[i]) == int(preds5[i]) else "red"
    ax.set_title(f"Wahr: {true_lbl}\nVorhersage: {pred_lbl}", color=color, fontsize=10)

fig.suptitle(f"TensorFlow CNN - CIFAR-10  (Test-Accuracy: {acc_val:.2f} %)", fontsize=13)
plt.tight_layout()
plt.savefig("cifar10_tensorflow_beispiele.png", dpi=120, bbox_inches="tight")
print(">>> Grafik gespeichert: cifar10_tensorflow_beispiele.png")
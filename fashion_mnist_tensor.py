import tensorflow as tf

# 1. Laden Sie Fashion-MNIST über TensorFlow
fashion_mnist = tf.keras.datasets.fashion_mnist
(x_train, y_train), (x_test, y_test) = fashion_mnist.load_data()

# 2. Normalisieren Sie die Bilddaten
# Pixelwerte liegen zwischen 0 und 255, durch Division durch 255.0 skalieren wir sie auf den Bereich [0, 1]
x_train, x_test = x_train / 255.0, x_test / 255.0

# 3. Definieren Sie ein einfaches neuronales Netz
model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])

# 4. Kompilieren Sie das Modell mit Optimizer, Loss-Funktion und Metrik
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 5. Trainieren Sie das Modell mit fit
print("Starte Training...")
model.fit(x_train, y_train, epochs=5)

# 6. Evaluieren Sie das Modell mit evaluate
print("\nEvaluiere Modell auf Testdaten...")
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=2)

# 7. Dokumentieren Sie Test-Loss und Test-Accuracy
print(f"\n--- Ergebnisse ---")
print(f"Test-Loss: {test_loss:.4f}")
print(f"Test-Accuracy: {test_accuracy:.4f}")
import keras
from keras import layers

# Datensatz laden
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

# Normalisieren
x_train, x_test = x_train / 255.0, x_test / 255.0

# Modell definieren (Sequential API)
model = keras.Sequential([
    keras.Input(shape=(28, 28)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# Kompilieren mit Optimizer, Loss-Funktion und Metrik
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Modell trainieren
print("Starte Training mit Keras...")
model.fit(x_train, y_train, epochs=5, batch_size=64)

# Modell evaluieren
print("\nEvaluiere das Modell...")
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=2)

# Ergebnisse dokumentieren
print("\n--- Keras Ergebnisse ---")
print(f"Test Loss: {test_loss:.4f}")
print(f"Test Accuracy: {test_accuracy:.4f}")

# Deep-Learning-Bibliotheken im Vergleich

Vergleich der drei gängigen Deep-Learning-Frameworks **PyTorch**, **TensorFlow**
und **Keras** anhand derselben Aufgaben. Jedes Framework löst die gleichen drei
Bildklassifikations-Datensätze, sodass sich Code-Stil, Abstraktionsgrad und
Ergebnisse direkt gegenüberstellen lassen.

## Datensätze

| Datensatz | Inhalt | Größe | Klassen |
|-----------|--------|-------|---------|
| **MNIST** | handgeschriebene Ziffern | 28×28, grau | 10 |
| **Fashion-MNIST** | Kleidungsstücke | 28×28, grau | 10 |
| **CIFAR-10** | Farbfotos von Objekten | 32×32, RGB | 10 |

## Projektstruktur

```
deep_learning_libraries/
├── README.md
├── requirements.txt
├── pytorch/                     # Low-Level: explizite Trainingsschleife
│   ├── mnist_pytorch.py
│   ├── fashion_mnist_pytorch.py
│   └── cifar10_pytorch.py       # CNN
├── tensorflow/                  # tf.GradientTape (eigener Loop) & tf.keras
│   ├── mnist_tensorflow.py
│   ├── fashion_mnist_tensorflow.py
│   └── cifar10_tensorflow.py    # CNN mit GradientTape
├── keras/                       # High-Level: compile() / fit() / evaluate()
│   ├── mnist_keras.py
│   ├── fashion_mnist_keras.py
│   └── cifar10_keras.py         # CNN (Sequential)
└── results/
    ├── generate_results.py      # erzeugt die folgenden Artefakte
    ├── experiment_table.csv     # Ergebnis-Zusammenfassung aller Experimente
    ├── loss_curves.png          # Trainings- & Test-Loss je Epoche
    ├── accuracy_curves.png      # Test-Accuracy je Epoche
    └── confusion_matrix.png     # Konfusionsmatrix (Fashion-MNIST)
```

## Die drei Frameworks

- **PyTorch** – Low-Level-Framework. Die Trainingsschleife (Forward Pass,
  `loss.backward()`, `optimizer.step()`) wird explizit ausprogrammiert –
  volle Kontrolle über jeden Schritt.
- **TensorFlow** – umfassendes Framework. Hier per `tf.GradientTape` ein
  eigener Trainingsschritt, um die „tiefe" Ebene zu zeigen.
- **Keras** – High-Level-API über TensorFlow. `compile()` + `fit()` +
  `evaluate()` kapseln die gesamte Trainingsschleife – sehr kompakter Code.

## Installation

```bash
pip install -r requirements.txt
```

## Ausführen

Die Skripte laden ihren Datensatz automatisch herunter.

```bash
# PyTorch
python pytorch/mnist_pytorch.py
python pytorch/fashion_mnist_pytorch.py
python pytorch/cifar10_pytorch.py

# TensorFlow
python tensorflow/mnist_tensorflow.py
python tensorflow/fashion_mnist_tensorflow.py
python tensorflow/cifar10_tensorflow.py

# Keras
python keras/mnist_keras.py
python keras/fashion_mnist_keras.py
python keras/cifar10_keras.py

# Auswertungen (Kurven, Konfusionsmatrix, Tabelle)
python results/generate_results.py
```

## Ergebnisse

Test-Accuracy der Experimente (Details siehe `results/experiment_table.csv`):

| Framework | MNIST | Fashion-MNIST | CIFAR-10 |
|-----------|:-----:|:-------------:|:--------:|
| PyTorch | ~97.6 % | 87.5 % | 72.08 % |
| TensorFlow | ~97.7 % | 87.2 % | 71.49 % |
| Keras | ~97.8 % | 87.6 % | 69.39 % |

**Kernaussagen**

- Bei gleicher Architektur liefern alle drei Frameworks nahezu identische
  Ergebnisse – die Wahl ist vor allem Stil-/Geschmackssache.
- Fashion-MNIST ist deutlich schwieriger als MNIST (~88 % statt >97 %), weil
  ein Feed-Forward-Netz die 2D-Struktur der Bilder ignoriert (`Flatten`).
- CIFAR-10 (Farbfotos, 3072 Eingabewerte) erfordert ein CNN; damit werden
  ~70 % erreicht – Faltungsnetze schlagen reine Dense-Netze bei Bildern klar.

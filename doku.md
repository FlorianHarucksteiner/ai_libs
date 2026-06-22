# 1. Allgemeine Fragen
- 1. Was ist PyTorch?
    Python orientieretes Framework zur Entwicklung von Neural-Nets mit Tensoren
- 2. Was ist Tensorflow?:
    Open-Source Framework, für Machinelearning. Es Arbeitet mit den tensoren
- 3. Was ist Keras?:
    High-Level API: Entwicklerfreundliche Schicht für entwicklung von Neural Nets mit tensorflow
- 4. Unterschied Keras vs. Tensorflow:
    tensorflow is das Umfassende Framework, stellt Funktionen wie Tensoren etc. bereit. Keras ist nur die High-Level API mti der man modelle aus fertigen Bausteinen zusammenbauen kann
- 5. Was ist ein Tensor?:  
  Zentrale Datenstruktur in der Frameworks rechnen,beliebig Dimensional

- 6. Was ist ein Optimizer?
    Algorithmus zum minimieren des Losses

- 7. Was ist eine Loss-Funktion?
    Funktion berechnet wie Falsch die Berechnungen des Nerual-Nets sind -> muss minimiert werden

- 8. Was ist eine Epoche?
    Eine Epoche ist ein kompletter Durchlauf durch den gesamten Trainingsdatensatz

- 9. Was ist eine Batch-Size?
    Anzahl der Training Beispiele die ein einem Durchlauf zusammengefasst werden

- 10. Was bedeuted Accuracy?
    Accuracy ist die Abweichung von den Modell bestimmten ergebnissen zu den Test ergebnissen 

# 2. Dokumentation des PyTorch MNIST Modells

**1. Wo wird das Modell definiert?**
Das Modell wird in der Klasse `NeuralNet` definiert, die von `torch.nn.Module` erbt. In der `__init__`-Methode werden die einzelnen Schichten (z.B. `nn.Flatten`, `nn.Linear`, `nn.ReLU`) initialisiert. Die Zusammensetzung (wie die Daten durch die Schichten fließen) wird in der `forward`-Methode definiert.

**2. Wo findet der Forward Pass statt?**
Im PyTorch-Code findet der eigentliche Forward Pass während der Trainings- und Testschleife beim Aufruf `outputs = model(images)` statt. Dieser Aufruf ruft intern die `forward`-Methode der `NeuralNet`-Klasse auf, welche die Eingabedaten nacheinander durch die definierten Schichten leitet.

**3. Wo wird der Loss berechnet?**
Der Loss wird in der Trainingsschleife mit `loss = criterion(outputs, labels)` berechnet. `criterion` wurde zuvor als `nn.CrossEntropyLoss()` instanziiert.

**4. Wo werden die Gewichte aktualisiert?**
Die Aktualisierung der Gewichte erfolgt in der Trainingsschleife durch den Aufruf von `optimizer.step()`. Zuvor wird mit `loss.backward()` der Gradient berechnet (Backpropagation) und mit `optimizer.zero_grad()` werden die Gradienten aus dem vorherigen Schritt zurückgesetzt.

**5. Welche Teile mussten Sie in Ihrer eigenen NumPy-Implementierung selbst programmieren?**
In einer reinen NumPy-Implementierung muss man vieles manuell programmieren:
- Den gesamten mathematischen Ablauf des **Forward Passes** (Matrixmultiplikationen, Addition der Biases).
- Die komplexe **Backpropagation** (partielle Ableitungen, Kettenregel berechnen, um die Gradienten für jede Schicht zu finden).
- Die Update-Logik der Gewichte und Biases (z.B. `W = W - learning_rate * dW`).
- Implementierung der **Aktivierungsfunktionen** (z.B. ReLU, Softmax) und deren jeweilige Ableitungsfunktionen.
- Die **Loss-Funktion** (z. B. Cross-Entropy-Loss Formel) und deren Ableitung.
- Das Batching-System (Auswählen und Iterieren über Daten-Batches).

**6. Welche Teile übernimmt PyTorch?**
PyTorch nimmt einem die meiste mathematische und organisatorische Arbeit ab:
- **Autograd:** Die automatische Differenzierung berechnet die Gradienten im Hintergrund (durch `loss.backward()`), ohne dass man Ableitungen per Hand implementieren muss.
- **Layer & Funktionen:** Fertig implementierte Schichten (`nn.Linear`), Aktivierungsfunktionen (`nn.ReLU`) und Loss-Funktionen (`nn.CrossEntropyLoss`).
- **Optimizer:** Optimiere wie SGD oder Adam sind vorkonfiguriert und wenden Updates über `optimizer.step()` extrem effizient an.
- **Datenverarbeitung:** Das Laden, Mischen, Batching und Transformieren der Daten wird elegant durch den `DataLoader` und `torchvision.transforms` übernommen.
- **GPU Berechnungen:** Einfaches Verschieben der Tensoren auf eine GPU durch `to(device)`, was manuell in C++/NumPy sehr aufwändig wäre.

---

# TensorFlow

**1. Wie wird das Modell in TensorFlow definiert?**
In der obigen Implementierung wird das Modell mithilfe der Keras `Sequential`-API formuliert (`tf.keras.models.Sequential`). Die Schichten (z.B. `Flatten` und `Dense`) werden einfach als Liste übergeben und das Modell verbindet sie automatisch sequentiell von vorne nach hinten.

**2. Was macht compile?**
Die `compile`-Methode konfiguriert das Modell für den Trainingsprozess. Hier werden alle wesentlichen Hyperparameter des Trainings hinterlegt: der Optimizer (z.B. `adam`), die Loss-Funktion (z.B. `sparse_categorical_crossentropy`) und Metriken (`accuracy`), die während des Trainings und der Evaluierung überwacht werden sollen.

**3. Was macht fit?**
Die `fit`-Methode führt das komplette Training für eine festgelegte Anzahl von Epochen aus. Sie abstrahiert fast die gesamte Trainingsschleife: Sie iteriert automatisch in Batches durch den Datensatz, führt Forward-Passes durch, berechnet den Loss, berechnet per Backpropagation die Gradienten und wendet schließlich die Gewichts-Updates über den Optimizer an.

**4. Was macht evaluate?**
Die `evaluate`-Methode testet die Leistung des fertig trainierten Modells auf ungesehenen Daten (Testdaten). Sie führt einen reinen Forward-Pass aus (ohne Gradientenberechnung oder Gewichtsupdates) und berechnet daraufhin den Loss sowie die Metrik (z.B. Accuracy) für den gesamten Test-Datensatz.

**5. Ist der Code kürzer oder länger als bei PyTorch?**
Der TensorFlow/Keras-Code ist in dieser High-Level-Fassung deutlich kürzer und kompakter als der PyTorch-Code.

**6. Welche Details des Trainings sind weniger sichtbar als bei PyTorch?**
Durch den Aufruf von `model.fit()` und `model.evaluate()` werden viele Low-Level-Details abstrahiert, die in PyTorch manuell implementiert wurden:
- Der **Data-Loading Loop** (die Batch-Iteration per `for`-Schleife).
- Der explizite Aufruf des **Forward Passes** (`outputs = model(images)`).
- Das manuelle Zurücksetzen der Gradienten (`optimizer.zero_grad()`).
- Die explizite Berechnung der **Backpropagation** (`loss.backward()`).
- Das Anwenden der **Gewichts-Updates** (`optimizer.step()`).
- Die bewusste Trennung von Training und Evaluierung durch Modus-Umschaltung (`model.train()`, `model.eval()`) sowie das Deaktivieren der Gradientenberechnung beim Testen (`with torch.no_grad():`).


# Keras


---

# Teil 5: Fashion-MNIST

## Ergebnisse und Vergleich

| Framework | Dataset | Modell (Hidden Layers) | Epochen | Batch Size | Optimizer | Test-Accuracy (ca.) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PyTorch | Fashion-MNIST | 1 (128 units, ReLU) | 5 | 64 | Adam | ~87.5% |
| TensorFlow | Fashion-MNIST | 1 (128 units, ReLU) | 5 | 32 (default)| Adam | ~87.2% |
| Keras | Fashion-MNIST | 1 (128 units, ReLU) | 5 | 64 | Adam | ~87.6% |



## Leitfragen zu Fashion-MNIST

**1. Ist Fashion-MNIST schwieriger als MNIST?**
Ja, deutlich. MNIST besteht aus einfachen handgeschriebenen Ziffern mit klaren Kanten, während Fashion-MNIST detailliertere Kleidungsstücke mit subtileren Merkmalen enthält.

**2. Ist die Accuracy niedriger als bei MNIST?**
Ja. Mit demselben simplen Feed-Forward-Netz erreicht man bei MNIST oft über 97% Accuracy, während sie bei Fashion-MNIST typischerweise nur bei etwa 85% bis 88% liegt.

**3. Welche Klassen werden häufig verwechselt?**
Es gibt starke Ähnlichkeiten innerhalb der Kategorien "Oberteile". Besonders häufig verwechselt werden:
- T-Shirt/top (Klasse 0), Pullover (Klasse 2) und Shirt (Klasse 6).
- Coat (Klasse 4) und Pullover (Klasse 2).
- Sneaker (Klasse 7), Sandal (Klasse 5) und Ankle boot (Klasse 9) werden gelegentlich auch verwechselt, sind aber besser trennbar als die Oberteile.

**4. Funktioniert dasselbe Modell gleich gut wie bei MNIST?**
Es funktioniert prinzipiell (es konvergiert und lernt), erzielt aber absolut gesehen eine sichtbar schlechtere Performance (~10% weniger Accuracy). Ein einfaches Fully-Connected-Netz stößt bei den komplexeren Texturen und Formen von Kleidungsstücken an seine Grenzen, da es die räumliche Struktur der Bilder (2D-Topologie) ignoriert, da das Bild vorab via `Flatten` zu einem 1D-Vektor geglättet wird.

**5. Welche Änderungen am Modell könnten helfen?**
- **Einsatz von Convolutional Neural Networks (CNNs):** Durch `Conv2D`-Schichten (mit Max Pooling) bleibt die 2D-Struktur erhalten und lokale Muster können positionsunabhängig viel besser gelernt werden. Dies führt bei Fashion-MNIST fast sofort zu Genauigkeiten von >90%.
- **Mehr Schichten & Neuronen (Deep Learning):** Ein tieferes Feed-Forward-Netz kann leicht verbesserte Ergebnisse liefern, skaliert jedoch schlechter als CNNs.
- **Regularisierung:** Techniken wie `Dropout` oder Batch-Normalization können Overfitting verhindern und die Generalisierung verbessern.
- **Data Augmentation:** Leichtes Drehen, Verschieben oder horizontales Spiegeln (nur sinnvoll für symmetrische Stücke) der Bilder im Training vergrößert die Robustheit.

# Teil 6: CIFAR-10 mit PyTorch, TensorFlow und Keras

## Dokumentation der Modelle

| Framework   | Dataset  | Modelltyp        | Epochen | Batch Size | Optimizer | Test-Accuracy* |
|-------------|----------|------------------|---------|------------|-----------|----------------|
| PyTorch     | CIFAR-10 | CNN (2 Conv-Lagen) | 10      | 64         | Adam      | 72.08 %         |
| TensorFlow  | CIFAR-10 | CNN (GradientTape) | 10      | 64         | Adam      | 71.49 %         |
| Keras       | CIFAR-10 | CNN (Sequential)   | 10      | 64         | Adam      | 69.39 %         |


---

## Leitfragen

### 1. Warum ist CIFAR-10 schwieriger als MNIST?
MNIST sind zentrierte, schwarz-weiße Ziffern auf einfarbigem Hintergrund — sehr
gleichförmig. CIFAR-10 enthält dagegen echte Fotos von Objekten (Auto, Hund,
Schiff …) mit Hintergrund, unterschiedlicher Beleuchtung, Perspektive, Größe und
Pose. Die Variation innerhalb einer Klasse ist also viel größer, und die Objekte
sind nicht sauber ausgerichtet. Außerdem hat ein CIFAR-Bild mit 32×32×3 = **3072
Werte** fast viermal so viele Eingabewerte wie ein MNIST-Bild mit 28×28 = 784.

### 2. Warum sind Farbbilder aufwendiger als Graustufenbilder?
Ein Graustufenbild hat **einen** Kanal, ein Farbbild **drei** (RGB). Damit ist die
Eingabedatenmenge dreimal so groß, das Modell hat in der ersten Schicht mehr
Parameter, und Rechenaufwand sowie Speicherbedarf steigen entsprechend. Das Netz
muss zusätzlich lernen, Farb- und Texturinformationen sinnvoll zu kombinieren.

### 3. Warum sind CNNs für Bilder besser geeignet als reine Dense-Netze?
- **Räumliche Struktur:** Faltungen (Convolutions) betrachten kleine lokale
  Bildausschnitte und erkennen Kanten, Ecken und Muster — ein Dense-Netz behandelt
  jeden Pixel unabhängig und ignoriert, dass benachbarte Pixel zusammengehören.
- **Parameter-Sharing:** Ein Filter wird über das ganze Bild geschoben, statt für
  jede Position eigene Gewichte zu lernen → drastisch weniger Parameter.
- **Translationsinvarianz:** Ein Objekt wird erkannt, egal wo im Bild es liegt.
- **Hierarchie:** Frühe Schichten lernen einfache Kanten, spätere komplexe Formen.

### 4. Welche Accuracy erreichen Sie?
Mit dem kleinen CNN und 10 Epochen typischerweise **~65–75 % Test-Accuracy**.
(Die exakten Werte aus deinen Läufen hier eintragen.)

### 5. Ist das Ergebnis zufriedenstellend?
Für ein bewusst kleines Einstiegsmodell mit wenigen Epochen: ja, es zeigt, dass das
CNN klar besser ist als ein Dense-Netz. Von State-of-the-Art-Ergebnissen auf
CIFAR-10 (über **95 %**) ist es aber weit entfernt. Als Lernübung ausreichend,
für den produktiven Einsatz nicht.

### 6. Welche Verbesserungen wären möglich?
- **Mehr Epochen** trainieren (mit Early Stopping gegen Overfitting).
- **Data Augmentation** (zufälliges Spiegeln, Verschieben, Zuschneiden).
- **Tieferes CNN** mit mehr Conv-Schichten.
- **Batch Normalization** zur Stabilisierung des Trainings.
- **Dropout / Regularisierung** stärker einsetzen.
- **Learning-Rate-Scheduling** (Lernrate über die Zeit absenken).
- **Transfer Learning** mit einem vortrainierten Netz (z. B. ResNet).

---

## Ausführung auf dem Server

```bash
# Abhängigkeiten installieren
pip install torch torchvision tensorflow

# Skripte nacheinander ausführen (laden den Datensatz automatisch herunter)
python cifar10_pytorch.py
python cifar10_tensorflow.py
python cifar10_keras.py
```



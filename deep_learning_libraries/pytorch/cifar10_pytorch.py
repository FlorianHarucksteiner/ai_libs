"""
CIFAR-10 mit PyTorch - kleines Convolutional Neural Network (CNN)

Ausfuehren:
    pip install torch torchvision
    python cifar10_pytorch.py
"""

import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms

# ----- Hyperparameter (fuer die Dokumentations-Tabelle) -----
EPOCHS      = 10
BATCH_SIZE  = 64
LR          = 1e-3
DEVICE      = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Device: {DEVICE}")

# ----- Daten laden -----
# CIFAR-10: Farbbilder, 3 Kanaele (RGB), 32x32 Pixel, 10 Klassen
transform = transforms.Compose([
    transforms.ToTensor(),
    # Normalisierung pro Kanal (Mittelwert/Std von CIFAR-10)
    transforms.Normalize((0.4914, 0.4822, 0.4465),
                         (0.2470, 0.2435, 0.2616)),
])

train_set = torchvision.datasets.CIFAR10(root="./data/cifar10", train=True,
                                          download=True, transform=transform)
test_set  = torchvision.datasets.CIFAR10(root="./data/cifar10", train=False,
                                          download=True, transform=transform)

train_loader = torch.utils.data.DataLoader(train_set, batch_size=BATCH_SIZE,
                                            shuffle=True, num_workers=2)
test_loader  = torch.utils.data.DataLoader(test_set, batch_size=BATCH_SIZE,
                                           shuffle=False, num_workers=2)


# ----- Modell: kleines CNN -----
class SmallCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),  # 3 Eingangskanaele (RGB!)
            nn.ReLU(),
            nn.MaxPool2d(2),                              # 32x32 -> 16x16
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),                              # 16x16 -> 8x8
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 128),
            nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(128, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)


model = SmallCNN().to(DEVICE)
criterion = nn.CrossEntropyLoss()              # Loss-Funktion fuer Klassifikation
optimizer = optim.Adam(model.parameters(), lr=LR)   # Optimizer: Adam

# ----- Training -----
for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()            # Backpropagation: Gradienten berechnen
        optimizer.step()           # Gewichte anpassen

        running_loss += loss.item()
    print(f"Epoche {epoch+1}/{EPOCHS} - Loss: {running_loss/len(train_loader):.4f}")

# ----- Test-Accuracy berechnen -----
model.eval()
correct, total = 0, 0
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

acc = 100 * correct / total
print(f"\n>>> Test-Accuracy (PyTorch): {acc:.2f} %")


# ----- Visualisierung: 5 Beispiele mit Vorhersage -----
import matplotlib
matplotlib.use("Agg")          # kein Display noetig (Server)
import matplotlib.pyplot as plt
import numpy as np

CLASSES = ["airplane", "automobile", "bird", "cat", "deer",
           "dog", "frog", "horse", "ship", "truck"]
MEAN = np.array([0.4914, 0.4822, 0.4465])
STD  = np.array([0.2470, 0.2435, 0.2616])

# erste 5 Testbilder holen und klassifizieren
images, labels = next(iter(test_loader))
images5, labels5 = images[:5].to(DEVICE), labels[:5]
model.eval()
with torch.no_grad():
    preds5 = model(images5).argmax(dim=1).cpu()

fig, axes = plt.subplots(1, 5, figsize=(15, 3.5))
for i, ax in enumerate(axes):
    img = images5[i].cpu().numpy().transpose(1, 2, 0)   # CHW -> HWC
    img = np.clip(img * STD + MEAN, 0, 1)               # Normalisierung rueckgaengig
    ax.imshow(img)
    ax.axis("off")
    true_lbl = CLASSES[labels5[i].item()]
    pred_lbl = CLASSES[preds5[i].item()]
    correct_pred = (labels5[i].item() == preds5[i].item())
    color = "green" if correct_pred else "red"
    ax.set_title(f"Wahr: {true_lbl}\nVorhersage: {pred_lbl}", color=color, fontsize=10)

fig.suptitle(f"PyTorch CNN - CIFAR-10  (Test-Accuracy: {acc:.2f} %)", fontsize=13)
plt.tight_layout()
plt.savefig("cifar10_pytorch_beispiele.png", dpi=120, bbox_inches="tight")
print(" Grafik gespeichert: cifar10_pytorch_beispiele.png")
"""
Erzeugt die Auswertungs-Artefakte im Ordner results/:
  - loss_curves.png        Trainings- und Test-Loss je Epoche
  - accuracy_curves.png    Test-Accuracy je Epoche
  - confusion_matrix.png   Konfusionsmatrix (Fashion-MNIST Testset)
  - experiment_table.csv   Zusammenfassung aller Experimente

Als reproduzierbare Referenz wird ein PyTorch-Feed-Forward-Netz auf
Fashion-MNIST trainiert (Kurven + Konfusionsmatrix). Die Tabelle fasst
die dokumentierten Ergebnisse aller drei Frameworks zusammen.

Aufruf (aus dem Ordner results/):
    python generate_results.py
"""
import os
import csv
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

torch.manual_seed(0)
np.random.seed(0)
HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")

TEAL, AMBER, CORAL, INK = "#13B5A6", "#F4A23C", "#EF5E6B", "#1B2333"
FASHION = ["T-Shirt/Top", "Hose", "Pullover", "Kleid", "Mantel",
           "Sandale", "Hemd", "Sneaker", "Tasche", "Stiefelette"]

# --------------------------------------------------------------- experiment table
ROWS = [
    # framework, dataset, model, epochs, batch_size, optimizer, test_accuracy
    ("PyTorch",    "MNIST",         "FFN (1x128, ReLU)",  5, 64, "Adam", 97.6),
    ("TensorFlow", "MNIST",         "FFN (1x128, ReLU)",  5, 32, "Adam", 97.7),
    ("Keras",      "MNIST",         "FFN (1x128, ReLU)",  5, 64, "Adam", 97.8),
    ("PyTorch",    "Fashion-MNIST", "FFN (1x128, ReLU)",  5, 64, "Adam", 87.5),
    ("TensorFlow", "Fashion-MNIST", "FFN (1x128, ReLU)",  5, 32, "Adam", 87.2),
    ("Keras",      "Fashion-MNIST", "FFN (1x128, ReLU)",  5, 64, "Adam", 87.6),
    ("PyTorch",    "CIFAR-10",      "CNN (2 Conv)",      10, 64, "Adam", 72.08),
    ("TensorFlow", "CIFAR-10",      "CNN (GradientTape)",10, 64, "Adam", 71.49),
    ("Keras",      "CIFAR-10",      "CNN (Sequential)",  10, 64, "Adam", 69.39),
]


def write_table():
    path = os.path.join(HERE, "experiment_table.csv")
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["framework", "dataset", "model", "epochs",
                    "batch_size", "optimizer", "test_accuracy_pct"])
        w.writerows(ROWS)
    print("  -> experiment_table.csv")


# --------------------------------------------------------------- train Fashion-MNIST
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 256), nn.ReLU(),
            nn.Linear(256, 128), nn.ReLU(),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        return self.net(x)


def train_and_plot():
    tf = transforms.Compose([transforms.ToTensor(),
                             transforms.Normalize((0.5,), (0.5,))])
    train_ds = torchvision.datasets.FashionMNIST(DATA, train=True, download=True, transform=tf)
    test_ds = torchvision.datasets.FashionMNIST(DATA, train=False, download=True, transform=tf)
    train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_ds, batch_size=1000, shuffle=False)

    model = Net()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    EPOCHS = 10
    hist = {"train_loss": [], "test_loss": [], "test_acc": []}

    for epoch in range(EPOCHS):
        model.train()
        running = 0.0
        for images, labels in train_loader:
            optimizer.zero_grad()
            loss = criterion(model(images), labels)
            loss.backward()
            optimizer.step()
            running += loss.item()
        model.eval()
        tl, correct, total = 0.0, 0, 0
        with torch.no_grad():
            for images, labels in test_loader:
                out = model(images)
                tl += criterion(out, labels).item()
                correct += (out.argmax(1) == labels).sum().item()
                total += labels.size(0)
        hist["train_loss"].append(running / len(train_loader))
        hist["test_loss"].append(tl / len(test_loader))
        hist["test_acc"].append(100 * correct / total)
        print(f"  Epoche {epoch+1:2d}/{EPOCHS}  acc={hist['test_acc'][-1]:.2f}%")

    xs = list(range(1, EPOCHS + 1))

    def style(ax):
        ax.grid(True, color="#E2E8F0", lw=0.8)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        for s in ("left", "bottom"):
            ax.spines[s].set_color("#CBD5E1")
        ax.tick_params(colors="#64748B")
        ax.set_xticks(xs)

    # loss curves
    fig, ax = plt.subplots(figsize=(6.4, 4.0))
    fig.patch.set_facecolor("white"); ax.set_facecolor("white")
    ax.plot(xs, hist["train_loss"], "-o", color=AMBER, lw=2.5, ms=6, label="Training")
    ax.plot(xs, hist["test_loss"], "-o", color=TEAL, lw=2.5, ms=6, label="Test")
    ax.set_xlabel("Epoche"); ax.set_ylabel("Loss (Cross-Entropy)")
    ax.set_title("Loss-Kurven - Fashion-MNIST", color=INK, fontweight="bold")
    style(ax); ax.legend(frameon=False)
    plt.tight_layout(); plt.savefig(os.path.join(HERE, "loss_curves.png"),
                                    dpi=140, facecolor="white"); plt.close(fig)
    print("  -> loss_curves.png")

    # accuracy curve
    fig, ax = plt.subplots(figsize=(6.4, 4.0))
    fig.patch.set_facecolor("white"); ax.set_facecolor("white")
    ax.plot(xs, hist["test_acc"], "-o", color=TEAL, lw=2.5, ms=6, label="Test-Accuracy")
    for x, y in zip(xs, hist["test_acc"]):
        if x in (1, EPOCHS):
            ax.annotate(f"{y:.1f}%", (x, y), textcoords="offset points",
                        xytext=(0, 9), ha="center", fontsize=10, color=INK, fontweight="bold")
    ax.set_xlabel("Epoche"); ax.set_ylabel("Accuracy (%)")
    ax.set_title("Accuracy-Kurve - Fashion-MNIST", color=INK, fontweight="bold")
    style(ax); ax.legend(frameon=False, loc="lower right")
    plt.tight_layout(); plt.savefig(os.path.join(HERE, "accuracy_curves.png"),
                                    dpi=140, facecolor="white"); plt.close(fig)
    print("  -> accuracy_curves.png")

    # confusion matrix
    cm = np.zeros((10, 10), dtype=int)
    model.eval()
    with torch.no_grad():
        for images, labels in test_loader:
            pred = model(images).argmax(1)
            for t, p in zip(labels.numpy(), pred.numpy()):
                cm[t, p] += 1

    fig, ax = plt.subplots(figsize=(7.2, 6.2))
    fig.patch.set_facecolor("white")
    im = ax.imshow(cm, cmap="GnBu")
    ax.set_xticks(range(10)); ax.set_yticks(range(10))
    ax.set_xticklabels(FASHION, rotation=45, ha="right", fontsize=8)
    ax.set_yticklabels(FASHION, fontsize=8)
    ax.set_xlabel("Vorhersage", color=INK); ax.set_ylabel("Wahr", color=INK)
    ax.set_title("Konfusionsmatrix - Fashion-MNIST (Testset)", color=INK, fontweight="bold")
    thresh = cm.max() / 2
    for i in range(10):
        for j in range(10):
            ax.text(j, i, cm[i, j], ha="center", va="center", fontsize=7,
                    color="white" if cm[i, j] > thresh else INK)
    fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    plt.tight_layout(); plt.savefig(os.path.join(HERE, "confusion_matrix.png"),
                                    dpi=140, facecolor="white"); plt.close(fig)
    print("  -> confusion_matrix.png")
    print("Finale Test-Accuracy: %.2f%%" % hist["test_acc"][-1])


if __name__ == "__main__":
    print("Schreibe Ergebnis-Tabelle ...")
    write_table()
    print("Trainiere Fashion-MNIST & erzeuge Grafiken ...")
    train_and_plot()
    print("Fertig.")

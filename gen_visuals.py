"""
Erzeugt alle Visualisierungen fuer die Praesentation:
  - >=10 Beispielbilder je Datensatz (MNIST, Fashion-MNIST, CIFAR-10)
  - Loss-Kurve (Train + Test) fuer Fashion-MNIST
  - Accuracy-Kurve (Test) fuer Fashion-MNIST
  - >=5 falsch klassifizierte Beispiele (Fashion-MNIST)
Ausgabe: ./assets/*.png
"""
import os
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
os.makedirs("assets", exist_ok=True)

TEAL = "#13B5A6"
AMBER = "#F4A23C"
CORAL = "#EF5E6B"
INK = "#1B2333"

FASHION = ["T-Shirt/Top", "Hose", "Pullover", "Kleid", "Mantel",
           "Sandale", "Hemd", "Sneaker", "Tasche", "Stiefelette"]
CIFAR = ["airplane", "automobile", "bird", "cat", "deer",
         "dog", "frog", "horse", "ship", "truck"]


# ---------------------------------------------------------------- sample grids
def sample_grid(images, titles, fname, suptitle, cmap=None, ncol=5, nrow=2):
    fig, axes = plt.subplots(nrow, ncol, figsize=(ncol * 1.5, nrow * 1.7))
    fig.patch.set_facecolor("white")
    for i, ax in enumerate(axes.flat):
        img = images[i]
        if cmap:
            ax.imshow(img, cmap=cmap)
        else:
            ax.imshow(img)
        ax.set_title(titles[i], fontsize=9, color=INK)
        ax.axis("off")
    fig.suptitle(suptitle, fontsize=13, color=INK, fontweight="bold", y=1.0)
    plt.tight_layout()
    plt.savefig(f"assets/{fname}", dpi=130, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("  ->", fname)


print("Lade Datensaetze & erstelle Beispielraster ...")
# MNIST
mnist = torchvision.datasets.MNIST(root="./data/mnist", train=True, download=True)
imgs = [np.array(mnist[i][0]) for i in range(10)]
tit = [str(mnist[i][1]) for i in range(10)]
sample_grid(imgs, tit, "samples_mnist.png", "MNIST - 10 Beispiele (Ziffer)", cmap="gray")

# Fashion-MNIST
fashion = torchvision.datasets.FashionMNIST(root="./data/fashion_mnist", train=True, download=True)
imgs = [np.array(fashion[i][0]) for i in range(10)]
tit = [FASHION[fashion[i][1]] for i in range(10)]
sample_grid(imgs, tit, "samples_fashion.png", "Fashion-MNIST - 10 Beispiele", cmap="gray")

# CIFAR-10
cifar = torchvision.datasets.CIFAR10(root="./data/cifar10", train=True, download=True)
imgs = [np.array(cifar[i][0]) for i in range(10)]
tit = [CIFAR[cifar[i][1]] for i in range(10)]
sample_grid(imgs, tit, "samples_cifar.png", "CIFAR-10 - 10 Beispiele", cmap=None)


# ---------------------------------------------------------------- train Fashion-MNIST
print("Trainiere Fashion-MNIST (fuer Kurven & Fehlklassifikationen) ...")
transform = transforms.Compose([transforms.ToTensor(),
                                transforms.Normalize((0.5,), (0.5,))])
train_ds = torchvision.datasets.FashionMNIST(root="./data/fashion_mnist", train=True,
                                             download=True, transform=transform)
test_ds = torchvision.datasets.FashionMNIST(root="./data/fashion_mnist", train=False,
                                            download=True, transform=transform)
train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
test_loader = DataLoader(test_ds, batch_size=1000, shuffle=False)


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
        out = model(images)
        loss = criterion(out, labels)
        loss.backward()
        optimizer.step()
        running += loss.item()
    train_loss = running / len(train_loader)

    # evaluate
    model.eval()
    tl, correct, total = 0.0, 0, 0
    with torch.no_grad():
        for images, labels in test_loader:
            out = model(images)
            tl += criterion(out, labels).item()
            pred = out.argmax(1)
            correct += (pred == labels).sum().item()
            total += labels.size(0)
    test_loss = tl / len(test_loader)
    test_acc = 100 * correct / total
    hist["train_loss"].append(train_loss)
    hist["test_loss"].append(test_loss)
    hist["test_acc"].append(test_acc)
    print(f"  Epoche {epoch+1:2d}/{EPOCHS}  train_loss={train_loss:.4f}  "
          f"test_loss={test_loss:.4f}  test_acc={test_acc:.2f}%")

epochs_x = list(range(1, EPOCHS + 1))

# ---------------------------------------------------------------- loss curve
fig, ax = plt.subplots(figsize=(6.2, 3.9))
fig.patch.set_facecolor("white")
ax.set_facecolor("white")
ax.plot(epochs_x, hist["train_loss"], "-o", color=AMBER, lw=2.5, ms=6, label="Training")
ax.plot(epochs_x, hist["test_loss"], "-o", color=TEAL, lw=2.5, ms=6, label="Test")
ax.set_xlabel("Epoche", color=INK, fontsize=11)
ax.set_ylabel("Loss (Cross-Entropy)", color=INK, fontsize=11)
ax.set_xticks(epochs_x)
ax.grid(True, color="#E2E8F0", lw=0.8)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
for s in ["left", "bottom"]:
    ax.spines[s].set_color("#CBD5E1")
ax.tick_params(colors="#64748B")
ax.legend(frameon=False, fontsize=11)
plt.tight_layout()
plt.savefig("assets/curve_loss.png", dpi=140, bbox_inches="tight", facecolor="white")
plt.close(fig)
print("  -> curve_loss.png")

# ---------------------------------------------------------------- accuracy curve
fig, ax = plt.subplots(figsize=(6.2, 3.9))
fig.patch.set_facecolor("white")
ax.set_facecolor("white")
ax.plot(epochs_x, hist["test_acc"], "-o", color=TEAL, lw=2.5, ms=6, label="Test-Accuracy")
for x, y in zip(epochs_x, hist["test_acc"]):
    if x in (1, EPOCHS):
        ax.annotate(f"{y:.1f}%", (x, y), textcoords="offset points",
                    xytext=(0, 9), ha="center", fontsize=10, color=INK, fontweight="bold")
ax.set_xlabel("Epoche", color=INK, fontsize=11)
ax.set_ylabel("Accuracy (%)", color=INK, fontsize=11)
ax.set_xticks(epochs_x)
ax.grid(True, color="#E2E8F0", lw=0.8)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
for s in ["left", "bottom"]:
    ax.spines[s].set_color("#CBD5E1")
ax.tick_params(colors="#64748B")
ax.legend(frameon=False, fontsize=11, loc="lower right")
plt.tight_layout()
plt.savefig("assets/curve_acc.png", dpi=140, bbox_inches="tight", facecolor="white")
plt.close(fig)
print("  -> curve_acc.png")

# ---------------------------------------------------------------- misclassified
print("Suche falsch klassifizierte Beispiele ...")
model.eval()
mis_imgs, mis_true, mis_pred = [], [], []
with torch.no_grad():
    for images, labels in DataLoader(test_ds, batch_size=256, shuffle=False):
        out = model(images)
        pred = out.argmax(1)
        wrong = (pred != labels).nonzero(as_tuple=True)[0]
        for w in wrong:
            img = images[w].squeeze().numpy() * 0.5 + 0.5  # de-normalize
            mis_imgs.append(img)
            mis_true.append(FASHION[labels[w].item()])
            mis_pred.append(FASHION[pred[w].item()])
            if len(mis_imgs) >= 10:
                break
        if len(mis_imgs) >= 10:
            break

fig, axes = plt.subplots(2, 5, figsize=(5 * 1.55, 2 * 2.0))
fig.patch.set_facecolor("white")
for i, ax in enumerate(axes.flat):
    ax.imshow(mis_imgs[i], cmap="gray")
    ax.set_title(f"Wahr: {mis_true[i]}\nVorhersage: {mis_pred[i]}",
                 fontsize=8.5, color=CORAL)
    ax.axis("off")
fig.suptitle("Fashion-MNIST - 10 Fehlklassifikationen", fontsize=13,
             color=INK, fontweight="bold", y=1.0)
plt.tight_layout()
plt.savefig("assets/misclassified.png", dpi=130, bbox_inches="tight", facecolor="white")
plt.close(fig)
print("  -> misclassified.png")

# save final metrics for the deck text
with open("assets/metrics.txt", "w") as f:
    f.write(f"final_acc={hist['test_acc'][-1]:.2f}\n")
    f.write(f"final_train_loss={hist['train_loss'][-1]:.4f}\n")
    f.write(f"final_test_loss={hist['test_loss'][-1]:.4f}\n")
print("Fertig. Finale Test-Accuracy: %.2f%%" % hist["test_acc"][-1])

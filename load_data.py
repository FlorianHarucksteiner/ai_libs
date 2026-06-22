import torchvision.datasets as datasets

# Alle drei in eigene Ordner laden
datasets.MNIST(root='./data/mnist', download=True)
datasets.FashionMNIST(root='./data/fashion_mnist', download=True)
datasets.CIFAR10(root='./data/cifar10', download=True)
# AgroDetect AI - Dataset Structure & Best Practices

## 1. Directory Structure
To train a robust disease detection model, structure your data as follows:

```text
dataset/
├── train/
│   ├── Tomato_Early_Blight/
│   ├── Tomato_Late_Blight/
│   ├── Tomato_Healthy/
│   ├── Potato_Early_Blight/
│   └── ...
├── validation/
│   ├── Tomato_Early_Blight/
│   └── ...
└── test/
    ├── Tomato_Early_Blight/
    └── ...
```

## 2. Best Practices
- **Class Balance**: Ensure each category has a similar number of images (e.g., 1000 images per class). If one class is smaller, use oversampling or heavy data augmentation.
- **Labeling**: Use high-quality images where the leaf is centered and the disease symptoms are clearly visible.
- **Diversity**: Include images taken under different lighting conditions, backgrounds, and angles to improve generalization.
- **Resolution**: While the model resizes to 224x224, start with higher resolution source images (at least 500x500) to preserve detail during the initial capture.

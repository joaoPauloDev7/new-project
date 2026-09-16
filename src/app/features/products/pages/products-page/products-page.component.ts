import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  pricePromo?: number | null;
  stock: number;
  status: boolean;
  sizes: string[];
  colors: string[];
  gender: string;
  highlight: boolean;
  newLaunch: boolean;
  images: { url: string; isMain: boolean }[];
  createdAt: string;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent {
  private fb = inject(FormBuilder);

  showModal = signal<boolean>(false);
  dragOver = signal<boolean>(false);
  
  // List of active clothing products configuration for Barone Imports
  products = signal<Product[]>([
    {
      id: '1',
      name: 'Camiseta Pima Premium Black',
      sku: 'BI-TSH-001',
      description: 'Camiseta confeccionada em algodão Pima peruano, corte slim fit.',
      price: 129.90,
      pricePromo: 99.90,
      stock: 45,
      status: true,
      sizes: ['M', 'G', 'GG'],
      colors: ['Preto'],
      gender: 'Masculino',
      highlight: true,
      newLaunch: false,
      images: [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200', isMain: true }],
      createdAt: '2026-07-01'
    },
    {
      id: '2',
      name: 'Calça Chino Slim Gray',
      sku: 'BI-PAN-002',
      description: 'Calça chino slim fit em sarja leve com elastano.',
      price: 249.90,
      pricePromo: null,
      stock: 12,
      status: true,
      sizes: ['38', '40', '42'],
      colors: ['Cinza'],
      gender: 'Masculino',
      highlight: false,
      newLaunch: true,
      images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200', isMain: true }],
      createdAt: '2026-07-02'
    },
    {
      id: '3',
      name: 'Jaqueta Bomber Couro Eclipse',
      sku: 'BI-JAC-003',
      description: 'Jaqueta bomber em couro legítimo preto fosco com forro acolchoado.',
      price: 1290.00,
      pricePromo: null,
      stock: 3,
      status: true,
      sizes: ['G', 'GG'],
      colors: ['Preto'],
      gender: 'Masculino',
      highlight: true,
      newLaunch: true,
      images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200', isMain: true }],
      createdAt: '2026-07-05'
    }
  ]);

  uploadedImages = signal<{ url: string; isMain: boolean }[]>([]);

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    sku: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    pricePromo: [null],
    stock: [0, [Validators.required, Validators.min(0)]],
    status: [true],
    highlight: [false],
    newLaunch: [false],
    gender: ['Masculino', Validators.required],
    sizes: [[]],
    colors: [[]]
  });

  // Size selections
  availableSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
  selectedSizes = signal<string[]>([]);

  // Color selections
  availableColors = ['Preto', 'Branco', 'Cinza', 'Azul', 'Vermelho', 'Off-White', 'Bege'];
  selectedColors = signal<string[]>([]);

  toggleSize(size: string): void {
    let current = [...this.selectedSizes()];
    if (current.includes(size)) {
      current = current.filter(s => s !== size);
    } else {
      current.push(size);
    }
    this.selectedSizes.set(current);
    this.productForm.get('sizes')?.setValue(current);
  }

  toggleColor(color: string): void {
    let current = [...this.selectedColors()];
    if (current.includes(color)) {
      current = current.filter(c => c !== color);
    } else {
      current.push(color);
    }
    this.selectedColors.set(current);
    this.productForm.get('colors')?.setValue(current);
  }

  openAddModal(): void {
    this.productForm.reset({
      price: 0,
      pricePromo: null,
      stock: 0,
      status: true,
      highlight: false,
      newLaunch: false,
      gender: 'Masculino',
      sizes: [],
      colors: []
    });
    this.selectedSizes.set([]);
    this.selectedColors.set([]);
    this.uploadedImages.set([]);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  // Image actions
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    
    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    const current = [...this.uploadedImages()];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const isMain = current.length === 0 && i === 0;
        current.push({
          url: e.target.result,
          isMain
        });
        this.uploadedImages.set([...current]);
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    const current = [...this.uploadedImages()];
    const removed = current.splice(index, 1)[0];
    
    if (removed.isMain && current.length > 0) {
      current[0].isMain = true;
    }
    
    this.uploadedImages.set(current);
  }

  setMainImage(index: number): void {
    const current = this.uploadedImages().map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    this.uploadedImages.set(current);
  }

  // Image sorting (reordering)
  moveImageUp(index: number): void {
    if (index === 0) return;
    const current = [...this.uploadedImages()];
    const temp = current[index];
    current[index] = current[index - 1];
    current[index - 1] = temp;
    this.uploadedImages.set(current);
  }

  moveImageDown(index: number): void {
    const current = [...this.uploadedImages()];
    if (index === current.length - 1) return;
    const temp = current[index];
    current[index] = current[index + 1];
    current[index + 1] = temp;
    this.uploadedImages.set(current);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formVal = this.productForm.value;
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formVal.name,
      sku: formVal.sku,
      description: formVal.description || '',
      price: formVal.price,
      pricePromo: formVal.pricePromo,
      stock: formVal.stock,
      status: formVal.status,
      sizes: formVal.sizes || [],
      colors: formVal.colors || [],
      gender: formVal.gender,
      highlight: formVal.highlight,
      newLaunch: formVal.newLaunch,
      images: this.uploadedImages().length > 0 ? this.uploadedImages() : [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200', isMain: true }],
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.products.set([newProduct, ...this.products()]);
    this.closeModal();
  }

  deleteProduct(id: string): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.products.set(this.products().filter(p => p.id !== id));
    }
  }
}

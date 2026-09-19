import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminCategory, AdminProduct, AdminProductsService } from '../../../../core/services/admin-products.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminProductsService = inject(AdminProductsService);

  showModal = signal<boolean>(false);
  dragOver = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  feedbackMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Real products and categories from API
  products = signal<AdminProduct[]>([]);
  categories = signal<AdminCategory[]>([]);
  
  // Search filter
  searchTerm = signal<string>('');

  // Editing state
  editingProductId = signal<string | null>(null);

  // Filtered products list
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      (p.category && p.category.name.toLowerCase().includes(term))
    );
  });

  uploadedImages = signal<{ url: string; isMain: boolean; order?: number }[]>([]);

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    sku: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    pricePromo: [null],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required],
    status: [true],
    highlight: [false],
    newLaunch: [false],
    gender: ['Masculino', Validators.required],
    composition: [''],
    fit: [''],
    washCare: [''],
    sizes: [[]],
    colors: [[]]
  });

  // Size selections
  availableSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', '38', '40', '42', '44', '46'];
  selectedSizes = signal<string[]>([]);

  // Color selections
  availableColors = ['Preto', 'Branco', 'Cinza', 'Azul', 'Off-White', 'Bege', 'Verde Militar'];
  selectedColors = signal<string[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Carregar categorias
    this.adminProductsService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });

    // Carregar produtos (incluindo inativos para o admin)
    this.adminProductsService.getProducts(true).subscribe({
      next: (prods) => {
        this.products.set(prods);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.errorMessage.set('Não foi possível conectar com o servidor da Barone Store. Verifique se a API está em execução.');
        this.isLoading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

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
    this.editingProductId.set(null);
    this.feedbackMessage.set(null);

    // Default to first category if available
    const defaultCatId = this.categories().length > 0 ? this.categories()[0].id : '';

    this.productForm.reset({
      name: '',
      description: '',
      sku: '',
      price: 0,
      pricePromo: null,
      stock: 0,
      categoryId: defaultCatId,
      status: true,
      highlight: false,
      newLaunch: false,
      gender: 'Masculino',
      composition: '',
      fit: '',
      washCare: '',
      sizes: [],
      colors: []
    });
    this.selectedSizes.set([]);
    this.selectedColors.set([]);
    this.uploadedImages.set([]);
    this.showModal.set(true);
  }

  openEditModal(product: AdminProduct): void {
    this.editingProductId.set(product.id);
    this.feedbackMessage.set(null);

    // Handle sizes
    const rawSizes = Array.isArray(product.sizes) ? product.sizes : [];
    this.selectedSizes.set(rawSizes);

    // Handle colors
    const rawColors = Array.isArray(product.colors)
      ? product.colors.map(c => typeof c === 'string' ? c : c.name)
      : [];
    this.selectedColors.set(rawColors);

    // Handle images
    const rawImages = (product.images || []).map((img, idx) => ({
      url: img.url,
      isMain: img.isMain ?? idx === 0,
      order: img.order ?? idx
    }));
    this.uploadedImages.set(rawImages);

    this.productForm.reset({
      name: product.name,
      description: product.description || '',
      sku: product.sku,
      price: product.price,
      pricePromo: product.promotionalPrice ?? product.pricePromo ?? null,
      stock: product.stock,
      categoryId: product.categoryId,
      status: product.status,
      highlight: product.highlight ?? false,
      newLaunch: product.newLaunch ?? false,
      gender: product.gender || 'Masculino',
      composition: product.composition || '',
      fit: product.fit || '',
      washCare: product.washCare || '',
      sizes: rawSizes,
      colors: rawColors
    });

    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProductId.set(null);
    this.isSubmitting.set(false);
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
          isMain,
          order: current.length
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

    this.isSubmitting.set(true);
    const formVal = this.productForm.value;

    const payload: Partial<AdminProduct> = {
      name: formVal.name,
      sku: formVal.sku,
      description: formVal.description || '',
      price: Number(formVal.price),
      promotionalPrice: formVal.pricePromo ? Number(formVal.pricePromo) : null,
      pricePromo: formVal.pricePromo ? Number(formVal.pricePromo) : null,
      stock: Number(formVal.stock),
      categoryId: formVal.categoryId,
      status: formVal.status ?? true,
      gender: formVal.gender || 'Masculino',
      highlight: formVal.highlight ?? false,
      newLaunch: formVal.newLaunch ?? false,
      composition: formVal.composition || null,
      fit: formVal.fit || null,
      washCare: formVal.washCare || null,
      sizes: this.selectedSizes(),
      colors: this.selectedColors(),
      images: this.uploadedImages().length > 0
        ? this.uploadedImages()
        : [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85', isMain: true, order: 0 }]
    };

    const isEdit = !!this.editingProductId();
    const action$ = isEdit
      ? this.adminProductsService.updateProduct(this.editingProductId()!, payload)
      : this.adminProductsService.createProduct(payload);

    action$.subscribe({
      next: (savedProduct) => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.showFeedback(
          isEdit ? `Produto "${savedProduct.name}" atualizado com sucesso!` : `Produto "${savedProduct.name}" cadastrado com sucesso!`,
          'success'
        );
        this.loadData();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Erro ao salvar produto:', err);
        const errorMsg = err.error?.message || 'Erro ao processar produto. Verifique se o SKU já existe.';
        this.showFeedback(errorMsg, 'error');
      }
    });
  }

  toggleProductStatus(product: AdminProduct): void {
    this.adminProductsService.toggleProductStatus(product.id).subscribe({
      next: (updated) => {
        this.products.set(
          this.products().map(p => p.id === updated.id ? { ...p, status: updated.status } : p)
        );
        this.showFeedback(
          `Produto "${product.name}" agora está ${updated.status ? 'ATIVO' : 'INATIVO'}.`,
          'success'
        );
      },
      error: (err) => {
        console.error('Erro ao alternar status do produto:', err);
        this.showFeedback('Erro ao alternar status do produto.', 'error');
      }
    });
  }

  deleteProduct(id: string): void {
    const prod = this.products().find(p => p.id === id);
    const prodName = prod ? prod.name : 'este produto';

    if (confirm(`Tem certeza que deseja excluir "${prodName}" permanentemente?`)) {
      this.adminProductsService.deleteProduct(id).subscribe({
        next: () => {
          this.products.set(this.products().filter(p => p.id !== id));
          this.showFeedback(`Produto "${prodName}" excluído com sucesso.`, 'success');
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
          this.showFeedback('Erro ao excluir produto.', 'error');
        }
      });
    }
  }

  private showFeedback(text: string, type: 'success' | 'error'): void {
    this.feedbackMessage.set({ text, type });
    setTimeout(() => {
      this.feedbackMessage.set(null);
    }, 4000);
  }
}

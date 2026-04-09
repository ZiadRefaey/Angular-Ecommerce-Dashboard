import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../core/services/categories.service';

type CreateCategoryForm = FormGroup<{
  name: FormControl<string>;
}>;

@Component({
  selector: 'app-create-category',
  standalone: false,
  templateUrl: './create-category.html',
  styleUrl: './create-category.css',
})
export class CreateCategory {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  readonly categoryForm: CreateCategoryForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
  });

  isSubmitting = false;
  errorMessage = '';

  get nameControl(): FormControl<string> {
    return this.categoryForm.controls.name;
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onCreateCategory(): void {
    if (this.categoryForm.invalid || this.isSubmitting) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      name: this.nameControl.value.trim(),
    };

    this.categoriesService.createCategory(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetForm();
        this.created.emit();
        this.closed.emit();
      },
      error: (err) => {
        console.log(err);
        this.isSubmitting = false;
        this.errorMessage = `Unable to create category right now.\n Error: ${err.error.error}`;
      },
    });
  }

  hasError(errorKey?: string): boolean {
    if (!(this.nameControl.touched || this.nameControl.dirty)) {
      return false;
    }

    if (!errorKey) {
      return this.nameControl.invalid;
    }

    return this.nameControl.hasError(errorKey);
  }

  private resetForm(): void {
    this.errorMessage = '';
    this.isSubmitting = false;
    this.categoryForm.reset({
      name: '',
    });
    this.categoryForm.markAsPristine();
    this.categoryForm.markAsUntouched();
  }
}

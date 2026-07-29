import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Package, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";
import { productSchema } from "../lib/validations";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useProducts";

export function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null | product object
  const [deleting, setDeleting] = useState(null); // null | product object

  const { data: products, isLoading, isError } = useProducts();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {products?.length ?? 0} item{products?.length !== 1 && "s"} in your
            catalog
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New product
        </Button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : isError ? (
        <Card className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-slate-600">Failed to load products.</p>
        </Card>
      ) : products?.length === 0 ? (
        <EmptyState onCreate={openCreate} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={() => openEdit(p)}
              onDelete={() => setDeleting(p)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <ProductFormModal
          initial={editing}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Delete confirmation */}
      {deleting && (
        <DeleteConfirm
          product={deleting}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

/* -------------------- product card -------------------- */
function ProductCard({ product, onEdit, onDelete }) {
  return (
    <Card className="p-5 hover:shadow-md hover:border-slate-300 transition group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {product.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

/* -------------------- empty state -------------------- */
function EmptyState({ onCreate }) {
  return (
    <Card className="p-12 text-center">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Package className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">No products yet</h3>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        Get started by adding your first product.
      </p>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" />
        Add product
      </Button>
    </Card>
  );
}

/* -------------------- create / edit modal -------------------- */
function ProductFormModal({ initial, onClose }) {
  const isEdit = Boolean(initial);
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: update, isPending: updating } = useUpdateProduct();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: initial?.name ?? "" },
  });

  const onSubmit = (data) => {
    if (isEdit) {
      update({ id: initial._id, data }, { onSuccess: onClose });
    } else {
      create(data, { onSuccess: onClose });
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        {isEdit ? "Edit product" : "New product"}
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        {isEdit
          ? "Update the details for this product."
          : "Add a new product to your catalog."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Product name"
          placeholder="e.g. Racket"
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={creating || updating}>
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------- delete confirmation -------------------- */
function DeleteConfirm({ product, onClose }) {
  const { mutate: del, isPending } = useDeleteProduct();

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">Delete product?</h2>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-medium text-slate-900">
              {product.name}
            </span>{" "}
            will be permanently removed. This cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          loading={isPending}
          onClick={() => del(product._id, { onSuccess: onClose })}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}

/* -------------------- generic modal -------------------- */
function Modal({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-slide-up"
      >
        {children}
      </div>
    </div>
  );
}

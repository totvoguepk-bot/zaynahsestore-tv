'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category, ProductVariant } from '@/lib/types';
import { 
  updateProductFields, 
  updateProductVariantFields,
  updateProductCategoryRelationFields,
  addProductToCategory,
  removeProductFromCategory,
  getAllProductsAdmin
} from '@/lib/services/products';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils/whatsapp';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Loader2, 
  PackageOpen,
  FolderOpen,
  Plus,
  Trash2,
  X
} from '@/components/common/Icons';

interface CategoryDetailManagerProps {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryDetailManager({ category, initialProducts }: CategoryDetailManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

  // Bulk update category relation fields
  const handleBulkUpdateRelation = async (fields: { isFeatured?: boolean; isVisible?: boolean }) => {
    if (selectedProductIds.length === 0) return;
    const toastId = toast.loading(`Updating ${selectedProductIds.length} products...`);
    try {
      await Promise.all(selectedProductIds.map(productId => 
        updateProductCategoryRelationFields(productId, category.id, fields)
      ));
      setProducts(prev => prev.map(p => {
        if (!selectedProductIds.includes(p.id)) return p;
        const updatedRelations = p.productCategories?.map(pc => 
          pc.categoryId === category.id ? { ...pc, ...fields } : pc
        ) || [];
        return {
          ...p,
          productCategories: updatedRelations
        };
      }));
      setSelectedProductIds([]);
      toast.success('Category settings updated for selected products', { id: toastId });
    } catch (err) {
      toast.error('Failed to update selected products', { id: toastId });
    }
  };

  // Bulk remove products from category
  const handleBulkRemoveProducts = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`Are you sure you want to remove ${selectedProductIds.length} products from this category?`)) return;
    const toastId = toast.loading(`Removing ${selectedProductIds.length} products...`);
    try {
      await Promise.all(selectedProductIds.map(productId => 
        removeProductFromCategory(productId, category.id)
      ));
      setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
      setSelectedProductIds([]);
      toast.success('Selected products removed from category', { id: toastId });
    } catch (err) {
      toast.error('Failed to remove selected products', { id: toastId });
    }
  };

  // Bulk update variant fields
  const handleBulkUpdateVariantFields = async (variantIds: string[], fields: Partial<ProductVariant>) => {
    if (variantIds.length === 0) return;
    const toastId = toast.loading(`Updating ${variantIds.length} variants...`);
    try {
      await Promise.all(variantIds.map(variantId => 
        updateProductVariantFields(variantId, fields)
      ));
      setProducts(prev => prev.map(p => {
        const hasMatchingVariant = p.variants?.some(v => variantIds.includes(v.id));
        if (!hasMatchingVariant) return p;
        const updatedVariants = p.variants.map(v => variantIds.includes(v.id) ? { ...v, ...fields } : v);
        const computedStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return {
          ...p,
          variants: updatedVariants,
          stock: p.hasVariants ? computedStock : p.stock
        };
      }));
      setSelectedVariantIds(prev => prev.filter(id => !variantIds.includes(id)));
      toast.success('Selected variants updated successfully', { id: toastId });
    } catch (err) {
      toast.error('Failed to update selected variants', { id: toastId });
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allStoreProducts, setAllStoreProducts] = useState<Product[]>([]);
  const [loadingAllProducts, setLoadingAllProducts] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  const openAddModal = async () => {
    setIsAddModalOpen(true);
    setLoadingAllProducts(true);
    try {
      const data = await getAllProductsAdmin();
      setAllStoreProducts(data);
    } catch (err) {
      toast.error('Failed to load store products');
    } finally {
      setLoadingAllProducts(false);
    }
  };

  const handleAddProduct = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addProductToCategory(productId, category.id);
      
      const addedProduct = allStoreProducts.find(p => p.id === productId);
      if (addedProduct) {
        const updatedProduct = {
          ...addedProduct,
          productCategories: [
            ...(addedProduct.productCategories || []),
            {
              productId: productId,
              categoryId: category.id,
              isFeatured: false,
              isVisible: addedProduct.active
            }
          ]
        };
        setProducts(prev => [updatedProduct, ...prev]);
      }
      toast.success('Product added to category successfully');
    } catch (err) {
      toast.error('Failed to add product to category');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    setRemovingProductId(productId);
    try {
      await removeProductFromCategory(productId, category.id);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product removed from category successfully');
    } catch (err) {
      toast.error('Failed to remove product from category');
    } finally {
      setRemovingProductId(null);
    }
  };

  const assignedProductIds = new Set(products.map(p => p.id));
  const availableProducts = allStoreProducts.filter(p => !assignedProductIds.has(p.id));
  
  const filteredModalProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(modalSearchQuery.toLowerCase()))
  );

  const toggleExpand = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Update product fields
  const handleUpdateProduct = async (productId: string, fields: Partial<Product>) => {
    const fieldName = Object.keys(fields)[0];
    const idKey = `${fieldName}-${productId}`;
    setUpdatingIds(prev => ({ ...prev, [idKey]: true }));
    try {
      await updateProductFields(productId, fields);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...fields } : p));
      toast.success('Product updated successfully');
    } catch (err) {
      toast.error('Failed to update product');
    } finally {
      setUpdatingIds(prev => ({ ...prev, [idKey]: false }));
    }
  };

  // Update variant fields
  const handleUpdateVariant = async (productId: string, variantId: string, fields: Partial<ProductVariant>) => {
    const fieldName = Object.keys(fields)[0];
    const idKey = `${fieldName}-${variantId}`;
    setUpdatingIds(prev => ({ ...prev, [idKey]: true }));
    try {
      await updateProductVariantFields(variantId, fields);
      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p;
        const updatedVariants = p.variants.map(v => v.id === variantId ? { ...v, ...fields } : v);
        const computedStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return {
          ...p,
          variants: updatedVariants,
          stock: p.hasVariants ? computedStock : p.stock
        };
      }));
      toast.success('Variant updated successfully');
    } catch (err) {
      toast.error('Failed to update variant');
    } finally {
      setUpdatingIds(prev => ({ ...prev, [idKey]: false }));
    }
  };

  // Update category relation fields
  const handleUpdateRelation = async (productId: string, fields: { isFeatured?: boolean; isVisible?: boolean }) => {
    const fieldName = Object.keys(fields)[0];
    const idKey = `relation-${fieldName}-${productId}`;
    setUpdatingIds(prev => ({ ...prev, [idKey]: true }));
    try {
      await updateProductCategoryRelationFields(productId, category.id, fields);
      
      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p;
        const updatedRelations = p.productCategories?.map(pc => 
          pc.categoryId === category.id ? { ...pc, ...fields } : pc
        ) || [];
        return {
          ...p,
          productCategories: updatedRelations
        };
      }));
      toast.success('Category display settings updated');
    } catch (err) {
      toast.error('Failed to update category display settings');
    } finally {
      setUpdatingIds(prev => ({ ...prev, [idKey]: false }));
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const skuMatch = product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return nameMatch || skuMatch;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <Link href="/admin/categories" className="hover:text-primary transition-all">Categories</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 dark:text-gray-200">{category.name}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/5 dark:bg-white/5 rounded-2xl text-primary dark:text-white border border-gray-100 dark:border-gray-850">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{category.name} Products</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {products.length} {products.length === 1 ? 'product' : 'products'} assigned to this category
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#e94560] text-white hover:bg-[#e94560]/90 transition-all active:scale-95 shadow-sm md:w-auto w-full"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-gray-900 dark:text-white transition-colors">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0f0f1b] text-sm focus:outline-none focus:border-[#1a1a2e] dark:focus:border-gray-600 focus:bg-white transition-all text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Bulk actions for products */}
      {selectedProductIds.length > 0 && (
        <div className="bg-gray-50 dark:bg-[#1f1f3a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
            {selectedProductIds.length} product(s) selected
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkUpdateRelation({ isVisible: true })}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm active:scale-95 min-h-[38px]"
            >
              Set Active
            </button>
            <button
              type="button"
              onClick={() => handleBulkUpdateRelation({ isVisible: false })}
              className="px-3.5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm active:scale-95 min-h-[38px]"
            >
              Set Inactive
            </button>
            <button
              type="button"
              onClick={() => handleBulkUpdateRelation({ isFeatured: true })}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm active:scale-95 min-h-[38px]"
            >
              Set Featured
            </button>
            <button
              type="button"
              onClick={() => handleBulkUpdateRelation({ isFeatured: false })}
              className="px-3.5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm active:scale-95 min-h-[38px]"
            >
              Unfeature
            </button>
            <button
              type="button"
              onClick={handleBulkRemoveProducts}
              className="px-3.5 py-2 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 min-h-[38px]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove Selected</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedProductIds([])}
              className="px-3.5 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all min-h-[38px] active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-[#16162a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden text-gray-900 dark:text-white transition-colors">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <PackageOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No Products Found</h3>
            <p className="text-sm text-gray-400 mt-1">There are no products in this category matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-[#0f0f1b] border-b border-gray-200 dark:border-gray-800 font-bold uppercase text-[10px] tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(filteredProducts.map(p => p.id));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                        className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4 w-10"></th>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Compare Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-center">Featured in Category</th>
                    <th className="py-3.5 px-4 text-center">Visible in Category</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredProducts.map(product => {
                    const isExpanded = expandedProducts[product.id] ?? false;
                    const relation = product.productCategories?.find(pc => pc.categoryId === category.id) || {
                      isFeatured: false,
                      isVisible: product.active
                    };
                    
                    return (
                      <React.Fragment key={product.id}>
                        <tr 
                          className={`hover:bg-gray-50/50 dark:hover:bg-[#1d1d36]/30 transition-all ${
                            !relation.isVisible ? 'opacity-60 bg-gray-50/30 dark:bg-gray-800/10' : ''
                          }`}
                        >
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds(prev => [...prev, product.id]);
                                } else {
                                  setSelectedProductIds(prev => prev.filter(id => id !== product.id));
                                }
                              }}
                              className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-4 px-4 text-center">
                            {product.hasVariants ? (
                              <button
                                type="button"
                                onClick={() => toggleExpand(product.id)}
                                className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#252542] transition-all"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            ) : null}
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-800 flex-shrink-0">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-100 dark:bg-gray-850 flex items-center justify-center text-gray-400 text-[10px]">
                                    No Img
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{product.name}</div>
                                <div className="text-[10px] font-mono text-gray-450 mt-0.5">{product.sku || 'No SKU'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {product.hasVariants ? (
                              <span className="text-xs text-gray-400">Managed per variant</span>
                            ) : (
                              <div className="flex items-center gap-2 max-w-[120px]">
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                  <span className="text-xs pl-2.5 text-gray-400 font-bold">Rs.</span>
                                  <input
                                    type="number"
                                    defaultValue={product.price}
                                    style={{ borderWidth: 0 }}
                                    className="w-20 bg-transparent text-xs text-gray-900 dark:text-white px-2 py-1.5 focus:outline-none"
                                    onBlur={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val) && val !== product.price) {
                                        handleUpdateProduct(product.id, { price: val });
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = parseFloat((e.target as HTMLInputElement).value);
                                        if (!isNaN(val)) {
                                          handleUpdateProduct(product.id, { price: val });
                                          (e.target as HTMLInputElement).blur();
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                {updatingIds[`price-${product.id}`] && (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e94560]" />
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {product.hasVariants ? (
                              <span className="text-xs text-gray-400">Managed per variant</span>
                            ) : (
                              <div className="flex items-center gap-2 max-w-[120px]">
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                  <span className="text-xs pl-2.5 text-gray-400 font-bold">Rs.</span>
                                  <input
                                    type="number"
                                    defaultValue={product.comparePrice || ''}
                                    placeholder="—"
                                    style={{ borderWidth: 0 }}
                                    className="w-20 bg-transparent text-xs text-gray-900 dark:text-white px-2 py-1.5 focus:outline-none"
                                    onBlur={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val) && val !== product.comparePrice) {
                                        handleUpdateProduct(product.id, { comparePrice: val });
                                      } else if (e.target.value === '' && product.comparePrice !== undefined) {
                                        handleUpdateProduct(product.id, { comparePrice: undefined });
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = parseFloat((e.target as HTMLInputElement).value);
                                        if (!isNaN(val)) {
                                          handleUpdateProduct(product.id, { comparePrice: val });
                                          (e.target as HTMLInputElement).blur();
                                        } else if ((e.target as HTMLInputElement).value === '') {
                                          handleUpdateProduct(product.id, { comparePrice: undefined });
                                          (e.target as HTMLInputElement).blur();
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                {updatingIds[`comparePrice-${product.id}`] && (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e94560]" />
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {product.hasVariants ? (
                              <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                                Variants ({product.stock})
                              </span>
                            ) : (
                              <div className="flex items-center gap-2 max-w-[120px]">
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                  <input
                                    type="number"
                                    defaultValue={product.stock}
                                    style={{ borderWidth: 0 }}
                                    className="w-16 bg-transparent text-xs text-gray-900 dark:text-white px-2.5 py-1.5 focus:outline-none"
                                    onBlur={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val !== product.stock) {
                                        handleUpdateProduct(product.id, { stock: val });
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = parseInt((e.target as HTMLInputElement).value, 10);
                                        if (!isNaN(val)) {
                                          handleUpdateProduct(product.id, { stock: val });
                                          (e.target as HTMLInputElement).blur();
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                {updatingIds[`stock-${product.id}`] && (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e94560]" />
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUpdateRelation(product.id, { isFeatured: !relation.isFeatured })}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  relation.isFeatured ? 'bg-[#e94560]' : 'bg-gray-200 dark:bg-gray-800'
                                }`}
                                role="switch"
                                aria-checked={relation.isFeatured}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                    relation.isFeatured ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              {updatingIds[`relation-isFeatured-${product.id}`] && (
                                <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUpdateRelation(product.id, { isVisible: !relation.isVisible })}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  relation.isVisible ? 'bg-[#e94560]' : 'bg-gray-200 dark:bg-gray-800'
                                }`}
                                role="switch"
                                aria-checked={relation.isVisible}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                    relation.isVisible ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              {updatingIds[`relation-isVisible-${product.id}`] && (
                                <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/admin/products/${product.id}`}
                                className="inline-flex p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-650 hover:bg-gray-50 dark:hover:bg-[#1d1d36] transition-all"
                                title="Edit full product details"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(product.id)}
                                disabled={removingProductId === product.id}
                                className="inline-flex p-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50"
                                title="Remove from category"
                              >
                                {removingProductId === product.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>                        {/* Sub-table for variants */}
                        {product.hasVariants && isExpanded && (
                          <tr>
                            <td colSpan={9} className="bg-gray-50/40 dark:bg-[#0e0e1e]/40 p-4">
                              {product.variants.some(v => selectedVariantIds.includes(v.id)) && (
                                <div className="ml-10 bg-gray-100/95 dark:bg-[#1c1c36] p-4 rounded-xl border border-gray-200 dark:border-gray-800 mb-3 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-1 duration-150">
                                  <div className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                    {product.variants.filter(v => selectedVariantIds.includes(v.id)).length} variant(s) selected
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3.5">
                                    {/* Bulk Set Price */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Price:</span>
                                      <input
                                        type="number"
                                        placeholder="Set Price"
                                        id={`bulk-price-input-${product.id}`}
                                        className="w-28 px-3 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-primary text-gray-900 dark:text-white font-medium"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.getElementById(`bulk-price-input-${product.id}`) as HTMLInputElement;
                                          const val = parseFloat(input?.value);
                                          if (!isNaN(val)) {
                                            const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                            handleBulkUpdateVariantFields(vIds, { price: val });
                                            if (input) input.value = '';
                                          } else {
                                            toast.error('Please enter a valid price');
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-lg text-xs font-bold transition-all"
                                      >
                                        Apply
                                      </button>
                                    </div>

                                    {/* Bulk Set Compare Price */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Compare:</span>
                                      <input
                                        type="number"
                                        placeholder="Set Compare"
                                        id={`bulk-compare-input-${product.id}`}
                                        className="w-28 px-3 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-primary text-gray-900 dark:text-white font-medium"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.getElementById(`bulk-compare-input-${product.id}`) as HTMLInputElement;
                                          const val = parseFloat(input?.value);
                                          if (!isNaN(val)) {
                                            const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                            handleBulkUpdateVariantFields(vIds, { comparePrice: val });
                                            if (input) input.value = '';
                                          } else if (input?.value === '') {
                                            const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                            handleBulkUpdateVariantFields(vIds, { comparePrice: undefined });
                                          } else {
                                            toast.error('Please enter a valid compare price');
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-lg text-xs font-bold transition-all"
                                      >
                                        Apply
                                      </button>
                                    </div>

                                    {/* Bulk Set Stock */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Stock:</span>
                                      <input
                                        type="number"
                                        placeholder="Set Stock"
                                        id={`bulk-stock-input-${product.id}`}
                                        className="w-28 px-3 py-1.5 bg-white dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-primary text-gray-900 dark:text-white font-medium"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.getElementById(`bulk-stock-input-${product.id}`) as HTMLInputElement;
                                          const val = parseInt(input?.value, 10);
                                          if (!isNaN(val)) {
                                            const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                            handleBulkUpdateVariantFields(vIds, { stock: val });
                                            if (input) input.value = '';
                                          } else {
                                            toast.error('Please enter a valid stock number');
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-lg text-xs font-bold transition-all"
                                      >
                                        Apply
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const vIds = product.variants.map(v => v.id);
                                        setSelectedVariantIds(prev => prev.filter(id => !vIds.includes(id)));
                                      }}
                                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-350 rounded-lg text-xs font-bold transition-all"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="ml-10 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-inner">
                                <table className="w-full text-left text-xs text-gray-600 dark:text-gray-450">
                                  <thead className="bg-gray-100/70 dark:bg-[#121226] border-b border-gray-200 dark:border-gray-800 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <tr>
                                      <th className="py-2.5 px-4 w-10 text-center">
                                        <input
                                          type="checkbox"
                                          checked={product.variants.length > 0 && product.variants.every(v => selectedVariantIds.includes(v.id))}
                                          onChange={(e) => {
                                            const vIds = product.variants.map(v => v.id);
                                            if (e.target.checked) {
                                              setSelectedVariantIds(prev => [...new Set([...prev, ...vIds])]);
                                            } else {
                                              setSelectedVariantIds(prev => prev.filter(id => !vIds.includes(id)));
                                            }
                                          }}
                                          className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] h-3 w-3 cursor-pointer"
                                        />
                                      </th>
                                      <th className="py-2.5 px-4">Variant Option</th>
                                      <th className="py-2.5 px-4">Price</th>
                                      <th className="py-2.5 px-4">Compare Price</th>
                                      <th className="py-2.5 px-4">Stock Level</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-150 dark:divide-gray-800 bg-white/50 dark:bg-[#16162a]/50">
                                    {product.variants.map(variant => {
                                      const variantLabel = [variant.color, variant.size, variant.material, variant.customValue].filter(Boolean).join(' / ') || 'Default';
                                      
                                      return (
                                        <tr key={variant.id} className="hover:bg-gray-150/20 dark:hover:bg-[#1e1e3b]/20 transition-colors">
                                          <td className="py-2.5 px-4 text-center">
                                            <input
                                              type="checkbox"
                                              checked={selectedVariantIds.includes(variant.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedVariantIds(prev => [...prev, variant.id]);
                                                } else {
                                                  setSelectedVariantIds(prev => prev.filter(id => id !== variant.id));
                                                }
                                              }}
                                              className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] h-3.5 w-3.5 cursor-pointer"
                                            />
                                          </td>
                                          <td className="py-2.5 px-4 font-semibold text-gray-855 dark:text-gray-200">
                                            <div className="flex items-center gap-2">
                                              {variant.colorHex && (
                                                <span className="h-3 w-3 rounded-full flex-shrink-0 border border-gray-300" style={{ background: variant.colorHex }} />
                                              )}
                                              {variantLabel}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-4">
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center border border-gray-250 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                                <span className="text-[10px] pl-2 text-gray-400 font-bold">Rs.</span>
                                                <input
                                                  type="number"
                                                  defaultValue={variant.price || ''}
                                                  placeholder={product.price.toString()}
                                                  style={{ borderWidth: 0 }}
                                                  className="w-16 bg-transparent text-xs text-gray-900 dark:text-white px-2 py-1 focus:outline-none"
                                                  onBlur={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    if (!isNaN(val) && val !== variant.price) {
                                                      handleUpdateVariant(product.id, variant.id, { price: val });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      const val = parseFloat((e.target as HTMLInputElement).value);
                                                      if (!isNaN(val)) {
                                                        handleUpdateVariant(product.id, variant.id, { price: val });
                                                        (e.target as HTMLInputElement).blur();
                                                      }
                                                    }
                                                  }}
                                                />
                                              </div>
                                              {updatingIds[`price-${variant.id}`] && (
                                                <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-4">
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center border border-gray-250 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                                <span className="text-[10px] pl-2 text-gray-400 font-bold">Rs.</span>
                                                <input
                                                  type="number"
                                                  defaultValue={variant.comparePrice || ''}
                                                  placeholder="—"
                                                  style={{ borderWidth: 0 }}
                                                  className="w-16 bg-transparent text-xs text-gray-900 dark:text-white px-2 py-1 focus:outline-none"
                                                  onBlur={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    if (!isNaN(val) && val !== variant.comparePrice) {
                                                      handleUpdateVariant(product.id, variant.id, { comparePrice: val });
                                                    } else if (e.target.value === '' && variant.comparePrice !== undefined) {
                                                      handleUpdateVariant(product.id, variant.id, { comparePrice: undefined });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      const val = parseFloat((e.target as HTMLInputElement).value);
                                                      if (!isNaN(val)) {
                                                        handleUpdateVariant(product.id, variant.id, { comparePrice: val });
                                                        (e.target as HTMLInputElement).blur();
                                                      } else if ((e.target as HTMLInputElement).value === '') {
                                                        handleUpdateVariant(product.id, variant.id, { comparePrice: undefined });
                                                        (e.target as HTMLInputElement).blur();
                                                      }
                                                    }
                                                  }}
                                                />
                                              </div>
                                              {updatingIds[`comparePrice-${variant.id}`] && (
                                                <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-4">
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center border border-gray-250 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                                <input
                                                  type="number"
                                                  defaultValue={variant.stock}
                                                  style={{ borderWidth: 0 }}
                                                  className="w-14 bg-transparent text-xs text-gray-900 dark:text-white px-2 py-1 focus:outline-none"
                                                  onBlur={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (!isNaN(val) && val !== variant.stock) {
                                                      handleUpdateVariant(product.id, variant.id, { stock: val });
                                                    }
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      const val = parseInt((e.target as HTMLInputElement).value, 10);
                                                      if (!isNaN(val)) {
                                                        handleUpdateVariant(product.id, variant.id, { stock: val });
                                                        (e.target as HTMLInputElement).blur();
                                                      }
                                                    }
                                                  }}
                                                />
                                              </div>
                                              {updatingIds[`stock-${variant.id}`] && (
                                                <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
              {filteredProducts.map(product => {
                const isExpanded = expandedProducts[product.id] ?? false;
                const relation = product.productCategories?.find(pc => pc.categoryId === category.id) || {
                  isFeatured: false,
                  isVisible: product.active
                };
                
                return (
                  <div 
                    key={product.id}
                    className={`bg-white dark:bg-[#16162a] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 text-gray-900 dark:text-white transition-all ${
                      !relation.isVisible ? 'opacity-65 bg-gray-50/50 dark:bg-gray-900/30' : ''
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(prev => [...prev, product.id]);
                            } else {
                              setSelectedProductIds(prev => prev.filter(id => id !== product.id));
                            }
                          }}
                          className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] h-4 w-4 cursor-pointer flex-shrink-0"
                        />
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 dark:bg-gray-850 flex items-center justify-center text-gray-400 text-[10px]">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{product.name}</div>
                          {product.sku && (
                            <div className="text-[10px] font-mono text-gray-550 dark:text-gray-400 mt-0.5">
                              SKU: {product.sku}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons on top right */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-650 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1d1d36] transition-all min-h-[36px] min-w-[36px] flex items-center justify-center bg-white dark:bg-transparent"
                          title="Edit full product details"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          disabled={removingProductId === product.id}
                          className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50 min-h-[36px] min-w-[36px] flex items-center justify-center bg-white dark:bg-transparent"
                          title="Remove from category"
                        >
                          {removingProductId === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Display Settings / Toggles */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-[#0f0f1b] p-3 rounded-xl">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Featured in Cat</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateRelation(product.id, { isFeatured: !relation.isFeatured })}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              relation.isFeatured ? 'bg-[#e94560]' : 'bg-gray-200 dark:bg-gray-800'
                            }`}
                            role="switch"
                            aria-checked={relation.isFeatured}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                relation.isFeatured ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          {updatingIds[`relation-isFeatured-${product.id}`] && (
                            <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Visible in Cat</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateRelation(product.id, { isVisible: !relation.isVisible })}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              relation.isVisible ? 'bg-[#e94560]' : 'bg-gray-200 dark:bg-gray-800'
                            }`}
                            role="switch"
                            aria-checked={relation.isVisible}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                relation.isVisible ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          {updatingIds[`relation-isVisible-${product.id}`] && (
                            <Loader2 className="h-3 w-3 animate-spin text-[#e94560]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing / Stock / Variants section */}
                    {product.hasVariants ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#0f0f1b] p-3 rounded-xl">
                          <span className="text-xs font-bold text-gray-550 dark:text-gray-400">
                            Total Stock: <span className="text-gray-900 dark:text-white font-black">{product.stock}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleExpand(product.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1d1d36] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-755 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252542] transition-all min-h-[36px]"
                          >
                            <span>{isExpanded ? 'Hide Variants' : 'Show Variants'}</span>
                            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {/* Variants list on mobile */}
                        {isExpanded && (
                          <div className="space-y-3 pl-2 border-l-2 border-gray-200 dark:border-gray-800">
                            {product.variants.some(v => selectedVariantIds.includes(v.id)) && (
                              <div className="bg-gray-50 dark:bg-[#0f0f1b] p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
                                <div className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                  {product.variants.filter(v => selectedVariantIds.includes(v.id)).length} variant(s) selected
                                </div>
                                <div className="grid grid-cols-1 gap-2.5">
                                  {/* Price input */}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      placeholder="Set Price"
                                      id={`bulk-price-input-mobile-${product.id}`}
                                      className="flex-1 px-3 py-2 bg-white dark:bg-[#1d1d36] border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-primary text-gray-900 dark:text-white min-h-[40px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.getElementById(`bulk-price-input-mobile-${product.id}`) as HTMLInputElement;
                                        const val = parseFloat(input?.value);
                                        if (!isNaN(val)) {
                                          const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                          handleBulkUpdateVariantFields(vIds, { price: val });
                                          if (input) input.value = '';
                                        } else {
                                          toast.error('Please enter a valid price');
                                        }
                                      }}
                                      className="px-3 py-2 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-xl text-xs font-bold min-h-[40px]"
                                    >
                                      Apply
                                    </button>
                                  </div>

                                  {/* Compare input */}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      placeholder="Set Compare Price"
                                      id={`bulk-compare-input-mobile-${product.id}`}
                                      className="flex-1 px-3 py-2 bg-white dark:bg-[#1d1d36] border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-primary text-gray-900 dark:text-white min-h-[40px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.getElementById(`bulk-compare-input-mobile-${product.id}`) as HTMLInputElement;
                                        const val = parseFloat(input?.value);
                                        if (!isNaN(val)) {
                                          const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                          handleBulkUpdateVariantFields(vIds, { comparePrice: val });
                                          if (input) input.value = '';
                                        } else if (input?.value === '') {
                                          const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                          handleBulkUpdateVariantFields(vIds, { comparePrice: undefined });
                                        } else {
                                          toast.error('Please enter a valid compare price');
                                        }
                                      }}
                                      className="px-3 py-2 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-xl text-xs font-bold min-h-[40px]"
                                    >
                                      Apply
                                    </button>
                                  </div>

                                  {/* Stock input */}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      placeholder="Set Stock"
                                      id={`bulk-stock-input-mobile-${product.id}`}
                                      className="flex-1 px-3 py-2 bg-white dark:bg-[#1d1d36] border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-primary text-gray-900 dark:text-white min-h-[40px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.getElementById(`bulk-stock-input-mobile-${product.id}`) as HTMLInputElement;
                                        const val = parseInt(input?.value, 10);
                                        if (!isNaN(val)) {
                                          const vIds = product.variants.filter(v => selectedVariantIds.includes(v.id)).map(v => v.id);
                                          handleBulkUpdateVariantFields(vIds, { stock: val });
                                          if (input) input.value = '';
                                        } else {
                                          toast.error('Please enter a valid stock number');
                                        }
                                      }}
                                      className="px-3 py-2 bg-[#e94560] hover:bg-[#e94560]/95 text-white rounded-xl text-xs font-bold min-h-[40px]"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {product.variants.map(variant => {
                              const variantLabel = [variant.color, variant.size, variant.material, variant.customValue].filter(Boolean).join(' / ') || 'Default';
                              
                              return (
                                <div 
                                  key={variant.id}
                                  className="bg-gray-50/50 dark:bg-[#0f0f1b]/50 p-3 rounded-xl border border-gray-150 dark:border-gray-800 space-y-2.5"
                                >
                                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                    <input
                                      type="checkbox"
                                      checked={selectedVariantIds.includes(variant.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedVariantIds(prev => [...prev, variant.id]);
                                        } else {
                                          setSelectedVariantIds(prev => prev.filter(id => id !== variant.id));
                                        }
                                      }}
                                      className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] h-3.5 w-3.5 cursor-pointer flex-shrink-0"
                                    />
                                    {variant.colorHex && (
                                      <span className="h-3.5 w-3.5 rounded-full border border-gray-300 flex-shrink-0" style={{ background: variant.colorHex }} />
                                    )}
                                    {variantLabel}
                                  </div>

                                  <div className="grid grid-cols-3 gap-2.5">
                                    <div>
                                      <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Price</label>
                                      <div className="flex items-center gap-1">
                                        <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                          <input
                                            type="number"
                                            defaultValue={variant.price || ''}
                                            placeholder={product.price.toString()}
                                            style={{ borderWidth: 0 }}
                                            className="w-full bg-transparent text-xs text-gray-900 dark:text-white px-2 py-2 focus:outline-none min-h-[40px]"
                                            onBlur={(e) => {
                                              const val = parseFloat(e.target.value);
                                              if (!isNaN(val) && val !== variant.price) {
                                                handleUpdateVariant(product.id, variant.id, { price: val });
                                              }
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = parseFloat((e.target as HTMLInputElement).value);
                                                if (!isNaN(val)) {
                                                  handleUpdateVariant(product.id, variant.id, { price: val });
                                                  (e.target as HTMLInputElement).blur();
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                        {updatingIds[`price-${variant.id}`] && (
                                          <Loader2 className="h-3 w-3 animate-spin text-[#e94560] flex-shrink-0" />
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Compare</label>
                                      <div className="flex items-center gap-1">
                                        <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                          <input
                                            type="number"
                                            defaultValue={variant.comparePrice || ''}
                                            placeholder="—"
                                            style={{ borderWidth: 0 }}
                                            className="w-full bg-transparent text-xs text-gray-900 dark:text-white px-2 py-2 focus:outline-none min-h-[40px]"
                                            onBlur={(e) => {
                                              const val = parseFloat(e.target.value);
                                              if (!isNaN(val) && val !== variant.comparePrice) {
                                                handleUpdateVariant(product.id, variant.id, { comparePrice: val });
                                              } else if (e.target.value === '' && variant.comparePrice !== undefined) {
                                                handleUpdateVariant(product.id, variant.id, { comparePrice: undefined });
                                              }
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = parseFloat((e.target as HTMLInputElement).value);
                                                if (!isNaN(val)) {
                                                  handleUpdateVariant(product.id, variant.id, { comparePrice: val });
                                                  (e.target as HTMLInputElement).blur();
                                                } else if ((e.target as HTMLInputElement).value === '') {
                                                  handleUpdateVariant(product.id, variant.id, { comparePrice: undefined });
                                                  (e.target as HTMLInputElement).blur();
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                        {updatingIds[`comparePrice-${variant.id}`] && (
                                          <Loader2 className="h-3 w-3 animate-spin text-[#e94560] flex-shrink-0" />
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Stock</label>
                                      <div className="flex items-center gap-1">
                                        <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-primary transition-all">
                                          <input
                                            type="number"
                                            defaultValue={variant.stock}
                                            style={{ borderWidth: 0 }}
                                            className="w-full bg-transparent text-xs text-gray-900 dark:text-white px-2 py-2 focus:outline-none min-h-[40px]"
                                            onBlur={(e) => {
                                              const val = parseInt(e.target.value, 10);
                                              if (!isNaN(val) && val !== variant.stock) {
                                                handleUpdateVariant(product.id, variant.id, { stock: val });
                                              }
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = parseInt((e.target as HTMLInputElement).value, 10);
                                                if (!isNaN(val)) {
                                                  handleUpdateVariant(product.id, variant.id, { stock: val });
                                                  (e.target as HTMLInputElement).blur();
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                        {updatingIds[`stock-${variant.id}`] && (
                                          <Loader2 className="h-3 w-3 animate-spin text-[#e94560] flex-shrink-0" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2.5 bg-gray-50 dark:bg-[#0f0f1b] p-3 rounded-xl">
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Price</label>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-[#e94560] transition-all">
                              <input
                                type="number"
                                defaultValue={product.price}
                                style={{ borderWidth: 0 }}
                                className="w-full bg-transparent text-xs text-gray-900 dark:text-white px-2 py-2 focus:outline-none min-h-[40px]"
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val !== product.price) {
                                    handleUpdateProduct(product.id, { price: val });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = parseFloat((e.target as HTMLInputElement).value);
                                    if (!isNaN(val)) {
                                      handleUpdateProduct(product.id, { price: val });
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {updatingIds[`price-${product.id}`] && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e94560] flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Compare At</label>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-[#e94560] transition-all">
                              <input
                                type="number"
                                defaultValue={product.comparePrice || ''}
                                placeholder="—"
                                style={{ borderWidth: 0 }}
                                className="w-full bg-transparent text-xs text-gray-900 dark:text-white px-2 py-2 focus:outline-none min-h-[40px]"
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val !== product.comparePrice) {
                                    handleUpdateProduct(product.id, { comparePrice: val });
                                  } else if (e.target.value === '' && product.comparePrice !== undefined) {
                                    handleUpdateProduct(product.id, { comparePrice: undefined });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = parseFloat((e.target as HTMLInputElement).value);
                                    if (!isNaN(val)) {
                                      handleUpdateProduct(product.id, { comparePrice: val });
                                      (e.target as HTMLInputElement).blur();
                                    } else if ((e.target as HTMLInputElement).value === '') {
                                      handleUpdateProduct(product.id, { comparePrice: undefined });
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {updatingIds[`comparePrice-${product.id}`] && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e94560] flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Stock</label>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#0f0f1b] focus-within:border-[#e94560] transition-all">
                              <input
                                type="number"
                                defaultValue={product.stock}
                                style={{ borderWidth: 0 }}
                                className="w-full bg-transparent text-xs text-gray-900 dark:text-white px-2 py-2 focus:outline-none min-h-[40px]"
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== product.stock) {
                                    handleUpdateProduct(product.id, { stock: val });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = parseInt((e.target as HTMLInputElement).value, 10);
                                    if (!isNaN(val)) {
                                      handleUpdateProduct(product.id, { stock: val });
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {updatingIds[`stock-${product.id}`] && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e94560] flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-350">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#16162a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden overscroll-contain animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-800">
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                Add Products to {category.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Search Input in Modal */}
            <div className="my-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-[#0f0f1b] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Product List */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
              {loadingAllProducts ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#e94560]" />
                </div>
              ) : filteredModalProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No products available to add.
                </div>
              ) : (
                filteredModalProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-150 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-[#1d1d36]/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-800 flex-shrink-0">
                        {prod.images?.[0] ? (
                          <Image
                            src={prod.images[0].url}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-100 dark:bg-gray-850 flex items-center justify-center text-gray-400 text-[10px]">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{prod.name}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{prod.sku || 'No SKU'} | Rs. {prod.price}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddProduct(prod.id)}
                      disabled={addingProductId === prod.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#e94560]/10 hover:bg-[#e94560]/20 text-[#e94560] transition-all disabled:opacity-50"
                    >
                      {addingProductId === prod.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

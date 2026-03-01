import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/app/data/products";
import { api } from "@/app/services/api";
import { getProductImageUrl } from "@/app/utils/imageUrl";

type ProductDraft = {
  sku: string;
  name: string;
  category: "Food" | "Clothing" | "Decor";
  price: string;
  stock: string;
  lowStockThreshold: string;
  weight: string;
  origin: string;
  description: string;
  imageUrl: string;
};

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<number, ProductDraft>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductDraft>({
    sku: "",
    name: "",
    category: "Food",
    price: "",
    stock: "",
    lowStockThreshold: "",
    weight: "",
    origin: "",
    description: "",
    imageUrl: "/placeholder-product.svg",
  });
  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null);
  const [productImageFiles, setProductImageFiles] = useState<Record<number, File | null>>({});

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
    [products]
  );
  const outOfStockCount = useMemo(() => products.filter((p) => p.stock === 0).length, [products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const backendProducts = await api.products.list();
      const mapped: Product[] = backendProducts.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        category: p.category as Product["category"],
        image: p.imageUrl || "/placeholder-product.svg",
        origin: p.origin,
        weight: Number(p.weight),
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        inStock: p.stock > 0,
      }));

      const initialDraft: Record<number, ProductDraft> = {};
      backendProducts.forEach((p) => {
        initialDraft[p.id] = {
          sku: p.sku,
          name: p.name,
          category: p.category as "Food" | "Clothing" | "Decor",
          price: String(p.price),
          stock: String(p.stock),
          lowStockThreshold: String(p.lowStockThreshold),
          weight: String(p.weight),
          origin: p.origin,
          description: p.description || "",
          // Use backend imageUrl directly (supports base64 data URLs)
          imageUrl: p.imageUrl || "/placeholder-product.svg",
        };
      });

      setProducts(mapped);
      setDraft(initialDraft);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const save = async (p: Product) => {
    const d = draft[p.id];
    if (!d) return;

    setSavingId(p.id);
    try {
      // Handle image upload if file is selected
      let imageUrl = d.imageUrl;
      if (productImageFiles[p.id]) {
        imageUrl = await convertFileToBase64(productImageFiles[p.id]!);
      }

      const updated = await api.products.update(p.id, {
        id: p.id,
        sku: d.sku.trim(),
        name: d.name.trim(),
        category: d.category,
        price: String(Number(d.price)),
        stock: Math.max(0, parseInt(d.stock || "0", 10) || 0),
        lowStockThreshold: Math.max(0, parseInt(d.lowStockThreshold || "0", 10) || 0),
        weight: String(Number(d.weight)),
        origin: d.origin.trim(),
        description: d.description.trim() || null,
        imageUrl: imageUrl, // This now contains the base64 data URL if file was uploaded
      } as any);

      // Update draft with the saved imageUrl to keep it in sync
      setDraft((prev) => ({
        ...prev,
        [p.id]: { ...prev[p.id]!, imageUrl: updated.imageUrl || imageUrl },
      }));

      // Don't clear the file immediately - keep it to show it was uploaded
      // The file will be cleared when a new file is selected or page reloads

      // Reload products to get updated data
      await loadProducts();
      
      // After reload, clear the file since it's now saved
      setProductImageFiles((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
    } catch (e) {
      console.error(e);
      alert("Failed to save. Check backend logs and try again.");
    } finally {
      setSavingId(null);
    }
  };


  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Handle image upload if file is selected
      let imageUrl = newProduct.imageUrl.trim() || "/placeholder-product.svg";
      if (newProductImageFile) {
        imageUrl = await convertFileToBase64(newProductImageFile);
      }

      const productData = {
        sku: newProduct.sku.trim(),
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: String(Number(newProduct.price)),
        stock: parseInt(newProduct.stock, 10) || 0,
        lowStockThreshold: parseInt(newProduct.lowStockThreshold, 10) || 0,
        weight: String(Number(newProduct.weight)),
        origin: newProduct.origin.trim(),
        description: newProduct.description.trim() || null,
        imageUrl: imageUrl,
      };

      await api.products.create(productData);

      // Reset form
      setNewProduct({
        sku: "",
        name: "",
        category: "Food",
        price: "",
        stock: "",
        lowStockThreshold: "",
        weight: "",
        origin: "",
        description: "",
        imageUrl: "/placeholder-product.svg",
      });
      setNewProductImageFile(null);
      setShowAddForm(false);

      // Reload products
      await loadProducts();
    } catch (e: any) {
      alert(`Failed to create product: ${e?.message || "Unknown error"}`);
    } finally {
      setCreating(false);
    }
  };

  const handleImageUpload = async (productId: number, file: File | null) => {
    if (file) {
      setProductImageFiles((prev) => ({ ...prev, [productId]: file }));
      const base64 = await convertFileToBase64(file);
      setDraft((prev) => ({
        ...prev,
        [productId]: { ...prev[productId]!, imageUrl: base64 },
      }));
    }
  };

  const handleNewProductImageUpload = async (file: File | null) => {
    if (file) {
      setNewProductImageFile(file);
      const base64 = await convertFileToBase64(file);
      setNewProduct({ ...newProduct, imageUrl: base64 });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
      <p className="text-gray-600 mb-8">Manage products, update stock, and edit all product details.</p>

      <div className="flex justify-between items-center mb-6">
        <div className="grid md:grid-cols-3 gap-4 flex-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Total products</div>
            <div className="text-3xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Low stock</div>
            <div className="text-3xl font-bold text-orange-600">{lowStockCount}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Out of stock</div>
            <div className="text-3xl font-bold text-red-600">{outOfStockCount}</div>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="ml-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
          {showAddForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">SKU *</label>
              <input
                type="text"
                required
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="NEP-FOOD-006"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Product Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                required
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as "Food" | "Clothing" | "Decor" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Food">Food</option>
                <option value="Clothing">Clothing</option>
                <option value="Decor">Decor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Low Stock Threshold *</label>
              <input
                type="number"
                required
                min="0"
                value={newProduct.lowStockThreshold}
                onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={newProduct.weight}
                onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Origin *</label>
              <input
                type="text"
                required
                value={newProduct.origin}
                onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Kathmandu, Nepal"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="Product description..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleNewProductImageUpload(e.target.files?.[0] || null)}
                      className="hidden"
                      id="new-product-image-upload"
                    />
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                      Choose File
                    </span>
                  </label>
                  {newProductImageFile && (
                    <p className="text-xs text-green-600 font-semibold mt-2">
                      ✓ {newProductImageFile.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Upload an image file or use URL below</p>
                </div>
                {newProduct.imageUrl && (
                  <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={getProductImageUrl(newProduct.imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getProductImageUrl(null);
                      }}
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={newProduct.imageUrl.startsWith("data:") ? "" : newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="/placeholder-product.svg or image URL"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-gray-600">Loading…</div>
      ) : error ? (
        <div className="py-16 text-center text-red-600">{error}</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="p-2">Image</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Low Stock</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Origin</th>
                <th className="p-2">Status</th>
                <th className="p-2 sticky right-0 bg-gray-50 z-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const d = draft[p.id];
                if (!d) return null;
                const isLow = parseInt(d.stock || "0", 10) > 0 && parseInt(d.stock || "0", 10) <= parseInt(d.lowStockThreshold || "0", 10);
                const isOut = parseInt(d.stock || "0", 10) === 0;
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-200 ${isOut ? "bg-red-50" : isLow ? "bg-orange-50" : ""}`}
                  >
                    <td className="p-2">
                      <div className="flex flex-col gap-1">
                        <div className="w-12 h-12 border border-gray-300 rounded overflow-hidden bg-gray-100">
                          <img
                            src={getProductImageUrl(d.imageUrl)}
                            alt={d.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getProductImageUrl(null);
                            }}
                          />
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(p.id, e.target.files?.[0] || null)}
                            className="hidden"
                            id={`image-upload-${p.id}`}
                          />
                          <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition text-center w-full">
                            Choose File
                          </span>
                        </label>
                        {productImageFiles[p.id] && (
                          <p className="text-xs text-green-600 font-semibold">
                            ✓ {productImageFiles[p.id]?.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-xs"
                        type="text"
                        value={d.sku}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, sku: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent font-semibold text-xs"
                        type="text"
                        value={d.name}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, name: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
                        value={d.category}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, category: e.target.value as "Food" | "Clothing" | "Decor" } }))}
                      >
                        <option value="Food">Food</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Decor">Decor</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
                        type="number"
                        step="0.01"
                        min={0}
                        value={d.price}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, price: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
                        type="number"
                        step="1"
                        min={0}
                        value={d.stock}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, stock: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
                        type="number"
                        step="1"
                        min={0}
                        value={d.lowStockThreshold}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, lowStockThreshold: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
                        type="number"
                        step="0.01"
                        min={0}
                        value={d.weight}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, weight: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
                        type="text"
                        value={d.origin}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [p.id]: { ...prev[p.id]!, origin: e.target.value } }))}
                      />
                    </td>
                    <td className="p-2">
                      {isOut ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">
                          Out
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs">
                          Low
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-2 sticky right-0 bg-white z-10 border-l border-gray-200">
                      <button
                        type="button"
                        className="w-full px-3 py-2 bg-orange-600 text-white font-bold rounded text-xs hover:bg-orange-700 disabled:opacity-50 whitespace-nowrap"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          save(p);
                        }}
                        disabled={savingId === p.id}
                      >
                        {savingId === p.id ? "Saving…" : "💾 Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  inStock: number;
}

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    id: "",
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    inStock: 0,
  });
  const { toast } = useToast();

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData: ProductFormData) =>
      apiRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(productData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...productData }: ProductFormData) =>
      apiRequest(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      resetForm();
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) =>
      apiRequest(`/api/admin/products/${productId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      inStock: 0,
    });
  };

  const handleCreateProduct = () => {
    setIsCreateDialogOpen(true);
    resetForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
    });
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate(formData);
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const isDialogOpen = isCreateDialogOpen || editingProduct !== null;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6" data-testid="page-dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">
          Admin Dashboard
        </h1>
        <Button
          onClick={handleCreateProduct}
          className="flex items-center gap-2"
          data-testid="button-create-product"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.inStock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      data-testid={`button-edit-${product.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCancel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-id">Product ID</Label>
              <Input
                id="product-id"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                disabled={!!editingProduct}
                data-testid="input-product-id"
              />
            </div>
            <div>
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                data-testid="input-product-name"
              />
            </div>
            <div>
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                data-testid="input-product-description"
              />
            </div>
            <div>
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                data-testid="input-product-price"
              />
            </div>
            <div>
              <Label htmlFor="product-image">Image URL</Label>
              <Input
                id="product-image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                data-testid="input-product-image"
              />
            </div>
            <div>
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                data-testid="input-product-category"
              />
            </div>
            <div>
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                value={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: parseInt(e.target.value) || 0 })
                }
                data-testid="input-product-stock"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveProduct}
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
                data-testid="button-save-product"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingProduct ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-product">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
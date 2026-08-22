"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Loader2, Search, X, PackageOpen, MoreVertical, Pencil } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@clerk/nextjs";

interface PriceItem {
  _id: string;
  name: string;
  price: number;
  qty?: number;
  unit?: string;
  isVisible: boolean;
  nameHi?: string;
}

export default function PriceList() {
  const { t, language } = useLanguage();
  const { orgId } = useAuth();
  
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemUnit, setNewItemUnit] = useState("pcs");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemQty("1");
    setNewItemUnit("pcs");
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: PriceItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemPrice(item.price.toString());
    setNewItemQty(item.qty?.toString() || "1");
    setNewItemUnit(item.unit || "pcs");
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    if (orgId) {
      fetchPrices();
    }
  }, [orgId]);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/prices");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch prices", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch("/api/prices", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: editingItem._id,
            name: newItemName, 
            price: Number(newItemPrice), 
            qty: Number(newItemQty), 
            unit: newItemUnit
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setItems(items.map(i => i._id === updated._id ? updated : i));
          setIsAddModalOpen(false);
          setEditingItem(null);
        }
      } else {
        const res = await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: newItemName, 
            price: Number(newItemPrice), 
            qty: Number(newItemQty), 
            unit: newItemUnit, 
            isVisible: true 
          }),
        });
        if (res.ok) {
          const newItem = await res.json();
          setItems([newItem, ...items]);
          setNewItemName("");
          setNewItemPrice("");
          setNewItemQty("1");
          setNewItemUnit("pcs");
          setIsAddModalOpen(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    setItems(items.map(item => item._id === id ? { ...item, isVisible: !currentStatus } : item));
    await fetch("/api/prices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isVisible: !currentStatus }),
    });
  };

  const deleteItem = async (id: string) => {
    setItems(items.filter(item => item._id !== id));
    await fetch(`/api/prices?id=${id}`, { method: "DELETE" });
  };

  const filteredItems = items.filter((item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">
            {t('priceList')}
          </h2>
          <p className="text-text-secondary mt-2 font-medium">{t('manageServices')}</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          {t('newItem')}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border text-text-primary font-medium placeholder:text-text-secondary"
        />
      </div>

      {/* Item List */}
      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors gap-4 sm:gap-0"
          >
            {/* Left Side: Name and Status */}
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                  {language === 'hi' && item.nameHi ? item.nameHi : item.name}
                </h3>
              <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${item.isVisible ? 'bg-success' : 'bg-text-secondary'}`}></span>
                </div>
                  <span className={`text-xs font-bold tracking-wide uppercase ${item.isVisible ? "text-success" : "text-text-secondary"}`}>
                    {item.isVisible ? t('published') : t('draft')}
                  </span>
                </div>
              </div>

              {/* Right Side: Price and Actions */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6">
                <div className="text-left sm:text-right">
                  <div className="text-xl font-bold text-accent">
                    ₹{item.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-text-secondary uppercase">
                    {t('per')} {item.qty || 1} {item.unit || t('pcs')}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg text-text-secondary hover:bg-background transition-colors flex items-center justify-center"
                    title={t('editItem')}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleVisibility(item._id, item.isVisible)}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      item.isVisible 
                        ? "text-primary hover:bg-primary-light/50 dark:hover:bg-primary/20" 
                        : "text-text-secondary hover:bg-background"
                    }`}
                    title={item.isVisible ? t('hidePublic') : t('publishPublic')}
                  >
                    {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors flex items-center justify-center"
                    title={t('deleteItem')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-16 px-6 bg-surface rounded-xl border border-border">
              <PackageOpen className="w-8 h-8 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text-primary mb-1">
                {searchQuery ? t('noResultsTitle') : t('emptyListTitle')}
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                {searchQuery 
                  ? t('noResultsDesc')
                  : t('emptyListDesc')}
              </p>
              {!searchQuery && (
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('addFirstItem')}
                </button>
              )}
            </div>
          )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-primary/50">
          <div className="relative w-full max-w-md bg-surface rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-primary">{editingItem ? t('editItemTitle') : t('addNewItem')}</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-text-secondary hover:bg-background rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">{t('itemName')}</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">{t('price')}</label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary text-sm"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">{t('quantity')}</label>
                    <input
                      type="number"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary text-sm"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">{t('unit')}</label>
                    <input
                      type="text"
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-text-secondary hover:bg-background rounded-lg font-medium text-sm transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 text-sm"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

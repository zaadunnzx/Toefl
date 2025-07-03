import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Users, Database, Settings, Plus, Search, Edit, Trash2, 
  ArrowLeft, Check, X, AlertCircle, Download, Upload, Filter 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as api from '../services/api';

const Dashboard = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Form states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddNumber, setShowAddNumber] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingNumber, setEditingNumber] = useState(null);
  
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [numberForm, setNumberForm] = useState({ number: '', categoryId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, numbersRes] = await Promise.all([
        api.getCategories(),
        api.getPhoneNumbers()
      ]);
      setCategories(categoriesRes.data);
      setPhoneNumbers(numbersRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createCategory(categoryForm);
      setCategories([...categories, response.data]);
      setCategoryForm({ name: '', description: '' });
      setShowAddCategory(false);
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleAddNumber = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createPhoneNumber(numberForm);
      setPhoneNumbers([...phoneNumbers, response.data]);
      setNumberForm({ number: '', categoryId: '' });
      setShowAddNumber(false);
      toast.success('Phone number added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add phone number');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleDeleteNumber = async (id) => {
    try {
      await api.deletePhoneNumber(id);
      setPhoneNumbers(phoneNumbers.filter(num => num.id !== id));
      toast.success('Phone number deleted successfully');
    } catch (error) {
      toast.error('Failed to delete phone number');
    }
  };

  const filteredNumbers = phoneNumbers.filter(number => {
    const matchesSearch = number.original_number.includes(searchTerm) || 
                         number.normalized_number.includes(searchTerm);
    const matchesCategory = !selectedCategory || number.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalNumbers: phoneNumbers.length,
    totalCategories: categories.length,
    databaseStatus: 'Active'
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToHome}
              className="glass-dark p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <Phone className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold text-white">WhatsApp Manager</h1>
              <span className="text-sm text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                Connected to API
              </span>
            </div>
          </div>

          <button className="glass-dark p-2 rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Management</h1>
          <p className="text-gray-400">Kelola nomor WhatsApp dengan kategorisasi dinamis dan deteksi duplikasi otomatis</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-purple-600 text-white' 
                : 'glass-dark text-gray-300 hover:text-white'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Dashboard</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              activeTab === 'categories' 
                ? 'bg-purple-600 text-white' 
                : 'glass-dark text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Categories</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-dark rounded-2xl p-6 hover-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Numbers</p>
                      <p className="text-2xl font-bold text-white">{stats.totalNumbers}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-dark rounded-2xl p-6 hover-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Categories</p>
                      <p className="text-2xl font-bold text-white">{stats.totalCategories}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-dark rounded-2xl p-6 hover-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Database</p>
                      <p className="text-lg font-bold text-green-400">{stats.databaseStatus}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Phone Numbers Management */}
              <div className="glass-dark rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Add New Phone Number</h2>
                  <button
                    onClick={() => setShowAddNumber(true)}
                    className="btn-gradient px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Number</span>
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search phone numbers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-input px-4 py-3 rounded-lg text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-gray-400 text-sm mb-6">
                  Supports: +6285476387, + 62-865-453-765, 08123456789
                </p>

                {/* Phone Numbers List */}
                <div className="space-y-3">
                  {filteredNumbers.map((number) => (
                    <motion.div
                      key={number.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{number.original_number}</p>
                          <p className="text-gray-400 text-sm">
                            Normalized: {number.normalized_number} • 
                            Category: {categories.find(cat => cat.id === number.category_id)?.name || 'No Category'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingNumber(number)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNumber(number.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="glass-dark rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Categories Management</h2>
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="btn-gradient px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-lg p-4 hover-card"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">{category.name}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{category.description}</p>
                      <p className="text-purple-400 text-xs mt-2">
                        {phoneNumbers.filter(num => num.category_id === category.id).length} numbers
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-dark rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Category</h3>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="form-input w-full px-4 py-3 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="form-input w-full px-4 py-3 rounded-lg text-white"
                    rows="3"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-gradient flex-1 py-3 rounded-lg text-white font-medium"
                  >
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="glass flex-1 py-3 rounded-lg text-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Number Modal */}
      <AnimatePresence>
        {showAddNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-dark rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Phone Number</h3>
              
              <form onSubmit={handleAddNumber} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g., +6285476387"
                    value={numberForm.number}
                    onChange={(e) => setNumberForm({...numberForm, number: e.target.value})}
                    className="form-input w-full px-4 py-3 rounded-lg text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    value={numberForm.categoryId}
                    onChange={(e) => setNumberForm({...numberForm, categoryId: e.target.value})}
                    className="form-input w-full px-4 py-3 rounded-lg text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-gradient flex-1 py-3 rounded-lg text-white font-medium"
                  >
                    Add Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddNumber(false)}
                    className="glass flex-1 py-3 rounded-lg text-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Shield, Users, CheckCircle, Play } from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you can add form submission logic
    onEnterApp();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">WhatsApp</span>
            <span className="text-xl font-bold gradient-text-purple">Manager</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex space-x-8"
          >
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onEnterApp}
            className="btn-gradient text-white px-6 py-2 rounded-full font-medium"
          >
            Enter App
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">Manage,</span><br />
            <span className="gradient-text">Organize &</span><br />
            <span className="text-white">WhatsApp Numbers</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            We will help you organize your WhatsApp contacts with smart categorization and duplicate detection
          </motion.p>

          {/* Consultation Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto mb-16"
          >
            <h3 className="text-white text-xl mb-2">Get started with our free consultation</h3>
            <p className="text-gray-400 mb-6">Free 30 minute WhatsApp Management Consultation</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input text-white placeholder-gray-400 px-4 py-3 rounded-lg w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="form-input text-white placeholder-gray-400 px-4 py-3 rounded-lg w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-gradient text-white px-8 py-3 rounded-lg font-medium w-full md:w-auto"
              >
                Request a Quote
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Services <span className="gradient-text">include</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Creative Service */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-dark rounded-2xl p-8 hover-card"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Organization</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Smart categorization</li>
                <li>• Contact grouping</li>
                <li>• Bulk management</li>
              </ul>
            </motion.div>

            {/* Management Service */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-dark rounded-2xl p-8 hover-card"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Management & Validation</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Number validation</li>
                <li>• Duplicate detection</li>
                <li>• Data cleaning</li>
              </ul>
            </motion.div>

            {/* Development Service */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-dark rounded-2xl p-8 hover-card"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Contact analytics</li>
                <li>• Usage statistics</li>
                <li>• Export capabilities</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Import your contacts</h3>
                    <p className="text-gray-400">Upload your WhatsApp contacts easily</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Organize automatically</h3>
                    <p className="text-gray-400">Get your smart categorization and cleaning</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Manage with ease</h3>
                    <p className="text-gray-400">Work with us to grow your contact database and boost engagement</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="gradient-text">3 Easy steps</span><br />
                to organize your<br />
                contacts with<br />
                <span className="gradient-text">WhatsApp Manager</span>
              </h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="text-white">Why</span> <span className="gradient-text">WhatsApp</span><br />
                <span className="text-white">Manager</span>
              </h2>
              
              <div className="glass-dark rounded-2xl p-8 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-400 text-sm">WA</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-400 text-sm">API</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-400 text-sm">DB</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-400 text-sm">AI</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-gray-300 text-lg">
                Take your business to the next level by working with seasoned contact management specialists, to create, implement and optimize your contact database strategy.
              </p>
              
              <p className="text-gray-300">
                Clearly laid AI vs human optimized results: we are selective in the clients we take on.
              </p>
              
              <p className="text-gray-300">
                If we decide to work together, you will join our superstar team of developers, data analysts, conversion optimization specialists and media buyers to GROW your business to new heights.
              </p>

              <button
                onClick={onEnterApp}
                className="btn-gradient text-white px-8 py-3 rounded-full font-medium inline-flex items-center space-x-2"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-40 px-6 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">WhatsApp Manager</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">About</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Services</a>
                <a href="#" className="block hover:text-white transition-colors">Portfolio</a>
                <a href="#" className="block hover:text-white transition-colors">Our Process</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <span className="block">Contact Management</span>
                <span className="block">Data Validation</span>
                <span className="block">Analytics</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Connect</h4>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer">
                  <span className="text-white text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer">
                  <span className="text-white text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer">
                  <span className="text-white text-sm">in</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors cursor-pointer">
                  <span className="text-white text-sm">@</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

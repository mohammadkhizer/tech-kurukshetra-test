'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BoneyardPreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence for layout/assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="boneyard-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 1, duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background glassmorphic"
        >
          <div className="flex flex-col gap-6 w-full max-w-md px-6">
            <motion.div 
              className="h-12 bg-muted/40 rounded-xl overflow-hidden relative"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </motion.div>
            
            <div className="space-y-3">
              <motion.div 
                className="h-4 bg-muted/30 rounded-full w-3/4"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.1, ease: "easeInOut" }}
              />
              <motion.div 
                className="h-4 bg-muted/30 rounded-full w-5/6"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              />
              <motion.div 
                className="h-4 bg-muted/30 rounded-full w-1/2"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <motion.div 
                className="h-32 bg-muted/20 rounded-2xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeInOut" }}
              />
              <motion.div 
                className="h-32 bg-muted/20 rounded-2xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

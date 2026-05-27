"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ThumbsUp, Loader2, IndianRupee, QrCode as QrCodeIcon } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import QRCode from "react-qr-code";

// We import TF and Handpose dynamically or standardly
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";

type PayState = "merchant" | "amount" | "camera" | "verifying" | "success";

const MERCHANTS = [
  { id: "starbucks", name: "Starbucks", upi: "starbucks@okicici", type: "Cafe", icon: "☕" },
  { id: "zara", name: "Zara Fashion", upi: "zara@sbi", type: "Fashion", icon: "👗" },
  { id: "croma", name: "Croma Electronics", upi: "croma@hdfc", type: "Electronics", icon: "💻" },
  { id: "reliance", name: "Reliance Fresh", upi: "reliance@axis", type: "Grocery", icon: "🛒" }
];

export default function PayFlow() {
  const [state, setState] = useState<PayState>("merchant");
  const [selectedMerchant, setSelectedMerchant] = useState(MERCHANTS[0]);
  const [amount, setAmount] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [handDetected, setHandDetected] = useState(false);

  const addTransaction = useStore((state) => state.addTransaction);

  // Function to finalize the payment and deduct balance
  const completePayment = () => {
    addTransaction({
      name: selectedMerchant.name,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: Number(amount),
      status: 'Success'
    });
    
    setState("success" as PayState);
    
    // Auto redirect to dashboard after 3 seconds
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 3000);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let detectionInterval: any;
    let net: handpose.HandPose | null = null;

    const startDetection = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Wait for video to be ready before starting TF prediction
        videoRef.current!.onloadedmetadata = async () => {
          setModelLoading(true);
          await tf.ready();
          net = await handpose.load();
          setModelLoading(false);

          // Prediction Loop
          const detect = async () => {
            if (videoRef.current && net && state === "camera") {
              const hands = await net.estimateHands(videoRef.current);
              
              if (hands.length > 0) {
                // A hand is detected! We will trigger verification and break the loop
                setHandDetected(true);
                setState("verifying");
                
                setTimeout(() => {
                  completePayment();
                }, 2000);
                
                return; // Stop detection loop
              }
            }
            if (state === "camera") {
              detectionInterval = requestAnimationFrame(detect);
            }
          };
          detect();
        };

      } catch (err) {
        console.error("Camera access denied or TFJS failed", err);
      }
    };

    if (state === "camera") {
      startDetection();
    }

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (detectionInterval) cancelAnimationFrame(detectionInterval);
    };
  }, [state]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center selection:bg-emerald-500/30">
      <header className="w-full p-4 flex items-center justify-between z-50">
        <button 
          onClick={() => state === "merchant" ? window.location.href = "/dashboard" : setState(state === "amount" ? "merchant" : "amount")}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-2">
          <ShieldIcon />
          <span className="text-xs font-medium text-zinc-300">HoverPay Secure</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md flex flex-col px-6">
        <AnimatePresence mode="wait">
          
          {/* MERCHANT SELECTION STATE */}
          {state === "merchant" && (
            <motion.div 
              key="merchant"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col py-8"
            >
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">Select Merchant</h2>
              <p className="text-zinc-400 text-sm mb-8">Who are you paying today?</p>
              
              <div className="space-y-3">
                {MERCHANTS.map((merchant) => (
                  <button 
                    key={merchant.id}
                    onClick={() => {
                      setSelectedMerchant(merchant);
                      setState("amount");
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center text-2xl border border-zinc-800">
                      {merchant.icon}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-zinc-100">{merchant.name}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{merchant.upi}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* AMOUNT ENTRY STATE */}
          {state === "amount" && (
            <motion.div 
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto mb-4 flex items-center justify-center text-3xl border border-zinc-700">
                  {selectedMerchant.icon}
                </div>
                <h2 className="text-xl font-semibold text-zinc-100">Paying {selectedMerchant.name}</h2>
                <p className="text-sm text-zinc-500 font-mono mt-1">{selectedMerchant.upi}</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-12">
                <IndianRupee className="text-zinc-500" size={32} />
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent text-5xl md:text-6xl font-bold text-zinc-100 w-full max-w-[200px] outline-none text-center placeholder:text-zinc-700"
                  autoFocus
                />
              </div>

              <button 
                onClick={() => amount && setState("camera")}
                disabled={!amount || Number(amount) <= 0}
                className="w-full py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
              >
                Proceed to Verify
              </button>
            </motion.div>
          )}

          {/* CAMERA VERIFICATION STATE */}
          {state === "camera" && (
            <motion.div 
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col pb-6"
            >
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-64 h-64 border-2 rounded-2xl relative transition-colors duration-500 ${handDetected ? 'border-emerald-500' : 'border-emerald-500/30'}`}>
                    <motion.div 
                      animate={{ y: [0, 250, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 to-transparent">
                  <div className="bg-zinc-950/80 backdrop-blur-md rounded-2xl p-4 border border-zinc-800 text-center">
                    <div className="flex justify-center mb-2">
                      {modelLoading ? (
                        <Loader2 className="text-zinc-400 animate-spin" size={24} />
                      ) : (
                        <ThumbsUp className="text-emerald-500" size={24} />
                      )}
                    </div>
                    <p className="text-zinc-100 font-medium">
                      {modelLoading ? "Loading Local AI Model..." : "Show Hand to confirm"}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">Paying ₹{amount} to {selectedMerchant.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PROCESSING STATE */}
          {state === "verifying" && (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                <Loader2 className="text-emerald-500 animate-spin" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">Hand Detected</h2>
              <p className="text-zinc-400 text-sm">Processing securely on-device...</p>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {state === ("success" as PayState) && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <ThumbsUp size={40} />
              </div>
              <h2 className="text-3xl font-bold text-zinc-100 mb-2">Payment Successful!</h2>
              <p className="text-emerald-400 text-lg font-medium mb-8">₹{amount} paid to {selectedMerchant.name}</p>
              
              <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-center gap-3">
                <Loader2 className="text-zinc-500 animate-spin" size={16} />
                <span className="text-sm font-medium text-zinc-300">Returning to Dashboard...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
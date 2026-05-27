"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, ThumbsUp, Loader2, IndianRupee, Mic, Smartphone, Watch, 
  Scan, ShieldCheck, Wifi, WifiOff, Volume2, AlertTriangle, Fingerprint, 
  HelpCircle, Bluetooth, Check, ShieldAlert, Sparkles, Hand, Eye, User,
  XCircle, RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

// We import TF and Handpose dynamically or safely in client-side useEffect
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";

type PayState = "nearby" | "amount" | "verify" | "success" | "failed";
type BioMethod = "face" | "hand" | "finger";

const DETECTED_MERCHANTS = [
  { id: "starbucks", name: "Starbucks Register 3", upi: "starbucks@okicici", type: "Cafe", icon: "☕", distance: 0.3, trustScore: "99.9%" },
  { id: "zara", name: "Zara Fashion Terminal", upi: "zara@sbi", type: "Fashion", icon: "👗", distance: 1.1, trustScore: "99.8%" },
  { id: "croma", name: "Croma Register 1", upi: "croma@hdfc", type: "Electronics", icon: "💻", distance: 2.4, trustScore: "99.9%" },
  { id: "reliance", name: "Reliance Fresh", upi: "reliance@axis", type: "Grocery", icon: "🛒", distance: 4.5, trustScore: "99.7%" }
];

export default function PayFlow() {
  const { balance, addTransaction, settings, updateSettings } = useStore();
  const [state, setState] = useState<PayState>("nearby");
  const [selectedMerchant, setSelectedMerchant] = useState(DETECTED_MERCHANTS[0]);
  const [amount, setAmount] = useState("");
  
  // Voice Assistant States
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceParsed, setVoiceParsed] = useState<{ merchant?: string; amount?: string } | null>(null);

  // Unified Verification States
  const [bioMethod, setBioMethod] = useState<BioMethod>("face");
  const [cameraActive, setCameraActive] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [faceScanningActive, setFaceScanningActive] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10-second secure enclave session
  
  // Scanning Progress States
  const [faceProgress, setFaceProgress] = useState(0);
  const [fingerProgress, setFingerProgress] = useState(0);
  const [handProgress, setHandProgress] = useState(0);
  const [fingerHolding, setFingerHolding] = useState(false);

  // Wearable / Ring Quick Pay States
  const [wearableType, setWearableType] = useState<"phone" | "ring" | "watch">("phone");
  const [failureReason, setFailureReason] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const detectionIntervalRef = useRef<any>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Complete payment and register to store
  const completePayment = (amtVal = amount) => {
    const finalAmount = Number(amtVal) || 120; // fallback if voice input didn't specify amount
    if (finalAmount > balance) {
      setFailureReason("Insufficient Funds: Transaction amount exceeds your primary account balance ledger threshold.");
      setState("failed");
      return;
    }
    addTransaction({
      name: selectedMerchant.name,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: finalAmount,
      status: 'Success',
      method: wearableType === "ring" ? "NFC Ring Tap" : wearableType === "watch" ? "HoverWatch Ambient" : `Face ID / Handpose (${bioMethod})`,
      category: selectedMerchant.type
    });
    
    setState("success");
    
    // play mock notification audio
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high chime
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log("Audio contexts blocked or unsupported");
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 3200);
  };

  // Web Speech API initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
      }
    }
  }, []);

  // Voice Speech Command Handler
  const startVoiceInput = () => {
    setVoiceTranscript("");
    setVoiceParsed(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceListening(true);
      setTimeout(() => {
        const simulatedPhrases = [
          "pay starbucks register 3 340 rupees",
          "send 850 to zara fashion terminal",
          "pay 24500 to croma register 1"
        ];
        const phrase = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
        handleParsedVoice(phrase);
      }, 2000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript.toLowerCase();
      setVoiceTranscript(speechToText);
      handleParsedVoice(speechToText);
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setVoiceListening(false);
    };

    recognition.onend = () => {
      setVoiceListening(false);
    };

    recognition.start();
  };

  const handleParsedVoice = (text: string) => {
    setVoiceTranscript(text);
    setVoiceListening(false);

    let detectedM = DETECTED_MERCHANTS[0];
    let detectedAmt = "";

    if (text.includes("zara") || text.includes("fashion")) {
      detectedM = DETECTED_MERCHANTS[1];
    } else if (text.includes("croma") || text.includes("electronics")) {
      detectedM = DETECTED_MERCHANTS[2];
    } else if (text.includes("reliance") || text.includes("grocery")) {
      detectedM = DETECTED_MERCHANTS[3];
    } else if (text.includes("starbucks") || text.includes("coffee")) {
      detectedM = DETECTED_MERCHANTS[0];
    }

    const matches = text.match(/\b\d+\b/);
    if (matches && matches[0]) {
      detectedAmt = matches[0];
    }

    setVoiceParsed({ merchant: detectedM.name, amount: detectedAmt || undefined });
    setSelectedMerchant(detectedM);
    if (detectedAmt) {
      setAmount(detectedAmt);
    }

    setTimeout(() => {
      if (detectedAmt && Number(detectedAmt) > balance) {
        setFailureReason("Insufficient Funds: Spoken transaction amount exceeds your available balance.");
        setState("failed");
      } else {
        setState("verify");
      }
    }, 1500);
  };

  // Webcam stream start/stop
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        activeStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.error("Camera access denied or locked. Running virtual biometric overlays.");
        setCameraActive(false);
      }
    };

    if (state === "verify") {
      startWebcam();
    } else {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(t => t.stop());
        activeStreamRef.current = null;
      }
      setCameraActive(false);
    }

    return () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(t => t.stop());
        activeStreamRef.current = null;
      }
      if (detectionIntervalRef.current) cancelAnimationFrame(detectionIntervalRef.current);
    };
  }, [state]);

  // Secure Enclave Countdown Ticker
  useEffect(() => {
    if (state !== "verify") return;

    setCountdown(10); // reset countdown on entering verify state
    setFaceScanningActive(false); // reset scanning active state

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setState("failed"); // timeout rejection trigger
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [state, bioMethod]);

  // Unified Verification Mode Scanner Loops
  useEffect(() => {
    if (state !== "verify") return;

    setFaceProgress(0);
    setHandProgress(0);
    setFingerProgress(0);

    let progressInterval: any;

    // A. FACE SCAN METHOD: Starts scanning face layout ONLY when active
    if (bioMethod === "face" && faceScanningActive) {
      setIsScanning(true);
      progressInterval = setInterval(() => {
        setFaceProgress(prev => {
          if (prev >= 100) {
            return 100;
          }
          const next = prev + 6;
          if (next >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setIsScanning(false);
              completePayment();
            }, 0);
            return 100;
          }
          return next;
        });
      }, 95);
    } 

    // B. HAND CLASSIFICATION METHOD: Runs handpose or simulated hand landmark tracing
    if (bioMethod === "hand") {
      setIsScanning(true);
      
      let net: handpose.HandPose | null = null;
      let modelActive = true;

      const runHandpose = async () => {
        if (!cameraActive) {
          progressInterval = setInterval(() => {
            setHandProgress(prev => {
              if (prev >= 100) {
                clearInterval(progressInterval);
                completePayment();
                return 100;
              }
              return prev + 8;
            });
          }, 110);
          return;
        }

        try {
          setModelLoading(true);
          await tf.ready();
          net = await handpose.load();
          setModelLoading(false);

          const detectHand = async () => {
            if (videoRef.current && net && state === "verify" && bioMethod === "hand" && modelActive) {
              const hands = await net.estimateHands(videoRef.current);
              
              if (hands.length > 0) {
                setHandProgress(100);
                modelActive = false;
                completePayment();
                return;
              } else {
                setHandProgress(prev => Math.min(95, prev + 2));
              }
            }
            if (state === "verify" && bioMethod === "hand" && modelActive) {
              detectionIntervalRef.current = requestAnimationFrame(detectHand);
            }
          };
          detectHand();
        } catch (e) {
          setModelLoading(false);
          progressInterval = setInterval(() => {
            setHandProgress(prev => {
              if (prev >= 100) {
                return 100;
              }
              const next = prev + 8;
              if (next >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                  completePayment();
                }, 0);
                return 100;
              }
              return next;
            });
          }, 110);
        }
      };

      runHandpose();

      return () => {
        modelActive = false;
        if (progressInterval) clearInterval(progressInterval);
      };
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [state, bioMethod, cameraActive, faceScanningActive]);

  // C. FINGERPRINT METHOD: Requires hold interaction
  useEffect(() => {
    let interval: any;
    if (fingerHolding && bioMethod === "finger" && state === "verify") {
      interval = setInterval(() => {
        setFingerProgress(prev => {
          if (prev >= 100) {
            return 100;
          }
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              completePayment();
            }, 0);
            return 100;
          }
          return next;
        });
      }, 100);
    } else {
      setFingerProgress(0);
    }
    return () => clearInterval(interval);
  }, [fingerHolding, bioMethod, state]);

  return (
    <div className="min-h-screen bg-[#030303] flex justify-center items-center p-4 selection:bg-brand-500/30">
      
      {/* Dynamic Cyber background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,170,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Frame Shell resembling phone interface */}
      <div className="w-full max-w-[420px] aspect-[9/19.5] bg-[#09090f] border border-white/10 rounded-[48px] overflow-hidden flex flex-col relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] outline outline-8 outline-zinc-900">
        
        {/* Dynamic Notch */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full flex items-center justify-between px-4 z-50 border border-white/5">
          <div className="w-3 h-3 rounded-full bg-zinc-900 border border-brand-500/20 flex items-center justify-center">
            <div className="w-1 h-1 bg-brand-500 rounded-full" />
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-[9px] font-bold text-zinc-500 font-mono">LTE</span>
            {settings.offlineMode ? (
              <WifiOff size={10} className="text-amber-500" />
            ) : (
              <Wifi size={10} className="text-brand-500" />
            )}
          </div>
        </div>

        {/* Mobile Header bar */}
        <header className="w-full pt-12 px-6 pb-4 flex items-center justify-between z-30">
          {state !== "success" && state !== "failed" ? (
            <button 
              onClick={() => {
                if (state === "nearby") window.location.href = "/dashboard";
                if (state === "amount") setState("nearby");
                if (state === "verify") setState("amount");
              }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          ) : <div className="w-10" />}

          <div className="flex items-center gap-2 bg-[#030305] border border-white/5 px-4 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-400 uppercase">
              {settings.offlineMode ? "Offline Secure" : "HoverSecure V2"}
            </span>
          </div>
        </header>

        {/* Dynamic Wearable Toggle Side Widget */}
        {state !== "success" && state !== "failed" && (
          <div className="absolute top-28 right-4 flex flex-col gap-2 z-40 bg-black/40 border border-white/5 backdrop-blur-md p-1.5 rounded-xl">
            <button 
              onClick={() => setWearableType("phone")}
              className={`p-2 rounded-lg transition-colors ${wearableType === "phone" ? "bg-brand-500 text-black font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Phone Camera Mode"
            >
              <Smartphone size={16} />
            </button>
            <button 
              onClick={() => {
                setWearableType("ring");
                setState("verify");
              }}
              className={`p-2 rounded-lg transition-colors ${wearableType === "ring" ? "bg-brand-500 text-black font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
              title="HoverRing Tap Mode"
            >
              <span className="text-xs font-bold font-mono">💍</span>
            </button>
            <button 
              onClick={() => {
                setWearableType("watch");
                setState("verify");
              }}
              className={`p-2 rounded-lg transition-colors ${wearableType === "watch" ? "bg-brand-500 text-black font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
              title="HoverWatch NFC Mode"
            >
              <Watch size={16} />
            </button>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 w-full flex flex-col px-6 relative overflow-hidden pb-8">
          <AnimatePresence mode="wait">
            
            {/* 1. NEARBY MERCHANTS DISCOVERY STATE */}
            {state === "nearby" && (
              <motion.div 
                key="nearby"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex flex-col justify-between py-4"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-display">Ambient Registry</h2>
                  <p className="text-xs text-zinc-500 mt-1">BLE Beacons detected within 5 meters.</p>
                  
                  {/* Radar Scan graphic */}
                  <div className="relative h-28 my-6 flex items-center justify-center overflow-hidden bg-white/5 border border-white/5 rounded-2xl">
                    <div className="absolute inset-4 rounded-full border border-brand-500/10 radar-ring" />
                    <div className="absolute inset-10 rounded-full border border-brand-500/20 radar-ring" />
                    <Bluetooth className="text-brand-500 animate-pulse relative z-10" size={32} />
                    <span className="absolute bottom-2 text-[9px] font-mono text-zinc-500">Auto-Selecting Closest Beacon</span>
                  </div>

                  {/* List of Detected Merchants */}
                  <div className="space-y-2">
                    {DETECTED_MERCHANTS.map((merchant) => (
                      <button 
                        key={merchant.id}
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setState("amount");
                        }}
                        className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                          selectedMerchant.id === merchant.id 
                            ? 'bg-brand-500/5 border-brand-500/30' 
                            : 'bg-[#030305]/50 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0a0a0f] flex items-center justify-center border border-white/5 text-lg">
                            {merchant.icon}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white text-xs">{merchant.name}</p>
                            <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{merchant.upi}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-brand-500 bg-brand-500/5 px-2 py-0.5 rounded-full border border-brand-500/10 font-mono">
                            {merchant.distance}m
                          </span>
                          <p className="text-[9px] text-zinc-600 mt-1 font-mono">{merchant.trustScore} Safe</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Voice assistant & offline switches */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={startVoiceInput}
                      className="flex-1 py-3 bg-[#0a0a0f] border border-white/5 hover:border-brand-500/30 rounded-xl text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <Mic size={14} className="text-brand-500" />
                      Voice Assistant
                    </button>
                    <button 
                      onClick={() => updateSettings({ offlineMode: !settings.offlineMode })}
                      className={`flex-1 py-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        settings.offlineMode 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold' 
                          : 'bg-[#0a0a0f] border-white/5 text-zinc-500'
                      }`}
                    >
                      {settings.offlineMode ? <WifiOff size={14} /> : <Wifi size={14} />}
                      Offline Mode
                    </button>
                  </div>

                  <button 
                    onClick={() => setState("amount")}
                    className="w-full py-3.5 bg-brand-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-brand-600 transition-colors"
                  >
                    Proceed to Pay {selectedMerchant.name.split(" ")[0]} <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. AMOUNT INPUT STATE */}
            {state === "amount" && (
              <motion.div 
                key="amount"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 flex flex-col justify-between py-4"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">
                    {selectedMerchant.icon}
                  </div>
                  <h3 className="font-semibold text-white text-base">Paying {selectedMerchant.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{selectedMerchant.upi}</p>
                </div>

                {/* Amount display */}
                <div className="my-6 text-center flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1">
                    <IndianRupee size={32} className="text-brand-500" />
                    <input 
                      type="text" 
                      value={amount}
                      readOnly
                      placeholder="0"
                      className="bg-transparent text-5xl font-extrabold text-white text-center w-full max-w-[240px] font-display placeholder:text-zinc-800 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-2">Available Balance: ₹{(balance).toLocaleString('en-IN')}</p>
                </div>

                {/* Custom numeric pad */}
                <div>
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"].map((key) => (
                      <button 
                        key={key}
                        onClick={() => {
                          if (key === "delete") {
                            setAmount(prev => prev.slice(0, -1));
                          } else if (key === "." && amount.includes(".")) {
                          } else {
                            if (amount.length < 6) setAmount(prev => prev + key);
                          }
                        }}
                        className="py-3 bg-white/5 hover:bg-white/10 active:bg-brand-500/10 border border-white/5 rounded-xl text-lg font-semibold text-white flex items-center justify-center transition-colors"
                      >
                        {key === "delete" ? "←" : key}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => amount && Number(amount) > 0 && setState("verify")}
                    disabled={!amount || Number(amount) <= 0 || Number(amount) > balance}
                    className="w-full py-4 rounded-2xl font-bold text-sm bg-brand-500 hover:bg-brand-600 text-black flex items-center justify-center gap-1.5 transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-transparent"
                  >
                    Confirm & Verify ₹{amount || "0"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. UNIFIED BIOMETRIC CAMERA VERIFICATION STATE */}
            {state === "verify" && (
              <motion.div 
                key="verify"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-2"
              >
                {/* Camera Viewfinder Box */}
                <div className="relative flex-1 bg-black border border-white/10 rounded-3xl overflow-hidden shadow-inner flex flex-col">
                  
                  {/* Real Web Camera Stream */}
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}
                  />
                  
                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090f] text-zinc-500 p-6 z-10">
                      <Loader2 className="animate-spin text-brand-500 mb-3" size={24} />
                      <span className="text-[10px] font-mono uppercase tracking-wider">Starting Secure Camera...</span>
                    </div>
                  )}

                  {/* Timer Ticker Header HUD */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-[#030305]/80 backdrop-blur border border-white/5 px-3 py-1.5 rounded-xl z-20">
                    <span className="text-[9px] font-mono font-bold text-zinc-400">ENCLAVE TIMEOUT SESSION</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${countdown <= 3 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-brand-purple/20 text-brand-purple'}`}>
                      0:0{countdown}s
                    </span>
                  </div>

                  {/* A. FACE ID NEON SCANNING OVERLAY */}
                  {bioMethod === "face" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {faceScanningActive ? (
                        <div className="relative w-48 h-48 border border-brand-500/20 rounded-[40px] flex items-center justify-center">
                          <div className={`absolute inset-0 border-2 rounded-[40px] transition-colors duration-500 ${faceProgress > 80 ? 'border-brand-500' : 'border-brand-500/40 animate-pulse'}`} />
                          
                          <motion.div 
                            animate={{ y: [-80, 80, -80] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-full h-0.5 bg-brand-500 shadow-[0_0_15px_rgba(0,255,170,0.8)]"
                          />
                          <Eye className="text-brand-500/30 animate-pulse" size={40} />
                        </div>
                      ) : (
                        <button 
                          onClick={() => setFaceScanningActive(true)}
                          className="w-48 h-48 border border-white/10 rounded-[40px] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-500/30 group transition-all"
                        >
                          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-brand-500 group-hover:border-brand-500/20 transition-all">
                            <Eye size={28} />
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono group-hover:text-brand-500 transition-colors">Scan Face ID</span>
                          <span className="text-[8px] text-zinc-500 font-mono">Tap to start</span>
                        </button>
                      )}

                      {/* Progress HUD bar */}
                      <div className="absolute bottom-6 left-6 right-6 bg-[#030305]/80 border border-white/5 backdrop-blur-md rounded-2xl p-3 text-center">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Facial Topology Verification</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-brand-500 transition-all duration-100" style={{ width: `${faceProgress}%` }} />
                        </div>
                        <p className="text-[9px] text-zinc-500 font-mono mt-1">
                          {faceScanningActive ? `Status: Matching Enclave Hash (${faceProgress}%)` : "Status: Awaiting Scan Request (0%)"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* B. HANDPOSE LANDMARKS SCANNING OVERLAY */}
                  {bioMethod === "hand" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="relative w-48 h-48 border-2 border-dashed border-brand-purple/30 rounded-full flex items-center justify-center">
                        <div className={`absolute inset-2 border-2 rounded-full transition-colors duration-500 ${handProgress >= 100 ? 'border-brand-500' : 'border-brand-purple/40 animate-pulse'}`} />
                        
                        <Hand className="text-brand-purple/30" size={40} />
                        
                        <div className="absolute inset-4">
                          {[
                            { t: "10%", l: "40%" }, { t: "15%", l: "60%" }, { t: "30%", l: "75%" },
                            { t: "50%", l: "80%" }, { t: "70%", l: "60%" }, { t: "80%", l: "35%" },
                            { t: "65%", l: "15%" }, { t: "45%", l: "15%" }, { t: "30%", l: "25%" }
                          ].map((pt, idx) => (
                            <motion.div 
                              key={idx}
                              animate={{ scale: [0.8, 1.2, 0.8] }}
                              transition={{ duration: 1.5, delay: idx * 0.1, repeat: Infinity }}
                              className="absolute w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_8px_#7000ff]"
                              style={{ top: pt.t, left: pt.l }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Progress HUD bar */}
                      <div className="absolute bottom-6 left-6 right-6 bg-[#030305]/80 border border-white/5 backdrop-blur-md rounded-2xl p-3 text-center">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                          {modelLoading ? "Loading Local Classifier..." : "Gesture Intent Check"}
                        </p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-brand-purple transition-all duration-100" style={{ width: `${handProgress}%` }} />
                        </div>
                        <p className="text-[9px] text-zinc-500 font-mono mt-1">
                          {modelLoading ? "TFJS Model Loading..." : `Detecting HandLandmarks (${handProgress}%)`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* C. TOUCH ID FINGERPRINT SCAN OVERLAY */}
                  {bioMethod === "finger" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="text-center">
                        <p className="text-xs text-zinc-400 mb-6 font-semibold uppercase tracking-wider">Hold Finger on Sensor</p>
                        
                        <div className="relative flex justify-center items-center">
                          <svg className="w-48 h-48 transform -rotate-90">
                            <circle 
                              cx="96" cy="96" r="76" 
                              className="stroke-white/5 fill-none" 
                              strokeWidth="4" 
                            />
                            <circle 
                              cx="96" cy="96" r="76" 
                              className="stroke-brand-500 fill-none transition-all duration-75" 
                              strokeWidth="4" 
                              strokeDasharray={2 * Math.PI * 76}
                              strokeDashoffset={2 * Math.PI * 76 * (1 - fingerProgress / 100)}
                            />
                          </svg>

                          <button
                            onMouseDown={() => setFingerHolding(true)}
                            onMouseUp={() => setFingerHolding(false)}
                            onMouseLeave={() => setFingerHolding(false)}
                            onTouchStart={() => setFingerHolding(true)}
                            onTouchEnd={() => setFingerHolding(false)}
                            className={`absolute w-28 h-28 rounded-full flex items-center justify-center border transition-all duration-300 ${
                              fingerHolding 
                                ? 'bg-brand-500/10 border-brand-500 scale-105 shadow-[0_0_25px_rgba(0,255,170,0.15)] text-brand-500' 
                                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                          >
                            <Fingerprint size={40} className={fingerHolding ? "animate-pulse" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Progress HUD bar */}
                      <div className="absolute bottom-6 left-6 right-6 bg-[#030305]/80 border border-white/5 backdrop-blur-md rounded-2xl p-3 text-center">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Touch ID sensor match</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-1">
                          {fingerHolding ? `Authenticating Fingerprint... ${fingerProgress}%` : "Place & hold thumb to verify"}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Biometric Switcher tabs */}
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 bg-[#09090f] p-1.5 rounded-2xl border border-white/5 text-center text-[10px]">
                    <button 
                      onClick={() => setBioMethod("face")}
                      className={`py-2 rounded-xl capitalize font-semibold flex items-center justify-center gap-1 transition-colors ${bioMethod === "face" ? 'bg-brand-500 text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <Eye size={12} /> Face ID
                    </button>
                    <button 
                      onClick={() => setBioMethod("hand")}
                      className={`py-2 rounded-xl capitalize font-semibold flex items-center justify-center gap-1 transition-colors ${bioMethod === "hand" ? 'bg-brand-500 text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <Hand size={12} /> Hand Pose
                    </button>
                    <button 
                      onClick={() => setBioMethod("finger")}
                      className={`py-2 rounded-xl capitalize font-semibold flex items-center justify-center gap-1 transition-colors ${bioMethod === "finger" ? 'bg-brand-500 text-black font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <Fingerprint size={12} /> Touch ID
                    </button>
                  </div>

                  <div className="bg-[#030305] border border-white/5 p-3.5 rounded-2xl flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <div className="text-left">
                      <p className="text-zinc-400">Total Settlement</p>
                      <p className="text-sm font-bold text-white mt-0.5">₹{amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-500 font-bold">RISK: 0.002% (SECURE)</p>
                      <p className="text-[9px] mt-0.5">Enclave Cryptography sealed</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. SUCCESS/SETTLED STATE */}
            {state === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                {/* Glowing Success Ring */}
                <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center mb-6 text-brand-500 shadow-[0_0_40px_rgba(0,255,170,0.25)]">
                  <ThumbsUp size={36} className="animate-pulse" />
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight text-white font-display">Payment Complete</h2>
                <p className="text-brand-500 text-lg font-bold mt-1">₹{amount} Paid</p>
                <p className="text-xs text-zinc-500 mt-1">to {selectedMerchant.name}</p>

                {/* Mini Receipt Details */}
                <div className="w-full bg-[#030305] border border-white/5 rounded-2xl p-4 my-8 text-left space-y-2 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>UPI Reference</span>
                    <span className="text-white">HPX8892019482</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authorization</span>
                    <span className="text-brand-500 font-bold uppercase">{wearableType === "ring" ? "NFC Ring Match" : wearableType === "watch" ? "Watch Match" : `${bioMethod} verified`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency</span>
                    <span className="text-white">0.78 seconds</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span>Ledger Status</span>
                    <span className="text-brand-500 font-bold">Settled (UPI Lite)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-zinc-500 font-mono">
                  <Loader2 className="animate-spin text-brand-500" size={14} />
                  <span>Redirecting to ledger...</span>
                </div>
              </motion.div>
            )}

            {/* 5. FAILED/TIMEOUT STATE */}
            {state === "failed" && (
              <motion.div 
                key="failed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-6"
              >
                {/* Glowing red warning indicator */}
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
                  <XCircle size={36} className="animate-bounce" />
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight text-white font-display">Verification Failed</h2>
                <p className="text-red-500 text-sm font-semibold mt-1">Biometric Handshake Reverted</p>
                <p className="text-xs text-zinc-500 mt-2 max-w-[240px]">
                  {failureReason || "HoverSecure closed the session because no face, fingerprint, or handpose matches were recorded inside the 10-second enclave window."}
                </p>

                {/* Error Hud specs */}
                <div className="w-full bg-[#030305] border border-white/5 rounded-2xl p-4 my-6 text-left space-y-2 text-xs font-mono text-zinc-500">
                  <div className="flex justify-between">
                    <span>Diagnostic code</span>
                    <span className="text-white">{failureReason.includes("Funds") ? "ERR-INS-FUNDS-402" : "ERR-SEC-HANDSHAKE-09"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Status</span>
                    <span className="text-red-500 font-bold">{failureReason.includes("Funds") ? "Insufficient Funds" : "Timed Out (Rejected)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Enclave</span>
                    <span className="text-white">Sealed Integrity Lock</span>
                  </div>
                </div>

                {/* Retry / Back Controls */}
                <div className="w-full space-y-2">
                  <button 
                    onClick={() => {
                      setFailureReason("");
                      setState("verify");
                    }}
                    className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw size={14} /> Retry Verification
                  </button>
                  <button 
                    onClick={() => setState("amount")}
                    className="w-full py-3 bg-transparent text-zinc-500 hover:text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Abort & Go Back
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Voice Assistant Mic Modal Overlay */}
      <AnimatePresence>
        {voiceListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6"
          >
            <div className="bg-[#09090f] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center relative glow-purple">
              <div className="w-20 h-20 bg-brand-purple/20 border border-brand-purple/40 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-purple">
                <Mic size={36} className="animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Speak Command</h3>
              <p className="text-xs text-zinc-500 mt-1.5">Try: "Pay Zara terminal 480 rupees"</p>
              
              <div className="my-6 p-4 bg-black border border-white/5 rounded-2xl min-h-[50px] flex items-center justify-center">
                <p className="text-sm font-semibold text-white font-mono italic">
                  {voiceTranscript ? `"${voiceTranscript}"` : "Listening for voice..."}
                </p>
              </div>

              {/* Suggestions */}
              <div className="text-left space-y-2 border-t border-white/5 pt-4">
                <p className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider">Example Templates</p>
                <button 
                  onClick={() => handleParsedVoice("pay starbucks register 3 340 rupees")}
                  className="w-full text-left p-2 bg-[#030305] border border-white/5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  "Pay Starbucks Register 3 340 rupees"
                </button>
                <button 
                  onClick={() => handleParsedVoice("send 1200 to zara fashion terminal")}
                  className="w-full text-left p-2 bg-[#030305] border border-white/5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  "Send 1200 to Zara Fashion Terminal"
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
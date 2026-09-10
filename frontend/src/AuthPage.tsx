import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Phone,
  Shield,
  Truck,
  User,
  Waypoints,
} from "lucide-react";

interface AuthPageProps {
  onSuccess: (profile: {
    driverName: string;
    driverMobile: string;
    vehicleNo: string;
    trustedContactMobile: string;
    vehicleType: "heavy" | "standard" | "light";
    commodity: "medical" | "agro" | "pds" | "fuel" | "construction";
  }) => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToHome }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("Bipul Hazarika");
  const [mobileOrEmail, setMobileOrEmail] = useState("+91 98640 12345");
  const [vehicleNo, setVehicleNo] = useState("AS-01-GB-4821");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      driverName: name || "Fleet Driver",
      driverMobile: mobileOrEmail || "+91 98640 12345",
      vehicleNo: vehicleNo || "AS-01-GB-4821",
      trustedContactMobile: "+91 94350 99881",
      vehicleType: "heavy",
      commodity: "medical",
    });
  };

  const handleQuickDemoAccess = () => {
    onSuccess({
      driverName: "Bipul Hazarika",
      driverMobile: "+91 98640 12345",
      vehicleNo: "AS-01-GB-4821",
      trustedContactMobile: "+91 94350 99881",
      vehicleType: "heavy",
      commodity: "medical",
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 2-Column Authentication Card (Modeled directly after Dribbble reference) */}
      <div className="w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-colors">
        {/* Left Side: Himalayan Road Visual Showcase */}
        <div className="lg:col-span-5 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden min-h-[300px] lg:min-h-[580px]">
          {/* Background Highway Photography */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-himalayan-highway.jpg')" }}
          />
          {/* Subtle Deep Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/75" />

          {/* Top Bar on Image: Logo & Back Button */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <Waypoints className="size-4" />
              </div>
              <span className="font-bold tracking-tight text-base">RaahSetu</span>
            </div>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Back to website</span>
              <ArrowRight className="size-3" />
            </button>
          </div>

          {/* Bottom Card Copy & Pagination */}
          <div className="relative z-10 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/30 border border-primary/40 text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
                <Shield className="size-3" />
                <span>Verified Freight Portal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Navigating Lifelines, Safeguarding Freight.
              </h2>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Empowering hill drivers, logistics operators, and essential supplies across Northeast mountain corridors.
              </p>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-white" />
              <span className="size-2 rounded-full bg-white/40" />
              <span className="size-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* Right Side: Clean Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-card text-foreground">
          <div>
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {mode === "signin" ? "Sign in to Dispatcher" : "Create fleet driver account"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {mode === "signin" ? (
                  <>
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 text-xs">
              {mode === "signup" && (
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Driver / Operator Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Bipul Hazarika"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Driver Mobile Number or Email
                </label>
                <div className="relative flex items-center">
                  <Phone className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={mobileOrEmail}
                    onChange={(e) => setMobileOrEmail(e.target.value)}
                    placeholder="+91 98640 12345 or fleet@transport.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Vehicle Registration / Fleet ID
                </label>
                <div className="relative flex items-center">
                  <Truck className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="e.g. AS-01-GB-4821 (28T Multi-Axle)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-4"
                  />
                  <span className="text-muted-foreground text-[11px]">
                    I agree to MoRTH Road Safety Protocols
                  </span>
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{mode === "signin" ? "Sign In to Dispatcher" : "Create Account & Enter"}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>

            {/* SSO & Demo Options */}
            <div className="mt-5 space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative px-3 bg-card text-[11px] text-muted-foreground uppercase tracking-wider">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleQuickDemoAccess}
                  className="py-2 px-3 rounded-xl border border-border bg-secondary text-foreground hover:bg-muted font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Truck className="size-3.5 text-primary" />
                  <span>Fleet Driver Demo</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAccess}
                  className="py-2 px-3 rounded-xl border border-border bg-secondary text-foreground hover:bg-muted font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>NIC / Gov SSO</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Encrypted Fleet Auth v2.4</span>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:underline text-foreground cursor-pointer"
            >
              Skip login & explore data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

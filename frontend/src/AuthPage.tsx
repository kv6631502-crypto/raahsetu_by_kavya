import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  Waypoints,
} from "lucide-react";

import { SupportedLanguage, TRANSLATIONS } from "./translations";

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
  lang?: SupportedLanguage;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToHome, lang = "en" }) => {
  const t = TRANSLATIONS[lang];
  const [email, setEmail] = useState("driver@raahsetu.in");
  const [password, setPassword] = useState("SafeTransit@2026");
  const [trustedPersonNo, setTrustedPersonNo] = useState("+91 94350 99881");
  const [showPassword, setShowPassword] = useState(false);

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const captchaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 5-character unambiguous captcha code
  const generateCaptchaCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Draw captcha with distortion, wavy lines, and noise
  const renderCaptcha = (code: string) => {
    const canvas = captchaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains("dark");

    // Background fill
    ctx.fillStyle = isDark ? "#0f172a" : "#f1f5f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.4)" : "rgba(2, 132, 199, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      ctx.stroke();
    }

    // Render characters with rotation and slight jitter
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 16 + i * 22;
      const y = 28 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = "bold 20px 'Courier New', monospace";
      ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7";
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    // Noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const refreshCaptcha = () => {
    setIsRefreshingCaptcha(true);
    const newCode = generateCaptchaCode();
    setCaptchaCode(newCode);
    setCaptchaInput("");
    setCaptchaError(null);
    setTimeout(() => {
      renderCaptcha(newCode);
      setIsRefreshingCaptcha(false);
    }, 150);
  };

  useEffect(() => {
    const code = generateCaptchaCode();
    setCaptchaCode(code);
    renderCaptcha(code);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError(t.captchaError);
      refreshCaptcha();
      return;
    }

    onSuccess({
      driverName: email.split("@")[0] || "Fleet Driver",
      driverMobile: email,
      vehicleNo: "AS-01-GB-4821",
      trustedContactMobile: trustedPersonNo || "+91 94350 99881",
      vehicleType: "heavy",
      commodity: "medical",
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 2-Column Authentication Card */}
      <div className="w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-colors">
        {/* Left Side: Himalayan Road Visual Showcase */}
        <div className="lg:col-span-5 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden min-h-[280px] lg:min-h-[560px]">
          {/* Background Highway Photography */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-himalayan-highway.jpg')" }}
          />
          {/* Deep Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/75" />

          {/* Top Bar on Image: Logo & Back Button */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <Waypoints className="size-4" />
              </div>
              <span className="font-bold tracking-tight text-base">{t.brandName}</span>
            </div>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{t.backToPlatform}</span>
              <ArrowRight className="size-3" />
            </button>
          </div>

          {/* Bottom Card Copy */}
          <div className="relative z-10 space-y-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/30 border border-primary/40 text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
                <Shield className="size-3" />
                <span>{t.authBadge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {t.brandSubtitle}
              </h2>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                {t.heroDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-card text-foreground">
          <div>
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t.authTitle}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t.authSubtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              {/* 1. Email ID */}
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  {t.emailLabel}
                </label>
                <div className="relative flex items-center">
                  <Mail className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              {/* 2. Password */}
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  {t.passwordLabel}
                </label>
                <div className="relative flex items-center">
                  <Lock className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* 3. Trusted Person No */}
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  {t.trustedPersonLabel}
                </label>
                <div className="relative flex items-center">
                  <Phone className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={trustedPersonNo}
                    onChange={(e) => setTrustedPersonNo(e.target.value)}
                    placeholder={t.trustedPersonPlaceholder}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  {t.trustedPersonHelp}
                </p>
              </div>

              {/* 4. Security Captcha */}
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  {t.captchaLabel}
                </label>
                <div className="flex items-center gap-3">
                  <canvas
                    ref={captchaCanvasRef}
                    width={130}
                    height={42}
                    className="rounded-xl border border-border shrink-0 select-none shadow-2xs"
                    title="Security verification code"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 rounded-xl border border-border bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-2xs"
                    title={t.captchaHelp}
                  >
                    <RefreshCw className={`size-4 ${isRefreshingCaptcha ? "animate-spin" : ""}`} />
                  </button>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value);
                      if (captchaError) setCaptchaError(null);
                    }}
                    placeholder={t.captchaPlaceholder}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono uppercase tracking-wider"
                  />
                </div>
                {captchaError && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive mt-1.5 font-medium">
                    <AlertCircle className="size-3.5" />
                    <span>{captchaError}</span>
                  </div>
                )}
              </div>

              {/* 5. Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>{t.signInBtn}</span>
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

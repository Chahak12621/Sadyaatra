"use client";
// app/user/login/page.tsx

import React, { useState, useRef, useEffect } from "react";
import { supabase, signIn, signUpUser } from "@/lib/supabase";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --sky:#0ea5e9;--sky-deep:#0369a1;--coral:#f97316;
  --dusk:#1e1b4b;--mist:#f0f9ff;--ink:#0f172a;--slate:#475569;--red:#ef4444;
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
}
html,body{height:100%;font-family:'DM Sans',sans-serif;background:var(--mist);color:var(--ink);overflow-x:hidden;}
body{cursor:none;}
.cur{position:fixed;width:10px;height:10px;background:var(--sky);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:multiply;transition:width .3s,height .3s;}
.cur-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--sky);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:.45;transition:width .3s,height .3s;}
.cur.h{width:18px;height:18px;background:var(--coral);}
.cur-ring.h{width:52px;height:52px;opacity:.15;}

.auth-wrap{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
@media(max-width:768px){.auth-wrap{grid-template-columns:1fr;}.auth-visual{display:none!important;}}

/* Visual panel */
.auth-visual{background:linear-gradient(145deg,#0369a1,#0ea5e9,#06b6d4);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;}
.auth-visual::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px);background-size:36px 36px;}
.av-orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;}
.av-orb-1{width:380px;height:380px;background:rgba(255,255,255,.12);top:-100px;right:-80px;animation:orb-float 9s ease-in-out infinite alternate;}
.av-orb-2{width:260px;height:260px;background:rgba(249,115,22,.18);bottom:-60px;left:-40px;animation:orb-float 11s ease-in-out infinite alternate-reverse;}
@keyframes orb-float{from{transform:translate(0,0) scale(1);}to{transform:translate(20px,20px) scale(1.06);}}
.av-content{position:relative;z-index:1;text-align:center;color:#fff;}
.av-logo{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;letter-spacing:-.03em;margin-bottom:8px;}
.av-tagline{font-size:1rem;color:rgba(255,255,255,.7);margin-bottom:48px;}
.av-card{background:rgba(255,255,255,.12);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:28px 24px;width:100%;max-width:320px;text-align:left;animation:card-float 5s ease-in-out infinite;}
@keyframes card-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.av-card-flag{font-size:2.2rem;margin-bottom:12px;}
.av-card-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:4px;}
.av-card-sub{font-size:.82rem;color:rgba(255,255,255,.65);}
.av-card-price{display:inline-block;margin-top:14px;background:rgba(255,255,255,.2);border-radius:50px;padding:5px 14px;font-size:.82rem;font-weight:700;color:#fff;}
.av-dots{display:flex;gap:8px;justify-content:center;margin-top:36px;}
.av-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);}
.av-dot.active{background:#fff;width:24px;border-radius:4px;}

/* Form side */
.auth-form-side{display:flex;align-items:center;justify-content:center;padding:40px 24px;background:#fff;}
.auth-box{width:100%;max-width:440px;}
.auth-back{display:inline-flex;align-items:center;gap:8px;font-size:.85rem;font-weight:500;color:var(--slate);margin-bottom:32px;cursor:none;transition:color .3s;border:none;background:none;}
.auth-back:hover{color:var(--sky);}
.auth-tabs{display:flex;background:var(--mist);border-radius:12px;padding:4px;gap:4px;margin-bottom:36px;}
.auth-tab{flex:1;padding:11px;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;color:var(--slate);background:transparent;cursor:none;transition:all .3s;}
.auth-tab.active{background:#fff;color:var(--sky-deep);box-shadow:0 2px 12px rgba(14,165,233,.12);}
.auth-heading{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;color:var(--dusk);letter-spacing:-.02em;margin-bottom:6px;}
.auth-sub{font-size:.9rem;color:var(--slate);margin-bottom:32px;line-height:1.6;}

.field{margin-bottom:20px;}
.field label{display:block;font-size:.82rem;font-weight:600;color:var(--ink);margin-bottom:7px;}
.field input{width:100%;padding:13px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.95rem;color:var(--ink);background:#fff;outline:none;transition:border-color .3s,box-shadow .3s;}
.field input:focus{border-color:var(--sky);box-shadow:0 0 0 3px rgba(14,165,233,.1);}
.field input.err{border-color:var(--red);}
.field-err{font-size:.78rem;color:var(--red);margin-top:5px;}
.pw-wrap{position:relative;}
.pw-wrap input{padding-right:46px;}
.pw-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:none;color:var(--slate);font-size:1.1rem;}
.divider{display:flex;align-items:center;gap:12px;margin:24px 0;color:var(--slate);font-size:.82rem;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:#e2e8f0;}

.btn-auth{width:100%;padding:15px;background:linear-gradient(135deg,var(--sky),var(--sky-deep));border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;color:#fff;cursor:none;transition:transform .3s var(--ease-spring),box-shadow .3s;margin-top:4px;}
.btn-auth:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 10px 30px rgba(14,165,233,.35);}
.btn-auth:disabled{opacity:.6;transform:none;box-shadow:none;cursor:not-allowed;}

.forgot{font-size:.82rem;color:var(--sky);display:block;cursor:none;border:none;background:none;font-family:'DM Sans',sans-serif;transition:color .3s;text-align:right;width:100%;margin-bottom:20px;margin-top:-10px;}
.forgot:hover{color:var(--sky-deep);}
.terms{font-size:.78rem;color:var(--slate);margin-top:18px;text-align:center;line-height:1.6;}
.terms a{color:var(--sky);text-decoration:none;}

.strength-bar{display:flex;gap:4px;margin-top:8px;}
.strength-seg{flex:1;height:4px;border-radius:2px;background:#e2e8f0;transition:background .4s;}
.s-weak{background:#ef4444;}.s-fair{background:#f59e0b;}.s-good{background:#10b981;}.s-strong{background:#059669;}
.strength-label{font-size:.72rem;margin-top:4px;font-weight:600;}
.sl-weak{color:#ef4444;}.sl-fair{color:#f59e0b;}.sl-good{color:#10b981;}.sl-strong{color:#059669;}

.spinner{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg);}}

.toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);padding:14px 24px;border-radius:12px;font-size:.88rem;font-weight:500;z-index:9990;opacity:0;transition:all .4s var(--ease-spring);pointer-events:none;white-space:nowrap;color:#fff;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.toast.success{background:linear-gradient(135deg,#059669,#0d9488);}
.toast.error{background:linear-gradient(135deg,#dc2626,#9f1239);}

.verify-notice{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 18px;margin-top:20px;font-size:.85rem;color:#15803d;line-height:1.6;}
.verify-notice strong{display:block;margin-bottom:4px;}
`;

/* ─── helpers ─── */
function pwStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const LABELS  = ["", "Weak", "Fair", "Good", "Strong"];
const SCLS    = ["", "s-weak", "s-fair", "s-good", "s-strong"];
const SLCLS   = ["", "sl-weak", "sl-fair", "sl-good", "sl-strong"];

function validate(mode: "login" | "register", f: Record<string, string>) {
  const e: Record<string, string> = {};
  if (!f.email) e.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Enter a valid email";
  if (!f.password) e.password = "Password is required";
  else if (f.password.length < 6) e.password = "Minimum 6 characters";
  if (mode === "register") {
    if (!f.name?.trim()) e.name = "Full name is required";
    if (f.password !== f.confirm) e.confirm = "Passwords don't match";
  }
  return e;
}

/* ─── cursor ─── */
function Cursor() {
  const c = useRef<HTMLDivElement>(null);
  const r = useRef<HTMLDivElement>(null);
  const mx = useRef(0); const my = useRef(0);
  const rx = useRef(0); const ry = useRef(0);
  useEffect(() => {
    const cur = c.current!; const ring = r.current!; let id: number;
    const mv = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; };
    document.addEventListener("mousemove", mv);
    const loop = () => {
      cur.style.left = mx.current + "px"; cur.style.top = my.current + "px";
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      ring.style.left = rx.current + "px"; ring.style.top = ry.current + "px";
      id = requestAnimationFrame(loop);
    };
    loop();
    const aH = () => { cur.classList.add("h"); ring.classList.add("h"); };
    const rH = () => { cur.classList.remove("h"); ring.classList.remove("h"); };
    const at = () => document.querySelectorAll<HTMLElement>("a,button,input").forEach(el => {
      el.addEventListener("mouseenter", aH); el.addEventListener("mouseleave", rH);
    });
    at();
    const mo = new MutationObserver(at);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { cancelAnimationFrame(id); document.removeEventListener("mousemove", mv); mo.disconnect(); };
  }, []);
  return <><div ref={c} className="cur" /><div ref={r} className="cur-ring" /></>;
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function UserLoginPage() {
  const [mode,     setMode]     = useState<"login" | "register">("login");
  const [form,     setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [showPw,   setShowPw]   = useState(false);
  const [showCnf,  setShowCnf]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [verified, setVerified] = useState(false);   // show "check email" notice
  const [toast,    setToast]    = useState({ msg: "", type: "" as "success" | "error" | "" });

  const strength = pwStrength(form.password);

  const flash = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 4000);
  };

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => { const n = { ...er }; delete n[k]; return n; });
  };

  const handleSubmit = async () => {
    const errs = validate(mode, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const { user } = await signIn(form.email, form.password);

        // Check this is a "user" role (not an agent trying to log in here)
        const role = user?.user_metadata?.role;
        if (role === "agent") {
          flash("This is a traveller login. Please use the Agent portal.", "error");
          await supabase.auth.signOut();
          return;
        }

        flash("✅ Welcome back! Redirecting…", "success");
        setTimeout(() => { window.location.href = "/user/home"; }, 1500);
      } else {
        await signUpUser(form.email, form.password, form.name);
        // Supabase sends a confirmation email by default
        setVerified(true);
        flash("🎉 Account created! Check your email to confirm. Now you can login", "success");
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Something went wrong";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already been registered")) {
        flash("An account with this email already exists.", "error");
      } else if (msg.toLowerCase().includes("invalid login")) {
        flash("Incorrect email or password. Maybe you are a new user Please Sign up!", "error");
      } else {
        flash(msg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!form.email) { flash("Enter your email address first.", "error"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/user/reset-password`,
    });
    if (error) { flash(error.message, "error"); return; }
    flash("📧 Password reset email sent!", "success");
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m); setErrors({}); setVerified(false);
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Cursor />
      <div className={`toast ${toast.type} ${toast.msg ? "show" : ""}`}>{toast.msg}</div>

      <div className="auth-wrap">

        {/* ── Left visual panel ── */}
        <div className="auth-visual">
          <div className="av-orb av-orb-1" /><div className="av-orb av-orb-2" />
          <div className="av-content">
            <div className="av-logo">Sadyaatra<span style={{ color: "rgba(255,255,255,.6)" }}></span><span style={{ color: "#f97316" }}>.</span>AI</div>
            <div className="av-tagline">Your journey starts here</div>
            <div className="av-card">
              <div className="av-card-flag">🏯</div>
              <div className="av-card-title">Taj Mahal, Agra</div>
              <div className="av-card-sub">📅 Mar 15–18 · 2 travelers · ⭐ 4.9</div>
              <div className="av-card-price">from ₹8,500 / person</div>
            </div>
            <div className="av-dots">
              <div className="av-dot active" /><div className="av-dot" /><div className="av-dot" />
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-form-side">
          <div className="auth-box">

            <button className="auth-back" onClick={() => window.location.href = "/"}>← Back to home</button>

            <div className="auth-tabs">
              <button className={`auth-tab${mode === "login" ? " active" : ""}`} onClick={() => switchMode("login")}>Log In</button>
              <button className={`auth-tab${mode === "register" ? " active" : ""}`} onClick={() => switchMode("register")}>Sign Up</button>
            </div>

            <div className="auth-heading">{mode === "login" ? "Welcome back" : "Create account"}</div>
            <div className="auth-sub">
              {mode === "login"
                ? "Sign in to continue planning your journey."
                : "Join SunTreasure AI and start exploring India."}
            </div>

            {/* Name — register only */}
            {mode === "register" && (
              <div className="field">
                <label>Full Name</label>
                <input type="text" placeholder="Rahul Sharma" value={form.name} onChange={upd("name")} className={errors.name ? "err" : ""} />
                {errors.name && <div className="field-err">{errors.name}</div>}
              </div>
            )}

            {/* Email */}
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={upd("email")} className={errors.email ? "err" : ""} />
              {errors.email && <div className="field-err">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="field">
              <label>Password</label>
              <div className="pw-wrap">
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={upd("password")} className={errors.password ? "err" : ""} />
                <button className="pw-eye" onClick={() => setShowPw(s => !s)}>{showPw ? "🙈" : "👁️"}</button>
              </div>
              {errors.password && <div className="field-err">{errors.password}</div>}
              {mode === "register" && form.password && (
                <>
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className={`strength-seg${strength >= n ? " " + SCLS[strength] : ""}`} />
                    ))}
                  </div>
                  <div className={`strength-label ${SLCLS[strength]}`}>{LABELS[strength]}</div>
                </>
              )}
            </div>

            {/* Confirm — register only */}
            {mode === "register" && (
              <div className="field">
                <label>Confirm Password</label>
                <div className="pw-wrap">
                  <input type={showCnf ? "text" : "password"} placeholder="••••••••" value={form.confirm} onChange={upd("confirm")} className={errors.confirm ? "err" : ""} />
                  <button className="pw-eye" onClick={() => setShowCnf(s => !s)}>{showCnf ? "🙈" : "👁️"}</button>
                </div>
                {errors.confirm && <div className="field-err">{errors.confirm}</div>}
              </div>
            )}

            {mode === "login" && (
              <button className="forgot" onClick={handleForgot}>Forgot password?</button>
            )}

            <button className="btn-auth" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" /> : mode === "login" ? "Log In →" : "Create Account →"}
            </button>

            {/* Email verification notice */}
            {verified && (
              <div className="verify-notice">
                <strong>📧 Check your email!</strong>
                We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then log in.
              </div>
            )}

            {mode === "register" && (
              <div className="terms">
                By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
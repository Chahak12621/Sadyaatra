"use client";
// app/agent/login/page.tsx

import React, { useState, useRef, useEffect } from "react";
import { supabase, signIn } from "@/lib/supabase";

/* ── styles ─────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--gold:#f59e0b;--gold-deep:#b45309;--amber:#d97706;--dusk:#1e1b4b;--ink:#0f172a;--slate:#475569;--mist:#fffbeb;--red:#ef4444;--ease-spring:cubic-bezier(0.34,1.56,0.64,1);}
html,body{height:100%;font-family:'DM Sans',sans-serif;background:var(--mist);color:var(--ink);overflow-x:hidden;}
body{cursor:none;}
.cur{position:fixed;width:10px;height:10px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:multiply;transition:width .3s,height .3s;}
.cur-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:.45;transition:width .3s,height .3s;}
.cur.h{width:18px;height:18px;background:var(--amber);}
.cur-ring.h{width:52px;height:52px;opacity:.15;}

.auth-wrap{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
@media(max-width:768px){.auth-wrap{grid-template-columns:1fr;}.auth-visual{display:none!important;}}

/* Visual panel */
.auth-visual{background:linear-gradient(145deg,#1e1b4b,#312e81,#1e1b4b);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;}
.auth-visual::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(245,158,11,.06) 1px,transparent 1px);background-size:36px 36px;}
.av-orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;}
.av-orb-1{width:380px;height:380px;background:rgba(245,158,11,.15);top:-100px;right:-80px;animation:orb-float 9s ease-in-out infinite alternate;}
.av-orb-2{width:260px;height:260px;background:rgba(249,115,22,.12);bottom:-60px;left:-40px;animation:orb-float 11s ease-in-out infinite alternate-reverse;}
@keyframes orb-float{from{transform:translate(0,0) scale(1);}to{transform:translate(20px,20px) scale(1.06);}}
.av-content{position:relative;z-index:1;text-align:center;color:#fff;}
.av-logo{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;letter-spacing:-.03em;margin-bottom:6px;}
.av-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.4);border-radius:50px;padding:6px 16px;font-size:.8rem;font-weight:600;color:#fbbf24;margin-bottom:36px;}
.av-stats{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:300px;}
.av-stat{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px;text-align:center;}
.av-stat-num{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:#fbbf24;}
.av-stat-label{font-size:.75rem;color:rgba(255,255,255,.6);margin-top:4px;}
.av-perks{margin-top:32px;text-align:left;width:100%;max-width:300px;}
.av-perk{display:flex;align-items:center;gap:10px;font-size:.88rem;color:rgba(255,255,255,.75);margin-bottom:12px;}

/* Form side */
.auth-form-side{display:flex;align-items:center;justify-content:center;padding:40px 24px;background:#fff;}
.auth-box{width:100%;max-width:440px;}
.auth-back{display:inline-flex;align-items:center;gap:8px;font-size:.85rem;font-weight:500;color:var(--slate);margin-bottom:32px;cursor:none;transition:color .3s;border:none;background:none;}
.auth-back:hover{color:var(--gold);}
.agent-badge{display:inline-flex;align-items:center;gap:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:50px;padding:6px 14px;font-size:.78rem;font-weight:700;color:var(--gold-deep);margin-bottom:24px;}
.auth-heading{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;color:var(--dusk);letter-spacing:-.02em;margin-bottom:6px;}
.auth-sub{font-size:.9rem;color:var(--slate);margin-bottom:32px;line-height:1.6;}

.field{margin-bottom:20px;}
.field label{display:block;font-size:.82rem;font-weight:600;color:var(--ink);margin-bottom:7px;}
.field input{width:100%;padding:13px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.95rem;color:var(--ink);background:#fff;outline:none;transition:border-color .3s,box-shadow .3s;}
.field input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(245,158,11,.1);}
.field input.err{border-color:var(--red);}
.field-err{font-size:.78rem;color:var(--red);margin-top:5px;}
.pw-wrap{position:relative;}
.pw-wrap input{padding-right:46px;}
.pw-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:none;color:var(--slate);font-size:1.1rem;}

.btn-auth{width:100%;padding:15px;background:linear-gradient(135deg,var(--gold),var(--gold-deep));border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;color:#fff;cursor:none;transition:transform .3s var(--ease-spring),box-shadow .3s;}
.btn-auth:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 10px 30px rgba(245,158,11,.35);}
.btn-auth:disabled{opacity:.6;transform:none;cursor:not-allowed;}
.btn-register{width:100%;padding:13px;margin-top:14px;background:transparent;border:1.5px solid #fde68a;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.92rem;font-weight:600;color:var(--gold-deep);cursor:none;transition:all .3s;}
.btn-register:hover{background:#fffbeb;border-color:var(--gold);}

.divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--slate);font-size:.82rem;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:#e2e8f0;}
.forgot{font-size:.82rem;color:var(--gold);display:block;cursor:none;border:none;background:none;font-family:'DM Sans',sans-serif;transition:color .3s;text-align:right;width:100%;margin-bottom:20px;margin-top:-10px;}
.forgot:hover{color:var(--gold-deep);}

/* Status pill */
.status-pill{display:inline-flex;align-items:center;gap:8px;border-radius:12px;padding:14px 18px;font-size:.85rem;font-weight:500;line-height:1.5;margin-top:16px;width:100%;}
.status-pill.pending{background:#fef9c3;color:#854d0e;border:1px solid #fde68a;}
.status-pill.rejected{background:#fef2f2;color:#991b1b;border:1px solid #fecaca;}

.spinner{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg);}}
.toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);padding:14px 24px;border-radius:12px;font-size:.88rem;font-weight:500;z-index:9990;opacity:0;transition:all .4s var(--ease-spring);pointer-events:none;white-space:nowrap;color:#fff;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.toast.success{background:linear-gradient(135deg,#059669,#0d9488);}
.toast.error{background:linear-gradient(135deg,#dc2626,#9f1239);}
`;

/* ── cursor ── */
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
export default function AgentLoginPage() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"pending_review" | "rejected" | null>(null);
  const [toast,   setToast]   = useState({ msg: "", type: "" as "success" | "error" | "" });

  const flash = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 4000);
  };

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => { const n = { ...er }; delete n[k]; return n; });
    setAgentStatus(null);
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setAgentStatus(null);
    try {
      const { user } = await signIn(form.email, form.password);

     
      const role = user?.user_metadata?.role;
      if (role !== "agent") {
        flash("This portal is for agents only. Please use the traveller login.", "error");
        await supabase.auth.signOut();
        return;
      }

      
      

      
      flash(" Welcome back! Loading dashboard…", "success");
      setTimeout(() => { window.location.href = "/agent/dashboard"; }, 1500);

    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Something went wrong";
      if (msg.toLowerCase().includes("invalid login")) {
        flash("Incorrect email or password.", "error");
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
      redirectTo: `${window.location.origin}/agent/reset-password`,
    });
    if (error) { flash(error.message, "error"); return; }
    flash("📧 Password reset email sent!", "success");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Cursor />
      <div className={`toast ${toast.type} ${toast.msg ? "show" : ""}`}>{toast.msg}</div>

      <div className="auth-wrap">

        {/* ── Left visual ── */}
        <div className="auth-visual">
          <div className="av-orb av-orb-1" /><div className="av-orb av-orb-2" />
          <div className="av-content">
            <div className="av-logo">Sadyaatra<span style={{ color: "rgba(255,255,255,.55)" }}></span><span style={{ color: "#f97316" }}>.</span>AI</div>
            <div className="av-badge">🚗 Agent Portal</div>
            <div className="av-stats">
              {[
                { num: "₹48K", label: "Avg Monthly Earnings" },
                { num: "4.9★", label: "Agent Rating" },
                { num: "2,400+", label: "Active Agents" },
                { num: "98%", label: "Satisfaction Rate" },
              ].map(s => (
                <div key={s.label} className="av-stat">
                  <div className="av-stat-num">{s.num}</div>
                  <div className="av-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="av-perks">
              {[
                { icon: "💰", text: "Earn on every booking you handle" },
                { icon: "🗺️", text: "Access AI itinerary tools" },
                { icon: "📊", text: "Real-time earnings dashboard" },
                { icon: "🛡️", text: "SunTreasure verified badge" },
              ].map(p => (
                <div key={p.text} className="av-perk">
                  <span>{p.icon}</span> {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form ── */}
        <div className="auth-form-side">
          <div className="auth-box">
            <button className="auth-back" onClick={() => window.location.href = "/"}>← Back to home</button>
            <div className="agent-badge">🚗 Agent Portal</div>
            <div className="auth-heading">Agent Sign In</div>
            <div className="auth-sub">Access your dashboard and manage bookings.</div>

            <div className="field">
              <label>Registered Email</label>
              <input type="email" placeholder="agent@example.com" value={form.email} onChange={upd("email")} className={errors.email ? "err" : ""} />
              {errors.email && <div className="field-err">{errors.email}</div>}
            </div>

            <div className="field">
              <label>Password</label>
              <div className="pw-wrap">
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={upd("password")} className={errors.password ? "err" : ""} />
                <button className="pw-eye" onClick={() => setShowPw(s => !s)}>{showPw ? "🙈" : "👁️"}</button>
              </div>
              {errors.password && <div className="field-err">{errors.password}</div>}
            </div>

            <button className="forgot" onClick={handleForgot}>Forgot password?</button>

            <button className="btn-auth" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign In to Dashboard →"}
            </button>

            {/* ── Status messages ── */}
            {agentStatus === "pending_review" && (
              <div className="status-pill pending">
                ⏳ <span><strong>Application under review.</strong> Our team is verifying your documents. You&apos;ll receive an email within 2–3 business days once approved.</span>
              </div>
            )}
            {agentStatus === "rejected" && (
              <div className="status-pill rejected">
                ❌ <span><strong>Application not approved.</strong> Please contact <a href="mailto:support@sadyaatra.ai" style={{ color: "inherit" }}>support@suntreasure.ai</a> for details.</span>
              </div>
            )}

            <div className="divider">New agent?</div>
            <button className="btn-register" onClick={() => window.location.href = "/agent/register"}>
              🚗 Register as an Agent →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
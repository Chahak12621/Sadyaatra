"use client";
// app/agent/register/page.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { registerAgent } from "@/lib/supabase";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --gold:#f59e0b;--gold-deep:#b45309;--amber:#d97706;
  --sky:#0ea5e9;--dusk:#1e1b4b;--ink:#0f172a;--slate:#475569;
  --mist:#fffbeb;--red:#ef4444;--green:#10b981;
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
}
html,body{font-family:'DM Sans',sans-serif;background:#f8fafc;color:var(--ink);overflow-x:hidden;}
body{cursor:none;}

/* CURSOR */
.cur{position:fixed;width:10px;height:10px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:multiply;transition:width .3s,height .3s,background .3s;}
.cur-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:.45;transition:width .3s,height .3s;}
.cur.h{width:18px;height:18px;background:var(--amber);}
.cur-ring.h{width:52px;height:52px;opacity:.15;}

/* HEADER */
.reg-header{background:linear-gradient(135deg,var(--dusk),#312e81);padding:20px 40px;display:flex;align-items:center;justify-content:space-between;}
.reg-logo{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#fff;letter-spacing:-.02em;}
.reg-logo-dot{color:#f97316;}
.reg-back{background:none;border:1px solid rgba(255,255,255,.25);border-radius:50px;padding:8px 18px;font-family:'DM Sans',sans-serif;font-size:.82rem;color:rgba(255,255,255,.8);cursor:none;transition:all .3s;}
.reg-back:hover{background:rgba(255,255,255,.1);color:#fff;}

/* STEPPER */
.stepper-wrap{background:#fff;border-bottom:1px solid #e2e8f0;padding:0 40px;}
.stepper{display:flex;max-width:900px;margin:0 auto;}
.step-item{flex:1;display:flex;flex-direction:column;align-items:center;padding:20px 8px;position:relative;cursor:none;}
.step-item::after{content:'';position:absolute;top:32px;left:calc(50% + 20px);right:calc(-50% + 20px);height:2px;background:#e2e8f0;z-index:0;}
.step-item:last-child::after{display:none;}
.step-item.done::after{background:var(--gold);}
.step-circle{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;position:relative;z-index:1;border:2px solid #e2e8f0;background:#fff;color:var(--slate);transition:all .3s;}
.step-item.active .step-circle{border-color:var(--gold);background:var(--gold);color:#fff;box-shadow:0 4px 14px rgba(245,158,11,.4);}
.step-item.done .step-circle{border-color:var(--gold);background:var(--gold);color:#fff;}
.step-label{font-size:.72rem;font-weight:600;color:var(--slate);margin-top:8px;text-align:center;line-height:1.3;}
.step-item.active .step-label{color:var(--gold-deep);}
.step-item.done .step-label{color:var(--gold-deep);}

/* MAIN CONTENT */
.reg-main{max-width:900px;margin:0 auto;padding:40px;}
.reg-section{background:#fff;border-radius:20px;padding:36px;margin-bottom:24px;border:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(0,0,0,.04);}
.reg-section-title{display:flex;align-items:center;gap:12px;margin-bottom:28px;}
.reg-section-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--amber));display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.reg-section-icon.blue{background:linear-gradient(135deg,#0ea5e9,#0369a1);}
.reg-section-icon.green{background:linear-gradient(135deg,#10b981,#059669);}
.reg-section-icon.purple{background:linear-gradient(135deg,#8b5cf6,#6d28d9);}
.reg-section-name{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:var(--dusk);}
.reg-section-desc{font-size:.82rem;color:var(--slate);margin-top:2px;}

/* FIELDS */
.field-grid{display:grid;gap:20px;}
.field-grid.cols2{grid-template-columns:1fr 1fr;}
.field-grid.cols3{grid-template-columns:1fr 1fr 1fr;}
@media(max-width:640px){.field-grid.cols2,.field-grid.cols3{grid-template-columns:1fr;}}
.field{display:flex;flex-direction:column;}
.field label{font-size:.8rem;font-weight:600;color:var(--ink);margin-bottom:7px;letter-spacing:.01em;}
.field label .req{color:var(--red);margin-left:2px;}
.field input,.field select,.field textarea{
  padding:12px 15px;border:1.5px solid #e2e8f0;border-radius:12px;
  font-family:'DM Sans',sans-serif;font-size:.92rem;color:var(--ink);
  background:#fff;outline:none;transition:border-color .3s,box-shadow .3s;
}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(245,158,11,.1);}
.field input.err,.field select.err,.field textarea.err{border-color:var(--red);}
.field textarea{resize:vertical;min-height:90px;}
.field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23475569' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;}
.field-err{font-size:.75rem;color:var(--red);margin-top:5px;}
.field-hint{font-size:.75rem;color:var(--slate);margin-top:5px;}
.pw-wrap{position:relative;}
.pw-wrap input{padding-right:46px;}
.pw-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:none;font-size:1rem;color:var(--slate);}

/* FILE UPLOAD */
.upload-zone{
  border:2px dashed #e2e8f0;border-radius:12px;padding:28px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;cursor:none;transition:all .3s;background:#fafafa;
  position:relative;overflow:hidden;
}
.upload-zone:hover,.upload-zone.drag{border-color:var(--gold);background:#fffbeb;}
.upload-zone.has-file{border-color:var(--green);background:#f0fdf4;}
.upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:none;}
.upload-icon{font-size:2rem;margin-bottom:10px;}
.upload-title{font-size:.9rem;font-weight:600;color:var(--ink);margin-bottom:4px;}
.upload-sub{font-size:.78rem;color:var(--slate);}
.upload-preview{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f0fdf4;border-radius:10px;margin-top:12px;width:100%;}
.upload-preview-name{font-size:.82rem;font-weight:600;color:#059669;flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.upload-preview-remove{background:none;border:none;cursor:none;color:#dc2626;font-size:1rem;}

/* CHECKBOX */
.checkbox-group{display:flex;flex-direction:column;gap:12px;}
.checkbox-item{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;cursor:none;transition:all .3s;}
.checkbox-item:hover{border-color:var(--gold);background:#fffbeb;}
.checkbox-item input[type=checkbox]{width:18px;height:18px;accent-color:var(--gold);cursor:none;flex-shrink:0;margin-top:2px;}
.checkbox-item-text{font-size:.88rem;color:var(--ink);line-height:1.5;}
.checkbox-item-text strong{display:block;font-weight:600;margin-bottom:2px;}

/* NAV BUTTONS */
.reg-nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;}
.btn-prev{padding:13px 28px;background:transparent;border:1.5px solid #e2e8f0;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.92rem;font-weight:600;color:var(--slate);cursor:none;transition:all .3s;}
.btn-prev:hover{border-color:var(--gold);color:var(--gold-deep);}
.btn-next{padding:13px 32px;background:linear-gradient(135deg,var(--gold),var(--gold-deep));border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:700;color:#fff;cursor:none;transition:transform .3s var(--ease-spring),box-shadow .3s;}
.btn-next:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 10px 28px rgba(245,158,11,.35);}
.btn-next:disabled{opacity:.6;transform:none;box-shadow:none;}
.btn-submit{padding:15px 40px;background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;color:#fff;cursor:none;transition:transform .3s var(--ease-spring),box-shadow .3s;}
.btn-submit:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 10px 28px rgba(16,185,129,.35);}
.btn-submit:disabled{opacity:.6;transform:none;box-shadow:none;}
.step-indicator{font-size:.85rem;color:var(--slate);font-weight:500;}

/* SUCCESS */
.success-wrap{min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;text-align:center;}
.success-icon{font-size:5rem;margin-bottom:24px;animation:pop .6s var(--ease-spring) forwards;}
@keyframes pop{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}
.success-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;color:var(--dusk);margin-bottom:14px;}
.success-sub{font-size:1rem;color:var(--slate);max-width:440px;line-height:1.7;margin-bottom:36px;}
.success-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:580px;margin-bottom:40px;}
.success-step{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px 16px;text-align:center;}
.success-step-icon{font-size:1.6rem;margin-bottom:8px;}
.success-step-title{font-size:.85rem;font-weight:700;color:var(--dusk);margin-bottom:4px;}
.success-step-desc{font-size:.76rem;color:var(--slate);line-height:1.5;}
.btn-home{padding:14px 36px;background:linear-gradient(135deg,var(--gold),var(--gold-deep));border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:700;color:#fff;cursor:none;transition:transform .3s,box-shadow .3s;}
.btn-home:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(245,158,11,.35);}

/* TOAST */
.toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--dusk);color:#fff;padding:14px 24px;border-radius:12px;font-size:.88rem;font-weight:500;z-index:9990;opacity:0;transition:all .4s;pointer-events:none;white-space:nowrap;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.toast.error{background:linear-gradient(135deg,#dc2626,#9f1239);}
.spinner{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg);}}
`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface AgentForm {
  // Step 1 - Personal
  fullName: string; email: string; phone: string; dob: string;
  gender: string; address: string; city: string; state: string; pincode: string;
  password: string; confirmPassword: string;
  // Step 2 - Vehicle / KYC
  vehicleType: string; vehicleNumber: string; vehicleModel: string;
  vehicleYear: string; vehicleColor: string; seatingCapacity: string;
  aadharNumber: string; panNumber: string;
  // Step 3 - Document display names (shown in UI)
  aadharFront: string; aadharBack: string;
  licenceImage: string; licenceNumber: string; licenceExpiry: string;
  vehicleRC: string; vehicleInsurance: string; profilePhoto: string;
  // Step 3 - Actual File objects (sent to Supabase Storage)
  aadharFrontFile: File | null; aadharBackFile: File | null;
  licenceImageFile: File | null;
  vehicleRCFile: File | null; vehicleInsuranceFile: File | null;
  profilePhotoFile: File | null;
  // Step 4 - Agreement
  agreeTerms: boolean; agreeBackground: boolean; agreeData: boolean;
}

const INITIAL: AgentForm = {
  fullName:"",email:"",phone:"",dob:"",gender:"",address:"",city:"",state:"",pincode:"",
  password:"",confirmPassword:"",
  vehicleType:"",vehicleNumber:"",vehicleModel:"",vehicleYear:"",vehicleColor:"",
  seatingCapacity:"",aadharNumber:"",panNumber:"",
  aadharFront:"",aadharBack:"",licenceImage:"",licenceNumber:"",
  licenceExpiry:"",vehicleRC:"",vehicleInsurance:"",profilePhoto:"",
  aadharFrontFile:null, aadharBackFile:null, licenceImageFile:null,
  vehicleRCFile:null, vehicleInsuranceFile:null, profilePhotoFile:null,
  agreeTerms:false,agreeBackground:false,agreeData:false,
};

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
function Cursor() {
  const c = useRef<HTMLDivElement>(null); const r = useRef<HTMLDivElement>(null);
  const mx=useRef(0);const my=useRef(0);const rx=useRef(0);const ry=useRef(0);
  useEffect(()=>{
    const cur=c.current!;const ring=r.current!;let id:number;
    const mv=(e:MouseEvent)=>{mx.current=e.clientX;my.current=e.clientY;};
    document.addEventListener("mousemove",mv);
    const loop=()=>{
      cur.style.left=mx.current+"px";cur.style.top=my.current+"px";
      rx.current+=(mx.current-rx.current)*0.12;ry.current+=(my.current-ry.current)*0.12;
      ring.style.left=rx.current+"px";ring.style.top=ry.current+"px";
      id=requestAnimationFrame(loop);
    };
    loop();
    const aH=()=>{cur.classList.add("h");ring.classList.add("h");};
    const rH=()=>{cur.classList.remove("h");ring.classList.remove("h");};
    const at=()=>document.querySelectorAll<HTMLElement>("a,button,input,select,textarea,.upload-zone").forEach(el=>{
      el.addEventListener("mouseenter",aH);el.addEventListener("mouseleave",rH);
    });
    at();const mo=new MutationObserver(at);mo.observe(document.body,{childList:true,subtree:true});
    return()=>{cancelAnimationFrame(id);document.removeEventListener("mousemove",mv);mo.disconnect();};
  },[]);
  return(<><div ref={c} className="cur"/><div ref={r} className="cur-ring"/></>);
}

/* ─────────────────────────────────────────────
   FILE UPLOAD COMPONENT
───────────────────────────────────────────── */
function UploadField({
  label, hint, value, onChange, onFileChange, required=false
}: {label:string;hint:string;value:string;onChange:(name:string)=>void;onFileChange:(file:File|null)=>void;required?:boolean}) {
  const [drag, setDrag] = useState(false);
  const handleFile = useCallback((file:File|undefined)=>{
    if(file) { onChange(file.name); onFileChange(file); }
  },[onChange, onFileChange]);
  return (
    <div className="field">
      <label>{label}{required&&<span className="req">*</span>}</label>
      <div className={`upload-zone${drag?" drag":""}${value?" has-file":""}`}
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
      >
        <input type="file" accept="image/*,.pdf"
          onChange={e=>handleFile(e.target.files?.[0])} />
        {value ? (
          <>
            <div className="upload-icon">✅</div>
            <div className="upload-title" style={{color:"#059669"}}>File Uploaded</div>
            <div className="upload-preview">
              <span>📄</span>
              <span className="upload-preview-name">{value}</span>
              <button className="upload-preview-remove" onClick={e=>{e.stopPropagation();onChange("");onFileChange(null);}}>✕</button>
            </div>
          </>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <div className="upload-title">Drag & drop or click to upload</div>
            <div className="upload-sub">{hint}</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP CONTENT COMPONENTS
───────────────────────────────────────────── */
function Step1({form,upd,errors,showPw,setShowPw,showCnf,setShowCnf}:{
  form:AgentForm; upd:(k:keyof AgentForm)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>void;
  errors:Record<string,string>; showPw:boolean; setShowPw:(v:boolean)=>void;
  showCnf:boolean; setShowCnf:(v:boolean)=>void;
}) {
  return (
    <>
      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon">👤</div>
          <div><div className="reg-section-name">Personal Information</div><div className="reg-section-desc">Your basic personal details</div></div>
        </div>
        <div className="field-grid cols2">
          <div className="field">
            <label>Full Name<span className="req">*</span></label>
            <input type="text" placeholder="Rahul Kumar Sharma" value={form.fullName} onChange={upd("fullName")} className={errors.fullName?"err":""}/>
            {errors.fullName&&<div className="field-err">{errors.fullName}</div>}
          </div>
          <div className="field">
            <label>Email Address<span className="req">*</span></label>
            <input type="email" placeholder="agent@example.com" value={form.email} onChange={upd("email")} className={errors.email?"err":""}/>
            {errors.email&&<div className="field-err">{errors.email}</div>}
          </div>
          <div className="field">
            <label>Phone Number<span className="req">*</span></label>
            <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={upd("phone")} className={errors.phone?"err":""}/>
            {errors.phone&&<div className="field-err">{errors.phone}</div>}
          </div>
          <div className="field">
            <label>Date of Birth<span className="req">*</span></label>
            <input type="date" value={form.dob} onChange={upd("dob")} className={errors.dob?"err":""}/>
            {errors.dob&&<div className="field-err">{errors.dob}</div>}
          </div>
          <div className="field">
            <label>Gender<span className="req">*</span></label>
            <select value={form.gender} onChange={upd("gender")} className={errors.gender?"err":""}>
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
            </select>
            {errors.gender&&<div className="field-err">{errors.gender}</div>}
          </div>
        </div>
        <div className="field-grid" style={{marginTop:20}}>
          <div className="field">
            <label>Full Address<span className="req">*</span></label>
            <textarea placeholder="House No., Street, Area, Locality" value={form.address} onChange={upd("address")} className={errors.address?"err":""}/>
            {errors.address&&<div className="field-err">{errors.address}</div>}
          </div>
        </div>
        <div className="field-grid cols3" style={{marginTop:20}}>
          <div className="field">
            <label>City<span className="req">*</span></label>
            <input type="text" placeholder="Mumbai" value={form.city} onChange={upd("city")} className={errors.city?"err":""}/>
            {errors.city&&<div className="field-err">{errors.city}</div>}
          </div>
          <div className="field">
            <label>State<span className="req">*</span></label>
            <select value={form.state} onChange={upd("state")} className={errors.state?"err":""}>
              <option value="">Select state</option>
              {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","J&K","Ladakh"].map(s=><option key={s}>{s}</option>)}
            </select>
            {errors.state&&<div className="field-err">{errors.state}</div>}
          </div>
          <div className="field">
            <label>PIN Code<span className="req">*</span></label>
            <input type="text" placeholder="400001" maxLength={6} value={form.pincode} onChange={upd("pincode")} className={errors.pincode?"err":""}/>
            {errors.pincode&&<div className="field-err">{errors.pincode}</div>}
          </div>
        </div>
      </div>

      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon blue">🔒</div>
          <div><div className="reg-section-name">Account Security</div><div className="reg-section-desc">Set a strong password for your agent account</div></div>
        </div>
        <div className="field-grid cols2">
          <div className="field">
            <label>Password<span className="req">*</span></label>
            <div className="pw-wrap">
              <input type={showPw?"text":"password"} placeholder="Min. 8 characters" value={form.password} onChange={upd("password")} className={errors.password?"err":""}/>
              <button className="pw-eye" onClick={()=>setShowPw(!showPw)}>{showPw?"🙈":"👁️"}</button>
            </div>
            {errors.password&&<div className="field-err">{errors.password}</div>}
            <div className="field-hint">Use letters, numbers & symbols for strength</div>
          </div>
          <div className="field">
            <label>Confirm Password<span className="req">*</span></label>
            <div className="pw-wrap">
              <input type={showCnf?"text":"password"} placeholder="Repeat password" value={form.confirmPassword} onChange={upd("confirmPassword")} className={errors.confirmPassword?"err":""}/>
              <button className="pw-eye" onClick={()=>setShowCnf(!showCnf)}>{showCnf?"🙈":"👁️"}</button>
            </div>
            {errors.confirmPassword&&<div className="field-err">{errors.confirmPassword}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

function Step2({form,upd,errors}:{form:AgentForm;upd:(k:keyof AgentForm)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>void;errors:Record<string,string>}) {
  return (
    <>
      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon">🚗</div>
          <div><div className="reg-section-name">Vehicle Details</div><div className="reg-section-desc">Information about your registered vehicle</div></div>
        </div>
        <div className="field-grid cols2">
          <div className="field">
            <label>Vehicle Type<span className="req">*</span></label>
            <select value={form.vehicleType} onChange={upd("vehicleType")} className={errors.vehicleType?"err":""}>
              <option value="">Select type</option>
              <option>Hatchback</option><option>Sedan</option><option>SUV</option>
              <option>MUV</option><option>Minibus</option><option>Tempo Traveller</option><option>Bus</option>
            </select>
            {errors.vehicleType&&<div className="field-err">{errors.vehicleType}</div>}
          </div>
          <div className="field">
            <label>Vehicle Registration Number<span className="req">*</span></label>
            <input type="text" placeholder="MH 01 AB 1234" value={form.vehicleNumber} onChange={upd("vehicleNumber")} className={errors.vehicleNumber?"err":""}/>
            {errors.vehicleNumber&&<div className="field-err">{errors.vehicleNumber}</div>}
          </div>
          <div className="field">
            <label>Vehicle Make & Model<span className="req">*</span></label>
            <input type="text" placeholder="Maruti Swift / Toyota Innova" value={form.vehicleModel} onChange={upd("vehicleModel")} className={errors.vehicleModel?"err":""}/>
            {errors.vehicleModel&&<div className="field-err">{errors.vehicleModel}</div>}
          </div>
          <div className="field">
            <label>Manufacturing Year<span className="req">*</span></label>
            <select value={form.vehicleYear} onChange={upd("vehicleYear")} className={errors.vehicleYear?"err":""}>
              <option value="">Select year</option>
              {Array.from({length:16},(_,i)=>2024-i).map(y=><option key={y}>{y}</option>)}
            </select>
            {errors.vehicleYear&&<div className="field-err">{errors.vehicleYear}</div>}
          </div>
          <div className="field">
            <label>Vehicle Color</label>
            <input type="text" placeholder="White / Silver / Black" value={form.vehicleColor} onChange={upd("vehicleColor")}/>
          </div>
          <div className="field">
            <label>Seating Capacity<span className="req">*</span></label>
            <select value={form.seatingCapacity} onChange={upd("seatingCapacity")} className={errors.seatingCapacity?"err":""}>
              <option value="">Select capacity</option>
              <option>4</option><option>5</option><option>6</option>
              <option>7</option><option>8</option><option>12</option><option>17</option><option>26+</option>
            </select>
            {errors.seatingCapacity&&<div className="field-err">{errors.seatingCapacity}</div>}
          </div>
        </div>
      </div>

      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon green">🪪</div>
          <div><div className="reg-section-name">KYC Information</div><div className="reg-section-desc">Government-issued identification numbers</div></div>
        </div>
        <div className="field-grid cols2">
          <div className="field">
            <label>Aadhaar Card Number<span className="req">*</span></label>
            <input type="text" placeholder="XXXX XXXX XXXX" maxLength={14} value={form.aadharNumber} onChange={upd("aadharNumber")} className={errors.aadharNumber?"err":""}/>
            {errors.aadharNumber&&<div className="field-err">{errors.aadharNumber}</div>}
            <div className="field-hint">12-digit Aadhaar number with spaces</div>
          </div>
          <div className="field">
            <label>PAN Card Number</label>
            <input type="text" placeholder="ABCDE1234F" maxLength={10} value={form.panNumber} onChange={upd("panNumber")}/>
            <div className="field-hint">Required for earnings above ₹50,000/year</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Step3({form,setForm}:{form:AgentForm;setForm:React.Dispatch<React.SetStateAction<AgentForm>>}) {
  const upFile = (nameKey:keyof AgentForm, fileKey:keyof AgentForm) => ({
    onChange: (name:string) => setForm(f=>({...f,[nameKey]:name})),
    onFileChange: (file:File|null) => setForm(f=>({...f,[fileKey]:file})),
  });
  const updField = (k:keyof AgentForm) => (e:React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:e.target.value}));
  return (
    <>
      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon purple">📄</div>
          <div><div className="reg-section-name">Identity Documents</div><div className="reg-section-desc">Upload clear photos of your government-issued documents</div></div>
        </div>
        <div className="field-grid cols2">
          <UploadField label="Aadhaar Card — Front" hint="JPG, PNG or PDF • Max 5MB" value={form.aadharFront} {...upFile("aadharFront","aadharFrontFile")} required/>
          <UploadField label="Aadhaar Card — Back" hint="JPG, PNG or PDF • Max 5MB" value={form.aadharBack} {...upFile("aadharBack","aadharBackFile")} required/>
          <UploadField label="Profile Photo" hint="Clear passport-size photo • JPG, PNG" value={form.profilePhoto} {...upFile("profilePhoto","profilePhotoFile")} required/>
        </div>
      </div>

      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon">🪪</div>
          <div><div className="reg-section-name">Driving Licence</div><div className="reg-section-desc">Valid commercial or private driving licence details</div></div>
        </div>
        <div className="field-grid cols2" style={{marginBottom:20}}>
          <div className="field">
            <label>Licence Number<span className="req">*</span></label>
            <input type="text" placeholder="MH0120XXXXXXXX" value={form.licenceNumber} onChange={updField("licenceNumber")}/>
          </div>
          <div className="field">
            <label>Licence Expiry Date<span className="req">*</span></label>
            <input type="date" value={form.licenceExpiry} onChange={updField("licenceExpiry")}/>
          </div>
        </div>
        <UploadField label="Driving Licence Image (Front & Back)" hint="Upload both sides in one image or PDF • Max 5MB" value={form.licenceImage} {...upFile("licenceImage","licenceImageFile")} required/>
      </div>

      <div className="reg-section">
        <div className="reg-section-title">
          <div className="reg-section-icon blue">🚗</div>
          <div><div className="reg-section-name">Vehicle Documents</div><div className="reg-section-desc">RC book and insurance certificate</div></div>
        </div>
        <div className="field-grid cols2">
          <UploadField label="Vehicle Registration Certificate (RC)" hint="JPG, PNG or PDF • Max 5MB" value={form.vehicleRC} {...upFile("vehicleRC","vehicleRCFile")} required/>
          <UploadField label="Vehicle Insurance Certificate" hint="Valid insurance document • Max 5MB" value={form.vehicleInsurance} {...upFile("vehicleInsurance","vehicleInsuranceFile")} required/>
        </div>
      </div>
    </>
  );
}

function Step4({form,setForm,errors}:{form:AgentForm;setForm:React.Dispatch<React.SetStateAction<AgentForm>>;errors:Record<string,string>}) {
  const toggle = (k:"agreeTerms"|"agreeBackground"|"agreeData") =>
    setForm(f=>({...f,[k]:!f[k]}));
  return (
    <div className="reg-section">
      <div className="reg-section-title">
        <div className="reg-section-icon green">✅</div>
        <div><div className="reg-section-name">Terms & Agreement</div><div className="reg-section-desc">Please read and accept all terms before submitting</div></div>
      </div>
      <div className="checkbox-group">
        <label className="checkbox-item">
          <input type="checkbox" checked={form.agreeTerms} onChange={()=>toggle("agreeTerms")}/>
          <div className="checkbox-item-text">
            <strong>Terms of Service & Agent Agreement</strong>
            I agree to SunTreasure AI&apos;s Terms of Service, Agent Code of Conduct, and the Agent Commission & Payment Policy. I understand I must maintain a minimum 4.0 rating.
          </div>
        </label>
        {errors.agreeTerms&&<div className="field-err" style={{marginTop:-8}}>{errors.agreeTerms}</div>}

        <label className="checkbox-item">
          <input type="checkbox" checked={form.agreeBackground} onChange={()=>toggle("agreeBackground")}/>
          <div className="checkbox-item-text">
            <strong>Background Verification Consent</strong>
            I consent to SunTreasure AI conducting a background verification check including police verification, document authenticity checks, and vehicle inspection as part of the onboarding process.
          </div>
        </label>
        {errors.agreeBackground&&<div className="field-err" style={{marginTop:-8}}>{errors.agreeBackground}</div>}

        <label className="checkbox-item">
          <input type="checkbox" checked={form.agreeData} onChange={()=>toggle("agreeData")}/>
          <div className="checkbox-item-text">
            <strong>Data Processing & Privacy Policy</strong>
            I consent to the collection, storage, and processing of my personal data including KYC documents, location data during trips, and earnings data as described in the Privacy Policy.
          </div>
        </label>
        {errors.agreeData&&<div className="field-err" style={{marginTop:-8}}>{errors.agreeData}</div>}
      </div>

      <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"16px 18px",marginTop:24,fontSize:".83rem",color:"#92400e",lineHeight:1.6}}>
        <strong>📋 What happens next?</strong><br/>
        After submission, our team will review your documents within <strong>2–3 business days</strong>. You&apos;ll receive an email confirmation once verified. Incomplete or unclear documents may delay the process.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VALIDATION PER STEP
───────────────────────────────────────────── */
function validateStep(step:number, form:AgentForm): Record<string,string> {
  const e: Record<string,string> = {};
  if (step === 1) {
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[+\d\s]{10,14}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.gender) e.gender = "Please select gender";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "Please select a state";
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit PIN";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
  }
  if (step === 2) {
    if (!form.vehicleType) e.vehicleType = "Select vehicle type";
    if (!form.vehicleNumber.trim()) e.vehicleNumber = "Vehicle number is required";
    if (!form.vehicleModel.trim()) e.vehicleModel = "Vehicle model is required";
    if (!form.vehicleYear) e.vehicleYear = "Select manufacturing year";
    if (!form.seatingCapacity) e.seatingCapacity = "Select seating capacity";
    if (!form.aadharNumber.trim()) e.aadharNumber = "Aadhaar number is required";
    else if (!/^\d{4}\s?\d{4}\s?\d{4}$/.test(form.aadharNumber.replace(/\s/g,"")||"")) {
      if (form.aadharNumber.replace(/\s/g,"").length !== 12) e.aadharNumber = "Aadhaar must be 12 digits";
    }
  }
  if (step === 4) {
    if (!form.agreeTerms) e.agreeTerms = "You must accept the Terms of Service";
    if (!form.agreeBackground) e.agreeBackground = "You must consent to background verification";
    if (!form.agreeData) e.agreeData = "You must consent to data processing";
  }
  return e;
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const STEPS = [
  { label: "Personal Info",    sub: "Basic details" },
  { label: "Vehicle & KYC",   sub: "Identification" },
  { label: "Documents",        sub: "Upload files" },
  { label: "Agreement",        sub: "Terms & submit" },
];

export default function AgentRegisterPage() {
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState<AgentForm>(INITIAL);
  const [errors,  setErrors]  = useState<Record<string,string>>({});
  const [showPw,  setShowPw]  = useState(false);
  const [showCnf, setShowCnf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [toast,   setToast]   = useState({ msg:"", type:"" as "error"|"" });

  const upd = (k: keyof AgentForm) => (
    e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>
  ) => {
    const val = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (errors[k]) setErrors(er => { const n={...er}; delete n[k]; return n; });
  };

  const showErr = (msg:string) => {
    setToast({msg, type:"error"});
    setTimeout(()=>setToast({msg:"",type:""}), 3000);
  };

  const next = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) { setErrors(errs); showErr("Please fix the errors above."); return; }
    setErrors({});
    window.scrollTo({top:0,behavior:"smooth"});
    setStep(s => s + 1);
  };

  const prev = () => { setErrors({}); window.scrollTo({top:0,behavior:"smooth"}); setStep(s => s - 1); };

  const submit = async () => {
    const errs = validateStep(4, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await registerAgent({
        fullName:          form.fullName,
        email:             form.email,
        phone:             form.phone,
        dob:               form.dob,
        gender:            form.gender,
        address:           form.address,
        city:              form.city,
        state:             form.state,
        pincode:           form.pincode,
        password:          form.password,
        vehicleType:       form.vehicleType,
        vehicleNumber:     form.vehicleNumber,
        vehicleModel:      form.vehicleModel,
        vehicleYear:       form.vehicleYear,
        vehicleColor:      form.vehicleColor,
        seatingCapacity:   form.seatingCapacity,
        aadharNumber:      form.aadharNumber,
        panNumber:         form.panNumber,
        licenceNumber:     form.licenceNumber,
        licenceExpiry:     form.licenceExpiry,
        aadharFrontFile:      form.aadharFrontFile,
        aadharBackFile:       form.aadharBackFile,
        licenceImageFile:     form.licenceImageFile,
        vehicleRCFile:        form.vehicleRCFile,
        vehicleInsuranceFile: form.vehicleInsuranceFile,
        profilePhotoFile:     form.profilePhotoFile,
      });
      setDone(true);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Submission failed";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already been registered")) {
        showErr("An account with this email already exists.");
      } else {
        showErr(msg);
      }
    } finally { setLoading(false); }
  };

  if (done) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <Cursor/>
      <header className="reg-header">
        <div className="reg-logo">Sun<span style={{color:"rgba(255,255,255,.55)"}}>Treasure</span><span className="reg-logo-dot">.</span>AI</div>
      </header>
      <div className="success-wrap">
        <div className="success-icon">🎉</div>
        <div className="success-title">Application Submitted!</div>
        <div className="success-sub">
          Thank you, {form.fullName.split(" ")[0]}! Your agent application has been received. Our team will review your documents and get back to you within 2–3 business days.
        </div>
        <div className="success-steps">
          {[
            {icon:"📋",title:"Under Review",desc:"Documents being verified by our team"},
            {icon:"📧",title:"Email Confirmation",desc:"You'll receive updates at "+form.email},
            {icon:"🚗",title:"Start Earning",desc:"Once approved, start accepting bookings"},
          ].map(s=>(
            <div key={s.title} className="success-step">
              <div className="success-step-icon">{s.icon}</div>
              <div className="success-step-title">{s.title}</div>
              <div className="success-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
        <button className="btn-home" onClick={()=>window.location.href="/"}>← Back to Home</button>
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <Cursor/>
      <div className={`toast ${toast.type} ${toast.msg?"show":""}`}>{toast.msg}</div>

      {/* Header */}
      <header className="reg-header">
        <div className="reg-logo">Sun<span style={{color:"rgba(255,255,255,.55)"}}>Treasure</span><span className="reg-logo-dot">.</span>AI</div>
        <button className="reg-back" onClick={()=>window.location.href="/agent/login"}>← Agent Login</button>
      </header>

      {/* Stepper */}
      <div className="stepper-wrap">
        <div className="stepper">
          {STEPS.map((s,i)=>(
            <div key={s.label} className={`step-item${step===i+1?" active":""}${step>i+1?" done":""}`}>
              <div className="step-circle">{step>i+1?"✓":i+1}</div>
              <div className="step-label">{s.label}<br/><span style={{fontWeight:400,color:"inherit",opacity:.7}}>{s.sub}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="reg-main">
        {step===1 && <Step1 form={form} upd={upd} errors={errors} showPw={showPw} setShowPw={setShowPw} showCnf={showCnf} setShowCnf={setShowCnf}/>}
        {step===2 && <Step2 form={form} upd={upd} errors={errors}/>}
        {step===3 && <Step3 form={form} setForm={setForm}/>}
        {step===4 && <Step4 form={form} setForm={setForm} errors={errors}/>}

        {/* Navigation */}
        <div className="reg-nav">
          <div>
            {step > 1
              ? <button className="btn-prev" onClick={prev}>← Back</button>
              : <button className="btn-prev" onClick={()=>window.location.href="/agent/login"}>← Cancel</button>
            }
          </div>
          <div className="step-indicator">Step {step} of {STEPS.length}</div>
          <div>
            {step < STEPS.length
              ? <button className="btn-next" onClick={next}>Continue →</button>
              : <button className="btn-submit" onClick={submit} disabled={loading}>
                  {loading ? <><span className="spinner"/> Submitting…</> : "🚀 Submit Application"}
                </button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
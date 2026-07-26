import{k as F,E as m,H as d,I as e,e as C,m as ut,F as b,J as K,Q as B,S as X,M as u,T as D,U as Vt,p as Yt}from"./routing-6H_yOrLq.js";import{q as Zt,h as te}from"./index-Du6FC0BF.js";import{c as ft}from"./createAsync-DlEYwpes.js";import{g as ee}from"./utils-BadJ_olU.js";var ie=u('<div class="pagination-container no-print"><div class=pagination-info>Menampilkan <!$><!/> dari <!$><!/> rekap absensi</div><div class=pagination-buttons><button class=btn-pagination>Sebelumnya</button><!$><!/><button class=btn-pagination>Berikutnya'),ne=u(`<main><div class=no-print style=display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)><h1 class=page-title style=margin-bottom:0>Laporan Absensi</h1><div style=display:flex;gap:var(--space-2)><button class=btn-primary style="width:auto;padding:0 var(--space-3);height:38px">Export Excel</button><button class=btn-ghost style="width:auto;padding:0 var(--space-3);height:38px">Cetak PDF</button></div></div><div class="filter-card no-print"style=margin-bottom:var(--space-4)><div class=form-group><label>Cari Nama</label><input type=text placeholder="Cari berdasarkan nama..."></div><div class=form-group><label>Pilih Divisi</label><select><option value>Semua Divisi</option><!$><!/></select></div><div class=form-group><label>Tanggal Mulai</label><input type=date></div><div class=form-group><label>Tanggal Selesai</label><input type=date></div><button class=btn-ghost style=width:auto>Reset Filter</button></div><div class=print-only style=display:none;margin-bottom:20px><div style="display:flex;align-items:center;border-bottom:3px double #1e293b;padding-bottom:15px;margin-bottom:10px;gap:15px;width:100%;box-sizing:border-box"><img src=/logo-sigma.png alt="SIGMA - Sistem Informasi dan Manajemen Magang"style=height:55px><div><h2 style=margin:0;font-size:18px;font-weight:800;letter-spacing:0.5px;color:#0f172a>SIGMA - Sistem Informasi dan Manajemen Magang</h2><p style="margin:2px 0 0 0;font-size:11px;color:#475569;line-height:1.4">Pabrik Cilacap — Jl. Ir. H. Juanda, Cilacap, Jawa Tengah</p></div></div><div style=text-align:center;margin-bottom:15px><h3 style=margin:0;font-size:15px;font-weight:700;letter-spacing:1px;color:#0f172a;text-transform:uppercase>Laporan Kehadiran Mahasiswa / Siswa Magang</h3><p style="margin:6px 0 0 0;font-size:12px;color:#475569">Periode: <!$><!/> s/d <!$><!/></p></div></div><div class=no-print style=overflow-x:auto><table class=data-table><thead><tr><th>No</th><th>Nama Lengkap</th><th>Divisi</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody></tbody></table></div><div class=print-only style=display:none><table class=data-table><thead><tr><th>No</th><th>Nama Lengkap</th><th>Divisi</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody></tbody></table><p style=font-size:11px;color:#64748b;margin-top:10px;text-align:right>Total: <!$><!/> data</p></div><!$><!/><style>
        @media print {
          @page {
            size: landscape;
            margin: 15mm;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
            width: 100% !important;
          }
          .app-layout,
          .app-layout.has-sidebar,
          .app-layout.has-sidebar .app-main-content {
            padding-left: 0 !important;
            margin-left: 0 !important;
            display: block !important;
            width: 100% !important;
          }
          .app-main-content {
            padding: 0 !important;
            margin: 0 !important;
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: sans-serif !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .data-table {
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .data-table th {
            background-color: transparent !important;
            color: #1e293b !important;
            border-bottom: 2px solid #475569 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            font-weight: bold !important;
            padding: 10px 12px !important;
            text-align: left !important;
          }
          .data-table td {
            border-bottom: 1px solid #e2e8f0 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            color: #334155 !important;
            padding: 10px 12px !important;
          }
          .data-table tr:nth-child(even) td {
            background-color: #f8fafc !important;
          }
          .badge {
            background: transparent !important;
            border: 1px solid #475569 !important;
            color: #475569 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            font-weight: bold !important;
          }
        }
      `),ae=u("<option>"),le=u("<tr><td colspan=8 style=text-align:center;color:var(--color-text-secondary);padding:var(--space-5)>Tidak ada catatan absensi sesuai filter tanggal."),re=u("<tr><td style=font-family:var(--font-mono);font-size:13px></td><td><strong></strong><div style=font-size:11px;color:var(--color-text-secondary)>@<!$><!/></div></td><td></td><td></td><td style=font-family:var(--font-mono)></td><td style=font-family:var(--font-mono)></td><td><span></span></td><td>"),oe=u("<tr><td></td><td><strong></strong></td><td></td><td></td><td></td><td></td><td></td><td>"),se=u("<button class=btn-pagination>"),de=u('<span style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600">...');function me(){const[w,V]=F(""),[L,Y]=F(""),xt=ft(()=>Zt(w(),L())),$t=ft(()=>te()),[G,Z]=F(""),[tt,et]=F(""),[c,g]=F(1),R=10,it=()=>{const a=f();return Math.max(1,Math.ceil(a.length/R))},_t=()=>{const a=f();if(!a||a.length===0){alert("Tidak ada data untuk diexport.");return}let i=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Laporan Absensi</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #E11D48; color: #ffffff; font-weight: bold; border: 1px solid #cccccc; padding: 10px; text-align: left; }
    td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
    .status-hadir { color: #16A34A; font-weight: bold; }
    .status-telat { color: #D97706; font-weight: bold; }
    .status-izin { color: #2563EB; font-weight: bold; }
    .status-alpha { color: #DC2626; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Laporan Kehadiran Anak Magang</h2>
  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Nama Lengkap</th>
        <th>Username</th>
        <th>Divisi</th>
        <th>Tanggal</th>
        <th>Check-In</th>
        <th>Check-Out</th>
        <th>Status</th>
        <th>Catatan</th>
      </tr>
    </thead>
    <tbody>`;a.forEach((n,T)=>{const W=new Date(n.date).toLocaleDateString("id-ID"),Q=n.checkIn?new Date(n.checkIn).toLocaleTimeString("id-ID"):"-",j=n.checkOut?new Date(n.checkOut).toLocaleTimeString("id-ID"):"-",J=`status-${n.status.toLowerCase()}`;i+=`
      <tr>
        <td>${T+1}</td>
        <td>${n.user.fullName}</td>
        <td>@${n.user.username}</td>
        <td>${n.user.divisi?.name??"-"}</td>
        <td>${W}</td>
        <td>${Q}</td>
        <td>${j}</td>
        <td><span class="${J}">${n.status}</span></td>
        <td>${n.notes??"-"}</td>
      </tr>`}),i+=`
    </tbody>
  </table>
</body>
</html>`;const I=new Blob([i],{type:"application/vnd.ms-excel;charset=utf-8;"}),p=URL.createObjectURL(I),o=document.createElement("a");o.setAttribute("href",p),o.setAttribute("download",`laporan_absensi_${new Date().toISOString().slice(0,10)}.xls`),o.style.visibility="hidden",document.body.appendChild(o),o.click(),document.body.removeChild(o)},vt=()=>{window.print()},f=()=>{const a=xt();return a?a.filter(i=>{const I=new Date(i.date).toISOString().slice(0,10);if(w()&&I<w()||L()&&I>L()||G()&&i.user.divisi?.name!==G())return!1;const p=tt().toLowerCase().trim();if(p){const o=i.user.fullName.toLowerCase().includes(p),n=i.user.username.toLowerCase().includes(p),T=i.user.divisi?.name?.toLowerCase().includes(p);if(!o&&!n&&!T)return!1}return!0}):[]},H=()=>{const a=f(),i=(c()-1)*R;return a.slice(i,i+R)};return(()=>{var a=m(ne),i=a.firstChild,I=i.firstChild,p=I.nextSibling,o=p.firstChild,n=o.nextSibling,T=i.nextSibling,W=T.firstChild,Q=W.firstChild,j=Q.nextSibling,J=W.nextSibling,St=J.firstChild,U=St.nextSibling,yt=U.firstChild,kt=yt.nextSibling,[Ct,Dt]=d(kt.nextSibling),nt=J.nextSibling,wt=nt.firstChild,at=wt.nextSibling,lt=nt.nextSibling,Lt=lt.firstChild,rt=Lt.nextSibling,It=lt.nextSibling,ot=T.nextSibling,Tt=ot.firstChild,Et=Tt.nextSibling,Mt=Et.firstChild,q=Mt.nextSibling,Nt=q.firstChild,Ot=Nt.nextSibling,[st,zt]=d(Ot.nextSibling),At=st.nextSibling,Pt=At.nextSibling,[Ft,Rt]=d(Pt.nextSibling),dt=ot.nextSibling,Wt=dt.firstChild,jt=Wt.firstChild,Jt=jt.nextSibling,ct=dt.nextSibling,gt=ct.firstChild,Ut=gt.firstChild,Bt=Ut.nextSibling,pt=gt.nextSibling,Gt=pt.firstChild,Ht=Gt.nextSibling,[ht,Qt]=d(Ht.nextSibling);ht.nextSibling;var qt=ct.nextSibling,[mt,Kt]=d(qt.nextSibling);return mt.nextSibling,o.$$click=_t,n.$$click=vt,j.$$input=t=>{et(t.currentTarget.value),g(1)},U.addEventListener("change",t=>{Z(t.currentTarget.value),g(1)}),e(U,C(B,{get each(){return $t()},children:t=>(()=>{var r=m(ae);return e(r,()=>t.name),b(()=>D(r,"value",t.name)),r})()}),Ct,Dt),at.$$input=t=>{V(t.currentTarget.value),g(1)},rt.$$input=t=>{Y(t.currentTarget.value),g(1)},It.$$click=()=>{V(""),Y(""),Z(""),et(""),g(1)},e(q,(()=>{var t=ut(()=>!!w());return()=>t()?new Date(w()).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}):"—"})(),st,zt),e(q,(()=>{var t=ut(()=>!!L());return()=>t()?new Date(L()).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}):new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})})(),Ft,Rt),e(Jt,C(X,{get when(){return H().length>0},get fallback(){return m(le)},get children(){return C(B,{get each(){return H()},children:(t,r)=>{const O=new Date(t.date).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),z=t.checkIn?new Date(t.checkIn).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"-",E=t.checkOut?new Date(t.checkOut).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"-";return(()=>{var x=m(re),$=x.firstChild,_=$.nextSibling,v=_.firstChild,S=v.nextSibling,y=S.firstChild,h=y.nextSibling,[M,k]=d(h.nextSibling),N=_.nextSibling,A=N.nextSibling,l=A.nextSibling,s=l.nextSibling,P=s.nextSibling,bt=P.firstChild,Xt=P.nextSibling;return e($,()=>(c()-1)*R+r()+1),e(v,()=>t.user.fullName),e(S,()=>t.user.username,M,k),e(N,()=>t.user.divisi?.name??"-"),e(A,O),e(l,z),e(s,E),e(bt,()=>t.status),e(Xt,()=>t.notes??"-"),b(()=>Vt(bt,`badge badge-${t.status.toLowerCase()}`)),x})()}})}})),e(Bt,C(B,{get each(){return f()},children:(t,r)=>{const O=new Date(t.date).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),z=t.checkIn?new Date(t.checkIn).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"-",E=t.checkOut?new Date(t.checkOut).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"-";return(()=>{var x=m(oe),$=x.firstChild,_=$.nextSibling,v=_.firstChild,S=_.nextSibling,y=S.nextSibling,h=y.nextSibling,M=h.nextSibling,k=M.nextSibling,N=k.nextSibling;return e($,()=>r()+1),e(v,()=>t.user.fullName),e(S,()=>t.user.divisi?.name??"-"),e(y,O),e(h,z),e(M,E),e(k,()=>t.status),e(N,()=>t.notes??"-"),x})()}})),e(pt,()=>f().length,ht,Qt),e(a,C(X,{get when(){return f().length>0},get children(){var t=m(ie),r=t.firstChild,O=r.firstChild,z=O.nextSibling,[E,x]=d(z.nextSibling),$=E.nextSibling,_=$.nextSibling,[v,S]=d(_.nextSibling);v.nextSibling;var y=r.nextSibling,h=y.firstChild,M=h.nextSibling,[k,N]=d(M.nextSibling),A=k.nextSibling;return e(r,()=>H().length,E,x),e(r,()=>f().length,v,S),h.$$click=()=>g(c()-1),e(y,C(B,{get each(){return ee(c(),it())},children:l=>C(X,{when:l!=="...",get fallback(){return m(de)},get children(){var s=m(se);return s.$$click=()=>g(l),e(s,l),b(()=>s.classList.toggle("active",c()===l)),K(),s}})}),k,N),A.$$click=()=>g(c()+1),b(l=>{var s=c()===1,P=c()===it();return s!==l.e&&D(h,"disabled",l.e=s),P!==l.t&&D(A,"disabled",l.t=P),l},{e:void 0,t:void 0}),K(),t}}),mt,Kt),b(()=>D(j,"value",tt())),b(()=>D(U,"value",G())),b(()=>D(at,"value",w())),b(()=>D(rt,"value",L())),K(),a})()}Yt(["click","input"]);export{me as default};

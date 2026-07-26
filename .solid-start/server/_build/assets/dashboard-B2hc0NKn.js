import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute, ssrStyle } from "solid-js/web";
import { createEffect, Show, createSignal, For } from "solid-js";
import { c as createAsync, a as useSearchParams, s as showToast, C as getAdminStats, g as getUser, D as getTodayAttendanceStatus, E as getInternTrendData } from "../../entry-server.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' style="display:flex;align-items:center;justify-content:space-around;gap:var(--space-4);flex-wrap:wrap;padding:var(--space-2) 0;flex-grow:1;"><svg viewBox="0 0 100 100" class="donut-svg-anim" style="width:45%;max-width:185px;min-width:130px;height:auto;aspect-ratio:1 / 1;flex-shrink:0;overflow:visible;transform-origin:center;"><circle cx="50" cy="50" r="35" fill="transparent" stroke="var(--color-border)" stroke-width="10"></circle><!--$-->', '<!--/--><g style="transform:rotate(90deg);transform-origin:50px 50px;"><text x="50" y="47" text-anchor="middle" font-size="14" font-weight="700" fill="var(--color-text)">', '</text><text x="50" y="58" text-anchor="middle" font-size="7" fill="var(--color-text-secondary)">', "</text></g><!--$-->", '<!--/--></svg><div style="display:flex;flex-direction:column;gap:var(--space-2);min-width:150px;flex:1 1 auto;max-width:220px;">', "</div></div>"], _tmpl$2 = ["<circle", ' cx="50" cy="50"', ' fill="transparent"', ' style="', '"></circle>'], _tmpl$3 = ["<g", ' style="transform:rotate(90deg);transform-origin:50px 50px;pointer-events:none;"><rect', ' width="44" height="18" rx="4" fill="var(--color-text)" opacity="0.9"></rect><text', ' text-anchor="middle" font-size="7" font-weight="600" fill="var(--surface-base)"><!--$-->', "<!--/-->%</text></g>"], _tmpl$4 = ["<div", ' style="', '"><span style="', '"></span><span style="color:var(--color-text);font-weight:500;"><!--$-->', "<!--/-->: <strong>", '</strong> <span style="color:var(--color-text-secondary);font-size:11px;">(<!--$-->', "<!--/-->%)</span></span></div>"], _tmpl$5 = ["<path", ' class="chart-area-anim"', ' fill="url(#chartAreaGrad)"></path>'], _tmpl$6 = ["<path", ' class="chart-line-anim"', ' fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>'], _tmpl$7 = ["<g", ' style="pointer-events:none;"><line', ' y1="15"', ' y2="220" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"></line><circle', ' r="6" fill="#3b82f6" stroke="#ffffff" stroke-width="2.5" style="filter:drop-shadow(0px 2px 4px rgba(59,130,246,0.4));"></circle></g>'], _tmpl$8 = ["<div", ' style="width:100%;position:relative;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);flex-wrap:wrap;gap:8px;"><h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.1rem;margin:0;color:var(--color-text);">Grafik Anak Magang</h3><select', ' style="width:auto !important;height:32px !important;padding:4px 24px 4px 12px !important;border-radius:6px;border:1px solid var(--color-border);background:var(--surface-base);color:var(--color-text);font-size:13px;cursor:pointer;outline:none;"><option value="weekly">Mingguan</option><option value="monthly">Bulanan</option><option value="yearly">Tahunan</option></select></div><svg viewBox="0 0 500 250" style="width:100%;height:auto;aspect-ratio:500 / 250;background:transparent;overflow:visible;"><defs><linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"></stop></linearGradient></defs><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></svg><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$9 = ["<g", '><line x1="40"', ' x2="490"', ' stroke="var(--color-border)" stroke-dasharray="4 4" stroke-width="1" opacity="0.5"></line><text x="32"', ' font-size="10" fill="var(--color-text-secondary)" text-anchor="end" font-family="var(--font-mono)">', "</text></g>"], _tmpl$0 = ["<circle", ' r="3" fill="#3b82f6" stroke="var(--surface-base)" stroke-width="1.5"', ' style="transition:opacity 0.15s ease;pointer-events:none;"></circle>'], _tmpl$1 = ["<rect", ' y="15"', ' height="205" fill="transparent" style="cursor:crosshair;"></rect>'], _tmpl$10 = ["<text", ' y="246" font-size="9" fill="var(--color-text-secondary)" text-anchor="middle" font-family="var(--font-mono)">', "</text>"], _tmpl$11 = ["<div", ' style="', '"><div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:2px;">', '</div><div style="font-size:18px;font-weight:700;color:var(--color-text);">', "</div></div>"], _tmpl$12 = ["<div", ' style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:var(--space-3);font-size:12px;color:var(--color-text-secondary);"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6;flex-shrink:0;"></span>Total Anak Magang <!--$-->', "<!--/--> dari <!--$-->", "<!--/--> hingga <!--$-->", "<!--/--></div>"], _tmpl$13 = ["<main", '><div class="fade-in-up" style="margin-bottom:var(--space-5);text-align:left;"><h1 class="page-title" style="margin-bottom:var(--space-1);">Dashboard Admin</h1><p style="color:var(--color-text-secondary);font-size:15px;margin:0;">Selamat datang kembali, <strong>', '</strong>. Berikut rekap operasional program magang hari ini.</p></div><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:var(--space-4);margin-bottom:var(--space-4);text-align:left;"><div class="stat-card fade-in-up stagger-1" style="border-left:4px solid #3b82f6;"><div class="stat-value">', '</div><div class="stat-label">Total Anak Magang</div></div><div class="stat-card fade-in-up stagger-2" style="border-left:4px solid #8b5cf6;"><div class="stat-value">', '</div><div class="stat-label">Total Divisi</div></div><div class="stat-card fade-in-up stagger-3" style="border-left:4px solid #10b981;"><div class="stat-value">', '</div><div class="stat-label">Batch Aktif</div></div><div class="stat-card fade-in-up stagger-4" style="border-left:4px solid #6b7280;"><div class="stat-value">', '</div><div class="stat-label">Batch Selesai</div></div></div><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:var(--space-4);margin-bottom:var(--space-6);text-align:left;"><div class="stat-card fade-in-up stagger-5" style="border-left:4px solid #10b981;"><div class="stat-value">', '</div><div class="stat-label">Hadir Hari Ini</div></div><div class="stat-card fade-in-up stagger-6" style="border-left:4px solid #f59e0b;"><div class="stat-value">', '</div><div class="stat-label">Terlambat Hari Ini</div></div><div class="stat-card fade-in-up stagger-7" style="border-left:4px solid #ef4444;"><div class="stat-value">', '</div><div class="stat-label">Izin Menunggu Persetujuan</div></div><div class="stat-card fade-in-up stagger-8" style="border-left:4px solid #3b82f6;"><div class="stat-value">', '</div><div class="stat-label">Batch Mendatang</div></div></div><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:var(--space-4);margin-bottom:var(--space-6);text-align:left;"><div class="stat-card fade-in-up" style="padding:var(--space-4);animation-delay:0.45s;"><h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.2rem;margin-top:0;margin-bottom:var(--space-4);color:var(--color-text);">Status Kehadiran Hari Ini</h3><!--$-->', '<!--/--></div><div class="stat-card fade-in-up" style="padding:var(--space-4);animation-delay:0.5s;">', "</div></div></main>"], _tmpl$14 = ["<div", ' style="display:flex;justify-content:center;align-items:center;min-height:185px;"><div class="skeleton" style="width:150px;height:150px;border-radius:50%;"></div></div>'], _tmpl$15 = ["<div", ' style="display:flex;flex-direction:column;gap:15px;"><div class="skeleton" style="width:150px;height:22px;"></div><div class="skeleton" style="width:100%;height:200px;border-radius:6px;"></div></div>'];
const id$$ = "src/routes/admin/dashboard.tsx?pick=default&pick=$css";
const DailyDonutChart = (props) => {
  const [hovered, setHovered] = createSignal(null);
  const total = () => props.hadir + props.telat + props.izin + props.belumAbsen || 1;
  const radius = 35;
  const hoverRadius = 38;
  const circumference = 2 * Math.PI * radius;
  const hoverCircumference = 2 * Math.PI * hoverRadius;
  const segments = () => {
    let currentOffset = 0;
    let currentHoverOffset = 0;
    return [{
      value: props.hadir,
      color: "var(--color-success)",
      label: "Hadir"
    }, {
      value: props.telat,
      color: "var(--color-warning)",
      label: "Telat"
    }, {
      value: props.izin,
      color: "var(--color-info)",
      label: "Izin"
    }, {
      value: props.belumAbsen,
      color: "var(--color-text-secondary)",
      label: "Belum Absen"
    }].map((s, i) => {
      const fraction = s.value / total();
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = currentOffset;
      const hoverStrokeDasharray = `${fraction * hoverCircumference} ${hoverCircumference}`;
      const hoverStrokeDashoffset = currentHoverOffset;
      currentOffset -= fraction * circumference;
      currentHoverOffset -= fraction * hoverCircumference;
      const percentage = fraction * 100;
      return {
        ...s,
        strokeDasharray,
        strokeDashoffset,
        hoverStrokeDasharray,
        hoverStrokeDashoffset,
        percentage,
        index: i
      };
    });
  };
  const tooltipPos = () => {
    const idx = hovered();
    if (idx === null) return null;
    const segs = segments();
    let angleBefore = 0;
    for (let i = 0; i < idx; i++) angleBefore += segs[i].value / total() * 360;
    const midAngle = angleBefore + segs[idx].value / total() * 180;
    const rad = (midAngle - 90) * Math.PI / 180;
    return {
      x: 50 + Math.cos(rad) * 52,
      y: 50 + Math.sin(rad) * 52,
      seg: segs[idx]
    };
  };
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return segments();
    },
    children: (segment) => createComponent(Show, {
      get when() {
        return segment.value > 0;
      },
      get children() {
        return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("r", hovered() === segment.index ? escape(hoverRadius, true) : escape(radius, true), false), ssrAttribute("stroke", escape(segment.color, true), false) + ssrAttribute("stroke-width", hovered() === segment.index ? 12 : 10, false) + ssrAttribute("stroke-dasharray", hovered() === segment.index ? escape(segment.hoverStrokeDasharray, true) : escape(segment.strokeDasharray, true), false) + ssrAttribute("stroke-dashoffset", hovered() === segment.index ? escape(segment.hoverStrokeDashoffset, true) : escape(segment.strokeDashoffset, true), false), ssrStyle(`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; opacity: ${hovered() !== null && hovered() !== segment.index ? "0.4" : "1"};`));
      }
    })
  })), hovered() !== null ? escape(segments()[hovered()].value) : escape(total()), hovered() !== null ? escape(segments()[hovered()].label) : "Total", escape(createComponent(Show, {
    get when() {
      return tooltipPos();
    },
    children: (pos) => ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("x", escape(pos().x, true) - 22, false) + ssrAttribute("y", escape(pos().y, true) - 10, false), ssrAttribute("x", escape(pos().x, true), false) + ssrAttribute("y", escape(pos().y, true) + 3, false), escape(pos().seg.percentage.toFixed(1)))
  })), escape(createComponent(For, {
    get each() {
      return segments();
    },
    children: (segment) => ssr(_tmpl$4, ssrHydrationKey(), ssrStyle(`display: flex; align-items: center; gap: 8px; font-size: 13.5px; padding: 6px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; ${hovered() === segment.index ? "background: var(--color-border);" : ""} ${hovered() !== null && hovered() !== segment.index ? "opacity: 0.5;" : "opacity: 1;"}`), ssrStyle(`display: inline-block; width: 12px; height: 12px; border-radius: 3px; background-color: ${segment.color}; flex-shrink: 0; transition: transform 0.2s ease; ${hovered() === segment.index ? "transform: scale(1.3);" : ""}`), escape(segment.label), escape(segment.value), escape(segment.percentage.toFixed(0)))
  })));
};
const TrendLineChart = (props) => {
  const [period, setPeriod] = createSignal("monthly");
  const [hovered, setHovered] = createSignal(null);
  const activeData = () => props.data[period()];
  const width = 500;
  const height = 250;
  const padL = 40, padR = 10, padT = 15, padB = 30;
  const maxCount = () => {
    const vals = activeData().map((d) => d.count);
    const rawMax = vals.length > 0 ? Math.max(...vals) : 4;
    return Math.max(Math.ceil(rawMax / 4) * 4, 4);
  };
  const getX = (i) => {
    const len = activeData().length;
    if (len <= 1) return padL + (width - padL - padR) / 2;
    return padL + i / (len - 1) * (width - padL - padR);
  };
  const getY = (count) => {
    const ratio = count / maxCount();
    return height - padB - ratio * (height - padT - padB);
  };
  const linePath = () => {
    const data = activeData();
    if (data.length === 0) return "";
    let path = `M ${getX(0)} ${getY(data[0].count)}`;
    for (let i = 1; i < data.length; i++) {
      const x0 = getX(i - 1);
      const y0 = getY(data[i - 1].count);
      const x1 = getX(i);
      const y1 = getY(data[i].count);
      const cpX1 = x0 + (x1 - x0) * 0.35;
      const cpY1 = y0;
      const cpX2 = x1 - (x1 - x0) * 0.35;
      const cpY2 = y1;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x1} ${y1}`;
    }
    return path;
  };
  const areaPath = () => {
    const data = activeData();
    if (data.length === 0) return "";
    const yBottom = height - padB;
    return `${linePath()} L ${getX(data.length - 1)} ${yBottom} L ${getX(0)} ${yBottom} Z`;
  };
  const formatValue = (val) => val >= 1e3 ? (val / 1e3).toFixed(0) + "RB" : `${val}`;
  return ssr(_tmpl$8, ssrHydrationKey(), ssrAttribute("value", escape(period(), true), false), escape(createComponent(For, {
    each: [0, 0.25, 0.5, 0.75, 1],
    children: (ratio) => {
      const val = Math.round(ratio * maxCount());
      const y = getY(val);
      return ssr(_tmpl$9, ssrHydrationKey(), ssrAttribute("y1", escape(y, true), false), ssrAttribute("y2", escape(y, true), false), ssrAttribute("y", escape(y, true) + 4, false), escape(formatValue(val)));
    }
  })), escape(createComponent(Show, {
    get when() {
      return activeData().length >= 2;
    },
    get children() {
      return ssr(_tmpl$5, ssrHydrationKey(), ssrAttribute("d", escape(areaPath(), true), false));
    }
  })), escape(createComponent(Show, {
    get when() {
      return activeData().length >= 2;
    },
    get children() {
      return ssr(_tmpl$6, ssrHydrationKey(), ssrAttribute("d", escape(linePath(), true), false));
    }
  })), escape(createComponent(For, {
    get each() {
      return activeData();
    },
    children: (d, i) => ssr(_tmpl$0, ssrHydrationKey() + ssrAttribute("cx", escape(getX(i()), true), false) + ssrAttribute("cy", escape(getY(d.count), true), false), ssrAttribute("opacity", hovered() !== null ? 0 : 0.7, false))
  })), escape(createComponent(Show, {
    get when() {
      return hovered() !== null && activeData()[hovered()];
    },
    get children() {
      return ssr(_tmpl$7, ssrHydrationKey(), ssrAttribute("x1", escape(getX(hovered()), true), false), ssrAttribute("x2", escape(getX(hovered()), true), false), ssrAttribute("cx", escape(getX(hovered()), true), false) + ssrAttribute("cy", escape(getY(activeData()[hovered()].count), true), false));
    }
  })), escape(createComponent(For, {
    get each() {
      return activeData();
    },
    children: (_, i) => {
      const data = activeData();
      const sliceW = data.length <= 1 ? width - padL - padR : (width - padL - padR) / (data.length - 1);
      return ssr(_tmpl$1, ssrHydrationKey() + ssrAttribute("x", escape(getX(i()), true) - escape(sliceW, true) / 2, false), ssrAttribute("width", escape(sliceW, true), false));
    }
  })), escape(createComponent(For, {
    get each() {
      return activeData();
    },
    children: (d, i) => {
      const data = activeData();
      const show = i() % 3 === 0 || i() === data.length - 1;
      return createComponent(Show, {
        when: show,
        get children() {
          return ssr(_tmpl$10, ssrHydrationKey() + ssrAttribute("x", escape(getX(i()), true), false), escape(d.label));
        }
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return hovered() !== null ? {
        idx: hovered()
      } : null;
    },
    keyed: true,
    children: (item) => {
      const idx = item.idx;
      const d = activeData()[idx];
      const x = getX(idx);
      const y = getY(d.count);
      const leftPct = Math.max(5, Math.min(90, x / width * 100));
      const topPct = Math.max(0, y / height * 100 - 32);
      return ssr(_tmpl$11, ssrHydrationKey(), ssrStyle(`position: absolute; left: ${leftPct}%; top: ${topPct}%; transform: translateX(-50%); pointer-events: none; z-index: 10; background: var(--surface-base); border: 1px solid var(--color-border); border-radius: 8px; padding: 8px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;`), escape(d.label), escape(d.count));
    }
  })), (() => {
    const data = activeData();
    const periodLabels = {
      weekly: "Mingguan",
      monthly: "Bulanan",
      yearly: "Tahunan"
    };
    const first = data[0]?.label ?? "";
    const last = data[data.length - 1]?.label ?? "";
    return ssr(_tmpl$12, ssrHydrationKey(), escape(periodLabels[period()]), escape(first), escape(last));
  })());
};
function AdminDashboard() {
  const stats = createAsync(() => getAdminStats(), {
    deferStream: true
  });
  const user = createAsync(() => getUser(), {
    deferStream: true
  });
  const todayStatus = createAsync(() => getTodayAttendanceStatus(), {
    deferStream: true
  });
  const trendData = createAsync(() => getInternTrendData(), {
    deferStream: true
  });
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "settings") {
      showToast("Pengaturan sistem berhasil diperbarui!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  return ssr(_tmpl$13, ssrHydrationKey(), escape(user()?.fullName), escape(stats()?.totalUsers ?? 0), escape(stats()?.totalDivisi ?? 0), escape(stats()?.batchAktif ?? 0), escape(stats()?.batchSelesai ?? 0), escape(stats()?.todayHadir ?? 0), escape(stats()?.todayTelat ?? 0), escape(stats()?.pendingIzin ?? 0), escape(stats()?.batchMendatang ?? 0), escape(createComponent(Show, {
    get when() {
      return todayStatus();
    },
    get fallback() {
      return ssr(_tmpl$14, ssrHydrationKey());
    },
    children: (data) => createComponent(DailyDonutChart, {
      get hadir() {
        return data().HADIR;
      },
      get telat() {
        return data().TELAT;
      },
      get izin() {
        return data().IZIN;
      },
      get belumAbsen() {
        return data().belumAbsen;
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return trendData() && trendData().monthly.length > 0;
    },
    get fallback() {
      return ssr(_tmpl$15, ssrHydrationKey());
    },
    get children() {
      return createComponent(TrendLineChart, {
        get data() {
          return trendData();
        }
      });
    }
  })));
}
export {
  AdminDashboard as default,
  id$$
};
//# sourceMappingURL=dashboard-B2hc0NKn.js.map

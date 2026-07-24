import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import {
  getAdminStats,
  getUser,
  getTodayAttendanceStatus,
  getInternTrendData,
} from "~/lib";

export const route = {
  preload() {
    getAdminStats();
    getUser();
    getTodayAttendanceStatus();
    getInternTrendData();
  },
} satisfies RouteDefinition;

const DailyDonutChart = (props: {
  hadir: number;
  telat: number;
  izin: number;
  belumAbsen: number;
}) => {
  const [hovered, setHovered] = createSignal<number | null>(null);

  const total = () =>
    props.hadir + props.telat + props.izin + props.belumAbsen || 1;
  const radius = 35;
  const hoverRadius = 38;
  const circumference = 2 * Math.PI * radius;
  const hoverCircumference = 2 * Math.PI * hoverRadius;

  const segments = () => {
    let currentOffset = 0;
    let currentHoverOffset = 0;
    return [
      { value: props.hadir, color: "var(--color-success)", label: "Hadir" },
      { value: props.telat, color: "var(--color-warning)", label: "Telat" },
      { value: props.izin, color: "var(--color-info)", label: "Izin" },
      {
        value: props.belumAbsen,
        color: "var(--color-text-secondary)",
        label: "Belum Absen",
      },
    ].map((s, i) => {
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
        index: i,
      };
    });
  };

  // Tooltip position from segment midpoint angle
  const tooltipPos = () => {
    const idx = hovered();
    if (idx === null) return null;
    const segs = segments();
    let angleBefore = 0;
    for (let i = 0; i < idx; i++)
      angleBefore += (segs[i].value / total()) * 360;
    const midAngle = angleBefore + (segs[idx].value / total()) * 180;
    const rad = ((midAngle - 90) * Math.PI) / 180;
    return {
      x: 50 + Math.cos(rad) * 52,
      y: 50 + Math.sin(rad) * 52,
      seg: segs[idx],
    };
  };

  return (
    <div style="display: flex; align-items: center; justify-content: space-around; gap: var(--space-4); flex-wrap: wrap; padding: var(--space-2) 0; flex-grow: 1;">
      <svg
        viewBox="0 0 100 100"
        class="donut-svg-anim"
        style="width: 45%; max-width: 185px; min-width: 130px; height: auto; aspect-ratio: 1 / 1; flex-shrink: 0; overflow: visible; transform-origin: center;"
        onMouseLeave={() => setHovered(null)}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="var(--color-border)"
          stroke-width="10"
        />
        <For each={segments()}>
          {(segment) => (
            <Show when={segment.value > 0}>
              <circle
                cx="50"
                cy="50"
                r={hovered() === segment.index ? hoverRadius : radius}
                fill="transparent"
                stroke={segment.color}
                stroke-width={hovered() === segment.index ? 12 : 10}
                stroke-dasharray={
                  hovered() === segment.index
                    ? segment.hoverStrokeDasharray
                    : segment.strokeDasharray
                }
                stroke-dashoffset={
                  hovered() === segment.index
                    ? segment.hoverStrokeDashoffset
                    : segment.strokeDashoffset
                }
                style={`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; opacity: ${hovered() !== null && hovered() !== segment.index ? "0.4" : "1"};`}
                onMouseEnter={() => setHovered(segment.index)}
              />
            </Show>
          )}
        </For>
        {/* Center text (rotated back) */}
        <g style="transform: rotate(90deg); transform-origin: 50px 50px;">
          <text
            x="50"
            y="47"
            text-anchor="middle"
            font-size="14"
            font-weight="700"
            fill="var(--color-text)"
          >
            {hovered() !== null ? segments()[hovered()!].value : total()}
          </text>
          <text
            x="50"
            y="58"
            text-anchor="middle"
            font-size="7"
            fill="var(--color-text-secondary)"
          >
            {hovered() !== null ? segments()[hovered()!].label : "Total"}
          </text>
        </g>
        {/* Tooltip bubble */}
        <Show when={tooltipPos()}>
          {(pos) => (
            <g style="transform: rotate(90deg); transform-origin: 50px 50px; pointer-events: none;">
              <rect
                x={pos().x - 22}
                y={pos().y - 10}
                width="44"
                height="18"
                rx="4"
                fill="var(--color-text)"
                opacity="0.9"
              />
              <text
                x={pos().x}
                y={pos().y + 3}
                text-anchor="middle"
                font-size="7"
                font-weight="600"
                fill="var(--surface-base)"
              >
                {pos().seg.percentage.toFixed(1)}%
              </text>
            </g>
          )}
        </Show>
      </svg>
      <div style="display: flex; flex-direction: column; gap: var(--space-2); min-width: 150px; flex: 1 1 auto; max-width: 220px;">
        <For each={segments()}>
          {(segment) => (
            <div
              style={`display: flex; align-items: center; gap: 8px; font-size: 13.5px; padding: 6px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; ${hovered() === segment.index ? "background: var(--color-border);" : ""} ${hovered() !== null && hovered() !== segment.index ? "opacity: 0.5;" : "opacity: 1;"}`}
              onMouseEnter={() => setHovered(segment.index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                style={`display: inline-block; width: 12px; height: 12px; border-radius: 3px; background-color: ${segment.color}; flex-shrink: 0; transition: transform 0.2s ease; ${hovered() === segment.index ? "transform: scale(1.3);" : ""}`}
              ></span>
              <span style="color: var(--color-text); font-weight: 500;">
                {segment.label}: <strong>{segment.value}</strong>{" "}
                <span style="color: var(--color-text-secondary); font-size: 11px;">
                  ({segment.percentage.toFixed(0)}%)
                </span>
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const TrendLineChart = (props: {
  data: {
    weekly: { label: string; count: number }[];
    monthly: { label: string; count: number }[];
    yearly: { label: string; count: number }[];
  };
}) => {
  const [period, setPeriod] = createSignal<"weekly" | "monthly" | "yearly">(
    "monthly",
  );
  const [hovered, setHovered] = createSignal<number | null>(null);

  const activeData = () => props.data[period()];

  const width = 500;
  const height = 250;
  const padL = 40,
    padR = 10,
    padT = 15,
    padB = 30;

  const maxCount = () => {
    const vals = activeData().map((d) => d.count);
    const rawMax = vals.length > 0 ? Math.max(...vals) : 4;
    return Math.max(Math.ceil(rawMax / 4) * 4, 4);
  };

  const getX = (i: number) => {
    const len = activeData().length;
    if (len <= 1) return padL + (width - padL - padR) / 2;
    return padL + (i / (len - 1)) * (width - padL - padR);
  };

  const getY = (count: number) => {
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

  const formatValue = (val: number) =>
    val >= 1000 ? (val / 1000).toFixed(0) + "RB" : `${val}`;

  return (
    <div style="width: 100%; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); flex-wrap: wrap; gap: 8px;">
        <h3 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.1rem; margin: 0; color: var(--color-text);">
          Grafik Anak Magang
        </h3>
        <select
          value={period()}
          onChange={(e) => {
            setPeriod(e.currentTarget.value as any);
            setHovered(null);
          }}
          style="width: auto !important; height: 32px !important; padding: 4px 24px 4px 12px !important; border-radius: 6px; border: 1px solid var(--color-border); background: var(--surface-base); color: var(--color-text); font-size: 13px; cursor: pointer; outline: none;"
        >
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
          <option value="yearly">Tahunan</option>
        </select>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style="width: 100%; height: auto; aspect-ratio: 500 / 250; background: transparent; overflow: visible;"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y grid lines + labels */}
        <For each={[0, 0.25, 0.5, 0.75, 1]}>
          {(ratio) => {
            const val = Math.round(ratio * maxCount());
            const y = getY(val);
            return (
              <g>
                <line
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke="var(--color-border)"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                  opacity="0.5"
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  font-size="10"
                  fill="var(--color-text-secondary)"
                  text-anchor="end"
                  font-family="var(--font-mono)"
                >
                  {formatValue(val)}
                </text>
              </g>
            );
          }}
        </For>

        {/* Area fill */}
        <Show when={activeData().length >= 2}>
          <path class="chart-area-anim" d={areaPath()} fill="url(#chartAreaGrad)" />
        </Show>

        {/* Line */}
        <Show when={activeData().length >= 2}>
          <path
            class="chart-line-anim"
            d={linePath()}
            fill="none"
            stroke="#3b82f6"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Show>

        {/* Data point dots (hidden when hovering) */}
        <For each={activeData()}>
          {(d, i) => (
            <circle
              cx={getX(i())}
              cy={getY(d.count)}
              r={3}
              fill="#3b82f6"
              stroke="var(--surface-base)"
              stroke-width="1.5"
              opacity={hovered() !== null ? 0 : 0.7}
              style="transition: opacity 0.15s ease; pointer-events: none;"
            />
          )}
        </For>

        {/* Hover indicator */}
        <Show when={hovered() !== null && activeData()[hovered()!]}>
          <g style="pointer-events: none;">
            <line
              x1={getX(hovered()!)}
              y1={padT}
              x2={getX(hovered()!)}
              y2={height - padB}
              stroke="#3b82f6"
              stroke-width="1"
              stroke-dasharray="3 3"
              opacity="0.5"
            />
            <circle
              cx={getX(hovered()!)}
              cy={getY(activeData()[hovered()!].count)}
              r="6"
              fill="#3b82f6"
              stroke="#ffffff"
              stroke-width="2.5"
              style="filter: drop-shadow(0px 2px 4px rgba(59,130,246,0.4));"
            />
          </g>
        </Show>

        {/* Hover target slices (transparent rects per data point) */}
        <For each={activeData()}>
          {(_, i) => {
            const data = activeData();
            const sliceW =
              data.length <= 1
                ? width - padL - padR
                : (width - padL - padR) / (data.length - 1);
            return (
              <rect
                x={getX(i()) - sliceW / 2}
                y={padT}
                width={sliceW}
                height={height - padT - padB}
                fill="transparent"
                style="cursor: crosshair;"
                onMouseEnter={() => setHovered(i())}
              />
            );
          }}
        </For>

        {/* X-axis labels */}
        <For each={activeData()}>
          {(d, i) => {
            const data = activeData();
            const show = i() % 3 === 0 || i() === data.length - 1;
            return (
              <Show when={show}>
                <text
                  x={getX(i())}
                  y={height - 4}
                  font-size="9"
                  fill="var(--color-text-secondary)"
                  text-anchor="middle"
                  font-family="var(--font-mono)"
                >
                  {d.label}
                </text>
              </Show>
            );
          }}
        </For>
      </svg>

      {/* Tooltip overlay */}
      <Show when={hovered() !== null ? { idx: hovered()! } : null} keyed>
        {(item) => {
          const idx = item.idx;
          const d = activeData()[idx];
          const x = getX(idx);
          const y = getY(d.count);
          const leftPct = Math.max(5, Math.min(90, (x / width) * 100));
          const topPct = Math.max(0, (y / height) * 100 - 32);
          return (
            <div
              style={`position: absolute; left: ${leftPct}%; top: ${topPct}%; transform: translateX(-50%); pointer-events: none; z-index: 10; background: var(--surface-base); border: 1px solid var(--color-border); border-radius: 8px; padding: 8px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;`}
            >
              <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 2px;">
                {d.label}
              </div>
              <div style="font-size: 18px; font-weight: 700; color: var(--color-text);">
                {d.count}
              </div>
            </div>
          );
        }}
      </Show>

      {/* Footer summary */}
      {(() => {
        const data = activeData();
        const periodLabels = {
          weekly: "Mingguan",
          monthly: "Bulanan",
          yearly: "Tahunan",
        } as const;
        const first = data[0]?.label ?? "";
        const last = data[data.length - 1]?.label ?? "";
        return (
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: var(--space-3); font-size: 12px; color: var(--color-text-secondary);">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0;"></span>
            Total Anak Magang {periodLabels[period()]} dari {first} hingga{" "}
            {last}
          </div>
        );
      })()}
    </div>
  );
};

export default function AdminDashboard() {
  const stats = createAsync(() => getAdminStats(), { deferStream: true });
  const user = createAsync(() => getUser(), { deferStream: true });
  const todayStatus = createAsync(() => getTodayAttendanceStatus(), {
    deferStream: true,
  });
  const trendData = createAsync(() => getInternTrendData(), {
    deferStream: true,
  });

  return (
    <main>
      <div class="fade-in-up" style="margin-bottom: var(--space-5); text-align: left;">
        <h1 class="page-title" style="margin-bottom: var(--space-1);">
          Dashboard Admin
        </h1>
        <p style="color: var(--color-text-secondary); font-size: 15px; margin: 0;">
          Selamat datang kembali, <strong>{user()?.fullName}</strong>. Berikut
          rekap operasional program magang hari ini.
        </p>
      </div>

      {/* Stats Section 1: Overview */}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4); text-align: left;">
        <div class="stat-card fade-in-up stagger-1" style="border-left: 4px solid #3b82f6;">
          <div class="stat-value">{stats()?.totalUsers ?? 0}</div>
          <div class="stat-label">Total Anak Magang</div>
        </div>

        <div class="stat-card fade-in-up stagger-2" style="border-left: 4px solid #8b5cf6;">
          <div class="stat-value">{stats()?.totalDivisi ?? 0}</div>
          <div class="stat-label">Total Divisi</div>
        </div>

        <div class="stat-card fade-in-up stagger-3" style="border-left: 4px solid #10b981;">
          <div class="stat-value">{stats()?.batchAktif ?? 0}</div>
          <div class="stat-label">Batch Aktif</div>
        </div>

        <div class="stat-card fade-in-up stagger-4" style="border-left: 4px solid #6b7280;">
          <div class="stat-value">{stats()?.batchSelesai ?? 0}</div>
          <div class="stat-label">Batch Selesai</div>
        </div>
      </div>

      {/* Stats Section 2: Attendance & Future */}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6); text-align: left;">
        <div class="stat-card fade-in-up stagger-5" style="border-left: 4px solid #10b981;">
          <div class="stat-value">{stats()?.todayHadir ?? 0}</div>
          <div class="stat-label">Hadir Hari Ini</div>
        </div>

        <div class="stat-card fade-in-up stagger-6" style="border-left: 4px solid #f59e0b;">
          <div class="stat-value">{stats()?.todayTelat ?? 0}</div>
          <div class="stat-label">Terlambat Hari Ini</div>
        </div>

        <div class="stat-card fade-in-up stagger-7" style="border-left: 4px solid #ef4444;">
          <div class="stat-value">{stats()?.pendingIzin ?? 0}</div>
          <div class="stat-label">Izin Menunggu Persetujuan</div>
        </div>

        <div class="stat-card fade-in-up stagger-8" style="border-left: 4px solid #3b82f6;">
          <div class="stat-value">{stats()?.batchMendatang ?? 0}</div>
          <div class="stat-label">Batch Mendatang</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6); text-align: left;">
        <div class="stat-card fade-in-up" style="padding: var(--space-4); animation-delay: 0.45s;">
          <h3 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.2rem; margin-top: 0; margin-bottom: var(--space-4); color: var(--color-text);">
            Status Kehadiran Hari Ini
          </h3>
          <Show
            when={todayStatus()}
            fallback={
              <div style="display: flex; justify-content: center; align-items: center; min-height: 185px;">
                <div class="skeleton" style="width: 150px; height: 150px; border-radius: 50%;"></div>
              </div>
            }
          >
            {(data) => (
              <DailyDonutChart
                hadir={data().HADIR}
                telat={data().TELAT}
                izin={data().IZIN}
                belumAbsen={data().belumAbsen}
              />
            )}
          </Show>
        </div>

        <div class="stat-card fade-in-up" style="padding: var(--space-4); animation-delay: 0.5s;">
          <Show
            when={trendData() && trendData()!.monthly.length > 0}
            fallback={
              <div style="display: flex; flex-direction: column; gap: 15px;">
                <div class="skeleton" style="width: 150px; height: 22px;"></div>
                <div class="skeleton" style="width: 100%; height: 200px; border-radius: 6px;"></div>
              </div>
            }
          >
            <TrendLineChart data={trendData()!} />
          </Show>
        </div>
      </div>
    </main>
  );
}

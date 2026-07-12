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
      return { ...s, strokeDasharray, strokeDashoffset, hoverStrokeDasharray, hoverStrokeDashoffset, percentage, index: i };
    });
  };

  // Tooltip position from segment midpoint angle
  const tooltipPos = () => {
    const idx = hovered();
    if (idx === null) return null;
    const segs = segments();
    let angleBefore = 0;
    for (let i = 0; i < idx; i++) angleBefore += (segs[i].value / total()) * 360;
    const midAngle = angleBefore + (segs[idx].value / total()) * 180;
    const rad = ((midAngle - 90) * Math.PI) / 180;
    return {
      x: 50 + Math.cos(rad) * 52,
      y: 50 + Math.sin(rad) * 52,
      seg: segs[idx],
    };
  };

  return (
    <div style="display: flex; align-items: center; justify-content: space-around; gap: var(--space-4); flex-wrap: wrap; padding: var(--space-2) 0;">
      <svg
        width="140"
        height="140"
        viewBox="0 0 100 100"
        style="transform: rotate(-90deg); flex-shrink: 0; overflow: visible;"
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
                stroke-dasharray={hovered() === segment.index ? segment.hoverStrokeDasharray : segment.strokeDasharray}
                stroke-dashoffset={hovered() === segment.index ? segment.hoverStrokeDashoffset : segment.strokeDashoffset}
                style={`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; opacity: ${hovered() !== null && hovered() !== segment.index ? '0.4' : '1'};`}
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
      <div style="display: flex; flex-direction: column; gap: var(--space-2); min-width: 140px;">
        <For each={segments()}>
          {(segment) => (
            <div
              style={`display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 4px 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; ${hovered() === segment.index ? 'background: var(--color-border);' : ''} ${hovered() !== null && hovered() !== segment.index ? 'opacity: 0.5;' : 'opacity: 1;'}`}
              onMouseEnter={() => setHovered(segment.index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                style={`display: inline-block; width: 12px; height: 12px; border-radius: 3px; background-color: ${segment.color}; flex-shrink: 0; transition: transform 0.2s ease; ${hovered() === segment.index ? 'transform: scale(1.3);' : ''}`}
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

const TrendLineChart = (props: { data: { date: string; count: number }[] }) => {
  const chartData = () => props.data.slice(-10);

  const maxCount = () => {
    const vals = chartData().map((d) => d.count);
    return vals.length > 0 ? Math.max(...vals) + 1 : 5;
  };

  const minCount = () => {
    const vals = chartData().map((d) => d.count);
    return vals.length > 0 ? Math.max(0, Math.min(...vals) - 1) : 0;
  };

  const width = 400;
  const height = 150;
  const paddingX = 35;
  const paddingY = 20;

  const points = () => {
    const data = chartData();
    if (data.length < 2) return "";
    const rangeY = maxCount() - minCount() || 1;
    return data
      .map((d, index) => {
        const x =
          paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
        const y =
          height -
          paddingY -
          ((d.count - minCount()) / rangeY) * (height - paddingY * 2);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div style="width: 100%; display: flex; flex-direction: column; gap: var(--space-2);">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="130"
        style="background: transparent; overflow: visible;"
      >
        <For each={[0, 0.5, 1]}>
          {(ratio) => {
            const rangeY = maxCount() - minCount() || 1;
            const val = Math.round(minCount() + ratio * rangeY);
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="var(--color-border)"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  font-size="10"
                  fill="var(--color-text-secondary)"
                  text-anchor="end"
                  font-family="var(--font-mono)"
                >
                  {val}
                </text>
              </g>
            );
          }}
        </For>

        <Show when={chartData().length >= 2}>
          <polyline
            fill="none"
            stroke="var(--color-secondary)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            points={points()}
          />
        </Show>

        <For each={chartData()}>
          {(d, index) => {
            const rangeY = maxCount() - minCount() || 1;
            const x =
              paddingX +
              (index() / (chartData().length - 1)) * (width - paddingX * 2);
            const y =
              height -
              paddingY -
              ((d.count - minCount()) / rangeY) * (height - paddingY * 2);
            return (
              <g style="cursor: pointer;">
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="var(--color-secondary)"
                  stroke="var(--surface-base)"
                  stroke-width="2"
                />
                <title>{`${d.date}: ${d.count} Anak Magang`}</title>
              </g>
            );
          }}
        </For>
      </svg>

      <div style="display: flex; justify-content: space-between; padding: 0 var(--space-4); font-size: 11px; color: var(--color-text-secondary); font-family: var(--font-mono);">
        <span>{formatShortDate(chartData()[0]?.date ?? "")}</span>
        <span style="font-weight: 600; color: var(--color-text);">
          Tren Pertumbuhan
        </span>
        <span>
          {formatShortDate(chartData()[chartData().length - 1]?.date ?? "")}
        </span>
      </div>
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
      <div style="margin-bottom: var(--space-5); text-align: left;">
        <h1 class="page-title" style="margin-bottom: var(--space-1);">
          Dashboard Admin
        </h1>
        <p style="color: var(--color-text-secondary); font-size: 15px; margin: 0;">
          Selamat datang kembali, <strong>{user()?.fullName}</strong>. Berikut
          rekap operasional program magang hari ini.
        </p>
      </div>

      {/* Stats Section */}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6); text-align: left;">
        <div class="stat-card" style="border-left: 4px solid #3b82f6;">
          <div class="stat-value">{stats()?.totalUsers ?? 0}</div>
          <div class="stat-label">Total Anak Magang</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #8b5cf6;">
          <div class="stat-value">{stats()?.totalDivisi ?? 0}</div>
          <div class="stat-label">Total Divisi</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #10b981;">
          <div class="stat-value">{stats()?.todayHadir ?? 0}</div>
          <div class="stat-label">Hadir Hari Ini</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #f59e0b;">
          <div class="stat-value">{stats()?.todayTelat ?? 0}</div>
          <div class="stat-label">Terlambat Hari Ini</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #ef4444;">
          <div class="stat-value">{stats()?.pendingIzin ?? 0}</div>
          <div class="stat-label">Izin Menunggu Persetujuan</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6); text-align: left;">
        <div class="stat-card" style="padding: var(--space-4);">
          <h3 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.2rem; margin-top: 0; margin-bottom: var(--space-4); color: var(--color-text);">
            Status Kehadiran Hari Ini
          </h3>
          <Show
            when={todayStatus()}
            fallback={
              <p style="color: var(--color-text-secondary); font-size: 14px;">
                Memuat data grafik...
              </p>
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

        <div class="stat-card" style="padding: var(--space-4);">
          <h3 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.2rem; margin-top: 0; margin-bottom: var(--space-4); color: var(--color-text);">
            Tren Pertumbuhan Anak Magang
          </h3>
          <Show
            when={trendData() && trendData()!.registrationTrend.length > 0}
            fallback={
              <p style="color: var(--color-text-secondary); font-size: 14px;">
                Memuat data grafik...
              </p>
            }
          >
            <TrendLineChart data={trendData()!.registrationTrend} />
          </Show>
        </div>
      </div>
    </main>
  );
}

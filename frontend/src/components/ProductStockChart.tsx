// src/components/ProductStockChart.tsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts';
  import type { InventoryTransaction } from '../lib/api';
  
  type Props = {
    transactions: InventoryTransaction[];
  };
  
  type ChartPoint = {
    dateLabel: string;
    stock: number;
    delta: number;
  };
  
  export default function ProductStockChart({ transactions }: Props) {
    if (!transactions.length) {
      return (
        <p className="text-xs text-slate-500">
          No transactions yet – stock history will appear here once changes are made.
        </p>
      );
    }
  
    // Sort oldest → newest so the chart goes left to right in time
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  
    const data: ChartPoint[] = sorted.map((t) => {
      const d = new Date(t.createdAt);
      const dateLabel = d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
  
      return {
        dateLabel,
        stock: t.resultingStock,
        delta: t.delta,
      };
    });
  
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: any, key: string) => {
                if (key === 'stock') return [value, 'Stock'];
                if (key === 'delta') return [value, 'Delta'];
                return [value, key];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#2563eb" // Tailwind blue-600
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
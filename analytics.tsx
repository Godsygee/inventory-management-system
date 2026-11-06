import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { getSales } from '../utils/storage';
import { Sale } from '../types';
import Layout from '../components/Layout';
import { BarChart2 } from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_OF_YEAR = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Analytics() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    setSales(getSales());
  }, []);

  // Sales by day name (aggregated across all time)
  const byDay: Record<string, number> = {};
  DAYS_OF_WEEK.forEach((d) => (byDay[d] = 0));
  sales.forEach((sale) => {
    const dayName = new Date(sale.date).toLocaleDateString('en-US', { weekday: 'long' });
    byDay[dayName] = (byDay[dayName] || 0) + sale.totalAmount;
  });

  // Sales by month name (aggregated across all time)
  const byMonth: Record<string, number> = {};
  MONTHS_OF_YEAR.forEach((m) => (byMonth[m] = 0));
  sales.forEach((sale) => {
    const monthName = new Date(sale.date).toLocaleDateString('en-US', { month: 'long' });
    byMonth[monthName] = (byMonth[monthName] || 0) + sale.totalAmount;
  });

  // Sales by year-month (for the table — actual months with data)
  const byYearMonth: Record<string, number> = {};
  sales.forEach((sale) => {
    const key = new Date(sale.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    byYearMonth[key] = (byYearMonth[key] || 0) + sale.totalAmount;
  });

  const maxDay = Math.max(...Object.values(byDay), 1);
  const maxMonth = Math.max(...Object.values(byMonth), 1);

  const dayColors = ['bg-indigo-400', 'bg-blue-400', 'bg-purple-400'];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  // Year-to-date total
  const ytd = sales
    .filter((s) => new Date(s.date).getFullYear() === currentYear)
    .reduce((sum, s) => sum + s.totalAmount, 0);

  // Month-to-date total
  const mtd = sales
    .filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, s) => sum + s.totalAmount, 0);

  // Best day name
  const bestDay = DAYS_OF_WEEK.reduce((best, d) => byDay[d] > byDay[best] ? d : best, DAYS_OF_WEEK[0]);
  const bestMonth = MONTHS_OF_YEAR.reduce((best, m) => byMonth[m] > byMonth[best] ? m : best, MONTHS_OF_YEAR[0]);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Sales breakdown by day name and month</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Year to Date ({currentYear})</p>
            <p className="text-xl font-bold">${ytd.toFixed(2)}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Month to Date</p>
            <p className="text-xl font-bold">${mtd.toFixed(2)}</p>
            <p className="text-xs text-indigo-500">{MONTHS_OF_YEAR[currentMonth]}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Best Day of Week</p>
            <p className="text-xl font-bold">{byDay[bestDay] > 0 ? bestDay.slice(0, 3) : '—'}</p>
            <p className="text-xs text-gray-400">${byDay[bestDay].toFixed(2)}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Best Month</p>
            <p className="text-xl font-bold">{byMonth[bestMonth] > 0 ? bestMonth.slice(0, 3) : '—'}</p>
            <p className="text-xs text-gray-400">${byMonth[bestMonth].toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales by Day of Week */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                <CardTitle className="text-base">Sales by Day of Week</CardTitle>
              </div>
              <CardDescription>Totals aggregated across all recorded sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day, i) => (
                  <div key={day}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className="text-gray-500">${byDay[day].toFixed(2)}</span>
                    </div>
                    <Bar value={byDay[day]} max={maxDay} color={dayColors[i % dayColors.length]} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales by Month Name */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-500" />
                <CardTitle className="text-base">Sales by Month</CardTitle>
              </div>
              <CardDescription>Totals aggregated across all years per month name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MONTHS_OF_YEAR.map((month) => (
                  <div key={month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{month}</span>
                      <span className="text-gray-500">${byMonth[month].toFixed(2)}</span>
                    </div>
                    <Bar value={byMonth[month]} max={maxMonth} color="bg-purple-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Month-by-month breakdown table */}
        {Object.keys(byYearMonth).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Breakdown</CardTitle>
              <CardDescription>Revenue per calendar month (only months with recorded sales)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(byYearMonth)
                  .sort(([a], [b]) => new Date(`1 ${a}`).getTime() - new Date(`1 ${b}`).getTime())
                  .map(([label, amount]) => (
                    <div key={label} className="bg-gray-50 border rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-base font-semibold">${amount.toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

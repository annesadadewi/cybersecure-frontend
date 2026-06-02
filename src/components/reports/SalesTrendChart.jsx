import React from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { formatIDR } from '../../utils/transactions';



const SalesTrendChart = ({

  chartData,

  selectedMonth,

  isFuture,

  loading = false,

  transactionCount = 0,

  embedded = false,

}) => {

  if (isFuture) {

    return (

      <div

        className={`text-center ${

          embedded ? 'py-10 border-t border-white/10' : 'rounded-2xl border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 p-8 sm:p-12'

        }`}

      >

        <p className="text-white/60 text-sm font-semibold">

          Grafik omzet untuk bulan {selectedMonth} akan tersedia setelah periode berjalan.

        </p>

      </div>

    );

  }



  const wrapperClass = embedded

    ? 'pt-2 border-t border-white/10'

    : 'rounded-2xl border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 p-5 sm:p-6 shadow-xl';



  return (

    <div className={wrapperClass}>

      <div className="mb-4">

        <h3 className={`font-bold text-white ${embedded ? 'text-base sm:text-lg' : 'text-lg'}`}>

          Tren Omzet Harian

        </h3>

        <p className="text-white/60 text-xs sm:text-sm mt-0.5">

          Fluktuasi pemasukan sukses · bulan <strong className="text-[#B8DDF5]">{selectedMonth}</strong>

        </p>

      </div>

      <div className="h-56 sm:h-64 w-full">

        {loading ? (

          <div className="h-full flex items-center justify-center text-white/50 text-sm font-medium">

            Memuat grafik...

          </div>

        ) : chartData.length === 0 ? (

          <div className="h-full flex flex-col items-center justify-center text-white/50 text-sm font-medium gap-2 px-4 text-center">

            <p>Belum ada transaksi mock pada bulan {selectedMonth}.</p>

            {transactionCount === 0 && (

              <p className="text-[#69C3FF] text-xs">Jalankan seeder Laravel lalu refresh halaman.</p>

            )}

          </div>

        ) : (

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={chartData}>

              <defs>

                <linearGradient id="colorOmzetReport" x1="0" y1="0" x2="0" y2="1">

                  <stop offset="5%" stopColor="#69C3FF" stopOpacity={0.8} />

                  <stop offset="95%" stopColor="#69C3FF" stopOpacity={0} />

                </linearGradient>

              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />

              <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="rgba(255,255,255,0.6)" fontSize={10} />

              <YAxis

                axisLine={false}

                tickLine={false}

                stroke="rgba(255,255,255,0.6)"

                tickFormatter={(val) => `Rp ${val / 1000}k`}

                fontSize={10}

              />

              <Tooltip

                contentStyle={{

                  backgroundColor: '#1F5E88',

                  borderRadius: '0.75rem',

                  border: '1px solid rgba(255,255,255,0.2)',

                  color: '#fff',

                  fontSize: '12px',

                }}

                formatter={(value) => [formatIDR(value), 'Omzet']}

              />

              <Area

                type="monotone"

                dataKey="Omzet"

                stroke="#69C3FF"

                strokeWidth={2.5}

                fillOpacity={1}

                fill="url(#colorOmzetReport)"

              />

            </AreaChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>

  );

};



export default SalesTrendChart;


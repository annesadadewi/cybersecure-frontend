import React from 'react';
import { formatIDR, formatDateShort, getTxKind } from '../utils/transactions';

const TransactionLogList = ({ transactions, emptyAction }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-2 max-h-[280px] lg:max-h-[300px] pr-0.5 scrollbar-thin">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-white/50 text-xs space-y-2">
          <p>Tidak ada log transaksi.</p>
          {emptyAction}
        </div>
      ) : (
        transactions.map((tx, idx) => {
          const isRefund = getTxKind(tx) === 'refund';
          const marketplace = (tx.marketplace_name || '').toUpperCase();

          return (
            <div
              key={tx.id ?? idx}
              className="p-2 bg-white/5 rounded-lg flex items-center justify-between border border-white/5"
            >
              <div className="space-y-0.5 max-w-[62%] min-w-0">
                <span className="text-[8px] uppercase font-extrabold tracking-wider text-[#69C3FF] block truncate">
                  {marketplace}
                </span>
                <span className="text-[11px] font-bold block text-white truncate leading-tight">{tx.product_name}</span>
                <span className="text-[8px] text-white/55 block">{formatDateShort(tx.transaction_date)}</span>
                {isRefund && (
                  <span className="text-[8px] font-bold text-red-400/90 block">Pengembalian dana</span>
                )}
              </div>
              <div className="text-right shrink-0 pl-1">
                <span
                  className={`text-[11px] font-black block ${isRefund ? 'text-red-400' : 'text-[#10B981]'}`}
                >
                  {isRefund ? '-' : '+'}
                  {formatIDR(tx.amount)}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionLogList;

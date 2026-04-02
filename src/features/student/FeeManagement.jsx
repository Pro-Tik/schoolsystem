import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../api/student';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';

export default function FeeManagement() {
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['student-fees'],
    queryFn: () => studentService.getDashboard()
  });

  const payMutation = useMutation({
    mutationFn: (feeId) => studentService.payFee(feeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['student-fees']);
      alert('Payment successful! (Simulated)');
    }
  });

  const [selectedMethod, setSelectedMethod] = React.useState('bkash');

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /></div>;

  const fees = dashboard?.fees || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-500">View your payment history and pay pending fees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">Payment History</h3>
              <button
                onClick={() => alert('Exporting PDF...')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
              >
                <Download size={16} />
                <span>Export PDF</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Month/Year</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{fee.month} {fee.year}</td>
                      <td className="px-6 py-4 text-gray-600">৳{fee.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${fee.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                          {fee.status === 'PAID' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          <span>{fee.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {fee.status === 'PENDING' ? (
                          <button
                            onClick={() => payMutation.mutate(fee.id)}
                            disabled={payMutation.isPending}
                            className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                            {payMutation.isPending ? 'Processing...' : 'Pay Now'}
                          </button>
                        ) : (
                          <button
                            onClick={() => alert('Downloading invoice...')}
                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <Download size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-medium opacity-90">Total Outstanding</h3>
            <p className="text-4xl font-bold mt-2">
              ৳{fees.filter(f => f.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0)}
            </p>
            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-orange-300" />
                <p className="text-xs opacity-90">Please clear your outstanding fees to avoid late charges.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod('bkash')}
                className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${selectedMethod === 'bkash'
                    ? 'border-indigo-100 bg-indigo-50 shadow-sm'
                    : 'border-gray-50 hover:border-indigo-100'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard size={20} className={selectedMethod === 'bkash' ? 'text-indigo-600' : 'text-gray-400'} />
                  <span className={`text-sm font-medium ${selectedMethod === 'bkash' ? 'text-indigo-900' : 'text-gray-600'}`}>bKash / Rocket</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === 'bkash' ? 'border-indigo-600 border-4' : 'border-gray-200'
                  }`} />
              </button>

              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${selectedMethod === 'card'
                    ? 'border-indigo-100 bg-indigo-50 shadow-sm'
                    : 'border-gray-50 hover:border-indigo-100'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard size={20} className={selectedMethod === 'card' ? 'text-indigo-600' : 'text-gray-400'} />
                  <span className={`text-sm font-medium ${selectedMethod === 'card' ? 'text-indigo-900' : 'text-gray-600'}`}>Credit Card</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === 'card' ? 'border-indigo-600 border-4' : 'border-gray-200'
                  }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

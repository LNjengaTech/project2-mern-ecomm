// /client/src/components/RevenueChart.jsx

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const RevenueChart = ({ revenueData }) => {
  
  // 🔑 Data Transformation: Convert backend aggregation output into a chart-friendly array
  const formattedData = monthNames.map((monthName, index) => {
    // Find the data point for the current month (index + 1)
    const dataPoint = revenueData.find(d => d._id.month === index + 1)
    
    return {
      name: monthName,
      Sales: dataPoint ? dataPoint.totalSales : 0, // Use 0 if no sales that month
      Orders: dataPoint ? dataPoint.totalOrders : 0,
    }
  })

  // Custom Tooltip component to format currency
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-md text-sm">
          <p className="font-semibold text-gray-900">{`Month: ${label}`}</p>
          <p className="text-indigo-600">{`Sales: Ksh. ${payload[0].value.toLocaleString()}`}</p>
          <p className="text-gray-700">{`Orders: ${payload[1].value.toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    // ResponsiveContainer ensures the chart fills the parent div
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          axisLine={false}
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          tickFormatter={(value) => `Ksh. ${value.toLocaleString()}`} 
          axisLine={false} 
          tickLine={false}
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Sales Bar */}
        <Bar dataKey="Sales" fill="#4f46e5" name="Monthly Sales" />
        {/* Orders Bar (Optional, but useful secondary data) */}
        <Bar dataKey="Orders" fill="#10b981" name="Number of Orders" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RevenueChart
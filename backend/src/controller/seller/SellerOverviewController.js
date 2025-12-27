import mongoose from "mongoose";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import Product from "../../models/ProductModel.js";
import Booking from "../../models/BookingModel.js";

export const sellerOverview = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.params.id);

    // 1️⃣ Total seller payout (overall)
    const payoutResult = await OrderVendorModel.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          totalSellerPayout: { $sum: "$sellerPayout" }
        }
      }
    ]);
    const totalSales = payoutResult[0]?.totalSellerPayout || 0;

    // 2️⃣ Total orders
    const totalOrders = await OrderVendorModel.countDocuments({
      seller: sellerId
    });

    // 3️⃣ Total products
    const totalProduct = await Product.countDocuments({
      seller: sellerId
    });

    // 4️⃣ Average rating
    const ratingResult = await Product.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = ratingResult[0]?.avgRating || 0;

    // 5️⃣ Monthly chart data
    const monthlyData = await OrderVendorModel.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: { $month: "$createdAt" }, // 1 = Jan, 2 = Feb ...
          monthlySales: { $sum: "$sellerPayout" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // convert to chart format
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const chartData = monthNames.map((m, idx) => {
      const monthEntry = monthlyData.find(d => d._id === idx + 1);
      return {
        month: m,
        value: monthEntry ? Number(monthEntry.monthlySales.toFixed(2)) : 0
      };
    });

    // ✅ Response
    res.status(200).json({
      success: true,
      data: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalProduct,
        avgRating: Number(avgRating.toFixed(1)),
        chartData // ready to pass to Recharts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error
    });
  }
};


export const providerOverview = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId(req.params.id);

    // 1️⃣ Get provider bookings data
    const providerBookings = await Booking.find({ provider: providerId })
      .populate('customer', 'name email phoneNumber')
      .populate('provider', 'hourlyRate fullName email phoneNumber serviceName serviceCategory');

    console.log('Total provider bookings:', providerBookings.length);

    // 2️⃣ Calculate total earnings from completed bookings
    const totalEarnings = providerBookings.reduce((sum, booking) => {
      // Check if booking is completed
      if (booking.status !== 'completed' && booking.status !== 'accept') {
        return sum;
      }

      // Get hourly rate from provider or use default
      const hourlyRate = booking.provider?.hourlyRate || 50; // Default hourly rate
      
      // Calculate duration from timeSlot
      let durationHours = 1; // Default 1 hour
      if (booking.timeSlot?.duration) {
        // Parse duration string like "60m", "2h", etc.
        const durationStr = booking.timeSlot.duration.toString().toLowerCase();
        if (durationStr.includes('h')) {
          durationHours = parseFloat(durationStr.replace('h', '')) || 1;
        } else if (durationStr.includes('m')) {
          durationHours = parseFloat(durationStr.replace('m', '')) / 60 || 1;
        }
      }

      // Calculate booking amount
      const bookingAmount = hourlyRate * durationHours;
      
      // Commission and tax calculation
      const commissionRate = 0.10; // 10% platform commission
      const taxRate = 0.19; // 19% tax on commission
      
      const commission = bookingAmount * commissionRate;
      const taxOnCommission = commission * taxRate;
      const netPayout = bookingAmount - commission - taxOnCommission;
      
      return sum + netPayout;
    }, 0);

    // 3️⃣ Total completed bookings
    const completedBookings = providerBookings.filter(
      booking => booking.status === 'completed' || booking.status === 'accept'
    );
    const totalBookings = completedBookings.length;

    // 4️⃣ Total products/services (default 1 for service providers)
    const totalProducts = 1; // Service providers typically have one service

    // 5️⃣ Average rating (default 0)
    const avgRating = 0;

    // 6️⃣ Monthly chart data from bookings
    const monthlyBookingsData = await Booking.aggregate([
      { 
        $match: { 
          provider: providerId,
          $or: [
            { status: 'completed' },
            { status: 'accept' }
          ]
        } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'provider',
          foreignField: '_id',
          as: 'providerDetails'
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalEarnings: {
            $sum: {
              $multiply: [
                { $ifNull: [{ $arrayElemAt: ["$providerDetails.hourlyRate", 0] }, 50] },
                {
                  $cond: {
                    if: { $and: [
                      { $ifNull: ["$timeSlot.duration", false] },
                      { $regexMatch: { input: "$timeSlot.duration", regex: /^\d+/ } }
                    ]},
                    then: {
                      $divide: [
                        { $toDouble: { $regexFind: { input: "$timeSlot.duration", regex: /^\d+/ } }.match },
                        { $cond: [
                          { $regexMatch: { input: { $toLower: "$timeSlot.duration" }, regex: /h$/ } },
                          1,
                          60
                        ]}
                      ]
                    },
                    else: 1
                  }
                }
              ]
            }
          },
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Process monthly data for chart
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    const chartData = monthNames.map((monthName, index) => {
      const monthData = monthlyBookingsData.find(data => 
        data._id.month === index + 1 && data._id.year === currentYear
      );
      
      // Calculate net payout (after commission and tax)
      const grossEarnings = monthData?.totalEarnings || 0;
      const commission = grossEarnings * 0.10;
      const tax = commission * 0.19;
      const netEarnings = grossEarnings - commission - tax;
      
      return {
        month: monthName,
        value: Number(netEarnings.toFixed(2)),
        bookings: monthData?.totalBookings || 0
      };
    });

    // 7️⃣ Recent bookings for activity overview
    const recentBookings = completedBookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(booking => ({
        id: booking._id,
        customerName: booking.customer?.name || booking.customer?.fullName || 'Customer',
        serviceDate: booking.dateId?.workingDate || booking.createdAt,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amount: (booking.provider?.hourlyRate || 50) * (booking.timeSlot?.duration ? 
          parseFloat(booking.timeSlot.duration.toString().replace(/[^0-9]/g, '')) / 60 || 1 : 1)
      }));

    // 8️⃣ Payment status summary
    const paymentSummary = {
      completed: completedBookings.filter(b => b.paymentStatus === 'completed').length,
      processing: completedBookings.filter(b => b.paymentStatus === 'processing').length,
      pending: completedBookings.filter(b => !b.paymentStatus || b.paymentStatus === 'pending').length
    };

    // 9️⃣ Service statistics
    const serviceStats = completedBookings.reduce((stats, booking) => {
      const serviceName = booking.provider?.serviceName || 'General Service';
      const serviceCategory = booking.provider?.serviceCategory || 'General';
      
      if (!stats.services[serviceName]) {
        stats.services[serviceName] = {
          count: 0,
          totalEarnings: 0,
          category: serviceCategory
        };
      }
      
      const hourlyRate = booking.provider?.hourlyRate || 50;
      const duration = booking.timeSlot?.duration ? 
        parseFloat(booking.timeSlot.duration.toString().replace(/[^0-9]/g, '')) / 60 || 1 : 1;
      const bookingAmount = hourlyRate * duration;
      
      stats.services[serviceName].count += 1;
      stats.services[serviceName].totalEarnings += bookingAmount;
      
      // Track by category
      if (!stats.categories[serviceCategory]) {
        stats.categories[serviceCategory] = {
          count: 0,
          totalEarnings: 0
        };
      }
      stats.categories[serviceCategory].count += 1;
      stats.categories[serviceCategory].totalEarnings += bookingAmount;
      
      return stats;
    }, { services: {}, categories: {} });

    // Format service stats for response
    const formattedServiceStats = {
      topServices: Object.entries(serviceStats.services)
        .map(([name, data]) => ({
          name,
          count: data.count,
          totalEarnings: Number(data.totalEarnings.toFixed(2)),
          category: data.category
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      
      categories: Object.entries(serviceStats.categories)
        .map(([category, data]) => ({
          category,
          count: data.count,
          totalEarnings: Number(data.totalEarnings.toFixed(2))
        }))
        .sort((a, b) => b.count - a.count)
    };

    // 🔟 Calculate additional metrics
    const weeklyGrowth = calculateWeeklyGrowth(completedBookings);
    const customerCount = new Set(completedBookings.map(b => b.customer?._id?.toString())).size;
    
    // Calculate average booking value
    const averageBookingValue = totalBookings > 0 ? 
      Number((totalEarnings / totalBookings).toFixed(2)) : 0;

    // ✅ Response
    res.status(200).json({
      success: true,
      data: {
        // Core metrics
        totalSales: Number(totalEarnings.toFixed(2)),
        totalBookings,
        totalProducts,
        avgRating,
        averageBookingValue,
        
        // Customer metrics
        totalCustomers: customerCount,
        repeatCustomers: calculateRepeatCustomers(completedBookings),
        
        // Payment metrics
        totalEarnings: Number(totalEarnings.toFixed(2)),
        pendingPayout: calculatePendingPayout(completedBookings),
        paymentSummary,
        
        // Growth metrics
        weeklyGrowth,
        monthlyGrowth: calculateMonthlyGrowth(chartData),
        
        // Chart data
        chartData,
        monthlyEarnings: chartData.reduce((sum, month) => sum + month.value, 0),
        
        // Activity data
        recentBookings,
        serviceStats: formattedServiceStats,
        
        // Time-based metrics
        thisMonthBookings: getThisMonthBookings(completedBookings),
        thisWeekBookings: getThisWeekBookings(completedBookings),
        todayBookings: getTodayBookings(completedBookings),
        
        // Additional info
        providerInfo: providerBookings[0]?.provider || {
          hourlyRate: 50,
          serviceName: 'Service Provider',
          serviceCategory: 'General'
        }
      }
    });

  } catch (error) {
    console.error('Provider overview error:', error);
    res.status(500).json({
      success: false,
      message: error?.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Helper functions

function calculateWeeklyGrowth(bookings) {
  if (!bookings || bookings.length === 0) return 0;
  
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const thisWeekBookings = bookings.filter(b => 
    new Date(b.createdAt) >= oneWeekAgo
  );
  
  const lastWeekBookings = bookings.filter(b => 
    new Date(b.createdAt) >= twoWeeksAgo && new Date(b.createdAt) < oneWeekAgo
  );
  
  if (lastWeekBookings.length === 0) return thisWeekBookings.length > 0 ? 100 : 0;
  
  const growth = ((thisWeekBookings.length - lastWeekBookings.length) / lastWeekBookings.length) * 100;
  return Number(growth.toFixed(1));
}

function calculateRepeatCustomers(bookings) {
  const customerBookings = bookings.reduce((acc, booking) => {
    const customerId = booking.customer?._id?.toString();
    if (customerId) {
      if (!acc[customerId]) {
        acc[customerId] = 0;
      }
      acc[customerId]++;
    }
    return acc;
  }, {});
  
  return Object.values(customerBookings).filter(count => count > 1).length;
}

function calculatePendingPayout(bookings) {
  return bookings
    .filter(booking => booking.paymentStatus === 'processing' || !booking.paymentStatus)
    .reduce((sum, booking) => {
      const hourlyRate = booking.provider?.hourlyRate || 50;
      const duration = booking.timeSlot?.duration ? 
        parseFloat(booking.timeSlot.duration.toString().replace(/[^0-9]/g, '')) / 60 || 1 : 1;
      const bookingAmount = hourlyRate * duration;
      
      // Apply commission and tax
      const commission = bookingAmount * 0.10;
      const tax = commission * 0.19;
      const netAmount = bookingAmount - commission - tax;
      
      return sum + netAmount;
    }, 0);
}

function calculateMonthlyGrowth(chartData) {
  if (chartData.length < 2) return 0;
  
  const currentMonth = new Date().getMonth();
  const currentMonthEarnings = chartData[currentMonth]?.value || 0;
  const lastMonthEarnings = chartData[currentMonth - 1]?.value || chartData[chartData.length - 1]?.value || 0;
  
  if (lastMonthEarnings === 0) return currentMonthEarnings > 0 ? 100 : 0;
  
  const growth = ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
  return Number(growth.toFixed(1));
}

function getThisMonthBookings(bookings) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return bookings.filter(booking => 
    new Date(booking.createdAt) >= firstDayOfMonth
  ).length;
}

function getThisWeekBookings(bookings) {
  const now = new Date();
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  
  return bookings.filter(booking => 
    new Date(booking.createdAt) >= firstDayOfWeek
  ).length;
}

function getTodayBookings(bookings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return bookings.filter(booking => 
    new Date(booking.createdAt) >= today
  ).length;
}
db.sales.aggregate([
    
    { $unwind: "$items" }, // unwind records items
    
    {
        $addFields: {  // require date wise records
            month: {
                $dateToString: {
                    format: "%Y-%m",
                    date: "$date"
                }
            }
        }
    },
    {    // grouping via store and month
        $group: {
            _id: {
                store: "$store",
                month: "$month"
            },
            totalRevenue: {
                $sum: { $multiply: ["$items.quantity", "$items.price"] }
            },
            totalItemsSold: {
                $sum: "$items.quantity"
            },
            totalPrice: {
                $sum: { $multiply: ["$items.quantity", "$items.price"] }
            }
        }
    },
    
    {
        $project: {
            _id: 0,
            store: "$_id.store",
            month: "$_id.month",
            totalRevenue: 1,
            averagePrice: {
                $divide: ["$totalPrice", "$totalItemsSold"]
            }
        }
    },
    
    {    // sorting applied
        $sort: {
            store: 1,
            month: 1
        }
    }
]);
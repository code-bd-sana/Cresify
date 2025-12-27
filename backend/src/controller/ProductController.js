import Product from "../models/ProductModel.js";

export const saveProduct = async (req, res) => {
  try {
    const data = req.body;

    const newProduct = new Product(data);

    const saved = await newProduct.save();

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Product.deleteOne({
      _id: id,
    });

    res.status(201).json({
      message: "Success",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const data = req.body;
    const id = data?.id;

    console.log(data, "hey data");
    const updated = await Product.updateOne(
      { _id: id },
      {
        $set: {
          name: data?.name,
          category: data?.category,
          price: data?.price,
          stock: data?.stock,
          description: data?.description,
          status: data?.status,
          image: data?.image,
          shippingCost: data?.shippingCost,
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const myProduct = async (req, res) => {
  console.log(req.query.search, "Search query received");
  try {
    const id = req.params.id;

    // Convert skip & limit to numbers + default values
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || ""; // get search from query

    console.log(skip, limit, "Skip and limit values");

    // Build the query
    const query = { seller: id };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];

      // Check if search term looks like an ObjectId or contains ID
      // Option 1: Search in _id as string
      if (search.length === 24 || /^[0-9a-fA-F]{24}$/.test(search)) {
        // If it looks like an ObjectId, search by _id directly
        try {
          const { ObjectId } = require("mongoose").Types;
          if (ObjectId.isValid(search)) {
            query.$or.push({ _id: new ObjectId(search) });
          }
        } catch (err) {
          console.log("Invalid ObjectId format");
        }
      } else {
        // Search in _id string representation
        query.$or.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: search,
              options: "i",
            },
          },
        });
      }
    }

    // Find products with pagination
    const allProducts = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Count total for frontend pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      message: "Success",
      total,
      skip,
      limit,
      data: allProducts,
    });
  } catch (error) {
    console.log(error, "Error in myProduct controller");
    res.status(500).json({
      message: error?.message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id }).populate("seller");
    res.status(200).json({
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

// controllers/productController.js
export const allProduct = async (req, res) => {
  console.log("All query params:", req.query);
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const location = req.query.location || "";
    const country = req.query.country || "";
    const region = req.query.region || "";
    const city = req.query.city || "";
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 1000000;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    console.log("Parsed filters:", {
      search,
      category,
      location,
      country,
      region,
      city,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      skip,
      limit,
    });

    // Build query object
    const query = { status: "active" };

    // Search filter
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { region: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];

      // Try to search in seller info
      query.$or.push({
        "seller.name": { $regex: search, $options: "i" },
      });
      query.$or.push({
        "seller.email": { $regex: search, $options: "i" },
      });

      // If search looks like an ObjectId
      if (search.length === 24 && /^[0-9a-fA-F]{24}$/.test(search)) {
        try {
          const { ObjectId } = require("mongoose").Types;
          query.$or.push({ _id: new ObjectId(search) });
          query.$or.push({ "seller._id": new ObjectId(search) });
        } catch (err) {
          console.log("Invalid ObjectId format:", search);
        }
      }
    }

    // Category filter
    if (category && category.trim() !== "") {
      const categories = category
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== "");
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Location filter
    if (location && location.trim() !== "") {
      const locations = location
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l !== "");
      if (locations.length > 0) {
        query.location = { $in: locations };
      }
    }

    // Country filter
    if (country && country.trim() !== "") {
      const countries = country
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== "");
      if (countries.length > 0) {
        query.country = { $in: countries };
      }
    }

    // Region filter
    if (region && region.trim() !== "") {
      const regions = region
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r !== "");
      if (regions.length > 0) {
        query.region = { $in: regions };
      }
    }

    // City filter
    if (city && city.trim() !== "") {
      const cities = city
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== "");
      if (cities.length > 0) {
        query.city = { $in: cities };
      }
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 1000000) {
      query.price = {};
      if (minPrice > 0) query.price.$gte = minPrice;
      if (maxPrice < 1000000) query.price.$lte = maxPrice;
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === "rating") {
      sortOptions.rating = sortOrder;
      sortOptions.createdAt = -1; // Secondary sort
    } else if (sortBy === "price") {
      sortOptions.price = sortOrder;
      sortOptions.createdAt = -1; // Secondary sort
    } else {
      sortOptions.createdAt = sortOrder;
    }

    console.log("Final MongoDB query:", JSON.stringify(query, null, 2));
    console.log("Sort options:", sortOptions);

    // Find products with filters and pagination
    const allProducts = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions)
      .populate("seller", "name email _id");

    // Count total for frontend pagination
    const total = await Product.countDocuments(query);

    console.log(`Found ${allProducts.length} products, total: ${total}`);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      total,
      skip,
      limit,
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
      filters: {
        search,
        category,
        location,
        country,
        region,
        city,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder: sortOrder === 1 ? "asc" : "desc",
      },
      data: allProducts,
    });
  } catch (error) {
    console.error("Error in allProduct controller:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};



export const allLocation = async(req, res) => {
  try {
    // Aggregation pipeline to get all unique locations
    const locations = await Product.aggregate([
      {
        $match: {
          status: "active",
          $or: [
            { location: { $exists: true, $ne: "" } },
            { country: { $exists: true, $ne: "" } },
            { region: { $exists: true, $ne: "" } },
            { city: { $exists: true, $ne: "" } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          // Get unique locations
          locations: { $addToSet: "$location" },
          countries: { $addToSet: "$country" },
          regions: { $addToSet: "$region" },
          cities: { $addToSet: "$city" }
        }
      },
      {
        $project: {
          _id: 0,
          locations: {
            $filter: {
              input: "$locations",
              as: "loc",
              cond: { 
                $and: [
                  { $ne: ["$$loc", null] },
                  { $ne: ["$$loc", ""] }
                ]
              }
            }
          },
          countries: {
            $filter: {
              input: "$countries",
              as: "country",
              cond: { 
                $and: [
                  { $ne: ["$$country", null] },
                  { $ne: ["$$country", ""] }
                ]
              }
            }
          },
          regions: {
            $filter: {
              input: "$regions",
              as: "region",
              cond: { 
                $and: [
                  { $ne: ["$$region", null] },
                  { $ne: ["$$region", ""] }
                ]
              }
            }
          },
          cities: {
            $filter: {
              input: "$cities",
              as: "city",
              cond: { 
                $and: [
                  { $ne: ["$$city", null] },
                  { $ne: ["$$city", ""] }
                ]
              }
            }
          }
        }
      }
    ]);

    // Get all locations by type
    const locationData = locations.length > 0 ? locations[0] : {
      locations: [],
      countries: [],
      regions: [],
      cities: []
    };

    // Sort alphabetically
    locationData.locations.sort();
    locationData.countries.sort();
    locationData.regions.sort();
    locationData.cities.sort();

    // Count total
    const locationStats = {
      totalLocations: locationData.locations.length,
      totalCountries: locationData.countries.length,
      totalRegions: locationData.regions.length,
      totalCities: locationData.cities.length,
      totalAll: locationData.locations.length + 
                locationData.countries.length + 
                locationData.regions.length + 
                locationData.cities.length
    };

    res.status(200).json({
      success: true,
      message: "All locations retrieved successfully",
      stats: locationStats,
      data: locationData
    });

  } catch (error) {
    console.error("Error in allLocation controller:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
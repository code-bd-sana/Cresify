import Cart from "../../models/CartModel.js";

export const addToCart = async(req, res)=>{
    try {

        const data = req.body;

        const {product, user} = data;
        const isExist = await Cart.findOne({user:user, product:product});

        if(isExist){
            res.status(401).json({
                message:"Already added on the cart"
            })
        }
        const newCart = new Cart(data);
        const saved = newCart.save();
        res.status(200).json({
            message:"Success",
            data:saved
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
};

export const removeCart = async(req, res)=>{
    try {
        const id = req.params.id;
        const deleted = await Cart.deleteOne({_id:id});
        res.status(200).json({
            message:"Success",
            data:deleted
        });

    
        
    } catch (error) {
          res.status(500).json({
            error,
            message:error?.message
        })
    }

};



export const increaseCount = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Cart.findByIdAndUpdate(
      id,
      {
        $inc: { count: 1 }, // count += 1
      },
      { new: true } // return updated doc
    );

    if (!updated) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      message: "Count increased successfully",
      cart: updated,
    });

  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};


export const decreaseCount = async (req, res) => {
  try {
    const id = req.params.id;

    // First get the cart item
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    // Prevent negative or zero count
    if (cartItem.count <= 1) {
      return res.status(400).json({
        message: "Count cannot be less than 1",
      });
    }

    // Update the count
    const updated = await Cart.findByIdAndUpdate(
      id,
      { $inc: { count: -1 } }, // count -= 1
      { new: true }
    );

    res.status(200).json({
      message: "Count decreased successfully",
      cart: updated,
    });

  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};



export const myCart = async(req, res)=>{
    try {
        const id = req.params.id;
        const myCarts = await Cart.find({usr:id});
        res.status(200).json({
            message:"Success",
            data: myCarts
        })
        
    } catch (error) {
           res.status(500).json({
      error,
      message: error?.message,
    });
    }
};


export const clearAllCart = async(req, res)=>{
    try {
        const id = req.params.id;
        const deleted = await Cart.deleteMany({user:id});
        res.status(200).json({
            message:"Success",
            data:deleted


        });
        
        
    } catch (error) {
             res.status(500).json({
      error,
      message: error?.message,
    });
    }
}
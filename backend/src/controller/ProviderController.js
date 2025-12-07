import User from "../models/UserModel.js";


export const changeAvailability = async (req, res) => {
    try {
        const { id, workingHours, slotDuration, workingDays } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({ message: "Provider ID is required" });
        }

        // Find provider
        const provider = await User.findById(id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        // Only update provider role
        if (provider.role !== "provider") {
            return res.status(400).json({ message: "User is not a service provider" });
        }

        // Update fields if provided
        if (workingHours) {
            provider.workingHours = workingHours; // { start: "09:00", end: "18:00" }
        }

        if (slotDuration) {
            provider.slotDuration = slotDuration; // in minutes
        }

        if (workingDays) {
            provider.workingDays = workingDays; // ["Mon", "Tue", "Wed"]
        }

        // Save updates
        const updatedProvider = await provider.save();

        res.status(200).json({
            message: "Availability updated successfully",
            data: updatedProvider
        });

    } catch (error) {
        console.error("Error updating availability:", error);
        res.status(500).json({
            error,
            message: error?.message
        });
    }
};

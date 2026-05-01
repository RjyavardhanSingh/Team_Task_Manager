import { getDashboardMetrics } from "./dashboard.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getDashboard = asyncHandler(async (req, res) => {
    
    const data = await getDashboardMetrics(req.user._id, req.user.role);
    
    
    res.status(200).json(
        new ApiResponse(200, data, "Dashboard metrics fetched successfully")
    );
});

export {
    getDashboard
}
// /client/src/reducers/dashboardReducers.js
import {
    DASHBOARD_DATA_REQUEST,
    DASHBOARD_DATA_SUCCESS,
    DASHBOARD_DATA_FAIL,
    DASHBOARD_DATA_RESET,
} from '../constants/dashboardConstants'

export const dashboardDataReducer = (state = { summary: {}, orders: [], revenue: [] }, action) => {
    switch (action.type) {
        case DASHBOARD_DATA_REQUEST:
            return { loading: true }
        case DASHBOARD_DATA_SUCCESS:
            return {
                loading: false,
                success: true,
                // Assuming the payload contains fields like summary, orders, and revenue
                summary: action.payload.summary,
                orders: action.payload.orders,
                revenue: action.payload.revenue,
            }
        case DASHBOARD_DATA_FAIL:
            return { loading: false, error: action.payload }
        case DASHBOARD_DATA_RESET:
            return { summary: {}, orders: [], revenue: [] }
        default:
            return state
    }
}
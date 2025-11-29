// /client/src/actions/dashboardActions.js
import axios from 'axios'
import {
    DASHBOARD_DATA_REQUEST,
    DASHBOARD_DATA_SUCCESS,
    DASHBOARD_DATA_FAIL,
} from '../constants/dashboardConstants'

export const getDashboardData = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: DASHBOARD_DATA_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        // 🔑 NOTE: Adjust the API endpoint as per your backend route for dashboard data
        const { data } = await axios.get(`/api/dashboard`, config)

        dispatch({
            type: DASHBOARD_DATA_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: DASHBOARD_DATA_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}
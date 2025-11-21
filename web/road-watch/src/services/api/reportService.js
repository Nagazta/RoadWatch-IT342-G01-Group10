import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseAnonKey)
{
    alert('Configuration Error: Missing Supabase keys. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const reportService =
{
    createReport: async(formData, name) =>
    {
        try
        {
            const response = await axios.post
            (
                `${API_URL}/api/reports/add2`, formData, { params: {submittedBy: name} }
            );

            if(response.data)
                return { success: true };
            else
                throw new Error('Failed to create report');
        }
        catch(error)
        {
            console.error(error.message);
            return { success: false };
        }
    },

    getReportsByEmail: async(email) => {
        try {
            const response = await axios.get(`${API_URL}/api/reports/getAll/name`, {
                params: { submittedBy: email }
            });
            if (response.data) return { success: true, data: response.data };
            throw new Error('Failed to fetch reports');
        } catch (error) {
            console.error(error.message);
            return { success: false };
        }
    }

}

export default reportService;
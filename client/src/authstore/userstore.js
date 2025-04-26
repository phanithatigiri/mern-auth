import {create} from 'zustand'
import axios from 'axios'


const backendurl = import.meta.env.VITE_BACKEND_URL


axios.defaults.withCredentials = true

export const userAuthStore = create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
	message:null,

    signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${backendurl}/signup`, { email, password, name });
			set({ user: response.data.user, error:null ,isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${backendurl}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async()=>{
       set({isLoading:false,error:null})
	   try {
		
		const response = await axios.post(`${backendurl}/logout`)
		set({user:null,isAuthenticated:false,error:null,isCheckingAuth:false})
        
	   } catch (error) {
          
		set({error:error.response.data.message , isLoading:false})
		
	   }
	},

	forgotPassword: async(email)=>{
        set({isLoading:true,error:null})
		try {

			const response = await axios.post(`${backendurl}/forgotPassword`,{email})
		set({message:response.data.message , isLoading:false})
			
		} catch (error) {
			 set({error:error.response.data.message,isLoading:false})
			 throw error;
		}
		
	},

	resetPassword:async(token,password)=>{
        set({error:null, isLoading:true})
		try {
          
			const response = await axios.post(`${backendurl}/resetpassword/${token}`,{password})
			set({message:response.data.message,error:null, isLoading:false})

		} catch (error) {
			set({isLoading:false, error:error.response.data.message})
			throw error
		}
	},

	verifyEmail: async (code) => {
		set({ isLoading: true, error: null ,message:null});
		try {
			const response = await axios.post(`${backendurl}/verifyEmail`, { code });
			set({ user:response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false , });
			throw error;
		}
	},
	checkauth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${backendurl}/checkauth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

}))
package com.example.roadwatch.utils

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.example.roadwatch.models.UserDTO

class PreferenceManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("RoadWatchPrefs", Context.MODE_PRIVATE)

    private val gson = Gson()

    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER_DATA = "user_data"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_SUPABASE_ID = "supabase_id"
    }

    fun saveAuthToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }

    fun getAuthToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun saveUserData(email: String, name: String, role: String) {
        prefs.edit().apply {
            putString(KEY_USER_EMAIL, email)
            putString(KEY_USER_NAME, name)
            putString(KEY_USER_ROLE, role)
            apply()
        }
    }

    fun saveCompleteUserData(user: UserDTO) {
        prefs.edit().apply {
            putString(KEY_USER_DATA, gson.toJson(user))
            putString(KEY_USER_EMAIL, user.email)
            putString(KEY_USER_NAME, user.name)
            putString(KEY_USER_ROLE, user.role)
            putLong(KEY_USER_ID, user.id)
            putString(KEY_SUPABASE_ID, user.supabaseId)
            apply()
        }
    }

    fun getCompleteUserData(): UserDTO? {
        val json = prefs.getString(KEY_USER_DATA, null) ?: return null
        return try {
            gson.fromJson(json, UserDTO::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun getUserName(): String? {
        return prefs.getString(KEY_USER_NAME, null)
    }

    fun getUserEmail(): String? {
        return prefs.getString(KEY_USER_EMAIL, null)
    }

    fun getUserRole(): String? {
        return prefs.getString(KEY_USER_ROLE, null)
    }

    fun getUserId(): Long {
        return prefs.getLong(KEY_USER_ID, -1)
    }

    fun getSupabaseId(): String? {
        return prefs.getString(KEY_SUPABASE_ID, null)
    }

    fun clearAll() {
        prefs.edit().clear().apply()
    }

    fun isLoggedIn(): Boolean {
        return !getAuthToken().isNullOrEmpty()
    }
    fun saveUserEmail(email: String) {
        prefs.edit().putString("user_email", email).apply()
    }

    fun clear() {
        prefs.edit().clear().apply()
    }
}
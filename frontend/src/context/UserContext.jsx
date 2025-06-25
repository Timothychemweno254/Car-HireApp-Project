import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { api_url } from "../config.json";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [auth_token, setAuthToken] = useState(() => localStorage.getItem("access_token"));

    console.log("Current User useState variable: ", currentUser);

    // ========= Function to register a user ==========
    function register_user(username, email, password) {
        toast.loading("Registering user...");

        fetch(`${api_url}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(res => {
            toast.dismiss();
            if (res.error) {
                toast.error(res.error);
            } else if (res.success) {
                toast.success(res.success);
                navigate("/login");
            } else {
                toast.error("An error occurred while registering the user.");
            }
        });
    }

    // ======== Function to login a user ========
    function login_user(email, password) {
        toast.loading("Logging you in...");

        fetch(`${api_url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password_hash: password })

        })
        .then(response => response.json())
        .then(res => {
            toast.dismiss();
            if (res.error) {
                toast.error(res.error);
            } else if (res.access_token) {
                toast.success("Logged in successfully!");
                localStorage.setItem("access_token", res.access_token);
                setAuthToken(res.access_token);
                navigate("/cars");
            } else {
                toast.error("An error occurred while logging in!");
            }
        });
    }

    // ======= Function to logout a user ========
function logout_user() {
  fetch(`${api_url}/logout`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth_token}`,
    }
  })
    .then(response => response.json())
    .then(res => {
      if (res.success || res.message) {
        toast.success(res.success || res.message);
        localStorage.removeItem("access_token");
        setAuthToken(null);
        setCurrentUser(null);
        navigate("/login");
      } else {
        toast.error(res.error || "An error occurred while logging out!");
      }
    })
    .catch(err => {
      toast.error("Failed to contact server during logout.");
      console.error("Logout error:", err);
    });
}


function delete_profile() {
  if (!currentUser || !currentUser.id) {
    toast.error("User ID not found.");
    return;
  }

  const userId = currentUser.id;

  toast.loading("Deleting profile...");

  fetch(`${api_url}/users/${userId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      toast.dismiss();
      if (res.error) {
        toast.error(res.error);
      } else if (res.message) {
        toast.success(res.message); // ✅ match Flask return key
        localStorage.removeItem("access_token");
        setAuthToken(null);
        setCurrentUser(null);
        navigate("/login");
      } else {
        toast.error("An error occurred while deleting the profile.");
      }
    })
    .catch((err) => {
      toast.dismiss();
      toast.error("Server error during deletion.");
      console.error("Delete error:", err);
    });
}


    //  ======= Function to update user profile ========
  function update_user_profile(user_id, email, password) {
  if (!auth_token) {
    toast.error("Not logged in.");
    return;
  }

  toast.loading("Updating profile...");

  fetch(`${api_url}/users/${user_id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const data = await res.json();
      toast.dismiss();

      if (!res.ok) {
        toast.error(data.error || "An unexpected error occurred.");
        return;
      }

      if (data.message) {
        toast.info("Please wait while we send a confirmation email...");
        setTimeout(() => {
          toast.success(data.message);
          setCurrentUser((prev) => ({ ...prev, email })); // optional: update email locally
        }, 1500);
      } else {
        toast.error("Profile update completed, but no confirmation message received.");
      }
    })
    .catch((err) => {
      toast.dismiss();
      toast.error("Failed to connect to the server.");
      console.error("Update error:", err);
    });
}


    // ======= Get current user data =======
    useEffect(() => {
        if (auth_token) {
            fetch(`${api_url}/current_user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth_token}`
                }
            })
            .then(response => response.json())
            .then(res => {
                if (res.msg) {
                    toast.error(res.msg);
                } else {
                    console.log("Current user response:", res);
                    setCurrentUser(res);
                }
            });
        }
    }, [auth_token]);

    const context_data = {
        auth_token,
        delete_profile,
        currentUser,
        register_user,
        login_user,
        logout_user,
        update_user_profile
    };

    return (
        <UserContext.Provider value={context_data}>
            {children}
        </UserContext.Provider>
    );
};

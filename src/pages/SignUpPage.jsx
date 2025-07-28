import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuth();

  
   const handleOnChange = (e) =>{
        const { name , value } = e.target

        setFormData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
        setErrors({})
    }


  // const validateForm = () => {
  //   if (!formData.fullName.trim()) return toast.error("Full name is required");
  //   if (!formData.email.trim()) return toast.error("Email is required");
  //   if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
  //   if (!formData.password) return toast.error("Password is required");
  //   if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

  //   return true;
  // };

   const validateConfig = {
        fullName: [
            { required: true, message: "Please enter your Name!" },
            { minLength: 3, message: "Name must contain at least 3 Characters!" }
        ],
        email: [
            { required: true, message: "Please enter your Email!" },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" }
        ],
        password: [
            { required: true, message: "Please enter your Password!" },
            { pattern: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Password must be 8+ chars with 1 capital & 1 number" }
        ]
    }
    // console.log("data", data)

    const validatForm = (data) => {
        let errorObj = {}
        Object.entries(data).forEach(([key, value]) => {
            const rules = validateConfig[key]
            if (!rules) return
            validateConfig[key].some((rule) => {
                if (rule.required && !value) {
                    errorObj[key] = rule.message
                    return true;
                }
                if (rule.minLength && value.length < rule.minLength) {
                    errorObj[key] = rule.message
                    return true;
                }
                if (rule.pattern && !rule.pattern.test(value)) {
                    errorObj[key] = rule.message
                    return true
                }
            })
        })
        setErrors(errorObj)
        return errorObj;
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formResult = validatForm(formData)
    if(Object.keys(formResult).length) return;
    // const success = validateForm();

     signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-medium">fullName</span>
              </label>
              <div className="relative  mt-3 md:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleOnChange}
                />
              </div>
              <p className="absolute top-2 left-16 text-red-500 text-[14px] leading-none">{errors.fullName}</p>
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative  mt-3 md:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                   onChange={handleOnChange}
                />
              </div>
              <p className="absolute top-2 left-12 text-red-500 text-[14px] leading-none">{errors.email}</p>
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative  mt-3 md:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                   onChange={handleOnChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              <p className="absolute top-2 left-20 text-red-500 text-[14px] leading-none">{errors.password}</p>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;

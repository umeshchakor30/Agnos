"use client";

import { useEffect, useRef, useState } from "react";
import FormField from "./FormField";

const initialFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  language: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  religion: "",
};

export default function PatientForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStatusRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      if (!typingStatusRef.current) {
        typingStatusRef.current = true;
        if (socketRef.current?.readyState === 1) {
          socketRef.current.send(JSON.stringify({ type: "patient:typing", data: newData }));
        }
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        typingStatusRef.current = false;
        if (socketRef.current?.readyState === 1) {
          socketRef.current.send(JSON.stringify({
            type: "patient:typing",
            data: newData
          }));
        } else {
          console.error("WebSocket is not connected");
        }
      }, 500);

      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields check
    const requiredFields = [
      "firstName", "lastName", "dob", "gender", 
      "phone", "email", "address", "language", "nationality"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Basic phone validation (at least 7 digits, allows some symbols)
    if (formData.phone && !/^[\d\s\-\+\(\)]{7,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Date validation
    if (formData.dob) {
      const date = new Date(formData.dob);
      if (isNaN(date.getTime())) {
        newErrors.dob = "Please enter a valid date";
      } else if (date > new Date()) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (validateForm()) {
      // Validation succeeded - showing success state instead of API call

      if(socketRef.current?.readyState === 1){
        socketRef.current.send(
          JSON.stringify({
            type: "patient:submitted",
            data: formData,
          })
        );
      } else {
        console.error("WebSocket is not connected");
      }
      

      setIsSuccess(true);
      // In a real app we'd submit to API/WebSocket here
    }
  };


  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    let socket = null;
    let reconnectTimeout = null;

    const connect = () => {
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");
        socket.send(JSON.stringify({ type: "patient:join" }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "error") {
            console.error("Server error:", data.message);
          } else {
            console.log("Message from server", data);
          }
        } catch (e) {
          console.error("Failed to parse server message", e);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket closed. Reconnecting...");
        reconnectTimeout = setTimeout(connect, 3000);
      };
      
      socket.onerror = () => {
        console.warn("WebSocket connection error");
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, []);ient";

import { useEffect, useRef, useState } from "react";
import FormField from "./FormField";

const initialFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  language: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  religion: "",
};

export default function PatientForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStatusRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      if (!typingStatusRef.current) {
        typingStatusRef.current = true;
        if (socketRef.current?.readyState === 1) {
          socketRef.current.send(JSON.stringify({ type: "patient:typing", data: newData }));
        }
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        typingStatusRef.current = false;
        if (socketRef.current?.readyState === 1) {
          socketRef.current.send(JSON.stringify({
            type: "patient:typing",
            data: newData
          }));
        } else {
          console.error("WebSocket is not connected");
        }
      }, 500);

      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields check
    const requiredFields = [
      "firstName", "lastName", "dob", "gender", 
      "phone", "email", "address", "language", "nationality"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Basic phone validation (at least 7 digits, allows some symbols)
    if (formData.phone && !/^[\d\s\-\+\(\)]{7,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Date validation
    if (formData.dob) {
      const date = new Date(formData.dob);
      if (isNaN(date.getTime())) {
        newErrors.dob = "Please enter a valid date";
      } else if (date > new Date()) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (validateForm()) {
      // Validation succeeded - showing success state instead of API call

      if(socketRef.current?.readyState === 1){
        socketRef.current.send(
          JSON.stringify({
            type: "patient:submitted",
            data: formData,
          })
        );
      } else {
        console.error("WebSocket is not connected");
      }
      

      setIsSuccess(true);
      // In a real app we'd submit to API/WebSocket here
    }
  };


  useEffect(()=>{
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen=()=>{
      console.log("WebSocket connected");
      socket.send(JSON.stringify({ type: "patient:join" }));
    }

    socket.onerror = () => {
      // Using console.warn instead of console.error to prevent the Next.js
      // development mode from showing a full-screen error overlay.
      console.warn("WebSocket connection error (Server might be offline)");
    };

    socket.onmessage = (event) =>{
      try {
        const data = JSON.parse(event.data);
        if (data.type === "error") {
          console.error("Server error:", data.message);
        } else {
          console.log("Message from server", data);
        }
      } catch (e) {
        console.error("Failed to parse server message", e);
      }
    }

    socket.onclose = ()=>{
      console.log("WebSocket Disconnected");
    }

    return () =>{
      socket.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

  },[])


  

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-green-900 mb-2">Registration Successful</h2>
        <p className="text-green-700 mb-6">
          The patient information has been successfully recorded.
        </p>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsSuccess(false);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
        >
          Register Another Patient
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-1">Please provide the patient&apos;s basic details.</p>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 items-start">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            placeholder="John"
          />
          <FormField
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Robert"
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            placeholder="Doe"
          />

          <FormField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            error={errors.dob}
            required
          />
          <FormField
            label="Gender"
            name="gender"
            type="select"
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            required
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
              { value: "prefer-not-to-say", label: "Prefer not to say" },
            ]}
          />
          <FormField
            label="Religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            placeholder="Optional"
          />

          <div className="md:col-span-2 lg:col-span-3 border-t border-slate-200 pt-6 mt-2">
            <h3 className="text-lg font-medium text-slate-900 mb-2">Contact Details</h3>
          </div>

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="(555) 123-4567"
          />
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="john.doe@example.com"
          />
          <FormField
            label="Preferred Language"
            name="language"
            type="select"
            value={formData.language}
            onChange={handleChange}
            error={errors.language}
            required
            options={[
              { value: "english", label: "English" },
              { value: "spanish", label: "Spanish" },
              { value: "french", label: "French" },
              { value: "other", label: "Other" },
            ]}
          />
          <FormField
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            error={errors.nationality}
            required
            placeholder="e.g. American"
          />

          <div className="md:col-span-2 lg:col-span-3">
            <FormField
              label="Home Address"
              name="address"
              type="textarea"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              placeholder="Full street address..."
              rows={3}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 border-t border-slate-200 pt-6 mt-2">
            <h3 className="text-lg font-medium text-slate-900 mb-2">Emergency Contact</h3>
          </div>

          <FormField
            label="Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder="Jane Doe"
          />
          <FormField
            label="Relationship to Patient"
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            placeholder="Spouse, Sibling, etc."
          />
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-4 md:px-8 border-t border-slate-200 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setFormData(initialFormData)}
          className="text-sm font-semibold leading-6 text-slate-900 mr-6 hover:text-slate-600 transition-colors"
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
        >
          Submit Registration
        </button>
      </div>
    </form>
  );
}

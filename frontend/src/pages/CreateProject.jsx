import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [serverError, setServerError] = useState(null);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Please log in to create a project
        </h2>
      </div>
    );
  }

  // Convert image file to Base64
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImageBase64(reader.result);
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);

    const payload = {
      title: data.title,
      description: data.description,
      goal_amount: parseFloat(data.goal_amount),
      end_at: data.end_date,
      category: data.category,
      image: imageBase64,
      bank_details: {
        account_name: data.account_name,
        account_number: data.account_number,
        ifsc: data.ifsc,
      },
      created_at: Date.now(),
    };

    try {
      const response = await fetch("http://localhost:3000/project/create", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message);
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Project</h1>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Title */}
        <div>
          <input
            type="text"
            placeholder="Project Title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Project Description"
            {...register("description", { required: "Description is required" })}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Funding Goal */}
        <div>
          <input
            type="number"
            placeholder="Funding Goal (₹)"
            {...register("goal_amount", { required: "Funding goal is required", min: 1 })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.goal_amount && <p className="text-red-500 text-sm">{errors.goal_amount.message}</p>}
        </div>

        {/* End Date */}
        <div>
          <input
            type="date"
            {...register("end_date", { required: "End date is required" })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
        </div>

        {/* Project Image */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {imageBase64 && <img src={imageBase64} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />}
        </div>

        {/* Category */}
        <div>
          <select {...register("category", { required: "Category is required" })} className="w-full px-3 py-2 border rounded-md">
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="film">Film</option>
            <option value="games">Games</option>
            <option value="publishing">Publishing</option>
            <option value="food">Food</option>
            <option value="fashion">Fashion</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Bank Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Bank Details</h2>

          <input
            type="text"
            placeholder="Account Holder Name"
            {...register("account_name", { required: "Account name is required" })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.account_name && <p className="text-red-500 text-sm">{errors.account_name.message}</p>}

          <input
            type="text"
            placeholder="Account Number"
            {...register("account_number", { required: "Account number is required" })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.account_number && <p className="text-red-500 text-sm">{errors.account_number.message}</p>}

          <input
            type="text"
            placeholder="IFSC Code"
            {...register("ifsc", {
              required: "IFSC code is required",
              minLength: { value: 11, message: "The IFSC must be 11 characters" },
              maxLength: { value: 11, message: "The IFSC must be 11 characters" },
            })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.ifsc && <p className="text-red-500 text-sm">{errors.ifsc.message}</p>}
        </div>

        {/* Submit Button with Loading Indicator */}
        <button
          type="submit"
          className={`w-full py-2 px-4 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700 flex justify-center items-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </form>
    </div>
  );
}

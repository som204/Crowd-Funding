import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [imageBase64, setImageBase64] = useState(null);

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
    const payload = {
      title: data.title,
      description: data.description,
      goal_amount: parseFloat(data.goal_amount),
      end_at: data.end_date,
      category: data.category,
      image: imageBase64,
      created_at: Date.now()
    };

    try {
      const response = await fetch("http://localhost:3000/project/create", {
        credentials:"include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Project</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Funding Goal ($)
          </label>
          <input
            type="number"
            {...register("goal_amount", { required: true })}
            min="1"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            {...register("end_date", { required: true })}
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: true })}
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded-md"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("category", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
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
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}

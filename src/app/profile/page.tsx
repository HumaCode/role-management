"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X, Upload, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name,
          phone: data.phone || "",
          image: data.image || "",
        });
        setImagePreview(data.image);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Client-side validation
    if (!formData.name || formData.name.trim().length === 0) {
      toast.error("Name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        toast.error("Invalid phone number format");
        return;
      }
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim() || null,
          image: formData.image.trim() || null,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        fetchProfile();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only images are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image: data.url });
        setImagePreview(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      image: profile?.image || "",
    });
    setImagePreview(profile?.image || null);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      admin: "bg-purple-500/20 text-purple-400 border-purple-500/50",
      user: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      guest: "bg-slate-500/20 text-slate-400 border-slate-500/50",
    };
    return variants[role] || variants.user;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription className="text-slate-400">
                Update your personal details here
              </CardDescription>
            </div>
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-700/50">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-slate-700">
                  <AvatarImage src={(imagePreview || profile.image) || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-semibold">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <div className="absolute -bottom-2 -right-2">
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      {uploading ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5 text-white" />
                      )}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                <p className="text-slate-400">{profile.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${getRoleBadge(profile.role)} capitalize`}
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {profile.role}
                  </Badge>
                </div>
                {editing && imagePreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="mt-2 text-red-400 border-red-400 hover:bg-red-500/10"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  <User className="inline mr-2 h-4 w-4" />
                  Full Name <span className="text-red-400">*</span>
                </Label>
                {editing ? (
                  <div className="space-y-1">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700 text-white"
                      placeholder="Enter your full name"
                    />
                    {formData.name && formData.name.trim().length < 2 && (
                      <p className="text-xs text-red-400">
                        Name must be at least 2 characters
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-white bg-slate-800/50 px-3 py-2 rounded-md">
                    {profile.name}
                  </p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label className="text-slate-300">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <p className="text-slate-400 bg-slate-800/30 px-3 py-2 rounded-md">
                    {profile.email}
                  </p>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    Read-only
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">
                  <Phone className="inline mr-2 h-4 w-4" />
                  Phone Number
                </Label>
                {editing ? (
                  <div className="space-y-1">
                    <Input
                      id="phone"
                      placeholder="+62 812 3456 7890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                    {formData.phone && formData.phone.trim().length > 0 && !/^[\d\s\-\+\(\)]+$/.test(formData.phone) && (
                      <p className="text-xs text-red-400">
                        Invalid phone number format
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Optional - Use numbers, spaces, +, -, ( )
                    </p>
                  </div>
                ) : (
                  <p className="text-white bg-slate-800/50 px-3 py-2 rounded-md">
                    {profile.phone || "-"}
                  </p>
                )}
              </div>

              {/* Member Since (Read-only) */}
              <div className="space-y-2">
                <Label className="text-slate-300">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Member Since
                </Label>
                <p className="text-slate-400 bg-slate-800/30 px-3 py-2 rounded-md">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Account Type</p>
                <p className="text-xl font-semibold text-white capitalize">
                  {profile.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Account Status</p>
                <p className="text-xl font-semibold text-white">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Mail className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Email Status</p>
                <p className="text-xl font-semibold text-white">
                  {profile.email ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// Validation helper functions
export const validation = {
    email: (email: string): { valid: boolean; message?: string } => {
        if (!email || email.trim().length === 0) {
            return { valid: false, message: "Email is required" };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: "Invalid email format" };
        }
        return { valid: true };
    },

    name: (name: string): { valid: boolean; message?: string } => {
        if (!name || name.trim().length === 0) {
            return { valid: false, message: "Name is required" };
        }
        if (name.trim().length < 2) {
            return { valid: false, message: "Name must be at least 2 characters" };
        }
        if (name.trim().length > 100) {
            return { valid: false, message: "Name must not exceed 100 characters" };
        }
        return { valid: true };
    },

    password: (password: string, isRequired: boolean = true): { valid: boolean; message?: string } => {
        if (isRequired && (!password || password.length === 0)) {
            return { valid: false, message: "Password is required" };
        }
        if (password && password.length > 0 && password.length < 8) {
            return { valid: false, message: "Password must be at least 8 characters" };
        }
        if (password && password.length > 100) {
            return { valid: false, message: "Password must not exceed 100 characters" };
        }
        return { valid: true };
    },

    phone: (phone: string): { valid: boolean; message?: string } => {
        if (!phone || phone.trim().length === 0) {
            return { valid: true }; // Phone is optional
        }
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: "Invalid phone format. Use numbers, +, -, (, ), and spaces only" };
        }
        if (phone.trim().length < 8) {
            return { valid: false, message: "Phone must be at least 8 characters" };
        }
        if (phone.trim().length > 20) {
            return { valid: false, message: "Phone must not exceed 20 characters" };
        }
        return { valid: true };
    },

    role: (role: string): { valid: boolean; message?: string } => {
        const validRoles = ["admin", "user", "guest"];
        if (!validRoles.includes(role)) {
            return { valid: false, message: "Invalid role selected" };
        }
        return { valid: true };
    },

    image: (file: File): { valid: boolean; message?: string } => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return { valid: false, message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" };
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { valid: false, message: "File size too large. Maximum 5MB allowed" };
        }
        return { valid: true };
    },
};

// Composite validation for user creation
export const validateUserCreate = (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
}): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const nameCheck = validation.name(data.name);
    if (!nameCheck.valid) errors.name = nameCheck.message!;

    const emailCheck = validation.email(data.email);
    if (!emailCheck.valid) errors.email = emailCheck.message!;

    const passwordCheck = validation.password(data.password, true);
    if (!passwordCheck.valid) errors.password = passwordCheck.message!;

    if (data.phone) {
        const phoneCheck = validation.phone(data.phone);
        if (!phoneCheck.valid) errors.phone = phoneCheck.message!;
    }

    const roleCheck = validation.role(data.role);
    if (!roleCheck.valid) errors.role = roleCheck.message!;

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

// Composite validation for user update
export const validateUserUpdate = (data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: string;
}): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const nameCheck = validation.name(data.name);
    if (!nameCheck.valid) errors.name = nameCheck.message!;

    const emailCheck = validation.email(data.email);
    if (!emailCheck.valid) errors.email = emailCheck.message!;

    // Password is optional for update
    if (data.password) {
        const passwordCheck = validation.password(data.password, false);
        if (!passwordCheck.valid) errors.password = passwordCheck.message!;
    }

    if (data.phone) {
        const phoneCheck = validation.phone(data.phone);
        if (!phoneCheck.valid) errors.phone = phoneCheck.message!;
    }

    const roleCheck = validation.role(data.role);
    if (!roleCheck.valid) errors.role = roleCheck.message!;

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
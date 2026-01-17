// ==================== VALIDATION SCHEMAS WITH ZOD ====================
// Runtime validation for forms and API data

// Using a lightweight validation approach without external dependencies
// This provides type safety and validation similar to Zod but vanilla JS

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = 'ValidationError';
  }
}

// Validation helper functions
const validators = {
  // String validators
  string: () => ({
    min: (length, message) => ({
      validate: (value) => {
        if (typeof value !== 'string' || value.length < length) {
          throw new ValidationError('string', message || `Must be at least ${length} characters`);
        }
        return value;
      }
    }),
    max: (length, message) => ({
      validate: (value) => {
        if (typeof value !== 'string' || value.length > length) {
          throw new ValidationError('string', message || `Must be at most ${length} characters`);
        }
        return value;
      }
    }),
    email: (message) => ({
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new ValidationError('email', message || 'Invalid email address');
        }
        return value;
      }
    }),
    phone: (message) => ({
      validate: (value) => {
        const phoneRegex = /^(\+264|0)?[0-9]{8,10}$/;
        if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
          throw new ValidationError('phone', message || 'Invalid phone number. Use format: +264812345678 or 0812345678');
        }
        return value;
      }
    }),
    required: (message) => ({
      validate: (value) => {
        if (!value || value.trim() === '') {
          throw new ValidationError('required', message || 'This field is required');
        }
        return value;
      }
    }),
    url: (message) => ({
      validate: (value) => {
        try {
          new URL(value);
          return value;
        } catch {
          throw new ValidationError('url', message || 'Invalid URL');
        }
      }
    })
  }),

  // Number validators
  number: () => ({
    min: (min, message) => ({
      validate: (value) => {
        const num = Number(value);
        if (isNaN(num) || num < min) {
          throw new ValidationError('number', message || `Must be at least ${min}`);
        }
        return num;
      }
    }),
    max: (max, message) => ({
      validate: (value) => {
        const num = Number(value);
        if (isNaN(num) || num > max) {
          throw new ValidationError('number', message || `Must be at most ${max}`);
        }
        return num;
      }
    }),
    positive: (message) => ({
      validate: (value) => {
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
          throw new ValidationError('number', message || 'Must be a positive number');
        }
        return num;
      }
    }),
    required: (message) => ({
      validate: (value) => {
        if (value === null || value === undefined || value === '') {
          throw new ValidationError('required', message || 'This field is required');
        }
        return Number(value);
      }
    })
  }),

  // Boolean validator
  boolean: () => ({
    validate: (value) => {
      return Boolean(value);
    }
  }),

  // Object validator
  object: (shape) => ({
    validate: (value) => {
      if (typeof value !== 'object' || value === null) {
        throw new ValidationError('object', 'Invalid object');
      }

      const validated = {};
      for (const [key, validator] of Object.entries(shape)) {
        try {
          validated[key] = validator.validate(value[key]);
        } catch (error) {
          throw new ValidationError(key, error.message);
        }
      }
      return validated;
    }
  }),

  // Array validator
  array: () => ({
    min: (length, message) => ({
      validate: (value) => {
        if (!Array.isArray(value) || value.length < length) {
          throw new ValidationError('array', message || `Must have at least ${length} items`);
        }
        return value;
      }
    }),
    nonempty: (message) => ({
      validate: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new ValidationError('array', message || 'Array cannot be empty');
        }
        return value;
      }
    })
  }),

  // Optional validator
  optional: (validator) => ({
    validate: (value) => {
      if (value === null || value === undefined || value === '') {
        return undefined;
      }
      return validator.validate(value);
    }
  }),

  // Enum validator
  enum: (values, message) => ({
    validate: (value) => {
      if (!values.includes(value)) {
        throw new ValidationError('enum', message || `Must be one of: ${values.join(', ')}`);
      }
      return value;
    }
  }),

  // Custom validator
  custom: (fn, message) => ({
    validate: (value) => {
      if (!fn(value)) {
        throw new ValidationError('custom', message || 'Validation failed');
      }
      return value;
    }
  })
};

// ==================== REGISTRATION SCHEMAS ====================

const RegistrationSchemas = {
  // Client registration
  client: {
    full_name: {
      validate: (value) => {
        if (!value || value.trim().length < 2) {
          throw new ValidationError('full_name', 'Full name must be at least 2 characters');
        }
        if (value.trim().length > 100) {
          throw new ValidationError('full_name', 'Full name must be less than 100 characters');
        }
        return value.trim();
      }
    },
    email: {
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new ValidationError('email', 'Please enter a valid email address');
        }
        return value.toLowerCase().trim();
      }
    },
    phone: {
      validate: (value) => {
        const phoneRegex = /^(\+264|0)?[0-9]{8,10}$/;
        const cleaned = value.replace(/[\s-]/g, '');
        if (!phoneRegex.test(cleaned)) {
          throw new ValidationError('phone', 'Please enter a valid Namibian phone number (e.g., +264812345678)');
        }
        return cleaned;
      }
    },
    password: {
      validate: (value) => {
        if (!value || value.length < 8) {
          throw new ValidationError('password', 'Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(value)) {
          throw new ValidationError('password', 'Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
          throw new ValidationError('password', 'Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(value)) {
          throw new ValidationError('password', 'Password must contain at least one number');
        }
        return value;
      }
    },
    company_name: {
      validate: (value) => {
        if (value && value.trim().length > 0 && value.trim().length < 2) {
          throw new ValidationError('company_name', 'Company name must be at least 2 characters');
        }
        return value ? value.trim() : undefined;
      }
    }
  },

  // Driver registration
  driver: {
    full_name: {
      validate: (value) => {
        if (!value || value.trim().length < 2) {
          throw new ValidationError('full_name', 'Full name must be at least 2 characters');
        }
        return value.trim();
      }
    },
    email: {
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new ValidationError('email', 'Please enter a valid email address');
        }
        return value.toLowerCase().trim();
      }
    },
    phone: {
      validate: (value) => {
        const phoneRegex = /^(\+264|0)?[0-9]{8,10}$/;
        const cleaned = value.replace(/[\s-]/g, '');
        if (!phoneRegex.test(cleaned)) {
          throw new ValidationError('phone', 'Please enter a valid Namibian phone number');
        }
        return cleaned;
      }
    },
    password: {
      validate: (value) => {
        if (!value || value.length < 8) {
          throw new ValidationError('password', 'Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(value)) {
          throw new ValidationError('password', 'Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(value)) {
          throw new ValidationError('password', 'Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(value)) {
          throw new ValidationError('password', 'Password must contain at least one number');
        }
        return value;
      }
    },
    vehicle_type: {
      validate: (value) => {
        const validTypes = ['PICKUP', 'SMALL_TRUCK', 'FLATBED', 'LARGE_TRUCK'];
        if (!validTypes.includes(value)) {
          throw new ValidationError('vehicle_type', `Vehicle type must be one of: ${validTypes.join(', ')}`);
        }
        return value;
      }
    },
    vehicle_make: {
      validate: (value) => {
        if (!value || value.trim().length < 2) {
          throw new ValidationError('vehicle_make', 'Vehicle make is required');
        }
        return value.trim();
      }
    },
    vehicle_model: {
      validate: (value) => {
        if (!value || value.trim().length < 2) {
          throw new ValidationError('vehicle_model', 'Vehicle model is required');
        }
        return value.trim();
      }
    },
    license_plate: {
      validate: (value) => {
        if (!value || value.trim().length < 2) {
          throw new ValidationError('license_plate', 'License plate is required');
        }
        // Namibian license plate format: N 123 ABC or similar
        return value.trim().toUpperCase();
      }
    },
    drivers_license: {
      validate: (value) => {
        if (!value || value.trim().length < 5) {
          throw new ValidationError('drivers_license', 'Driver\'s license number is required');
        }
        return value.trim();
      }
    }
  }
};

// ==================== JOB CREATION SCHEMA ====================

const JobSchema = {
  pickup_address: {
    validate: (value) => {
      if (!value || value.trim().length < 5) {
        throw new ValidationError('pickup_address', 'Pickup address must be at least 5 characters');
      }
      return value.trim();
    }
  },
  delivery_address: {
    validate: (value) => {
      if (!value || value.trim().length < 5) {
        throw new ValidationError('delivery_address', 'Delivery address must be at least 5 characters');
      }
      return value.trim();
    }
  },
  pickup_location: {
    validate: (value) => {
      if (!value || typeof value !== 'object') {
        throw new ValidationError('pickup_location', 'Pickup location is required');
      }
      if (typeof value.lat !== 'number' || typeof value.lng !== 'number') {
        throw new ValidationError('pickup_location', 'Invalid pickup coordinates');
      }
      return value;
    }
  },
  delivery_location: {
    validate: (value) => {
      if (!value || typeof value !== 'object') {
        throw new ValidationError('delivery_location', 'Delivery location is required');
      }
      if (typeof value.lat !== 'number' || typeof value.lng !== 'number') {
        throw new ValidationError('delivery_location', 'Invalid delivery coordinates');
      }
      return value;
    }
  },
  vehicle_type: {
    validate: (value) => {
      const validTypes = ['PICKUP', 'SMALL_TRUCK', 'FLATBED', 'LARGE_TRUCK'];
      if (!validTypes.includes(value)) {
        throw new ValidationError('vehicle_type', `Vehicle type must be one of: ${validTypes.join(', ')}`);
      }
      return value;
    }
  },
  load_type: {
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        throw new ValidationError('load_type', 'Load type is required');
      }
      return value.trim();
    }
  },
  load_weight: {
    validate: (value) => {
      if (value && value.trim().length > 0) {
        const weight = parseFloat(value);
        if (isNaN(weight) || weight <= 0) {
          throw new ValidationError('load_weight', 'Load weight must be a positive number');
        }
        if (weight > 10000) {
          throw new ValidationError('load_weight', 'Load weight seems unreasonably high');
        }
      }
      return value;
    }
  },
  total_price: {
    validate: (value) => {
      const price = Number(value);
      if (isNaN(price) || price < 50) {
        throw new ValidationError('total_price', 'Minimum job price is NAD 50');
      }
      if (price > 50000) {
        throw new ValidationError('total_price', 'Price exceeds maximum allowed (NAD 50,000)');
      }
      return price;
    }
  },
  scheduled_pickup: {
    validate: (value) => {
      if (!value) return undefined;

      const scheduledDate = new Date(value);
      const now = new Date();

      if (isNaN(scheduledDate.getTime())) {
        throw new ValidationError('scheduled_pickup', 'Invalid date format');
      }

      if (scheduledDate < now) {
        throw new ValidationError('scheduled_pickup', 'Scheduled pickup must be in the future');
      }

      // Max 30 days in advance
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      if (scheduledDate > maxDate) {
        throw new ValidationError('scheduled_pickup', 'Cannot schedule more than 30 days in advance');
      }

      return value;
    }
  }
};

// ==================== LOGIN SCHEMA ====================

const LoginSchema = {
  email: {
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new ValidationError('email', 'Please enter a valid email address');
      }
      return value.toLowerCase().trim();
    }
  },
  password: {
    validate: (value) => {
      if (!value || value.length < 1) {
        throw new ValidationError('password', 'Password is required');
      }
      return value;
    }
  }
};

// ==================== VALIDATION HELPER ====================

class Validator {
  static validate(data, schema) {
    const errors = {};
    const validated = {};

    for (const [field, validator] of Object.entries(schema)) {
      try {
        validated[field] = validator.validate(data[field]);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors[field] = error.message;
        } else {
          errors[field] = 'Validation error';
        }
      }
    }

    return {
      success: Object.keys(errors).length === 0,
      data: validated,
      errors
    };
  }

  static validateField(value, validator) {
    try {
      return {
        success: true,
        value: validator.validate(value),
        error: null
      };
    } catch (error) {
      return {
        success: false,
        value: null,
        error: error.message
      };
    }
  }
}

// ==================== EXPORTS ====================

window.ValidationSchemas = {
  Registration: RegistrationSchemas,
  Job: JobSchema,
  Login: LoginSchema,
  Validator,
  ValidationError,
  validators
};

// Also export individual schemas for convenience
window.ClientRegistrationSchema = RegistrationSchemas.client;
window.DriverRegistrationSchema = RegistrationSchemas.driver;
window.JobValidationSchema = JobSchema;
window.LoginValidationSchema = LoginSchema;

console.log('✅ Validation schemas loaded');

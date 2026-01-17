// ==================== FORM COMPONENTS WITH VALIDATION ====================
// Reusable form components with built-in validation

const { useState, useEffect } = React;

// ==================== VALIDATED INPUT ====================

function ValidatedInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  validator,
  placeholder,
  required = false,
  disabled = false,
  className = ''
}) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (validator && value) {
      const result = window.ValidationSchemas.Validator.validateField(value, validator);
      if (!result.success) {
        setError(result.error);
      } else {
        setError(null);
      }
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear error on change
    if (error) {
      setError(null);
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${error && touched
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
    }
    ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      {error && touched && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

// ==================== VALIDATED SELECT ====================

function ValidatedSelect({
  label,
  name,
  value,
  onChange,
  options,
  validator,
  required = false,
  disabled = false,
  placeholder = 'Select an option...',
  className = ''
}) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (validator && value) {
      const result = window.ValidationSchemas.Validator.validateField(value, validator);
      if (!result.success) {
        setError(result.error);
      } else {
        setError(null);
      }
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (error) {
      setError(null);
    }
  };

  const selectClasses = `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${error && touched
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
    }
    ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={selectClasses}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

// ==================== VALIDATED TEXTAREA ====================

function ValidatedTextarea({
  label,
  name,
  value,
  onChange,
  validator,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  className = ''
}) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (validator && value) {
      const result = window.ValidationSchemas.Validator.validateField(value, validator);
      if (!result.success) {
        setError(result.error);
      } else {
        setError(null);
      }
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (error) {
      setError(null);
    }
  };

  const textareaClasses = `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${error && touched
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
    }
    ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
      />
      {error && touched && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

// ==================== FORM ERROR SUMMARY ====================

function FormErrorSummary({ errors }) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong className="capitalize">{field.replace(/_/g, ' ')}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==================== SUBMIT BUTTON ====================

function SubmitButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  className = ''
}) {
  const buttonClasses = `
    w-full px-6 py-3 rounded-lg font-medium transition-colors
    ${disabled || loading
      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
      : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
    }
    ${className}
  `;

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ==================== FIELD GROUP ====================

function FieldGroup({ title, description, children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// ==================== PASSWORD STRENGTH INDICATOR ====================

function PasswordStrengthIndicator({ password }) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback([]);
      return;
    }

    let score = 0;
    const issues = [];

    // Length
    if (password.length >= 8) score++;
    else issues.push('At least 8 characters');

    // Uppercase
    if (/[A-Z]/.test(password)) score++;
    else issues.push('One uppercase letter');

    // Lowercase
    if (/[a-z]/.test(password)) score++;
    else issues.push('One lowercase letter');

    // Number
    if (/[0-9]/.test(password)) score++;
    else issues.push('One number');

    // Special character (bonus)
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setStrength(score);
    setFeedback(issues);
  }, [password]);

  if (!password) return null;

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-yellow-500';
    if (strength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-600">
          {getStrengthText()}
        </span>
      </div>
      {feedback.length > 0 && (
        <p className="text-xs text-slate-500">
          Required: {feedback.join(', ')}
        </p>
      )}
    </div>
  );
}

// ==================== EXPORTS ====================

window.FormComponents = {
  ValidatedInput,
  ValidatedSelect,
  ValidatedTextarea,
  FormErrorSummary,
  SubmitButton,
  FieldGroup,
  PasswordStrengthIndicator
};

// Export individual components for convenience
window.ValidatedInput = ValidatedInput;
window.ValidatedSelect = ValidatedSelect;
window.ValidatedTextarea = ValidatedTextarea;
window.FormErrorSummary = FormErrorSummary;
window.SubmitButton = SubmitButton;
window.FieldGroup = FieldGroup;
window.PasswordStrengthIndicator = PasswordStrengthIndicator;

console.log('✅ Form components loaded');

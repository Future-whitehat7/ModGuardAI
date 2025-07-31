import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, AlertCircle, Loader } from 'lucide-react';

interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  autoComplete?: string;
  debounceMs?: number;
}

interface SmartFormProps {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitLabel?: string;
  className?: string;
  validateOnChange?: boolean;
  showProgress?: boolean;
}

export const SmartForm: React.FC<SmartFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  className = '',
  validateOnChange = true,
  showProgress = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [validationTimeout, setValidationTimeout] = useState<Record<string, NodeJS.Timeout>>({});

  const validateField = useCallback((field: FieldConfig, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      for (const rule of field.validation) {
        if (!rule.test(value)) {
          return rule.message;
        }
      }
    }

    return '';
  }, []);

  const validateAllFields = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [fields, formData, validateField]);

  const handleChange = useCallback((fieldName: string, value: any, field: FieldConfig) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    if (validateOnChange && touched[fieldName]) {
      // Debounced validation
      if (validationTimeout[fieldName]) {
        clearTimeout(validationTimeout[fieldName]);
      }

      const timeout = setTimeout(() => {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
      }, field.debounceMs || 300);

      setValidationTimeout(prev => ({ ...prev, [fieldName]: timeout }));
    }
  }, [validateOnChange, touched, validationTimeout, validateField]);

  const handleBlur = useCallback((fieldName: string, field: FieldConfig) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (validateOnChange) {
      const error = validateField(field, formData[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [validateOnChange, formData, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const getFieldStatus = (field: FieldConfig) => {
    const hasValue = formData[field.name] && formData[field.name].toString().trim() !== '';
    const hasError = errors[field.name] && touched[field.name];
    const isValid = hasValue && !hasError && touched[field.name];

    return { hasValue, hasError, isValid };
  };

  const getCompletionPercentage = () => {
    const requiredFields = fields.filter(field => field.required);
    const completedFields = requiredFields.filter(field => {
      const value = formData[field.name];
      return value && value.toString().trim() !== '' && !errors[field.name];
    });
    
    return requiredFields.length > 0 ? (completedFields.length / requiredFields.length) * 100 : 0;
  };

  useEffect(() => {
    return () => {
      // Cleanup timeouts
      Object.values(validationTimeout).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [validationTimeout]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      {/* Progress Indicator */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Form Progress</span>
            <span className="text-sm text-gray-500">{Math.round(getCompletionPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </motion.div>
      )}

      {fields.map((field, index) => {
        const { hasValue, hasError, isValid } = getFieldStatus(field);
        
        return (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value, field)}
                  onBlur={() => handleBlur(field.name, field)}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    hasError
                      ? 'border-red-500 bg-red-50'
                      : isValid
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  autoComplete={field.autoComplete}
                >
                  <option value="">{field.placeholder || `Select ${field.label}`}</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  rows={field.rows || 4}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value, field)}
                  onBlur={() => handleBlur(field.name, field)}
                  placeholder={field.placeholder}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-vertical ${
                    hasError
                      ? 'border-red-500 bg-red-50'
                      : isValid
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  autoComplete={field.autoComplete}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type === 'password' && showPasswords[field.name] ? 'text' : field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => {
                    const value = field.type === 'number' ? Number(e.target.value) : e.target.value;
                    handleChange(field.name, value, field);
                  }}
                  onBlur={() => handleBlur(field.name, field)}
                  placeholder={field.placeholder}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    field.type === 'password' ? 'pr-10' : ''
                  } ${
                    hasError
                      ? 'border-red-500 bg-red-50'
                      : isValid
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  autoComplete={field.autoComplete}
                />
              )}

              {/* Password Toggle */}
              {field.type === 'password' && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords[field.name] ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* Validation Icons */}
              {(hasError || isValid) && field.type !== 'password' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {hasError ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <X className="h-5 w-5 text-red-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-1 text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{errors[field.name]}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader className="h-4 w-4 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          submitLabel
        )}
      </motion.button>
    </motion.form>
  );
};

// Common validation rules
export const validationRules = {
  email: {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  minLength: (min: number) => ({
    test: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters long`
  }),
  maxLength: (max: number) => ({
    test: (value: string) => value.length <= max,
    message: `Must be no more than ${max} characters long`
  }),
  strongPassword: {
    test: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
  },
  phoneNumber: {
    test: (value: string) => /^\+?[\d\s\-\(\)]+$/.test(value),
    message: 'Please enter a valid phone number'
  },
  url: {
    test: (value: string) => /^https?:\/\/.+\..+/.test(value),
    message: 'Please enter a valid URL'
  }
};
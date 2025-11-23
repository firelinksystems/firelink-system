import { useState, useCallback } from 'react';

interface FormField {
  value: any;
  required?: boolean;
  validate?: (value: any) => string | null;
}

interface FormFields {
  [key: string]: FormField;
}

interface UseFormReturn {
  fields: { [key: string]: any };
  errors: { [key: string]: string };
  setField: (name: string, value: any) => void;
  validate: () => boolean;
  reset: () => void;
}

export const useForm = (initialFields: FormFields): UseFormReturn => {
  const [fields, setFields] = useState<{ [key: string]: any }>(() => {
    const initialValues: { [key: string]: any } = {};
    Object.keys(initialFields).forEach(key => {
      initialValues[key] = initialFields[key].value;
    });
    return initialValues;
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const setField = useCallback((name: string, value: any) => {
    setFields(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    Object.keys(initialFields).forEach(key => {
      const field = initialFields[key];
      const value = fields[key];

      // Check required fields
      if (field.required && (!value || value === '')) {
        newErrors[key] = 'This field is required';
        return;
      }

      // Run custom validation
      if (field.validate && value) {
        const error = field.validate(value);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, initialFields]);

  const reset = useCallback(() => {
    const initialValues: { [key: string]: any } = {};
    Object.keys(initialFields).forEach(key => {
      initialValues[key] = initialFields[key].value;
    });
    setFields(initialValues);
    setErrors({});
  }, [initialFields]);

  return {
    fields,
    errors,
    setField,
    validate,
    reset
  };
};

// Form validation utilities

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Email validation
export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

// Phone validation (international format)
export const validatePhone = (
  phone: string
): { isValid: boolean; error?: string } => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/

  if (!phone) {
    return { isValid: false, error: 'Phone number is required' }
  }

  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s-]/g, '')

  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid phone number' }
  }

  return { isValid: true }
}

// Password validation
export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long',
    }
  }

  // Check for at least one number and one letter
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one letter and one number',
    }
  }

  return { isValid: true }
}

// Name validation
export const validateName = (
  name: string,
  fieldName: string = 'Name'
): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters long`,
    }
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    }
  }

  return { isValid: true }
}

// Sign up form validation
export const validateSignupForm = (data: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  password: string
  confirmPassword: string
}): ValidationResult => {
  const errors: Record<string, string> = {}

  // Validate first name
  const firstNameValidation = validateName(data.firstName, 'First name')
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error!
  }

  // Validate last name
  const lastNameValidation = validateName(data.lastName, 'Last name')
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error!
  }

  // Validate email or phone (at least one required)
  if (!data.email && !data.phone) {
    errors.contact = 'Either email or phone number is required'
  } else {
    if (data.email) {
      const emailValidation = validateEmail(data.email)
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error!
      }
    }

    if (data.phone) {
      const phoneValidation = validatePhone(data.phone)
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error!
      }
    }
  }

  // Validate password
  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!
  }

  // Validate confirm password
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Login form validation
export const validateLoginForm = (data: {
  credential: string
  password: string
  loginMethod: string // <-- THIS LINE IS THE FIX
}): ValidationResult => {
  const errors: Record<string, string> = {}

  // Validate credential based on login method
  if (data.loginMethod === 'email') {
    const emailValidation = validateEmail(data.credential)
    if (!emailValidation.isValid) {
      errors.credential = emailValidation.error!
    }
  } else {
    const phoneValidation = validatePhone(data.credential)
    if (!phoneValidation.isValid) {
      errors.credential = phoneValidation.error!
    }
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Profile update validation
export const validateProfileForm = (data: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
}): ValidationResult => {
  const errors: Record<string, string> = {}

  // Validate first name
  const firstNameValidation = validateName(data.firstName, 'First name')
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error!
  }

  // Validate last name
  const lastNameValidation = validateName(data.lastName, 'Last name')
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error!
  }

  // Validate email if provided
  if (data.email) {
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!
    }
  }

  // Validate phone if provided
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone)
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Generic field validation
export const validateField = (
  value: string,
  rules: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => boolean
  },
  fieldName: string = 'Field'
): { isValid: boolean; error?: string } => {
  if (rules.required && (!value || value.trim().length === 0)) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${rules.minLength} characters long`,
    }
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${rules.maxLength} characters long`,
    }
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: `${fieldName} format is invalid` }
  }

  if (value && rules.custom && !rules.custom(value)) {
    return { isValid: false, error: `${fieldName} is invalid` }
  }

  return { isValid: true }
}
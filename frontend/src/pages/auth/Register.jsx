/**
 * Register Page
 * User registration form with API integration
 */

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../../components/common';

// Validation schema
const registerSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().transform((val) => {
        if (!val) return val;
        // Remove all non-digit characters
        const cleaned = val.replace(/\D/g, '');
        // If it starts with 0 and is 10 digits (Philippine mobile), convert to +63
        if (cleaned.startsWith('0') && cleaned.length === 10) {
            return '+63' + cleaned.substring(1);
        }
        // If it's 9 digits (Philippine mobile without leading 0), add +63
        if (cleaned.length === 9) {
            return '+63' + cleaned;
        }
        // If it already has country code, keep as is
        if (cleaned.startsWith('63') && cleaned.length === 11) {
            return '+' + cleaned;
        }
        // Return original if already formatted or doesn't match patterns
        return val.startsWith('+') ? val : '+63' + cleaned;
    }),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const Register = () => {
    const { register: registerUser, isRegistering } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data) => {
        const { confirmPassword, ...userData } = data;
        registerUser(userData);
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sign up to get started with Smart City Lipa
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        placeholder="Juan"
                        error={errors.first_name?.message}
                        {...register('first_name')}
                    />

                    <Input
                        label="Last Name"
                        placeholder="Dela Cruz"
                        error={errors.last_name?.message}
                        {...register('last_name')}
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    placeholder="0912 345 6789 or 912 345 6789"
                    helperText="Philippine numbers will automatically be formatted with +63"
                    error={errors.phone?.message}
                    {...register('phone')}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <div className="flex items-start">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isRegistering}
                    disabled={isRegistering}
                >
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

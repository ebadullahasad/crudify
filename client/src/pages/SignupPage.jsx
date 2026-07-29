import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { signupSchema } from "../lib/validations";
import { useSignup } from "../hooks/useAuth";

export function SignupPage() {
  const { mutate: signup, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  return (
    <AuthLayout title="Create your account" subtitle="Get started with Crudify">
      <form
        onSubmit={handleSubmit((data) => signup(data))}
        className="space-y-4"
      >
        <Input
          label="Username"
          type="text"
          placeholder="ebadullah"
          autoComplete="username"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" size="lg" loading={isPending} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

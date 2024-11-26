import customFetch from "@/utils/customFetch";
import React from "react";
import { Form, useActionData } from "react-router-dom";
import img_bg from "../../assets/images/bg_signup.png";
import { Link } from "react-router-dom";
import { useNavigation } from "react-router-dom";
import { InputComponent } from "@/components/sharedComponents/FormRow";
import { toast } from "react-toastify";
export const signupAction = async ({ request }) => {
  const result = await request.formData();
  const user = Object.fromEntries(result);
  try {
    const response = await customFetch.post("auth/register", user);
    if (response.status === 201) {
      toast.success("Please check your email for verification");
    }
    return { success: response.data.msg };
  } catch (error) {
    console.log({ error })
    return { error: error?.response?.data?.msg || "An error occurred during signup." };
  }
};
const SignUp = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const data = useActionData();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 rounded-lg">
      <div className="bg-white shadow-xl max-w-6xl flex flex-col sm:flex-row">
        {/* Image Section - left Half */}
        <div className=" w-full sm:w-1/2 p-4 pt-12 flex flex-col justify-center items-center bg-gray-50">
          <h2 className="font-bold text-[2.5rem] text-[var(--gray--900)] text-center mb-4">
            SukoonSphere
          </h2>
          <p className=" text-center mb-6 max-w-[400px] text-[var(--grey--800)]">
            Join our community and start your journey towards peace, growth, and well-being today.
          </p>
          <img
            src={img_bg}
            alt="bg-mind-img"
            className="w-full max-w-[400px] object-cover"
          />
        </div>
        {/* Form Section - Right  Half */}
        <div className="w-full sm:w-1/2 p-4 flex flex-col justify-center items-center bg-[var(--primary)] sm:rounded-r-2xl">
          <div>
            <img src="https://cdn-icons-png.flaticon.com/512/4822/4822695.png" alt="logo" className="w-14  h-14" />
          </div>
          <Form
            method="post"
            className="flex flex-col gap-4 p-4 rounded-lg w-full max-w-[500px] mx-auto "
          >
            <h1 className="font-bold text-[var(--white-color)] text-center text-2xl">Signup </h1>
            {data?.success && (
              <p className="text-[var(--btn-secondary)] text-center">{data.success}</p>
            )}
            <p className="text-red-400 text-center">
              {data?.error && data.error.split(",")[0]}
            </p>
            <InputComponent type="name" name="name" placeholder="Enter your name.." />
            <InputComponent type="email" name="email" placeholder="Enter an email.." />
            <InputComponent type="password" name="password" placeholder="Enter password.." />

            <button type="submit" disabled={isSubmitting} className="btn-2 w-full ">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <Link to="/auth/sign-in" className="text-[var(--white-color)] text-center">
              Already have an account!
            </Link>
            <Link to="/user/forget-password" className="text-[var(--white-color)] text-center">
              Forget Password
            </Link>
          </Form>
        </div>


      </div>
    </div>
  );
};

export default SignUp;

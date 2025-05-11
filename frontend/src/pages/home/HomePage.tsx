import Container from "@/components/common/Container";
import {
  CustomButtonBlue,
  CustomButtonGray,
} from "@/components/common/CustomButton";
import GradientText from "@/components/common/GradientText";
import { IoLogIn, IoPersonAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <GradientText className="md:text-5xl text-3xl font-bold text-center tracking-wide max-w-4xl leading-[1.2] pb-0">
          Welcome to Linkify!
        </GradientText>
        <p className="text-gray-500 md:text-[16.5px] font-normal text-center max-w-2xl text-sm">
          Simplify your links and track their performance. Sign in or create an
          account to get started.
        </p>
        {/* Authentication Buttons */}
        <div className="flex space-x-4">
          <CustomButtonBlue
            navigateTo={() => navigate("/login")}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <IoLogIn />
            <span>Login</span>
          </CustomButtonBlue>
          <CustomButtonGray
            navigateTo={() => navigate("/register")}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <IoPersonAdd />
            <span>Sign Up</span>
          </CustomButtonGray>
        </div>
      </Container>
    </>
  );
}

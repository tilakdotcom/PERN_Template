import Container from "@/components/common/Container";
import UserSetting from "@/components/app-ui/UserSetting";

export default function UserPage() {
  return (
    <Container className="py-0 min-h-screen">
      {/* "user header" */}
      <div className="py-5">
        <UserSetting />
      </div>
    </Container>
  );
}

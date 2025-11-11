import { Redirect } from "expo-router";

export default function Index() {
  // Boot straight into the onboarding entry screen
  return <Redirect href="/(onboarding)/get-started" />;
}

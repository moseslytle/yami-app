import { AlertCircle, ArrowLeft, Home } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import {
  AnimatePresence,
  Button,
  Card,
  Circle,
  H1,
  H2,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from "tamagui";

export default function NotFoundScreen() {
  const router = useRouter();

  // Navigate back to home
  const handleGoHome = () => {
    router.dismissAll();
    router.replace("/");
  };

  // Navigate back in history
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <AnimatePresence>
      <YStack
        flex={1}
        bg="$background"
        justify="center"
        items="center"
        p="$4"
        space="$6"
      >
        {/* Animated Error Icon */}
        <YStack items="center" space="$4">
          <Circle
            size={120}
            bg="$red2"
            borderColor="$red6"
            borderWidth={2}
            justify="center"
            items="center"
            animation="quick"
            enterStyle={{
              opacity: 0,
              scale: 0.5,
            }}
            exitStyle={{
              opacity: 0,
              scale: 0.5,
            }}
          >
            <AlertCircle size={60} color="$red10" />
          </Circle>

          {/* 404 Text */}
          <YStack items="center" space="$2">
            <H1
              size="$12"
              color="$color12"
              fontWeight="900"
              letterSpacing={-2}
              animation="quick"
              enterStyle={{
                opacity: 0,
                y: 20,
              }}
              exitStyle={{
                opacity: 0,
                y: -20,
              }}
            >
              404
            </H1>
            <H2
              size="$8"
              color="$color11"
              fontWeight="600"
              text="center"
              animation="quick"
              enterStyle={{
                opacity: 0,
                y: 20,
              }}
              exitStyle={{
                opacity: 0,
                y: -20,
              }}
            >
              Page Not Found
            </H2>
          </YStack>
        </YStack>

        {/* Description Card */}
        <Card
          bordered
          elevate
          size="$4"
          maxW={400}
          width="100%"
          animation="bouncy"
          enterStyle={{
            opacity: 0,
            scale: 0.9,
            y: 30,
          }}
          exitStyle={{
            opacity: 0,
            scale: 0.9,
            y: -30,
          }}
        >
          <Card.Header>
            <YStack space="$3" items="center">
              <Paragraph
                size="$5"
                color="$color10"
                text="center"
                lineHeight="$2"
              >
                Oops! The page you're looking for doesn't exist or has been
                moved.
              </Paragraph>
              <Separator />
              <Paragraph
                size="$3"
                color="$color9"
                text="center"
                lineHeight="$1"
              >
                Don't worry, let's get you back on track!
              </Paragraph>
            </YStack>
          </Card.Header>
        </Card>

        {/* Action Buttons */}
        <YStack
          space="$3"
          width="100%"
          maxW={300}
          animation="quick"
          enterStyle={{
            opacity: 0,
            y: 40,
          }}
          exitStyle={{
            opacity: 0,
            y: -40,
          }}
        >
          {/* Primary Action - Go Home */}
          <Button
            size="$5"
            theme="blue"
            icon={Home}
            onPress={handleGoHome}
            rounded="$6"
            elevate
            pressStyle={{
              scale: 0.95,
            }}
            hoverStyle={{
              scale: 1.02,
            }}
          >
            Go to Home
          </Button>

          {/* Secondary Actions */}
          <XStack space="$3">
            <Button
              flex={1}
              size="$4"
              variant="outlined"
              icon={ArrowLeft}
              onPress={handleGoBack}
              rounded="$4"
              pressStyle={{
                scale: 0.98,
              }}
            >
              Go Back
            </Button>
          </XStack>
        </YStack>

        {/* Footer Text */}
        <YStack
          items="center"
          space="$2"
          mt="$8"
          animation="quick"
          enterStyle={{
            opacity: 0,
          }}
          exitStyle={{
            opacity: 0,
          }}
        >
          <Paragraph size="$2" color="$color8" text="center">
            Error Code: 404 - Route Not Found
          </Paragraph>
          <Paragraph size="$1" color="$color7" text="center">
            If you believe this is an error, please contact support
          </Paragraph>
        </YStack>
      </YStack>
    </AnimatePresence>
  );
}

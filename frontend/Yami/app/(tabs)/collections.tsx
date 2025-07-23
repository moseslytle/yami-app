// Created by Linus Xiong - Collections Page with Infinite Scroll
import { Plus } from '@tamagui/lucide-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H1,
  XStack
} from 'tamagui';
import CreateCollectionModal from '../../components/CreateCollectionModal';
import VerticalCollectionsList from '../../components/VerticalCollectionsList';

export default function CollectionsScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colorScheme === 'dark' ? '#111111' : '#FFFFFF',
      maxWidth: 500,
      alignSelf: 'center',
      width: '100%',
    }}>
      {/* Collections List - render first per expo-blur docs */}
              <View style={{ 
          flex: 1, 
          paddingTop: insets.top + 45,
        }}>
        <VerticalCollectionsList onCreateCollection={() => setShowCreateModal(true)} />
      </View>

      {/* Floating Header with Blur Effect - render after dynamic content */}
      <View 
        style={{
          position: 'absolute',
          top: insets.top + 10,
          left: 16,
          right: 16,
          zIndex: 100,
          pointerEvents: 'box-none',
        }}
      >
        <BlurView
          intensity={50}
          tint={colorScheme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight'}
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: 40,
            backgroundColor: colorScheme === 'dark' ? 'rgba(17, 17, 17, 0.8)' : 'rgba(248, 248, 248, 0.5)',
            shadowColor: colorScheme === 'dark' ? '#000' : '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: colorScheme === 'dark' ? 0.4 : 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <XStack 
            flex={1}
            justifyContent="space-between" 
            alignItems="center"
            // paddingVertical="$2"
            paddingHorizontal="$5"
          >
            <H1 
              color={colorScheme === 'dark' ? '#F5F5F5' : '#111111'} 
              textAlign="left"
              fontSize="$8"
              fontWeight="bold"
            >
              Collections
            </H1>
            <Button
              size="$4"
              circular
              backgroundColor="$brand"
              color="white"
              icon={Plus}
              onPress={() => setShowCreateModal(true)}
              pressStyle={{
                backgroundColor: "$brandPress",
                scale: 0.9,
              }}
              shadowColor="$brand"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={12}
              elevation={8}
            />
          </XStack>
        </BlurView>
      </View>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </View>
  );
} 
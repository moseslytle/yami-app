// Created 07/27/2025 By Linus Xiong - Add to Collection Modal Component
import { Check, ChevronDown, Plus, X } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import {
    Button,
    Dialog,
    ScrollView,
    Spinner,
    Text,
    Unspaced,
    XStack,
    YStack
} from 'tamagui';
import { useCreateCollectionItem } from '../hooks/useCollectionItems';
import { useUserCollections } from '../hooks/useCollections';

interface Collection {
  id: number;
  title: string;
  description?: string;
}

interface AddToCollectionModalProps {
  providerId: number;
  providerName: string;
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Custom Collection Picker Component
function CollectionPicker({ 
  collections, 
  selectedValue, 
  onValueChange, 
  placeholder = "Choose a collection..." 
}: {
  collections: Collection[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCollection = collections.find(c => c.id.toString() === selectedValue);

  return (
    <YStack gap="$2">
      {/* Trigger Button */}
      <Button
        onPress={() => setIsOpen(!isOpen)}
        justifyContent="space-between"
        borderWidth={1}
        borderColor="$borderColor"
        backgroundColor="$background"
        paddingHorizontal="$3"
        paddingVertical="$3"
        iconAfter={ChevronDown}
      >
        <Text color={selectedCollection ? "$color" : "$colorPress"}>
          {selectedCollection ? selectedCollection.title : placeholder}
        </Text>
      </Button>

      {/* Dropdown Options */}
      {isOpen && (
        <YStack
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          maxHeight={200}
          shadowColor="$shadowColor"
          shadowRadius={4}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
        >
          <ScrollView maxHeight={200}>
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                onPress={() => {
                  onValueChange(collection.id.toString());
                  setIsOpen(false);
                }}
              >
                <XStack
                  padding="$3"
                  borderBottomWidth={1}
                  borderBottomColor="$borderColor"
                  alignItems="center"
                  backgroundColor={selectedValue === collection.id.toString() ? "$backgroundHover" : "$background"}
                  hoverStyle={{
                    backgroundColor: "$backgroundHover"
                  }}
                >
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="500">
                      {collection.title}
                    </Text>
                    {collection.description && (
                      <Text fontSize="$2" color="$colorPress">
                        {collection.description}
                      </Text>
                    )}
                  </YStack>
                  {selectedValue === collection.id.toString() && (
                    <Check size={16} color="$brand" />
                  )}
                </XStack>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </YStack>
      )}
    </YStack>
  );
}

export function AddToCollectionModal({
  providerId,
  providerName,
  isVisible,
  onClose,
  onSuccess,
}: AddToCollectionModalProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');

  const { data: collections = [], isLoading: collectionsLoading } = useUserCollections(true);
  const createCollectionItem = useCreateCollectionItem();

  const handleAddToCollection = async () => {
    if (!selectedCollectionId) {
      Alert.alert('Error', 'Please select a collection');
      return;
    }

    try {
      await createCollectionItem.mutateAsync({
        collection_id: parseInt(selectedCollectionId),
        provider_id: providerId,
      });

      Alert.alert(
        'Success',
        `${providerName} has been added to your collection!`,
        [{ text: 'OK', onPress: onSuccess }]
      );
      
      // Reset form and close
      setSelectedCollectionId('');
      onClose();
    } catch (error: any) {
      console.error('Failed to add to collection:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        Alert.alert(
          'Already Added', 
          `${providerName} is already in this collection. You cannot add the same provider twice.`
        );
      } else if (error.response?.status === 422) {
        Alert.alert('Error', 'This provider is already in the selected collection');
      } else {
        Alert.alert('Error', 'Failed to add provider to collection. Please try again.');
      }
    }
  };

  const selectedCollection = collections.find((c: Collection) => c.id.toString() === selectedCollectionId);

  return (
    <Dialog modal open={isVisible} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadow6"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            bordered
            paddingVertical="$4"
            paddingHorizontal="$6"
            elevate
            borderRadius="$6"
            key="content"
            animateOnly={['transform', 'opacity']}
            animation={[
              'quicker',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: 20, opacity: 0 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            minWidth={320}
            maxWidth={420}
          >
            <Dialog.Title>Add to Collection</Dialog.Title>
            
            <Dialog.Description>
              Add "{providerName}" to one of your collections
            </Dialog.Description>

            <YStack gap="$4">
              {/* Collection Selector */}
              <YStack gap="$2" position="relative">
                <Text fontWeight="500">Select Collection</Text>
                {collectionsLoading ? (
                  <XStack alignItems="center" gap="$2" padding="$3">
                    <Spinner size="small" />
                    <Text>Loading collections...</Text>
                  </XStack>
                ) : collections.length === 0 ? (
                  <Text color="$colorPress" padding="$3">
                    No collections found. Create a collection first.
                  </Text>
                ) : (
                  <CollectionPicker
                    collections={collections}
                    selectedValue={selectedCollectionId}
                    onValueChange={setSelectedCollectionId}
                    placeholder="Choose a collection..."
                  />
                )}
              </YStack>

              {/* Display selected collection info */}
              {selectedCollection && (
                <YStack
                  padding="$3"
                  backgroundColor="$backgroundHover"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Text fontSize="$3" fontWeight="500" color="$brand">
                    Selected: {selectedCollection.title}
                  </Text>
                  {selectedCollection.description && (
                    <Text fontSize="$2" color="$colorPress">
                      {selectedCollection.description}
                    </Text>
                  )}
                </YStack>
              )}
            </YStack>

            {/* Action Buttons */}
            <XStack alignSelf="flex-end" gap="$4">
              <Dialog.Close asChild>
                <Button
                  variant="outlined"
                  borderColor="$borderColor"
                  color="$color"
                  disabled={createCollectionItem.isPending}
                >
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                theme="accent"
                disabled={!selectedCollectionId || createCollectionItem.isPending}
                onPress={handleAddToCollection}
                icon={createCollectionItem.isPending ? undefined : Plus}
              >
                {createCollectionItem.isPending ? (
                  <XStack alignItems="center" gap="$2">
                    <Spinner size="small" color="white" />
                    <Text color="white">Adding...</Text>
                  </XStack>
                ) : (
                  'Add to Collection'
                )}
              </Button>
            </XStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button 
                  position="absolute" 
                  right="$4"
                  top="$4"
                  size="$2" 
                  circular 
                  icon={X} 
                />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  );
} 
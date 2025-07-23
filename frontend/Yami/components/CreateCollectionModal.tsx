// Created 07/22/2025 by Linus Xiong - Create Collection Sheet Modal
import { ChevronDown } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import {
    Button,
    Fieldset,
    H2,
    Input,
    Label,
    Sheet,
    Switch,
    TextArea,
    XStack,
    YStack,
} from 'tamagui';
import { useCreateCollection } from '../hooks/useCollections';

interface CreateCollectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCollectionModal({ open, onOpenChange }: CreateCollectionSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const createCollectionMutation = useCreateCollection();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      await createCollectionMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
      });
      
      // Reset form and close sheet
      setTitle('');
      setDescription('');
      setIsPublic(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsPublic(false);
    onOpenChange(false);
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[65, 45]}
      snapPointsMode="percent"
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
      moveOnKeyboardChange={true}
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="rgba(0,0,0,0.5)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      
      <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background" borderRadius="$8">
        {/* Header with close button */}
        <XStack justifyContent="center" alignItems="center" marginBottom="$2" position="relative">
          <H2 color="$color12">Create New Collection</H2>
          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={handleCancel}
            backgroundColor="$color3"
            color="$color11"
            pressStyle={{ backgroundColor: "$color4" }}
            position="absolute"
            right={0}
          />
        </XStack>

        {/* Form Content */}
        <YStack gap="$3" flex={1}>
          <Fieldset gap="$2">
            <Label htmlFor="title" color="$color12" fontWeight="600" fontSize="$5">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter collection title"
              value={title}
              onChangeText={setTitle}
              size="$4"
              numberOfLines={1}
              borderColor="$color6"
              focusStyle={{ borderColor: "$brand" }}
              verticalAlign="center"
              autoFocus={false}
            />
          </Fieldset>

          <Fieldset gap="$2">
            <Label htmlFor="description" color="$color12" fontWeight="600" fontSize="$5">
              Description
            </Label>
            <TextArea
              id="description"
              placeholder="Describe your collection..."
              value={description}
              onChangeText={setDescription}
              numberOfLines={4}
              size="$4"
              borderColor="$color6"
              focusStyle={{ borderColor: "$brand" }}
              verticalAlign="top"
              autoFocus={false}
            />
          </Fieldset>

          <Fieldset>
            <XStack alignItems="center" justifyContent="space-between">
              <Label htmlFor="public" color="$color12" fontWeight="600" fontSize="$3">
                Make Public
              </Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                size="$3"
                backgroundColor={isPublic ? "$brand" : "$color6"}
              >
                <Switch.Thumb animation="quicker" />
              </Switch>
            </XStack>
          </Fieldset>

          {/* Action Buttons */}
          <XStack gap="$3" marginTop="$3">
            <Button
              flex={1}
              variant="outlined"
              onPress={handleCancel}
              disabled={createCollectionMutation.isPending}
              borderColor="$color6"
              color="$color11"
              pressStyle={{ backgroundColor: "$color3" }}
              size="$4"
            >
              Cancel
            </Button>

            <Button
              flex={2}
              onPress={handleSubmit}
              disabled={!title.trim() || createCollectionMutation.isPending}
              opacity={!title.trim() ? 0.5 : 1}
              backgroundColor="$brand"
              color="white"
              pressStyle={{ backgroundColor: "$brandPress" }}
              fontWeight="600"
              size="$4"
            >
              {createCollectionMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}

export default CreateCollectionModal;
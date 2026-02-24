import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PropertyCard } from '@/components/shared/PropertyCard';

export default function ScheduleViewingScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { properties, scheduleViewing, isLoading } = useStore();

  const property = properties.find((p) => p.id === propertyId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');

  if (!property) {
    return null;
  }

  const timeSlots = [
    { id: '09:00', label: '9:00 AM', available: true },
    { id: '10:00', label: '10:00 AM', available: true },
    { id: '11:00', label: '11:00 AM', available: false },
    { id: '14:00', label: '2:00 PM', available: true },
    { id: '15:00', label: '3:00 PM', available: true },
    { id: '16:00', label: '4:00 PM', available: true },
  ];

  const handleSchedule = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const viewingDateTime = new Date(selectedDate);
    viewingDateTime.setHours(selectedTime.getHours());
    viewingDateTime.setMinutes(selectedTime.getMinutes());

    try {
      await scheduleViewing(propertyId, viewingDateTime, notes);
      Alert.alert(
        'Success',
        'Your viewing has been scheduled! The seller will confirm shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule viewing. Please try again.');
    }
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setSelectedDate(date);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && time) {
      setSelectedTime(time);
      if (Platform.OS === 'ios') {
        setShowTimePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, paddingTop: insets.top + 16 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Schedule Viewing
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Property Preview */}
        <View style={styles.section}>
          <PropertyCard property={property} variant="horizontal" />
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select Date
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
            }}
            style={[styles.dateButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>
              {formatDate(selectedDate)}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
              textColor={colors.text}
            />
          )}
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select Time
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTimePicker(true);
            }}
            style={[styles.dateButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name="time" size={24} color={colors.primary} />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>
              {formatTime(selectedTime)}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              textColor={colors.text}
            />
          )}
        </View>

        {/* Available Time Slots */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Time Slots
          </Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                disabled={!slot.available}
                onPress={() => {
                  const [hours, minutes] = slot.id.split(':');
                  const newTime = new Date(selectedTime);
                  newTime.setHours(parseInt(hours));
                  newTime.setMinutes(parseInt(minutes));
                  setSelectedTime(newTime);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor: slot.available
                      ? colors.card
                      : colors.backgroundTertiary,
                    borderColor:
                      formatTime(selectedTime) === slot.label
                        ? colors.primary
                        : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    {
                      color: slot.available
                        ? colors.text
                        : colors.textTertiary,
                    },
                  ]}
                >
                  {slot.label}
                </Text>
                {!slot.available && (
                  <Text
                    style={[
                      styles.unavailableText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Booked
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Additional Notes (Optional)
          </Text>
          <Input
            placeholder="Any special requests or questions..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.notesInput}
          />
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              The seller will receive your viewing request and confirm the
              appointment within 24 hours.
            </Text>
          </View>
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <Button
          title="Confirm Viewing"
          onPress={handleSchedule}
          variant="primary"
          icon="checkmark-circle"
          loading={isLoading}
          style={styles.confirmButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableText: {
    fontSize: 11,
    marginTop: 4,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoCard: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  confirmButton: {
    width: '100%',
  },
});
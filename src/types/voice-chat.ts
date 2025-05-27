
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface VoiceChatProps {
  isListening: boolean;
  onToggleListening: () => void;
  onBookingRequest: () => void;
}

export interface BookingRequirements {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: string;
  passengerName: string;
}

export interface BookingField {
  key: keyof BookingRequirements;
  question: string;
}

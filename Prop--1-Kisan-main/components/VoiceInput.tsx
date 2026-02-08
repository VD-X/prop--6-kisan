import React, { useState, useEffect, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, className = "", placeholder = "Tap to speak..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      // Stop the running instance
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    try {
      // Type definition for Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-IN'; // Default to Indian English, can be localized
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        // Ignore 'aborted' error which happens when we stop manually or click fast
        if (event.error !== 'aborted') {
          console.error("Speech recognition error", event.error);
        }
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error("Failed to start recognition", e);
      setIsListening(false);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse border-red-200' 
          : 'bg-nature-100 text-nature-700 hover:bg-nature-200 border-nature-200'
      } border ${className}`}
      title={isListening ? "Listening..." : "Tap to speak"}
    >
      {isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export default VoiceInput;
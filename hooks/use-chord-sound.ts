import {
  CHORD_DEFINITIONS,
  INDEX_TO_NOTE,
  NOTE_TO_INDEX,
} from '@/constants/chord-constants';
import { Instrument, Octave } from '@/entities/chord-types';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useChordSound() {
  const [isArpeggio, setIsArpeggio] = useState(false);
  const [instrument, setInstrument] = useState<Instrument>('piano');
  const [octave, setOctave] = useState<Octave>('3');
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const getChordNotesFromServer = async (): Promise<string[]> => {
    try {
      const { data } = await axios.get('/api/chord/notes');

      if (!data.success) {
        throw new Error(data.error);
      }

      const { note, type } = data;

      if (!CHORD_DEFINITIONS[type as keyof typeof CHORD_DEFINITIONS]) {
        return [note];
      }

      const rootIndex = NOTE_TO_INDEX[note as keyof typeof NOTE_TO_INDEX];
      if (rootIndex === undefined) return [note];

      return CHORD_DEFINITIONS[type as keyof typeof CHORD_DEFINITIONS].map(
        interval => {
          const noteIndex = (rootIndex + interval) % 12;
          return INDEX_TO_NOTE[noteIndex];
        },
      );
    } catch (error) {
      console.error('Erro ao obter notas do acorde:', error);
      toast.error('Erro ao obter notas do acorde');
      return [];
    }
  };

  const playChordSound = async (forceArpeggio?: boolean) => {
    try {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });

      const chordNotes = await getChordNotesFromServer();
      if (chordNotes.length === 0) return;

      const audioElements = chordNotes.map(note => {
        const noteFile = note.replace('#', 's');
        const audio = new Audio(
          `/sounds/${instrument}/${noteFile}${octave}.mp3`,
        );
        audio.volume = 0.7;
        return audio;
      });

      audioRefs.current = audioElements;

      const playAsArpeggio =
        forceArpeggio !== undefined ? forceArpeggio : isArpeggio;

      if (playAsArpeggio) {
        let delay = 0;
        audioElements.forEach(audio => {
          setTimeout(() => {
            audio.play().catch(err => {
              console.error('Erro ao tocar áudio:', err);
              toast.error('Algo deu errado.');
            });
          }, delay);
          delay += 200;
        });
      } else {
        audioElements.forEach(audio => {
          audio.play().catch(err => {
            console.error('Erro ao tocar áudio:', err.message);
            toast.error('Algo deu errado.');
          });
        });
      }
    } catch (error) {
      console.error('Erro ao tocar som:', error);
      toast.error('Erro ao tocar som.');
    }
  };

  return {
    isArpeggio,
    instrument,
    octave,
    setIsArpeggio,
    setInstrument,
    setOctave,
    playChordSound,
  };
}

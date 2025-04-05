import { getChordNotes } from '@/app/(home)/_actions/chord-actions';
import {
  CHORD_DEFINITIONS,
  INDEX_TO_NOTE,
  NOTE_TO_INDEX,
} from '@/constants/chord-constants';
import { Instrument, Octave } from '@/entities/chord-types';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useChordSound() {
  const [isArpeggio, setIsArpeggio] = useState(false);
  const [instrument, setInstrument] = useState<Instrument>('piano');
  const [octave, setOctave] = useState<Octave>('3');
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const getChordNotesFromServer = async (): Promise<string[]> => {
    try {
      const result = await getChordNotes();

      if (!result.success) {
        throw new Error(result.error);
      }

      const { note, type } = result;

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

  const playChordSound = async () => {
    try {
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

      if (isArpeggio) {
        let delay = 0;
        audioElements.forEach(audio => {
          setTimeout(() => {
            audio.play().catch(err => {
              console.error('Erro ao tocar áudio:', err);
              toast.error(`Erro ao tocar áudio: ${err.message}`);
            });
          }, delay);
          delay += 200;
        });
      } else {
        audioElements.forEach(audio => {
          audio.play().catch(err => {
            console.error('Erro ao tocar áudio:', err);
            toast.error(`Erro ao tocar áudio: ${err.message}`);
          });
        });
      }

      toast.success(isArpeggio ? 'Tocando arpejo...' : 'Tocando acorde...');
    } catch (error) {
      console.error('Erro ao tocar som:', error);
      toast.error('Erro ao tocar som');
    }
  };

  return {
    isArpeggio,
    setIsArpeggio,
    instrument,
    setInstrument,
    octave,
    setOctave,
    playChordSound,
  };
}

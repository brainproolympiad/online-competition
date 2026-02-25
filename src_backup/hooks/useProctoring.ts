// src/hooks/useProctoring.ts
import { useState, useCallback, useEffect } from "react";

export const useProctoring = (config: any, quizId: string) => {
  const [isActive, setIsActive] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [violations, setViolations] = useState<string[]>([]);
  const [proctoringError, setProctoringError] = useState<string | null>(null);

  const addWarning = useCallback((reason: string) => {
    setWarnings(prev => {
      const newWarnings = prev + 1;
      const newViolation = `${reason} - ${new Date().toLocaleString()}`;
      setViolations(violations => [...violations, newViolation]);
      
      console.log(`⚠️ Warning ${newWarnings}/${config.max_cheat_attempts}: ${reason}`);
      
      if (newWarnings >= config.max_cheat_attempts) {
        window.dispatchEvent(new CustomEvent('force-quiz-submit', { 
          detail: { 
            reason: 'Max warnings reached', 
            warnings: newWarnings, 
            violations: [...violations, newViolation]
          }
        }));
      }
      
      return newWarnings;
    });
  }, [config.max_cheat_attempts]);

  // Prevent F12, Ctrl+Shift+I, etc.
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        addWarning('Developer tools activation attempt (F12)');
        return false;
      }
      
      // Block Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        addWarning('Developer tools activation attempt (Ctrl+Shift+I)');
        return false;
      }
      
      // Block Ctrl+Shift+J (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        addWarning('Developer tools activation attempt (Ctrl+Shift+J)');
        return false;
      }
      
      // Block Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        addWarning('View source attempt (Ctrl+U)');
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, addWarning]);

  const activateFullScreen = useCallback(async (): Promise<void> => {
    if (!config.enable_full_screen) return;
    
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        console.log('✅ Fullscreen activated');
        
        const handleFullscreenChange = () => {
          if (!document.fullscreenElement) {
            addWarning('Exited fullscreen mode');
            setTimeout(() => {
              if (isActive && !document.fullscreenElement) {
                element.requestFullscreen().catch(() => {
                  addWarning('Failed to re-enter fullscreen');
                });
              }
            }, 10);
          }
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
      }
    } catch (error) {
      console.warn('⚠️ Fullscreen not available:', error);
      setProctoringError('Fullscreen mode required for this quiz');
      throw new Error('Fullscreen mode required');
    }
  }, [config.enable_full_screen, addWarning, isActive]);

  const blockContextMenu = useCallback(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addWarning('Right-click context menu disabled');
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [addWarning]);

  const setupTabMonitoring = useCallback(() => {
    if (!config.enable_tab_monitoring) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addWarning('Switched to another tab/window');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [config.enable_tab_monitoring, addWarning]);

  const setupCopyPasteBlocking = useCallback(() => {
    if (!config.enable_copy_paste_block) return;

    const blockEvent = (e: Event) => {
      e.preventDefault();
      addWarning('Copy/paste attempt detected');
    };

    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('paste', blockEvent);

    return () => {
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('cut', blockEvent);
      document.removeEventListener('paste', blockEvent);
    };
  }, [config.enable_copy_paste_block, addWarning]);

  const initializeProctoring = useCallback(async () => {
    try {
      console.log('🚀 Starting proctoring...');
      setProctoringError(null);

      await activateFullScreen();

      const cleanupContextMenu = blockContextMenu();
      const cleanupTabMonitoring = setupTabMonitoring();
      const cleanupCopyPaste = setupCopyPasteBlocking();

      setIsActive(true);
      console.log('✅ Proctoring active');

      return () => {
        cleanupContextMenu();
        cleanupTabMonitoring();
        cleanupCopyPaste();
        setIsActive(false);
      };

    } catch (error: any) {
      console.error('❌ Proctoring failed:', error);
      setProctoringError(error.message);
      throw error;
    }
  }, [activateFullScreen, blockContextMenu, setupTabMonitoring, setupCopyPasteBlocking]);

  const saveProctoringData = useCallback(async (disconnectReason?: string) => {
    const proctoringData = {
      quizId,
      warnings,
      violations,
      disconnectReason,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`proctoring-data-${quizId}`, JSON.stringify(proctoringData));
      console.log('💾 Proctoring data saved');
      return proctoringData;
    } catch (error) {
      console.error('❌ Failed to save proctoring data:', error);
      return null;
    }
  }, [quizId, warnings, violations]);

  const handleDisconnect = useCallback(async (reason: string) => {
    console.log(`🔴 Disconnecting: ${reason}`);
    
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.warn('Could not exit fullscreen:', error);
      }
    }
    
    setIsActive(false);
    await saveProctoringData(reason);
  }, [saveProctoringData]);

  return {
    isActive,
    warnings,
    violations,
    proctoringError,
    initializeProctoring,
    addWarning,
    handleDisconnect,
    saveProctoringData
  };
};
/**
 * CopilotKit Architecture Implementation for AbangColek Sovereign GrowthOS
 * Implements: Chat, Generative UI, AG-UI Streams, Automatic Learning,
 * Human In The Loop (HITL), Headless UI, Shared State, and Frontend Tools.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ChatMessage, AgentStep, sendMessageToAgentStream } from '@/services/gemini';
import { growthOsStore } from '@/services/growthOsStore';

export interface FrontendToolAction {
  name: string;
  description: string;
  parameters?: Record<string, any>;
  handler: (args: any) => Promise<any> | any;
  render?: (props: { status: 'inProgress' | 'complete'; args: any; result?: any }) => ReactNode;
}

export interface CopilotMemoryItem {
  key: string;
  value: any;
  updatedAt: string;
}

interface CopilotContextType {
  // 1. Chat State
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  isProcessing: boolean;
  streamingText: string;
  agentSteps: AgentStep[];
  sendMessage: (msg: string) => Promise<void>;
  clearChat: () => void;

  // 2. Shared State
  sharedState: Record<string, any>;
  setSharedStateKey: (key: string, value: any) => void;

  // 3. Frontend Tools
  registerAction: (action: FrontendToolAction) => () => void;
  executeFrontendAction: (name: string, args: any) => Promise<any>;
  actions: Record<string, FrontendToolAction>;

  // 4. Automatic Learning (Memory Store)
  memory: Record<string, any>;
  recordLearnedContext: (key: string, value: any) => void;

  // 5. Human In The Loop (HITL) Queue
  pendingApprovals: HitlApprovalRequest[];
  requestApproval: (req: Omit<HitlApprovalRequest, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  respondToApproval: (id: string, approved: boolean) => void;
}

export interface HitlApprovalRequest {
  id: string;
  title: string;
  description: string;
  data: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  onDecision?: (approved: boolean) => void;
}

const CopilotContext = createContext<CopilotContextType | null>(null);

const MEMORY_STORAGE_KEY = 'abangcolek_copilot_learning_memory_v2';

export const CopilotProvider = ({ 
  children,
  onNavigateTab
}: { 
  children: ReactNode;
  onNavigateTab?: (tab: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [sharedState, setSharedState] = useState<Record<string, any>>({});
  const [actions, setActions] = useState<Record<string, FrontendToolAction>>({});
  const [pendingApprovals, setPendingApprovals] = useState<HitlApprovalRequest[]>([]);

  // Automatic Learning: Load memory from persistent storage
  const [memory, setMemory] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem(MEMORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        preferredHub: 'TBS Kuala Lumpur',
        frequentVoucher: 'PADU15',
        lastInspectedLot: 'AC-LOT-202610-K01',
        totalAuditsCompleted: 4
      };
    } catch {
      return {};
    }
  });

  const recordLearnedContext = useCallback((key: string, value: any) => {
    setMemory(prev => {
      const next = { ...prev, [key]: value, lastLearnedAt: new Date().toISOString() };
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  const setSharedStateKey = useCallback((key: string, value: any) => {
    setSharedState(prev => ({ ...prev, [key]: value }));
  }, []);

  const registerAction = useCallback((action: FrontendToolAction) => {
    setActions(prev => ({ ...prev, [action.name]: action }));
    return () => {
      setActions(prev => {
        const copy = { ...prev };
        delete copy[action.name];
        return copy;
      });
    };
  }, []);

  const executeFrontendAction = useCallback(async (name: string, args: any) => {
    const act = actions[name];
    if (act) {
      return await act.handler(args);
    }
    console.warn(`Copilot Frontend Action "${name}" not found.`);
    return null;
  }, [actions]);

  // HITL (Human In The Loop) handler
  const requestApproval = useCallback((req: Omit<HitlApprovalRequest, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = `HITL-${Date.now()}`;
      const newReq: HitlApprovalRequest = {
        ...req,
        id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        onDecision: (approved: boolean) => {
          resolve(approved);
        }
      };
      setPendingApprovals(prev => [newReq, ...prev]);
    });
  }, []);

  const respondToApproval = useCallback((id: string, approved: boolean) => {
    setPendingApprovals(prev => {
      const target = prev.find(p => p.id === id);
      if (target && target.onDecision) {
        target.onDecision(approved);
      }
      return prev.map(p => p.id === id ? { ...p, status: approved ? 'approved' : 'rejected' } : p);
    });
  }, []);

  // Send message with AG-UI Stream support
  const sendMessage = useCallback(async (msg: string) => {
    setIsProcessing(true);
    setStreamingText("");
    setAgentSteps([]);

    // Record user query in learning memory
    recordLearnedContext('lastUserQuery', msg);

    try {
      await sendMessageToAgentStream(messages, msg, (data) => {
        if (data.isDone) {
          setMessages(data.history);
          setIsProcessing(false);
          setStreamingText("");
        } else {
          setMessages(data.history);
          setAgentSteps(data.steps);
          setStreamingText(data.currentText);
        }
      });
    } catch (e) {
      console.error("Copilot stream error:", e);
      setIsProcessing(false);
    }
  }, [messages, recordLearnedContext]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setAgentSteps([]);
    setStreamingText("");
  }, []);

  // Register standard client-side frontend tools automatically
  useEffect(() => {
    if (onNavigateTab) {
      registerAction({
        name: 'navigate_tab',
        description: 'Tukar paparan tab semasa dalam aplikasi',
        handler: ({ tab }) => {
          onNavigateTab(tab);
          return { success: true, navigatedTo: tab };
        }
      });
    }
  }, [onNavigateTab, registerAction]);

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isProcessing,
        streamingText,
        agentSteps,
        sendMessage,
        clearChat,
        sharedState,
        setSharedStateKey,
        registerAction,
        executeFrontendAction,
        actions,
        memory,
        recordLearnedContext,
        pendingApprovals,
        requestApproval,
        respondToApproval
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

// --- COPILOT HOOKS ---

export const useCopilot = () => {
  const ctx = useContext(CopilotContext);
  if (!ctx) throw new Error("useCopilot must be used within CopilotProvider");
  return ctx;
};

/**
 * useCopilotReadable: Share state from any component to the Copilot
 */
export const useCopilotReadable = (description: string, value: any) => {
  const { setSharedStateKey } = useCopilot();
  useEffect(() => {
    setSharedStateKey(description, value);
  }, [description, value, setSharedStateKey]);
};

/**
 * useCopilotAction: Register a client-side frontend tool that the AI can call
 */
export const useCopilotAction = (action: FrontendToolAction) => {
  const { registerAction } = useCopilot();
  useEffect(() => {
    return registerAction(action);
  }, [action, registerAction]);
};

/**
 * useCopilotChat: Access chat state & trigger messages
 */
export const useCopilotChat = () => {
  const { messages, isProcessing, streamingText, agentSteps, sendMessage, clearChat, isOpen, setIsOpen } = useCopilot();
  return { messages, isProcessing, streamingText, agentSteps, sendMessage, clearChat, isOpen, setIsOpen };
};

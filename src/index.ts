import type { Plugin, PluginInput } from '@opencode-ai/plugin';
import type { Part } from '@opencode-ai/sdk';
import clipboardy from 'clipboardy';

const COMMAND = 'clip';

async function copyLastMessage(sessionID: string, client: PluginInput['client']): Promise<string> {
  try {
    // Get session messages to find the last assistant response
    const messagesResponse = await client.session.messages({
      path: { id: sessionID },
    });

    const allMessages = Array.isArray(messagesResponse)
      ? messagesResponse
      : (messagesResponse?.data ?? []);

    // Find the last assistant message
    let lastAssistantMessage: (typeof allMessages)[number] | undefined;

    for (let i = allMessages.length - 1; i >= 0; i--) {
      const msg = allMessages[i];
      if (msg.info?.role === 'assistant') {
        lastAssistantMessage = msg;
        break;
      }
    }

    if (!lastAssistantMessage) {
      await client.tui.showToast({
        body: {
          title: 'Nothing to copy',
          message: 'No AI response found to copy',
          variant: 'warning',
          duration: 3000,
        },
      });
      return 'No assistant message found to copy';
    }

    const assistantContent = (lastAssistantMessage.parts ?? [])
      .map((part: Part) => (part.type === 'text' ? (part.text ?? '') : ''))
      .filter(Boolean)
      .join('\n');

    // Copy to clipboard
    await clipboardy.write(assistantContent);

    // Show success notification
    await client.tui.showToast({
      body: {
        title: 'Copied to clipboard',
        message: `Copied ${assistantContent.length} characters`,
        variant: 'success',
        duration: 3000,
      },
    });

    return `✓ Copied ${assistantContent.length} characters to clipboard`;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await client.tui.showToast({
      body: {
        title: 'Copy failed',
        message: errorMsg,
        variant: 'error',
        duration: 5000,
      },
    });
    return `Copy failed: ${errorMsg}`;
  }
}

export const ClipPlugin: Plugin = async ({ client }: PluginInput) => {
  return {
    async config(config) {
      // Register the command
      config.command = config.command ?? {};
      config.command[COMMAND] = {
        description: 'Copy the last AI response to clipboard',
        template: `This is a UI command to copy the previous assistant message to the clipboard.

**CRITICAL INSTRUCTION**: Do not analyze, think about, or respond to the command itself. Simply acknowledge with "✓ Copied" and stop.

- DO NOT ask what the user wants to copy
- DO NOT explain what "${COMMAND}" means
- DO NOT look for files or perform any actions
- DO NOT Respond with anything other than "✓ Copied"

This command has already been processed by the system. Just confirm it worked. Respond with "✓ Copied".

Please acknowledge: **✓ Copied**`,
      };
    },

    // Handle the command execution
    'command.execute.before': async (input: {
      command: string;
      sessionID: string;
      arguments: string;
    }) => {
      // Only handle clip command
      if (input.command !== COMMAND) return;

      await copyLastMessage(input.sessionID, client);
    },
  };
};

export default ClipPlugin;

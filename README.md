# opencode-clip

Copy the last AI response to clipboard

> An OpenCode plugin created from the [bun-module](https://github.com/zenobi-us/bun-module) template

## Description

This OpenCode plugin provides a `/clip` command that copies the last AI assistant response to your clipboard with a single command.

## Installation

### Via npm

```bash
npm install opencode-clip
```

### Via OpenCode

Add the plugin to your OpenCode configuration:

```bash
# In your opencode project directory
opencode plugin add opencode-clip
```

Or manually add to your `opencode.json`:

```json
{
  "plugins": [
    "opencode-clip"
  ]
}
```

## Usage

Once installed, you can use the `/clip` command in any OpenCode session:

```
/clip
```

This will:
1. Find the last AI assistant message in the current session
2. Copy its text content to your clipboard
3. Show a success toast notification with the character count

### Example

```
User: Write a function to calculate factorial
AI: Here's a factorial function in JavaScript...

User: /clip
AI: ✓ Copied
```

The AI response is now in your clipboard and ready to paste.

## Development

### Prerequisites

- [Bun](https://bun.sh) 1.3.2 or later
- [mise](https://mise.jdx.dev) (optional, for task running)

### Setup

```bash
bun install
```

### Build

```bash
# With mise
mise run build

# Or directly with bun
bun build ./src/index.ts --outdir dist --target bun
npx tsc --project tsconfig.build.json
```

### Test

```bash
mise run test
```

### Lint

```bash
mise run lint
mise run lint:fix
```

### Format

```bash
mise run format
```

## Release

See the [RELEASE.md](RELEASE.md) file for instructions on how to release a new version of the plugin.

## How It Works

The plugin hooks into OpenCode's command system and:

1. **Registers** a `/clip` command with a template that tells the AI not to process the command text
2. **Intercepts** the command execution via the `command.execute.before` hook
3. **Fetches** session messages to find the most recent assistant response
4. **Copies** the text content to clipboard using `clipboardy`
5. **Notifies** the user with a toast notification (success, warning, or error)

## Contributing

Contributions are welcome! Please file issues or submit pull requests on the [GitHub repository](https://github.com/gerkirill/opencode-clip).

## License

See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Created with the [bun-module](https://github.com/zenobi-us/bun-module) template
- Built for [OpenCode](https://opencode.ai)

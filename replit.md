# Overview

This is a Discord bot application built with Node.js using the Discord.js v14 library. The bot is **fully deployed and operational**, providing slash commands for user interaction and server information. It includes styled welcome messages with embeds for new members and an Express.js server to keep the bot alive in hosted environments.

**Current Status**: Bot is online and connected to Discord servers with all slash commands functioning properly.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Bot Framework
- **Discord.js v14**: Modern Discord API wrapper providing comprehensive bot functionality
- **Slash Commands**: Uses Discord's native slash command system for user interactions
- **Gateway Intents**: Configured with Guilds and GuildMembers intents for basic operations and member events

## Server Management
- **Express.js Keep-Alive Server**: Lightweight HTTP server running on port 5000 to prevent the bot from sleeping in hosted environments
- **Single-File Architecture**: All bot logic contained in `bot.js` for simplicity

## Command System
- **Slash Command Registration**: Automated registration of commands with Discord API
- **Built-in Commands**: 
  - `/ping` - Basic connectivity test
  - `/info` - Bot information display
  - `/hello` - User greeting
  - `/server` - Server statistics and information

## Event Handling
- **Ready Event**: Bot initialization and status logging
- **Member Events**: Prepared for welcome message functionality (requires privileged intent activation)

## Configuration Approach
- **Environment-based**: Bot token and configuration expected through environment variables
- **Intent Management**: Explicit intent configuration with guidance for privileged intents

# External Dependencies

## Core Libraries
- **discord.js (^14.22.1)**: Primary Discord API interaction library
- **express (^5.1.0)**: Web server framework for keep-alive functionality

## Discord Platform
- **Discord Developer Portal**: Required for bot application management and token generation
- **Discord Gateway**: Real-time event streaming from Discord servers
- **Discord REST API**: HTTP-based API for command registration and data retrieval

## Hosting Considerations
- **Environment Variables**: Bot token storage and configuration
- **Privileged Intents**: Server Members Intent required for advanced member functionality
- **Port 5000**: HTTP server endpoint for health checks and keep-alive mechanisms
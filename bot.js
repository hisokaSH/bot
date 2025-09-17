const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');

// Keep the bot alive with Express server
const app = express();
app.get('/', (req, res) => res.send('Discord Bot is running!'));
app.listen(5000, () => console.log('Keep-alive server started on port 5000'));

// Create Discord client with intents
// Note: GuildMembers is a privileged intent needed for welcome messages
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers  // Enable this for welcome messages
    ]
});

// Slash commands data
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows bot information'),
    
    new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello to the user'),
    
    new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays server information')
].map(command => command.toJSON());

// Ready event - bot has logged in
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is now online!`);
    console.log(`📊 Connected to ${client.guilds.cache.size} servers`);
    
    // Check if GuildMembers intent is available for welcome messages
    if (!client.options.intents.has(GatewayIntentBits.GuildMembers)) {
        console.log('⚠️  WARNING: GuildMembers intent is not enabled.');
        console.log('   Welcome messages will not work until you:');
        console.log('   1. Go to https://discord.com/developers/applications');
        console.log('   2. Select your bot application');
        console.log('   3. Go to the "Bot" section');
        console.log('   4. Enable "Server Members Intent" under Privileged Gateway Intents');
        console.log('   5. Uncomment the GuildMembers intent in bot.js');
        console.log('   6. Restart the bot');
    }
    
    // Register slash commands
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        console.log('🔄 Registering slash commands...');
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        
        console.log('✅ Successfully registered slash commands!');
        console.log('   Available commands: /ping, /hello, /info, /server');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
});

// Welcome message when new member joins
// Note: This event requires GuildMembers privileged intent to be enabled
client.on('guildMemberAdd', async (member) => {
    try {
        // Use specific welcome channel ID
        const welcomeChannel = member.guild.channels.cache.get('1417740297030602854');
        
        if (!welcomeChannel) {
            console.log(`Welcome channel not found in ${member.guild.name}`);
            return;
        }
        
        // Check if bot has permissions to send messages
        if (!welcomeChannel.permissionsFor(member.guild.members.me)?.has(['SendMessages', 'EmbedLinks'])) {
            console.log(`No permissions to send messages in welcome channel in ${member.guild.name}`);
            return;
        }
        
        // Create welcome embed with custom banner
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#808080') // Gray color
            .setTitle('🌟 Welcome!')
            .setDescription(`Welcome ${member}, to **${member.guild.name}**! ♡\n\nFollow the rules! <#1417741717288779937>\nChat in <#1417563604252758190>\nOwner is <@1169065695867322411>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setImage('https://cdn.discordapp.com/banners/1417732734591307836/8bfde384640e1937452804550ff0b50a.png?size=1024')
            .setFooter({ text: `Member #${member.guild.memberCount}` })
            .setTimestamp();
        
        await welcomeChannel.send({ 
            content: `${member}`, // Mention the user
            embeds: [welcomeEmbed] 
        });
        
        console.log(`Welcome message sent for ${member.user.tag}`);
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
});

// Slash command interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    const { commandName } = interaction;
    
    try {
        switch (commandName) {
            case 'ping':
                await interaction.reply('🏓 Pong!');
                break;
                
            case 'hello':
                await interaction.reply(`👋 Hello, ${interaction.user.username}!`);
                break;
                
            case 'info':
                const infoEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('🤖 Bot Information')
                    .setDescription('A Discord bot that welcomes new members and responds to commands!')
                    .addFields(
                        { name: '📊 Servers', value: `${client.guilds.cache.size}`, inline: true },
                        { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
                        { name: '🏓 Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true }
                    )
                    .setFooter({ text: 'Made with Discord.js' })
                    .setTimestamp();
                
                await interaction.reply({ embeds: [infoEmbed] });
                break;
                
            case 'server':
                if (!interaction.guild) {
                    await interaction.reply({ content: '❌ This command can only be used in a server!', ephemeral: true });
                    break;
                }
                
                const serverEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle(`📋 ${interaction.guild.name}`)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .addFields(
                        { name: '👥 Members', value: `${interaction.guild.memberCount}`, inline: true },
                        { name: '📅 Created', value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`, inline: true },
                        { name: '👑 Owner', value: `<@${interaction.guild.ownerId}>`, inline: true }
                    )
                    .setFooter({ text: `Server ID: ${interaction.guild.id}` })
                    .setTimestamp();
                
                await interaction.reply({ embeds: [serverEmbed] });
                break;
                
            default:
                await interaction.reply('❌ Unknown command!');
        }
    } catch (error) {
        console.error('Error handling slash command:', error);
        await interaction.reply({ content: '❌ An error occurred while processing this command!', ephemeral: true });
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
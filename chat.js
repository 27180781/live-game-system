async function initChat(rtmClient, channelName, loginUid, displayName) {
    try {
        await rtmClient.login({ uid: loginUid.toString() }); // Login with unique RTC UID
        const channel = rtmClient.createChannel(channelName);
        await channel.join();

        const chatContainer = document.getElementById('chat-container');
        const toggleButton = document.getElementById('chat-toggle-btn');
        const messagesContainer = document.getElementById('chat-messages');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');

        toggleButton.onclick = () => chatContainer.classList.toggle('open');

        chatForm.onsubmit = (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (messageText) {
                const message = { senderName: displayName, text: messageText };
                channel.sendMessage({ text: JSON.stringify(message) }).then(() => {
                    addMessageToLog(displayName, messageText, true);
                    chatInput.value = '';
                });
            }
        };

        channel.on('ChannelMessage', (message, senderId) => {
            try {
                const parsedMessage = JSON.parse(message.text);
                addMessageToLog(parsedMessage.senderName, parsedMessage.text, false);
            } catch (e) {
                console.log("Received non-JSON message");
            }
        });

        function addMessageToLog(sender, text, isSelf) {
            const messageEl = document.createElement('div');
            const senderEl = document.createElement('span');
            senderEl.textContent = `${sender}: `;
            if (isSelf) senderEl.textContent = `אני: `;
            
            messageEl.appendChild(senderEl);
            messageEl.append(document.createTextNode(text));
            messagesContainer.appendChild(messageEl);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (error) {
        console.error('RTM initialization failed', error);
    }
}
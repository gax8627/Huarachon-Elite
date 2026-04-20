import 'package:flutter/material.dart';
import '../services/ai_service.dart';
import '../theme/app_colors.dart';
import '../widgets/liquid_glass_card.dart';

class SupportPage extends StatefulWidget {
  const SupportPage({super.key});

  @override
  State<SupportPage> createState() => _SupportPageState();
}

class _SupportPageState extends State<SupportPage> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  final _ai = AiService();
  bool _isTyping = false;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _messages.add({
      'role': 'assistant',
      'content': '¡Hola Huarafan! Soy tu Huara-Concierge. ¿En qué te puedo ayudar hoy? ¡Qué chulada tenerte por aquí!'
    });
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSend() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'content': text});
      _controller.clear();
      _isTyping = true;
    });
    _scrollToBottom();

    String assistantResponse = '';
    _messages.add({'role': 'assistant', 'content': ''});
    final lastIndex = _messages.length - 1;

    try {
      await for (final chunk in _ai.sendMessageStream(text)) {
        assistantResponse += chunk;
        setState(() {
          _messages[lastIndex]['content'] = assistantResponse;
        });
        _scrollToBottom();
      }
    } catch (e) {
      setState(() {
        _messages[lastIndex]['content'] = '¡Epa! Tuve un problemita con la conexión. ¿Podemos intentar de nuevo?';
      });
    } finally {
      setState(() => _isTyping = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Huara-Concierge'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    child: LiquidGlassCard(
                      padding: const EdgeInsets.all(16),
                      borderRadius: 20,
                      gradient: isUser 
                        ? const LinearGradient(colors: [AppColors.primaryRed, AppColors.darkRed])
                        : null,
                      child: Text(
                        msg['content']!,
                        style: const TextStyle(fontSize: 15, height: 1.4),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isTyping)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: Align(alignment: Alignment.centerLeft, child: Text('Escribiendo...', style: TextStyle(fontSize: 12, color: Colors.white38))),
            ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppColors.backgroundDark,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Pregúntame algo...',
                hintStyle: const TextStyle(color: Colors.white24),
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
              onSubmitted: (_) => _handleSend(),
            ),
          ),
          const SizedBox(width: 12),
          IconButton.filled(
            onPressed: _handleSend,
            style: IconButton.styleFrom(backgroundColor: AppColors.primaryYellow, foregroundColor: Colors.black),
            icon: const Icon(Icons.send_rounded),
          ),
        ],
      ),
    );
  }
}

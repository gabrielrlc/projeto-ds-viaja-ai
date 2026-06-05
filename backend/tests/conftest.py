import sys
from unittest.mock import MagicMock

# O llm_client.py chama genai.Client() no nível do módulo (fora de qualquer função).
# Isso significa que ao importar chat_flow, o SDK do Google tenta conectar imediatamente.
# Injetamos um mock no sys.modules antes que qualquer import de teste aconteça,
# impedindo a chamada real à API.
mock_genai = MagicMock()
sys.modules.setdefault("google", MagicMock())
sys.modules.setdefault("google.genai", mock_genai)
sys.modules.setdefault("google.genai.types", MagicMock())

import pytest
from app.services.chat_flow import _extrair_numero, _extrair_data


# --- _extrair_numero ---

def test_extrair_numero_inteiro_simples():
    assert _extrair_numero("5000") == 5000.0

def test_extrair_numero_com_ponto_de_milhar():
    # "R$ 5.000" → remove o ponto → "5000" → 5000.0
    assert _extrair_numero("R$ 5.000") == 5000.0

def test_extrair_numero_com_virgula_decimal():
    # "5.000,50" → remove ponto → "5000,50" → troca vírgula → "5000.50" → 5000.5
    assert _extrair_numero("5.000,50") == 5000.5

def test_extrair_numero_dentro_de_frase():
    assert _extrair_numero("2 pessoas") == 2.0

def test_extrair_numero_opcao_com_mais():
    # "5+" → encontra o "5" e ignora o "+"
    assert _extrair_numero("5+") == 5.0

def test_extrair_numero_sem_numero_retorna_none():
    assert _extrair_numero("sem número nenhum") is None

def test_extrair_numero_string_vazia_retorna_none():
    assert _extrair_numero("") is None

def test_extrair_numero_retorna_o_primeiro_quando_ha_varios():
    assert _extrair_numero("3 adultos e 2 crianças") == 3.0


# --- _extrair_data ---

def test_extrair_data_formato_brasileiro():
    assert _extrair_data("15/07/2025") == "2025-07-15"

def test_extrair_data_formato_iso():
    assert _extrair_data("2025-07-15") == "2025-07-15"

def test_extrair_data_dentro_de_frase_brasileiro():
    assert _extrair_data("vou viajar no dia 20/12/2025 de manhã") == "2025-12-20"

def test_extrair_data_dentro_de_frase_iso():
    assert _extrair_data("data de ida: 2024-01-10") == "2024-01-10"

def test_extrair_data_sem_data_retorna_none():
    assert _extrair_data("não sei a data ainda") is None

def test_extrair_data_string_vazia_retorna_none():
    assert _extrair_data("") is None

def test_extrair_data_prefere_formato_brasileiro_quando_ambos_presentes():
    # DD/MM/AAAA é checado primeiro no código
    assert _extrair_data("20/06/2025 ou 2025-06-20") == "2025-06-20"

/**
 * Barone Store — Configuração centralizada da loja.
 *
 * Altere o número de WhatsApp aqui.
 * Este é o ÚNICO local onde o número do vendedor deve ser configurado.
 */
export const STORE_CONFIG = {
  /** Nome da loja exibido no site */
  name: 'Barone Store',

  /** Número do WhatsApp do vendedor (com código do país, sem + ou espaços) */
  whatsappNumber: '5511963041542',

  /** Moeda utilizada */
  currency: 'BRL',

  /** Locale para formatação */
  locale: 'pt-BR',

  /** Mensagem de saudação padrão do WhatsApp */
  whatsappGreeting: 'Olá! Gostaria de fazer um pedido na Barone Store.',

  /** Mensagem de encerramento do WhatsApp */
  whatsappClosing: 'Gostaria de finalizar meu pedido.',
} as const;

# 🚨 Guia de Configuração de Monitoramento (Pushcut + Railway)

Este guia explica como configurar seu sistema para receber alertas imediatos no celular caso o site saia do ar ou sofra reinicializações inesperadas.

---

## 1. Preparação: Obter URL do Pushcut

O Pushcut é o aplicativo que enviará a notificação para o seu iPhone/iPad.

1. Abra o app **Pushcut** no seu dispositivo.
2. Vá em **Webhooks** ou **Online Actions**.
3. Crie uma nova ação chamada `SiteDown` (ou similar).
4. Copie a URL gerada. Ela será parecida com:
    `https://api.pushcut.io/v1/notifications/SiteDown`
5. **Teste:** Cole essa URL no navegador do computador. Se receber a notificação no celular, está funcionando!

---

## 2. Monitoramento de Uptime (Caiu/Voltou)

Como o plano Hobby da Railway pode "dormir" ou reiniciar por memória, precisamos de um "cão de guarda" externo. Recomendamos **UptimeRobot** (grátis e confiável) ou **Cron-job.org**.

**Endpoint de Saúde:**
O seu site agora possui uma rota leve para monitoramento:
`https://seu-dominio-railway.app/health`
*(Retorna 200 OK se o servidor estiver rodando)*

### Configurando no UptimeRobot (Recomendado)

1. Crie uma conta em [uptimerobot.com](https://uptimerobot.com).
2. Clique em **Add New Monitor**.
3. **Monitor Type:** HTTP(s).
4. **Friendly Name:** Havaianas API.
5. **URL:** `https://seu-dominio-railway.app/health` (Substitua pelo seu domínio real).
6. **Monitoring Interval:** 5 minutes (Plano Grátis).
7. **Alert Contacts:**
    * Aqui está o truque: O UptimeRobot nativo manda e-mail. Para usar o Pushcut, você precisa da integração "Web-Hook".
    * Vá em **My Settings** -> **Alert Contacts** -> **New Alert Contact**.
    * **Type:** Web-Hook.
    * **Friendly Name:** Pushcut iPhone.
    * **URL to Notify:** Cole a URL do Pushcut (`https://api.pushcut.io/...`).
    * **JSON Alert Format:** Opcional (O padrão já funciona para disparar).
8. Salve e marque esse contato na configuração do Monitor.

**Resultado:** Se o `/health` não responder (site caiu/travou), o UptimeRobot chama o Pushcut -> Você recebe notificação.

---

## 3. Monitoramento de Deploy (Railway Nativo)

Para saber quando um NOVO deploy falhou ou foi sucesso (sem depender do site estar no ar).

1. Acesse o Dashboard da **Railway** -> Seu Projeto.
2. Vá em **Settings** (Aba General).
3. Desça até **Webhooks**.
4. Clique em **Create Webhook**.
5. **Payload URL:** Cole a URL do Pushcut.
6. **Triggers:** Selecione:
    * `Deployment Failed` (Crítico)
    * `Deployment Crashed` (Crítico)
    * `Deployment Success` (Opcional - bom para saber quando voltou)
7. Salve.

**Resultado:** Se a Railway tentar subir uma versão nova e falhar (ex: erro de build), você recebe notificação instantânea.

---

## Resumo dos Níveis de Alerta

| Tipo | Fonte | O que monitora? | Status |
| :--- | :--- | :--- | :--- |
| **Site Down** | UptimeRobot | Se a API pinguar/responder 200 OK | ✅ **Configurado via /health** |
| **Crash/Build** | Railway | Se o Deploy falhou ou processo morreu | ✅ **Nativo do Painel** |

Agora você tem cobertura total! 🛡️

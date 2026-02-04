const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PDF_URL = 'https://alexis91100.github.io/marie-antoinette-lp/assets/livre-blanc.pdf';

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { firstname, lastname, email, company, template } = JSON.parse(event.body);

        if (!email || !firstname) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email et prénom requis' })
            };
        }

        let subject, htmlContent;

        if (template === 'livre-blanc') {
            // Email 1: Livre blanc
            subject = `L'influence et le lifestyle : Votre exemplaire Marie Antoinette`;
            htmlContent = `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Bonjour ${firstname},
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Bienvenue dans l'univers de Marie Antoinette, nous vous remercions de l'intérêt porté à notre vision du marché.
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Vous trouverez le lien d'accès à notre dernier livre blanc consacré au secteur du lifestyle. Ce document synthétise notre expertise et les leviers stratégiques que nous activons pour nos clients afin de garantir leur impact et leur singularité ainsi que l'impact que la communication d'influence a et aura dans le futur.
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Nous espérons que ces perspectives nourriront vos réflexions actuelles.
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        <strong>Lien d'accès :</strong> <a href="${PDF_URL}" style="color: #000;">${PDF_URL}</a>
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Bien à vous,
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #666;">
                        L'équipe Marie Antoinette.<br>
                        <span style="font-size: 12px; color: #999;">Marie Antoinette — Agence de communication Lifestyle & Influence</span>
                    </p>
                </div>
            `;
        } else {
            // Email 2: Suivi
            subject = `Votre stratégie d'influence avec Marie Antoinette`;
            htmlContent = `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Bonjour ${firstname},
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Nous espérons que la lecture de notre analyse sectorielle vous a apporté un éclairage pertinent sur les nouveaux enjeux de demain.
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Si les défis et les opportunités détaillés dans ce document font écho à vos réflexions stratégiques et que vous souhaitez désormais activer une communication d'influence forte pour <strong>${company || 'votre entreprise'}</strong>, nous serions ravis d'en discuter avec vous.
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Pour définir ensemble les leviers les plus adaptés à vos ambitions, nous vous proposons un échange selon votre préférence :
                    </p>
                    <ul style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px; padding-left: 20px;">
                        <li style="margin-bottom: 10px;"><strong>Au Café de l'Agence (Paris 3e)</strong> — Pour un moment de conseil privilégié et humain.</li>
                        <li><strong>En visioconférence</strong> — Pour un format plus agile de 20 minutes.</li>
                    </ul>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Quelle option conviendrait le mieux à votre emploi du temps pour la semaine prochaine ?
                    </p>
                    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
                        Bien à vous,
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #666;">
                        L'équipe Marie Antoinette.<br>
                        <span style="font-size: 12px; color: #999;">Marie Antoinette — Lifestyle & Influence</span>
                    </p>
                </div>
            `;
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Marie Antoinette <onboarding@resend.dev>',
                to: email,
                subject: subject,
                html: htmlContent
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend error:', data);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: data.message || 'Erreur Resend' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, id: data.id })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur serveur' })
        };
    }
};

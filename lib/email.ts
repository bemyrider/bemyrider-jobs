import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendApplicationEmailParams {
  to: string
  businessName: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  vehicleType: string
  availability: string
  cvLink?: string
  message?: string
}

export async function sendApplicationEmail({
  to,
  businessName,
  applicantName,
  applicantEmail,
  applicantPhone,
  vehicleType,
  availability,
  cvLink,
  message,
}: SendApplicationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Bemyrider Jobs <recruting@bemyrider.it>',
      to,
      subject: `Nuova candidatura per ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nuova candidatura ricevuta</h2>
          
          <p><strong>Attività:</strong> ${businessName}</p>
          
          <h3 style="color: #374151;">Dati del candidato:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Nome:</strong> ${applicantName}</li>
            <li><strong>Email:</strong> ${applicantEmail}</li>
            <li><strong>Telefono:</strong> ${applicantPhone}</li>
            <li><strong>Mezzo:</strong> ${vehicleType}</li>
            <li><strong>Disponibilità:</strong> ${availability}</li>
            ${cvLink ? `<li><strong>CV:</strong> <a href="${cvLink}">Visualizza CV</a></li>` : ''}
          </ul>
          
          ${message ? `
            <h3 style="color: #374151;">Messaggio del candidato:</h3>
            <p style="background: #f3f4f6; padding: 16px; border-radius: 8px;">${message}</p>
          ` : ''}
          
          <p style="margin-top: 24px; color: #6b7280;">
            Puoi contattare il candidato direttamente via email o telefono.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

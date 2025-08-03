import { CreateJobOfferForm } from "../../components/create-job-offer-form"

export default function PublishPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Pubblica un Annuncio</h1>
          <p className="text-lg text-gray-600">
            Trova il rider perfetto per la tua attività
          </p>
        </div>
        
        <CreateJobOfferForm />
      </div>
    </div>
  )
}

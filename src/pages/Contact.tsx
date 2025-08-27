import { useState } from 'react';
import { Mail, Phone, MessageCircle, DollarSign, Clock, CheckCircle, Users, Award, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { submitContactForm } from '../api/contact'; // Import the API function
import { ContactSubmission } from '../types'; // Import the type

export default function Contact() {
  // State for form inputs
  const [formData, setFormData] = useState<Omit<ContactSubmission, 'id' | 'submittedAt'>>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // State for loading and form submission status
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string | null }>({
    type: null,
    text: null,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage({ type: null, text: null }); // Reset message

    const result = await submitContactForm(formData);

    setLoading(false);
    if (result.success) {
      setFormMessage({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      // Reset form fields
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setFormMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ayaanu nahay. sidee-se noola soo xidhiidh kartaa?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hoyga deeqaha waxbarasho iyo dhiiri galinta ardayda. Halkan waxaad ka helaysa caawimaad shaqsiyeed sida inaan kaa caawino qorida applications-ka jaamacada, essay writing, iyo ururinta documents lagaaga baahan yahay.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* About Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nagu Saabsan</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                   <b> Xariif</b> waa madal deeq waxbarasho oo u heellan sidii loo yareeyn lahaa fursadaha dahabiga ah ee dhaafa (ya) ardayda kartida leh anagoo usoo gudbinayna fursadaha Deeq waxbarash-eed ee dunida ka jira. 
                  Hadafkayagu waa inaan soo gudbino Deeq waxbarasho tayo leh oo uu  heli karo qof walba, iyadoon loo eegin asalkiisa dhaqaale.
                  <br /> <br />
                  Anagga oo leh sannado badan oo waayo-aragnimo ah lana xidhiidha sida loo codsado deeqaha waxbarasho iyo sida loo hago ardayda, kooxdayadu waxay ay caawisay boqolaal arday ah sidii ay u rumeyn lahaayeen riyooyinkooda waxbarasho. 
                  <br />
                                 </p>
                
                <p>
                   Waxaan aad u fahamsanahay kakanaanta iyo dhibaatada ardeyga somaaliyed maro/helo marka uu codsanayo deeqaha waxbarasho waxaanan bixinaa taageero shakhsiyeed si aan u kordhino fursadaha kuu horseedi lahaa guusha-da..
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">50+</div>
                    <div className="text-sm text-gray-600">Ardeyda aan caawinay</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">$50k+</div>
                    <div className="text-sm text-gray-600">Deeq-da aan u helnay</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Services Preview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sidee ku caawin karnaa ?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Raadinta deeq-da kugu haboon</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Caawinta sida loo qoro essay's ka jaamacadaha</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Diyaarinta iyo dib u shaan-dheynta documents-kaga</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Diyaarinta interview-ka iyo caawinta sida ugu guuleysan lahayd</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Maareyn-ta waqtiga application-ka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Pricing Section */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nala soo Xidhiidh</h2>
              
              <div className="space-y-6">
                {/* WhatsApp Contact */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Nagala soo xidhiidh WhatsApp-ka</h3>
                    <p className="text-gray-600 mb-2">Suaalo yaryar iyo jawaab degdega</p>
                    <a 
                      href="https://wa.me/+918283871748" 
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      +91 8283871748
                    </a>
                    <p className="text-sm text-gray-500 mt-1">La heli karo: Isniin-Sabti, 9AM(arror) - 9PM(habeen)</p>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Nagala soo xidhiidh Email-ka</h3>
                    <p className="text-gray-600 mb-2">Suaalo la xidhiidha application-ka iyo documents ka dheeraad-ka ah </p>
                    <a 
                      href="mailto:support@xariif.site" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      support@xariif.site
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Jawaab degdeg ah 24-saac gudaheed.</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Saacadaha aan shaqeyno</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Isniin - Jimce: 9:00 AM - 6:00 PM </p>
                      <p>Sabti: 10:00 AM - 4:00 PM EST</p>
                      <p>Axad: Xidhan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Contact Form Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Fariin noo soo Dir</h2>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Magaca oo dhameys-tiran</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Ciwaanka Email-kaga</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sabab-ta</label>
              <input 
                type="text" 
                name="subject" 
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Fariin-ta</label>
              <textarea 
                name="message" 
                id="message" 
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              ></textarea>
            </div>
            <div className="text-center">
              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md font-medium transition-colors disabled:bg-teal-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Dir Fariinta'
                )}
              </button>
            </div>
            {formMessage.text && (
              <div className={`mt-4 text-center p-3 rounded-md ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Suaalaha Badana Nala Weydiiyo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Waqti intee le-eg ayuu process-ka qaata?</h3>
              <p className="text-gray-600 mb-4">
                Badanaa 1-2 wiig applicaiton-ka oo dhameystiran, waxa ay ku xidhan tahay adeyga applicaiton-ka iyo sida aad noogu soo jawaabto.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ma dammaanad qaadaysaa inaan ku guuleysanayo deeqda waxbarasho?</h3>
              <p className="text-gray-600">
                Inkastoo aanan dammaanad qaadi karin guusha-da, hagidda khubaradayadu waxay kor u qaadey-sa fursadada.. 
                Waxaan bixinaa dib u eegis ilaa aad ku qanacdo codsigaga.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Waa maxay dukumentiyada aan u baahanahay?</h3>
              <p className="text-gray-600 mb-4">
                Transcripts, personal statements, recommendation letters, and scholarship requirements. 
                Waxaannu kusiin doona list-ga oo dhameystiran wada hadalka kadib.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ma iga caawin kartaa deeqaha waxbarasho ee caalamiga ah?</h3>
              <p className="text-gray-600">
                Dabcan! Waxaan khibrad u leenahay deeqaha waxbarasho ee adduunka oo dhan, oo ay ku jiraan Fulbright, Chevening,
                Dawlada-ha, iyo barnaamijyo badan oo jaamacado gaar ah bixiyaan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

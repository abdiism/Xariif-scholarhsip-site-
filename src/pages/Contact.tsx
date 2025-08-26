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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About XARIIF & Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in scholarship applications and academic success. Get personalized assistance 
            with applications, essays, and documentation.
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
                <h2 className="text-2xl font-bold text-gray-900">About XARIIF</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  XARIIF is a dedicated scholarship platform founded to bridge the gap between talented 
                  students and life-changing educational opportunities. Our mission is to make quality 
                  education accessible to everyone, regardless of financial background.
                </p>
                
                <p>
                  With years of experience in scholarship applications and academic guidance, our team 
                  has helped hundreds of students secure funding for their educational dreams. We understand 
                  the complexities of scholarship applications and provide personalized support to maximize 
                  your chances of success.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">500+</div>
                    <div className="text-sm text-gray-600">Students Helped</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">$2M+</div>
                    <div className="text-sm text-gray-600">Scholarships Secured</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Services Preview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Do</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Scholarship search and matching</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Application essay writing and editing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Document preparation and review</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Interview preparation and coaching</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Application timeline management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Pricing Section */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                {/* WhatsApp Contact */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">WhatsApp Support</h3>
                    <p className="text-gray-600 mb-2">Quick questions and immediate assistance</p>
                    <a 
                      href="https://wa.me/+918283871748" 
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      +91 8283871748
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Available: Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                    <p className="text-gray-600 mb-2">Formal inquiries and document submissions</p>
                    <a 
                      href="mailto:support@xariif.site" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      support@xariif.site
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Contact Form Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
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
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
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
                  'Send Message'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does the process take?</h3>
              <p className="text-gray-600 mb-4">
                Typically 1-2 weeks for complete applications, depending on complexity and your responsiveness to feedback.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you guarantee scholarship success?</h3>
              <p className="text-gray-600">
                While we cannot guarantee awards, our expert guidance significantly improves your chances. 
                We offer revisions until you're satisfied with your application.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What documents do I need?</h3>
              <p className="text-gray-600 mb-4">
                Transcripts, personal statements, recommendation letters, and scholarship requirements. 
                We'll provide a complete checklist after consultation.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can you help with international scholarships?</h3>
              <p className="text-gray-600">
                Yes! We have experience with scholarships worldwide, including Fulbright, Chevening, 
                Commonwealth, and many university-specific programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '../../../shared/components/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
          } else {
            // Optionnel: réinitialiser quand l'élément quitte la vue
            // entry.target.classList.remove('animate-slide-up');
            // entry.target.classList.add('opacity-0');
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px' // Déclenche un peu avant d'entrer dans la vue
      }
    );

    const elements = sectionRef.current?.querySelectorAll('.observe-animation');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-surface"
    >
      {/* Effets de lumière */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="observe-animation opacity-0 transition-all duration-700 mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Contact</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Une idée de projet ? Discutons-en ensemble
          </p>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Informations de contact */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-200 space-y-6">
            <div className="glass-effect p-6 md:p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gradient-accent">
                Restons en contact
              </h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Je suis toujours ouvert aux nouvelles opportunités et collaborations. 
                N'hésitez pas à me contacter pour discuter de vos projets.
              </p>

              <div className="space-y-4">
                <a 
                  href="mailto:sellyrafaj@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated hover:bg-surface hover:glow-effect transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📧
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">Email</div>
                    <div className="text-text-primary font-medium">sellyrafaj@gmail.com</div>
                  </div>
                </a>

                <a 
                  href="https://www.linkedin.com/in/mikajisoa-selly-rafaj-ratsimbazafy-7b9365321/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated hover:bg-surface hover:glow-effect transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💼
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">LinkedIn</div>
                    <div className="text-text-primary font-medium">Mikajisoa Selly-Rafaj</div>
                  </div>
                </a>

                <a 
                  href="https://github.com/Mikajy01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated hover:bg-surface hover:glow-effect transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💻
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">GitHub</div>
                    <div className="text-text-primary font-medium">@Mikajy01</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div>
                    <div className="text-text-muted text-sm">Localisation</div>
                    <div className="text-text-primary font-medium">Fianarantsoa, Madagascar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="observe-animation opacity-0 transition-all duration-700 delay-400">
            <form onSubmit={handleSubmit} className="glass-effect p-6 md:p-8 rounded-2xl space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-text-primary transition-all"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-text-primary transition-all"
                  placeholder="votre.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 text-text-primary transition-all resize-none"
                  placeholder="Parlez-moi de votre projet..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚡</span>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer le message'
                )}
              </Button>

              {submitStatus === 'success' && (
                <div className="p-4 rounded-xl bg-primary bg-opacity-10 border border-primary text-primary text-center animate-slide-up">
                  ✓ Message envoyé avec succès !
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 rounded-xl bg-accent bg-opacity-10 border border-accent text-accent text-center animate-slide-up">
                  ✗ Une erreur s'est produite. Veuillez réessayer.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
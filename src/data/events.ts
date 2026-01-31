import { Event } from '../types';

export const events: Event[] = [
  {
    id: 'evt-elite-one-001',
    title: 'Dynamo FC vs Coton Sport',
    category: 'Sport',
    date: 'Samedi 18h30',
    location: 'Stade de la Réunification, Douala',
    description:
      'Le choc de l’Elite One avec une ambiance électrique et un accès rapide via Mobile Money.',
    tiers: [
      { id: 'vip', label: 'VIP', price: 15000 },
      { id: 'tribune', label: 'Tribune', price: 5000 },
      { id: 'classique', label: 'Classique', price: 2000 },
    ],
    highlight: 'Guichets express + accès offline garanti',
  },
  {
    id: 'evt-concert-002',
    title: 'AfroLive Night',
    category: 'Art',
    date: 'Vendredi 21h00',
    location: 'Palais des Sports, Yaoundé',
    description:
      'Un line-up premium, sonorisation HD et billetterie 100% mobile.',
    tiers: [
      { id: 'vip', label: 'VIP', price: 25000 },
      { id: 'tribune', label: 'Tribune', price: 8000 },
      { id: 'classique', label: 'Classique', price: 4000 },
    ],
    highlight: 'QR dynamique + anti-fraude renforcée',
  },
  {
    id: 'evt-fanfest-003',
    title: 'Fan Fest Douala',
    category: 'Divertissement',
    date: 'Dimanche 16h00',
    location: 'Esplanade Bessengue',
    description:
      'Animations, gaming zone et performances live pour toute la communauté.',
    tiers: [
      { id: 'vip', label: 'VIP', price: 12000 },
      { id: 'tribune', label: 'Tribune', price: 6000 },
      { id: 'classique', label: 'Classique', price: 3000 },
    ],
    highlight: 'Paiement ultra-rapide < 45s',
  },
];

/**
 * Aaradhya — Sacred Catalogs & Mock Databases
 * Comprehensive Vedic ritual specifications, verified Purohits, and unadulterated Samagri checklists.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AaradhyaCatalog = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const RITUALS_CATALOG = [
    {
      id: 'griha-pravesh',
      icon: '🏠',
      name: 'Griha Pravesh Puja',
      shortDesc: 'Sacred blessings for peaceful entry into a new home.',
      category: 'Home',
      priceStart: 5500,
      duration: '2.5 – 3 Hours',
      deity: 'Lord Ganesha & Vastu Purush',
      purpose: 'New Home & Prosperity',
      tags: ['Most Booked', 'Vedic', 'Home'],
      packages: {
        Essential: {
          price: 5500,
          title: 'Essential Ceremony',
          pandits: '1 Verified Vedic Pandit',
          duration: '~2 Hours',
          inclusions: [
            'Standard Griha Pravesh & Havan',
            'Essential Samagri Included',
            'Vedic Kalash Sthapana',
            'Aarti & Pushpanjali'
          ]
        },
        Premium: {
          price: 8999,
          title: 'Premium Acharya Ceremony',
          pandits: '1 Senior Acharya + 1 Sahayak Purohit',
          duration: '~3 to 3.5 Hours',
          recommended: true,
          inclusions: [
            'Extended Navagraha & Vastu Shanti Havan',
            'Complete 18-Item Premium Samagri Pack',
            'Digital Sankalp Patra (Official Record)',
            'Consecrated Dry Prasad Box Delivery',
            'Vedic Gotra & Nakshatra Alignment'
          ]
        }
      },
      details: 'A sacred Vedic ceremony performed before shifting into a new residence to cleanse negative energies, invoke divine blessings of Vastu Devata, and bring abundance, health, and peace to the entire household.'
    },
    {
      id: 'satyanarayan',
      icon: '🪔',
      name: 'Satyanarayan Katha',
      shortDesc: 'Vedic recitation of Lord Vishnu’s divine glory.',
      category: 'Vishnu',
      priceStart: 3500,
      duration: '2 Hours',
      deity: 'Lord Satyanarayan (Vishnu)',
      purpose: 'Peace & Thanksgiving',
      tags: ['Family Favorite', 'Vishnu'],
      packages: {
        Essential: {
          price: 3500,
          title: 'Essential Katha',
          pandits: '1 Verified Purohit',
          duration: '~1.5 Hours',
          inclusions: [
            'Complete 5-Chapter Katha Recitation',
            'Standard Samagri Kit',
            'Panchamrit & Prasad Consecration',
            'Family Sankalp'
          ]
        },
        Premium: {
          price: 5500,
          title: 'Sampoorna Katha with Havan',
          pandits: '1 Senior Purohit + 1 Assistant',
          duration: '~2.5 Hours',
          recommended: true,
          inclusions: [
            'Full Katha with Melodious Bhajans',
            'Vishnu Sahasranama Chanting',
            'Navagraha & Satyanarayan Havan',
            'Full 18-Item Samagri + Tulsi Mala'
          ]
        }
      },
      details: 'Recitation of the sacred Satyanarayan Katha from the Skanda Purana, performed on Poornima or special family occasions to express gratitude, seek divine protection, and restore household harmony.'
    },
    {
      id: 'havan',
      icon: '🔥',
      name: 'Maha Ganapati Havan',
      shortDesc: 'Removal of obstacles with sacred fire offerings.',
      category: 'Home',
      priceStart: 2500,
      duration: '1.5 – 2 Hours',
      deity: 'Lord Ganesha',
      purpose: 'Obstacle Removal & Sankalp',
      tags: ['Auspicious', 'Home'],
      packages: {
        Essential: {
          price: 2500,
          title: 'Standard Havan',
          pandits: '1 Verified Pandit',
          duration: '~1.5 Hours',
          inclusions: ['Ganapati Atharvashirsha Chanting', 'Agnihotra Fire Sanctification', 'Essential Samidha & Ghee']
        },
        Premium: {
          price: 4999,
          title: 'Maha Ganapati Homam',
          pandits: '2 Vedic Acharyas',
          duration: '~2.5 Hours',
          recommended: true,
          inclusions: ['1008 Modak / Durva Ahuti', 'Modak Prasaad Consecration', 'Complete Sacred Herb Samagri', 'Digital Sankalp Certificate']
        }
      },
      details: 'Holy agnihotra fire ritual invoking Lord Ganesha to eliminate impediments from work, business, or personal ventures, and sanctify your premises with sacred herb-infused mantras.'
    },
    {
      id: 'naamkaran',
      icon: '👶',
      name: 'Naamkaran Sanskar',
      shortDesc: 'Traditional Vedic newborn naming ceremony.',
      category: 'Sanskar',
      priceStart: 4500,
      duration: '2 Hours',
      deity: 'Kuldevata & Navagrahas',
      purpose: 'Newborn Ceremony',
      tags: ['Sanskar'],
      packages: {
        Essential: {
          price: 4500,
          title: 'Vedic Naamkaran',
          pandits: '1 Acharya',
          duration: '~2 Hours',
          inclusions: ['Nakshatra Syllable Calculation', 'Navagraha Puja', 'Honey & Curd Offering (Madhu-parka)']
        },
        Premium: {
          price: 7500,
          title: 'Sampoorna Sanskar & Janampatri',
          pandits: '1 Senior Acharya + 1 Purohit',
          duration: '~3 Hours',
          recommended: true,
          inclusions: ['Detailed Janampatri Chart Printed', 'Swasti Vachan & Cradle Blessing', 'Ayushya Sukta Havan', 'Complete Samagri']
        }
      },
      details: 'One of the principal 16 Vedic Sanskars performed on the 11th or 21st day after childbirth to name the newborn in accordance with astrological nakshatra syllables and ancestral traditions.'
    },
    {
      id: 'mundan',
      icon: '✂️',
      name: 'Mundan Sanskar',
      shortDesc: 'First tonsure ceremony for vitality and longevity.',
      category: 'Sanskar',
      priceStart: 4000,
      duration: '2 Hours',
      deity: 'Kuldevata & Ganga Mata',
      purpose: 'Child Purification',
      tags: ['Sanskar'],
      packages: {
        Essential: {
          price: 4000,
          title: 'Chudakarana Ritual',
          pandits: '1 Purohit',
          duration: '~2 Hours',
          inclusions: ['Mundan Sankalp & Shanti Path', 'Curd & Turmeric Scalp Application', 'Vedic Blessings']
        },
        Premium: {
          price: 6500,
          title: 'Sampoorna Mundan with Havan',
          pandits: '1 Acharya + 1 Purohit',
          duration: '~2.5 Hours',
          recommended: true,
          inclusions: ['Ayushya Havan', 'Sacred Hair Immersion in Gangajal', 'Prasad Consecration', 'Complete Samagri']
        }
      },
      details: 'Traditional head-shaving ritual performed in childhood to sever karmic ties with past life impressions, promote healthy cranial hair growth, and invoke divine mental clarity.'
    },
    {
      id: 'vastu-puja',
      icon: '🕉️',
      name: 'Vastu Shanti Puja',
      shortDesc: 'Balancing the 5 cosmic elements in your space.',
      category: 'Home',
      priceStart: 5000,
      duration: '3 Hours',
      deity: 'Vastu Purush & Dikpalas',
      purpose: 'Home Harmony',
      tags: ['Architectural Harmony', 'Home'],
      packages: {
        Essential: {
          price: 5000,
          title: 'Vastu Shanti',
          pandits: '1 Vedic Acharya',
          duration: '~2.5 Hours',
          inclusions: ['Vastu Purush Mandala Sthapana', 'Directional Dikpala Offerings', 'Essential Samagri']
        },
        Premium: {
          price: 8500,
          title: 'Maha Vastu Dosha Nivaran',
          pandits: '2 Senior Acharyas',
          duration: '~3.5 Hours',
          recommended: true,
          inclusions: ['Detailed 8-Corner Copper Pyramid Sanctification', 'Shanti Havan with Medicinal Woods', 'Complete 18-Item Samagri', 'Digital Sankalp Certificate']
        }
      },
      details: 'Sacred ritual aimed at pacifying directional discrepancies (Vastu Doshas) in residences or commercial establishments, inviting harmonic life-force (Prana) flow.'
    },
    {
      id: 'shradh',
      icon: '🙏',
      name: 'Shradh & Pitru Tarpan',
      shortDesc: 'Ancestral homage and generational blessings.',
      category: 'Ancestral',
      priceStart: 4500,
      duration: '2 Hours',
      deity: 'Pitru Devatas',
      purpose: 'Ancestral Peace',
      tags: ['Solemn Vedic', 'Ancestral'],
      packages: {
        Essential: {
          price: 4500,
          title: 'Vedic Pitru Tarpan',
          pandits: '1 Specialized Purohit',
          duration: '~1.5 Hours',
          inclusions: ['Kusha Grass & Til Tarpan', 'Pinda Daan Offerings', 'Ancestral Gotra Sankalp']
        },
        Premium: {
          price: 7000,
          title: 'Maha Shradh & Brahman Bhoj',
          pandits: '2 Senior Purohits',
          duration: '~2.5 Hours',
          recommended: true,
          inclusions: ['Sampoorna Pitru Tarpan Vidhi', 'Brahman Dakshina Arrangement', 'Vishnu Tarpan & Agnihotra', 'Complete Pure Samagri']
        }
      },
      details: 'Sacred ceremonial homage to ancestors performed during Pitru Paksha or death anniversaries with black sesame (Til), barley, and Kusha grass to seek ancestral peace and blessings.'
    },
    {
      id: 'rudrabhishek',
      icon: '🔱',
      name: 'Maha Rudrabhishek',
      shortDesc: 'Potent Vedic abhishek for health and inner peace.',
      category: 'Shiva',
      priceStart: 3800,
      duration: '2.5 Hours',
      deity: 'Lord Shiva',
      purpose: 'Health & Protection',
      tags: ['Powerful', 'Shiva'],
      packages: {
        Essential: {
          price: 3800,
          title: 'Laghu Rudrabhishek',
          pandits: '1 Vedic Acharya',
          duration: '~2 Hours',
          inclusions: ['Panchamrit Abhishek', 'Sri Rudram Recitation', 'Bilva Patra & Bhasma Offerings']
        },
        Premium: {
          price: 6999,
          title: 'Maha Rudrabhishek with Havan',
          pandits: '2 Acharyas versed in Shukla Yajurveda',
          duration: '~3 Hours',
          recommended: true,
          inclusions: ['11 Recitations of Sri Rudram (Ekadasha Rudra)', 'Mahamrityunjaya Havan', 'Pure Gangajal & Sugarcane Juice', 'Digital Sankalp Certificate']
        }
      },
      details: 'Potent abhishek of the Shiva Linga with Panchamrit, holy Gangajal, and sugarcane juice while chanting the Sri Rudram hymn to ward off malefic influences and cultivate spiritual serenity.'
    }
  ];

  const PANDITS_DATABASE = [
    {
      id: 'rajesh',
      name: 'Pandit Rajesh Sharma',
      avatarInitials: 'RS',
      experience: '18+ years',
      rating: 4.98,
      bookingsCount: 247,
      languages: 'Hindi • Sanskrit • English',
      tradition: 'North Indian / Shukla Yajurveda',
      education: 'Acharya from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi',
      verified: true,
      bgChecked: true,
      bio: 'Specialist in Griha Pravesh, Vastu, and Mahamrityunjaya Havan with authentic Vedic pronunciation. Known for punctuality, explaining ritual mantras clearly to families, and graceful conduct.',
      reviews: [
        { devotee: 'Anurag & Neha', rating: 5, date: '18 Apr 2026', comment: 'Pandit ji explained the deeper meaning behind each mantra during our Griha Pravesh. Extremely calm, respectful and punctual.' },
        { devotee: 'Meenakshi K.', rating: 5, date: '04 Mar 2026', comment: 'Everything was conducted respectfully. He arrived 20 minutes before the Muhurat with his puja attire.' }
      ]
    },
    {
      id: 'anand',
      name: 'Pandit Anand Shastri',
      avatarInitials: 'AS',
      experience: '14+ years',
      rating: 4.92,
      bookingsCount: 310,
      languages: 'Hindi • Awadhi • Sanskrit',
      tradition: 'North Indian / Rigveda',
      education: 'Shastri from Kashi Naresh Sanskrit Vidyalaya, Kashi',
      verified: true,
      bgChecked: true,
      bio: 'Venerated Purohit specializing in Sanskars, Ramcharitmanas recitation, and elaborate Havan rituals. Over a decade of ritual service across Delhi NCR.',
      reviews: [
        { devotee: 'Rameshwar Dayal', rating: 5, date: '15 Feb 2026', comment: 'Very deep knowledge of Muhurat and Shastras. Our family has invited him thrice for our family pujas.' }
      ]
    },
    {
      id: 'manoj',
      name: 'Pandit Manoj Mishra',
      avatarInitials: 'MM',
      experience: '11+ years',
      rating: 4.88,
      bookingsCount: 190,
      languages: 'Hindi • Maithili • Sanskrit',
      tradition: 'Mithila & North Indian',
      education: 'Darbhanga Sanskrit Vishwavidyalaya',
      verified: true,
      bgChecked: true,
      bio: 'Dedicated to Vedic rituals with pristine pronunciation and adherence to family Kul-parampara. Highly appreciated for warm, patient guidance with elders and children.',
      reviews: [
        { devotee: 'Vikas Sharma', rating: 5, date: '28 Jan 2026', comment: 'Handled our Satyanarayan katha very smoothly. Punctual, humble, and very serene.' }
      ]
    }
  ];

  const SAMAGRI_ITEMS = [
    {
      category: 'Havan & Sacred Fire',
      items: [
        'Dry Wood Sticks (Samidha)',
        'Pure Cow Ghee (Gir Cow A2, 500g)',
        'Vedic Havan Samagri (Organic 32 Herbs)',
        'Pure Camphor (Bhimseni Kapoor)',
        'Guggal & Natural Loban Incense',
        'Navagraha Wood Samidha Sticks'
      ]
    },
    {
      category: 'Kalash & Vastra',
      items: [
        'Pure Brass Kalash with Coconut Holder',
        'Sacred Red Altar Cloth (1.25m Cotton)',
        'Yellow Pitambar Vastra for Lord Ganesha',
        'Sacred Kalawa / Mauli Thread (Pure Cotton)',
        'Sacred Janeu Threads (3 consecrated pairs)'
      ]
    },
    {
      category: 'Botanicals & Offerings',
      items: [
        'Fresh Mango Leaves (Ashoka / Aam Patra)',
        'Whole Water Coconuts (Shrifal)',
        'Betel Leaves (Paan) & Betel Nuts (Supari)',
        'Organic Haldi & Kumkum Powder',
        'Whole Akshat Rice (Unbroken Hand-Selected)'
      ]
    },
    {
      category: 'Sacred Fluids & Essentials',
      items: [
        'Pure Gangajal from Haridwar Brahma Kund',
        'Panchamrit Mixture Essentials (Honey, Khand, Tulsi)',
        'Handcrafted Brass Diya & Pure Cotton Wicks',
        'Pure Sandalwood / Chandan Paste',
        'Natural Dhoop & Agarbatti'
      ]
    }
  ];

  const TEMPLES_CATALOG = [
    {
      id: 'temple-kashi',
      name: 'Shri Kashi Vishwanath',
      location: 'Varanasi, Uttar Pradesh',
      icon: '🕉️',
      offerings: ['Daily Ganga Aarti', 'Nitya Deepdaan', 'Rudrabhishek Seva'],
      description: 'Ancient Jyotirlinga on the banks of holy Ganga. Seva conducted in your Gotra with consecrated prasad dispatched within 48h.'
    },
    {
      id: 'temple-mahakal',
      name: 'Mahakaleshwar Jyotirlinga',
      location: 'Ujjain, Madhya Pradesh',
      icon: '🔱',
      offerings: ['Bhasma Aarti Sponsorship', 'Nitya Anna Daan', 'Shani Shanti Path'],
      description: 'Dakshinmukhi Jyotirlinga renowned for transcendental time mastery. Prasad blessed by Mahakal delivered to your doorstep.'
    },
    {
      id: 'temple-tirupati',
      name: 'Sri Venkateswara Swamy (Tirupati Balaji)',
      location: 'Tirumala, Andhra Pradesh',
      icon: '🌺',
      offerings: ['Kalyanotsavam Seva', 'Laddu Prasadam Offering', 'Nitya Annadanam'],
      description: 'Venerated Kaliyuga sanctuary. Sanctified dry laddu and akshat mailed with video sankalp acknowledgement.'
    }
  ];

  return {
    RITUALS_CATALOG,
    PANDITS_DATABASE,
    SAMAGRI_ITEMS,
    TEMPLES_CATALOG
  };
}));

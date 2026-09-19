import { DrawingProject, DrawingStep } from '../types';

export const SAMPLE_PRESETS: {
  id: string;
  title: string;
  category: 'Portrait' | 'Still Life' | 'Anatomy' | 'Architecture';
  imageUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stepCount: number;
  description: string;
}[] = [
  {
    id: 'preset-portrait-maya',
    title: 'Portrait Study: Frontal Proportion',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    difficulty: 'Intermediate',
    stepCount: 6,
    description: 'Deconstruct cranial proportions, symmetry axes, eye spacing, and jawline contour.'
  },
  {
    id: 'preset-still-teapot',
    title: 'Handmade Ceramic Teapot',
    category: 'Still Life',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
    difficulty: 'Beginner',
    stepCount: 5,
    description: 'Spherical volume blocking, spout curve dynamics, lid axis, and handle counter-balance.'
  },
  {
    id: 'preset-marble-bust',
    title: 'Classical Roman Bust',
    category: 'Anatomy',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    difficulty: 'Advanced',
    stepCount: 7,
    description: 'Chiseled anatomical plane shifts, brow bridge depth, and hair curl structural masses.'
  },
  {
    id: 'preset-botanical-fern',
    title: 'Botanical Monstera Leaf',
    category: 'Still Life',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80',
    difficulty: 'Beginner',
    stepCount: 5,
    description: 'Central stem gesture line, rib branching angles, and negative space cutouts.'
  }
];

export const INITIAL_STEPS_PORTRAIT: DrawingStep[] = [
  {
    id: 1,
    title: 'Cranium & Jaw Oval',
    instruction: 'Block in the primary egg shape of the head and the tapering jaw contour.',
    anatomicalTarget: 'Cranial mass and mandible perimeter',
    isCompleted: false,
    guidePaths: [
      {
        id: 'p1-cranium',
        points: [350, 170, 430, 200, 480, 260, 485, 350, 465, 430, 420, 500, 350, 540, 280, 500, 235, 430, 215, 350, 220, 260, 270, 200, 350, 170],
        closed: true,
        tension: 0.35,
        label: 'Cranial envelope'
      },
      {
        id: 'p1-jaw',
        points: [235, 410, 265, 480, 350, 540, 435, 480, 465, 410],
        tension: 0.25,
        label: 'Mandible angle'
      }
    ]
  },
  {
    id: 2,
    title: 'Symmetry & Eye Axis',
    instruction: 'Drop the central vertical facial axis and the horizontal eye line through the midpoint.',
    anatomicalTarget: 'Facial planes and cardinal alignments',
    isCompleted: false,
    guidePaths: [
      {
        id: 'p2-v-axis',
        points: [350, 150, 350, 560],
        label: 'Central vertical axis'
      },
      {
        id: 'p2-eye-axis',
        points: [220, 355, 480, 355],
        label: 'Eye level axis'
      },
      {
        id: 'p2-brow-axis',
        points: [240, 320, 460, 320],
        label: 'Supraorbital brow line'
      },
      {
        id: 'p2-nose-axis',
        points: [270, 425, 430, 425],
        label: 'Subnasal plane'
      },
      {
        id: 'p2-mouth-axis',
        points: [280, 475, 420, 475],
        label: 'Lip parting line'
      }
    ]
  },
  {
    id: 3,
    title: 'Eye Sockets & Nose Bridge',
    instruction: 'Establish the twin eye sockets and the triangular keystone wedge of the nose bridge.',
    anatomicalTarget: 'Orbital cavities and nasal bone projection',
    isCompleted: false,
    guidePaths: [
      {
        id: 'p3-left-eye',
        points: [275, 355, 305, 345, 335, 360, 305, 368, 275, 355],
        closed: true,
        tension: 0.3,
        label: 'Left orbital fissure'
      },
      {
        id: 'p3-right-eye',
        points: [365, 360, 395, 345, 425, 355, 395, 368, 365, 360],
        closed: true,
        tension: 0.3,
        label: 'Right orbital fissure'
      },
      {
        id: 'p3-nose-keystone',
        points: [340, 345, 360, 345, 365, 415, 375, 425, 350, 432, 325, 425, 335, 415, 340, 345],
        closed: true,
        tension: 0.2,
        label: 'Nasal cartilage pyramid'
      }
    ]
  },
  {
    id: 4,
    title: 'Lip Contour & Chin Anchor',
    instruction: 'Map the cupid bow of the upper lip, the fuller lower lip cradle, and the chin crease.',
    anatomicalTarget: 'Vermilion border and mental protuberance',
    isCompleted: false,
    guidePaths: [
      {
        id: 'p4-upper-lip',
        points: [310, 475, 335, 468, 350, 473, 365, 468, 390, 475],
        tension: 0.3,
        label: 'Cupid bow & tubercle'
      },
      {
        id: 'p4-parting-line',
        points: [308, 477, 335, 478, 350, 482, 365, 478, 392, 477],
        tension: 0.2,
        label: 'Oral fissure line'
      },
      {
        id: 'p4-lower-lip',
        points: [315, 482, 350, 502, 385, 482],
        tension: 0.3,
        label: 'Lower lip fullness'
      },
      {
        id: 'p4-chin-shadow',
        points: [330, 520, 350, 524, 370, 520],
        tension: 0.2,
        label: 'Mental crease'
      }
    ]
  },
  {
    id: 5,
    title: 'Ears & Outer Hair Mass',
    instruction: 'Anchor ear tops to the brow line and bottom to nose base, then wrap the hair volume.',
    anatomicalTarget: 'Auricular placement and cranial silhouette',
    isCompleted: false,
    guidePaths: [
      {
        id: 'p5-left-ear',
        points: [220, 335, 205, 370, 215, 420, 230, 425],
        tension: 0.3,
        label: 'Left helix'
      },
      {
        id: 'p5-right-ear',
        points: [480, 335, 495, 370, 485, 420, 470, 425],
        tension: 0.3,
        label: 'Right helix'
      },
      {
        id: 'p5-hair-silhouette',
        points: [205, 380, 185, 290, 210, 200, 270, 140, 350, 120, 430, 140, 490, 200, 515, 290, 495, 380],
        tension: 0.35,
        label: 'Hair volume perimeter'
      }
    ]
  },
  {
    id: 6,
    title: 'Neck Gestures & Key Values',
    instruction: 'Pull the sternocleidomastoid muscle lines down toward the collarbone to ground the head.',
    anatomicalTarget: 'Cervical column and clavicular base',
    isCompleted: false,
    guidePaths: [
      {
        id: 'p6-left-neck',
        points: [265, 490, 240, 595],
        tension: 0.15,
        label: 'Left trapezius slope'
      },
      {
        id: 'p6-right-neck',
        points: [435, 490, 460, 595],
        tension: 0.15,
        label: 'Right trapezius slope'
      },
      {
        id: 'p6-sc-muscle',
        points: [305, 515, 340, 580, 360, 580, 395, 515],
        tension: 0.2,
        label: 'Sternocleidomastoid tendon'
      },
      {
        id: 'p6-clavicle',
        points: [210, 600, 340, 610, 360, 610, 490, 600],
        tension: 0.2,
        label: 'Clavicle line'
      }
    ]
  }
];

export const INITIAL_STEPS_TEAPOT: DrawingStep[] = [
  {
    id: 1,
    title: 'Base Sphere & Center Axis',
    instruction: 'Draft the main circular vessel body and its plumb center balance line.',
    anatomicalTarget: 'Spherical volume bounding box',
    isCompleted: false,
    guidePaths: [
      {
        id: 'tp1-circle',
        points: [350, 260, 440, 290, 480, 370, 460, 460, 390, 510, 310, 510, 240, 460, 220, 370, 260, 290, 350, 260],
        closed: true,
        tension: 0.35,
        label: 'Vessel spherical body'
      },
      {
        id: 'tp1-axis',
        points: [350, 200, 350, 540],
        label: 'Center plumb line'
      }
    ]
  },
  {
    id: 2,
    title: 'Lid Rim & Finial Knob',
    instruction: 'Construct the horizontal ellipse at the opening and the sphere knob atop.',
    anatomicalTarget: 'Aperture ellipse and apex balance',
    isCompleted: false,
    guidePaths: [
      {
        id: 'tp2-rim',
        points: [290, 260, 350, 245, 410, 260, 350, 275, 290, 260],
        closed: true,
        tension: 0.3,
        label: 'Opening rim ellipse'
      },
      {
        id: 'tp2-lid-dome',
        points: [305, 255, 350, 225, 395, 255],
        tension: 0.3,
        label: 'Lid dome'
      },
      {
        id: 'tp2-finial',
        points: [340, 215, 350, 205, 360, 215, 350, 225, 340, 215],
        closed: true,
        tension: 0.3,
        label: 'Finial ball'
      }
    ]
  },
  {
    id: 3,
    title: 'Spout S-Curve Sweep',
    instruction: 'Trace the graceful upward curve of the spout from low belly to lip.',
    anatomicalTarget: 'Dynamic hydraulic vector',
    isCompleted: false,
    guidePaths: [
      {
        id: 'tp3-spout-outer',
        points: [230, 420, 180, 390, 150, 330, 160, 280],
        tension: 0.35,
        label: 'Spout underside'
      },
      {
        id: 'tp3-spout-inner',
        points: [255, 360, 210, 340, 180, 310, 185, 285],
        tension: 0.35,
        label: 'Spout top curve'
      },
      {
        id: 'tp3-spout-lip',
        points: [160, 280, 185, 285],
        label: 'Pouring rim'
      }
    ]
  },
  {
    id: 4,
    title: 'Handle Arc Counterbalance',
    instruction: 'Construct the sweeping loop handle opposing the spout for optical balance.',
    anatomicalTarget: 'Ergonomic loop geometry',
    isCompleted: false,
    guidePaths: [
      {
        id: 'tp4-handle-outer',
        points: [440, 300, 520, 320, 545, 410, 500, 480, 440, 470],
        tension: 0.4,
        label: 'Handle outer perimeter'
      },
      {
        id: 'tp4-handle-inner',
        points: [435, 330, 485, 345, 505, 405, 475, 450, 430, 445],
        tension: 0.4,
        label: 'Handle negative space'
      }
    ]
  },
  {
    id: 5,
    title: 'Foot Ring & Cast Shadow Plane',
    instruction: 'Anchor the pot with a clean grounded ellipse and ground shadow line.',
    anatomicalTarget: 'Base plane contact',
    isCompleted: false,
    guidePaths: [
      {
        id: 'tp5-foot',
        points: [300, 508, 350, 515, 400, 508, 350, 502, 300, 508],
        closed: true,
        tension: 0.25,
        label: 'Foot pedestal'
      },
      {
        id: 'tp5-shadow',
        points: [200, 525, 350, 535, 520, 520],
        tension: 0.2,
        label: 'Ground contact line'
      }
    ]
  }
];

export const INITIAL_PROJECTS: DrawingProject[] = [
  {
    id: 'proj-1',
    title: 'Portrait of Maya',
    category: 'Portrait',
    referenceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    createdAt: '2 days ago',
    updatedAt: '45 mins ago',
    progressPercentage: 83,
    currentStepIndex: 5,
    isCompleted: false,
    totalSteps: 6,
    accuracyOverall: 93,
    timeSpentMinutes: 32,
    steps: INITIAL_STEPS_PORTRAIT,
    completedStrokes: [],
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'proj-2',
    title: 'Handmade Ceramic Teapot',
    category: 'Still Life',
    referenceImageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    createdAt: 'Yesterday',
    updatedAt: 'Yesterday',
    progressPercentage: 100,
    currentStepIndex: 4,
    isCompleted: true,
    totalSteps: 5,
    accuracyOverall: 96,
    timeSpentMinutes: 24,
    steps: INITIAL_STEPS_TEAPOT.map(s => ({ ...s, isCompleted: true })),
    completedStrokes: [],
    thumbnailUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'proj-3',
    title: 'Classical Roman Bust',
    category: 'Anatomy',
    referenceImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    createdAt: '4 days ago',
    updatedAt: '3 days ago',
    progressPercentage: 35,
    currentStepIndex: 2,
    isCompleted: false,
    totalSteps: 7,
    accuracyOverall: 88,
    timeSpentMinutes: 18,
    steps: INITIAL_STEPS_PORTRAIT.map(s => ({ ...s, isCompleted: false })),
    completedStrokes: [],
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'proj-4',
    title: 'Botanical Monstera Leaf',
    category: 'Still Life',
    referenceImageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    createdAt: '1 week ago',
    updatedAt: '5 days ago',
    progressPercentage: 100,
    currentStepIndex: 4,
    isCompleted: true,
    totalSteps: 5,
    accuracyOverall: 95,
    timeSpentMinutes: 21,
    steps: INITIAL_STEPS_TEAPOT.map(s => ({ ...s, isCompleted: true })),
    completedStrokes: [],
    thumbnailUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
  }
];

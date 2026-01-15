
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  doc,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Question, SubjectType, Attempt, User } from '../types';

const PHYSICS_DATA = [
  {"question":"A body moving with uniform velocity has","options":["Zero acceleration","Constant acceleration","Increasing velocity","Decreasing velocity"],"correctIndex":0},
  {"question":"The slope of a velocity–time graph gives","options":["Velocity","Displacement","Acceleration","Momentum"],"correctIndex":2},
  {"question":"The SI unit of force is","options":["Dyne","Newton","Joule","Watt"],"correctIndex":1},
  {"question":"Work done in uniform circular motion is","options":["Zero","Maximum","Minimum","Infinite"],"correctIndex":0},
  {"question":"Dimensional formula of pressure is","options":["ML⁻¹T⁻²","MLT⁻²","M²LT⁻²","ML²T⁻³"],"correctIndex":0},
  {"question":"Which law explains conservation of momentum?","options":["Newton’s first law","Newton’s second law","Newton’s third law","Law of gravitation"],"correctIndex":2},
  {"question":"Unit of impulse is","options":["N","N s","kg m","J"],"correctIndex":1},
  {"question":"Acceleration due to gravity on Earth is approximately","options":["8.9 m/s²","9.8 m/s²","10.8 m/s²","9.0 m/s²"],"correctIndex":1},
  {"question":"The area under a velocity–time graph represents","options":["Acceleration","Distance","Displacement","Momentum"],"correctIndex":2},
  {"question":"SI unit of work is","options":["Watt","Joule","Newton","Pascal"],"correctIndex":1},
  {"question":"Ohm’s law relates","options":["Current and resistance","Voltage and resistance","Voltage and current","Power and voltage"],"correctIndex":2},
  {"question":"Unit of electric current is","options":["Volt","Ampere","Coulomb","Ohm"],"correctIndex":1},
  {"question":"Resistance of a conductor depends on","options":["Length","Area","Material","All of these"],"correctIndex":3},
  {"question":"The device used to measure electric current is","options":["Voltmeter","Ammeter","Galvanometer","Ohmmeter"],"correctIndex":1},
  {"question":"Electrical energy consumed is measured in","options":["Joule","Watt","kWh","Ampere"],"correctIndex":2},
  {"question":"Power is defined as","options":["Work per unit time","Energy per unit charge","Force per unit area","Charge per unit time"],"correctIndex":0},
  {"question":"The SI unit of electric power is","options":["Watt","Volt","Ampere","Joule"],"correctIndex":0},
  {"question":"Fuse wire is made of","options":["Copper","Aluminium","Alloy with low melting point","Silver"],"correctIndex":2},
  {"question":"An electric bulb filament is made of","options":["Copper","Aluminium","Tungsten","Iron"],"correctIndex":2},
  {"question":"One kilowatt hour equals","options":["1000 J","3600 J","3.6×10⁶ J","3.6×10⁵ J"],"correctIndex":2},
  {"question":"The speed of light in vacuum is","options":["3×10⁸ m/s","3×10⁶ m/s","3×10⁵ m/s","3×10⁷ m/s"],"correctIndex":0},
  {"question":"Mirror used in vehicle headlights is","options":["Convex","Plane","Concave","Cylindrical"],"correctIndex":2},
  {"question":"Image formed by a plane mirror is","options":["Real","Inverted","Virtual and erect","Magnified"],"correctIndex":2},
  {"question":"Focal length of a plane mirror is","options":["Zero","Infinity","Half radius","Equal to radius"],"correctIndex":1},
  {"question":"SI unit of focal length is","options":["Metre","Dioptre","Centimetre","Second"],"correctIndex":0},
  {"question":"Power of a lens is measured in","options":["Metre","Watt","Dioptre","Newton"],"correctIndex":2},
  {"question":"A convex lens is also called","options":["Converging lens","Diverging lens","Plane lens","Cylindrical lens"],"correctIndex":0},
  {"question":"A concave lens always forms","options":["Real image","Virtual image","Magnified image","Inverted image"],"correctIndex":1},
  {"question":"The refractive index is the ratio of","options":["Speeds","Wavelengths","Angles","Frequencies"],"correctIndex":0},
  {"question":"The phenomenon of bending of light is called","options":["Reflection","Refraction","Diffraction","Dispersion"],"correctIndex":1},
  {"question":"Sound waves are","options":["Transverse","Longitudinal","Electromagnetic","Stationary"],"correctIndex":1},
  {"question":"Unit of frequency is","options":["Second","Hertz","Metre","Decibel"],"correctIndex":1},
  {"question":"Human audible range is","options":["20–20,000 Hz","10–10,000 Hz","100–10,000 Hz","50–50,000 Hz"],"correctIndex":0},
  {"question":"The speed of sound is maximum in","options":["Air","Water","Steel","Vacuum"],"correctIndex":2},
  {"question":"Echo is due to","options":["Reflection of sound","Refraction of sound","Diffraction of sound","Absorption of sound"],"correctIndex":0},
  {"question":"Ultrasound frequency is greater than","options":["20 Hz","200 Hz","2000 Hz","20,000 Hz"],"correctIndex":3},
  {"question":"The unit of loudness is","options":["Hertz","Decibel","Watt","Pascal"],"correctIndex":1},
  {"question":"Pitch of sound depends on","options":["Amplitude","Speed","Frequency","Wavelength"],"correctIndex":2},
  {"question":"Time period is reciprocal of","options":["Speed","Frequency","Wavelength","Amplitude"],"correctIndex":1},
  {"question":"The phenomenon responsible for rainbow is","options":["Reflection","Refraction and dispersion","Diffraction","Scattering"],"correctIndex":1},
  {"question":"Radioactivity was discovered by","options":["Rutherford","Becquerel","Curie","Bohr"],"correctIndex":1},
  {"question":"Alpha particles are","options":["Electrons","Helium nuclei","Protons","Neutrons"],"correctIndex":1},
  {"question":"SI unit of radioactivity is","options":["Curie","Becquerel","Gray","Sievert"],"correctIndex":1},
  {"question":"Half-life is the time taken for","options":["Complete decay","Half decay","Double decay","No decay"],"correctIndex":1},
  {"question":"Nuclear fission is splitting of","options":["Electron","Proton","Heavy nucleus","Light nucleus"],"correctIndex":2},
  {"question":"Energy of the Sun comes from","options":["Combustion","Fission","Fusion","Radioactivity"],"correctIndex":2},
  {"question":"Binding energy is due to","options":["Mass defect","Electron motion","Charge","Heat"],"correctIndex":0},
  {"question":"SI unit of energy is","options":["Calorie","Joule","Electron volt","Watt"],"correctIndex":1},
  {"question":"Mass-energy relation is given by","options":["E=mc","E=mc²","E=m²c","E=c²m²"],"correctIndex":1},
  {"question":"Neutrons were discovered by","options":["Rutherford","Chadwick","Bohr","Curie"],"correctIndex":1},
  {"question":"The unit of electric capacitance is","options":["Volt","Ohm","Farad","Tesla"],"correctIndex":2},
  {"question":"Magnetic field strength is measured in","options":["Weber","Tesla","Henry","Farad"],"correctIndex":1},
  {"question":"Lenz's law is a consequence of the law of conservation of","options":["Charge","Mass","Energy","Momentum"],"correctIndex":2},
  {"question":"The frequency of AC in India is","options":["60 Hz","50 Hz","100 Hz","220 Hz"],"correctIndex":1},
  {"question":"The velocity of electromagnetic waves in vacuum is","options":["3x10^8 m/s","3x10^10 m/s","3x10^6 m/s","3x10^7 m/s"],"correctIndex":0},
  {"question":"The photoelectric effect was explained by","options":["Newton","Hertz","Einstein","Maxwell"],"correctIndex":2},
  {"question":"The de Broglie wavelength is inversely proportional to","options":["Mass","Velocity","Momentum","Energy"],"correctIndex":2},
  {"question":"Which of the following is a universal gate?","options":["OR","AND","NOT","NAND"],"correctIndex":3},
  {"question":"In a p-type semiconductor, the majority charge carriers are","options":["Electrons","Holes","Protons","Neutrons"],"correctIndex":1},
  {"question":"The process of superimposing signal on a carrier wave is","options":["Demodulation","Modulation","Detection","Amplification"],"correctIndex":1}
];

const CHEMISTRY_DATA = [
  {"question":"The atomic number of an element is equal to the number of","options":["Neutrons","Protons","Electrons + Neutrons","Nucleons"],"correctIndex":1},
  {"question":"The SI unit of amount of substance is","options":["Gram","Kilogram","Mole","Litre"],"correctIndex":2},
  {"question":"Avogadro number is","options":["6.022×10²³","3.011×10²³","6.626×10⁻³⁴","1.6×10⁻¹⁹"],"correctIndex":0},
  {"question":"pH of a neutral solution at 25°C is","options":["0","7","14","5"],"correctIndex":1},
  {"question":"The mass of one mole of carbon-12 is","options":["12 g","6 g","1 g","24 g"],"correctIndex":0},
  {"question":"The number of electrons in Na⁺ ion is","options":["10","11","12","9"],"correctIndex":0},
  {"question":"Isotopes have same","options":["Mass number","Atomic number","Neutrons","Mass"],"correctIndex":1},
  {"question":"The smallest particle of an element that retains its properties is","options":["Atom","Molecule","Ion","Electron"],"correctIndex":0},
  {"question":"The law of conservation of mass was given by","options":["Dalton","Lavoisier","Avogadro","Boyle"],"correctIndex":1},
  {"question":"The empirical formula of glucose is","options":["CH₂O","C₆H₁₂O₆","CHO","CH₄O"],"correctIndex":0},
  {"question":"Which of the following is a noble gas?","options":["Nitrogen","Oxygen","Argon","Hydrogen"],"correctIndex":2},
  {"question":"The valency of oxygen is","options":["1","2","3","4"],"correctIndex":1},
  {"question":"Which bond involves sharing of electrons?","options":["Ionic","Covalent","Hydrogen","Metallic"],"correctIndex":1},
  {"question":"NaCl is an example of","options":["Covalent compound","Ionic compound","Metal","Acid"],"correctIndex":1},
  {"question":"The chemical formula of washing soda is","options":["Na₂CO₃","NaHCO₃","Na₂CO₃·10H₂O","CaCO₃"],"correctIndex":2},
  {"question":"Plaster of Paris is chemically","options":["CaSO₄","CaSO₄·2H₂O","CaSO₄·½H₂O","CaCO₃"],"correctIndex":2},
  {"question":"Which acid is present in vinegar?","options":["Citric acid","Formic acid","Acetic acid","Lactic acid"],"correctIndex":2},
  {"question":"A base turns red litmus paper","options":["Blue","White","No change","Yellow"],"correctIndex":0},
  {"question":"The pH value of an acidic solution is","options":["Greater than 7","Equal to 7","Less than 7","14"],"correctIndex":2},
  {"question":"Which gas is evolved when acid reacts with metal?","options":["Oxygen","Hydrogen","Nitrogen","Carbon dioxide"],"correctIndex":1},
  {"question":"The gas used in photosynthesis is","options":["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],"correctIndex":2},
  {"question":"Which metal is liquid at room temperature?","options":["Sodium","Mercury","Aluminium","Iron"],"correctIndex":1},
  {"question":"The most abundant metal in Earth’s crust is","options":["Iron","Copper","Aluminium","Zinc"],"correctIndex":2},
  {"question":"Rusting of iron is an example of","options":["Reduction","Oxidation","Neutralization","Decomposition"],"correctIndex":1},
  {"question":"Which of the following prevents rusting?","options":["Painting","Moisture","Salt","Air"],"correctIndex":0},
  {"question":"Stainless steel is an alloy of","options":["Iron, carbon","Iron, chromium, nickel","Copper, zinc","Aluminium, iron"],"correctIndex":1},
  {"question":"Galvanization is coating iron with","options":["Copper","Zinc","Silver","Tin"],"correctIndex":1},
  {"question":"The ore of aluminium is","options":["Haematite","Bauxite","Calamine","Galena"],"correctIndex":1},
  {"question":"Which metal is extracted by electrolysis?","options":["Iron","Copper","Aluminium","Zinc"],"correctIndex":2},
  {"question":"Which metal is the best conductor of electricity?","options":["Copper","Silver","Aluminium","Iron"],"correctIndex":1},
  {"question":"Organic compounds mainly contain","options":["Carbon","Oxygen","Nitrogen","Sulphur"],"correctIndex":0},
  {"question":"The general formula of alkanes is","options":["CnH2n","CnH2n+2","CnH2n-2","CnHn"],"correctIndex":1},
  {"question":"Ethene belongs to","options":["Alkanes","Alkenes","Alkynes","Alcohols"],"correctIndex":1},
  {"question":"The functional group of alcohol is","options":["–COOH","–CHO","–OH","–CO"],"correctIndex":2},
  {"question":"Acetic acid belongs to","options":["Alcohol","Ketone","Carboxylic acid","Aldehyde"],"correctIndex":2},
  {"question":"Ethanol reacts with sodium to form","options":["Hydrogen","Oxygen","Carbon dioxide","Water"],"correctIndex":0},
  {"question":"Soap is sodium salt of","options":["Carboxylic acid","Alcohol","Ketone","Ester"],"correctIndex":0},
  {"question":"Detergents are more effective than soaps in","options":["Soft water","Hard water","Distilled water","Acidic water"],"correctIndex":1},
  {"question":"Which is a biodegradable substance?","options":["Plastic","Nylon","Paper","PVC"],"correctIndex":2},
  {"question":"PVC is a polymer of","options":["Ethene","Chloroethene","Propene","Ethyne"],"correctIndex":1},
  {"question":"The process of separation of cream from milk is","options":["Filtration","Sedimentation","Centrifugation","Evaporation"],"correctIndex":2},
  {"question":"Which method is used to separate salt from seawater?","options":["Filtration","Decantation","Evaporation","Centrifugation"],"correctIndex":2},
  {"question":"Chromatography is used to separate","options":["Liquids","Gases","Coloured substances","Solids"],"correctIndex":2},
  {"question":"The solvent used in chromatography is called","options":["Residue","Distillate","Mobile phase","Stationary phase"],"correctIndex":2},
  {"question":"Distillation is based on difference in","options":["Density","Solubility","Boiling point","Melting point"],"correctIndex":2},
  {"question":"Air is a","options":["Compound","Element","Mixture","Solution"],"correctIndex":2},
  {"question":"A homogeneous mixture is called","options":["Colloid","Suspension","Solution","Emulsion"],"correctIndex":2},
  {"question":"The Tyndall effect is shown by","options":["Solution","Colloid","Compound","Element"],"correctIndex":1},
  {"question":"An example of colloid is","options":["Salt solution","Milk","Sugar solution","Copper sulphate"],"correctIndex":1},
  {"question":"Pure substances have","options":["Fixed composition","Variable composition","No composition","Random composition"],"correctIndex":0},
  {"question":"The catalyst used in the Haber process for ammonia synthesis is","options":["Iron","Copper","Platinum","Nickel"],"correctIndex":0},
  {"question":"What is the approximate bond angle in a water molecule?","options":["90°","104.5°","109.5°","120°"],"correctIndex":1},
  {"question":"The functional group of an aldehyde is","options":["-OH","-CHO","-COOH","-CO-"],"correctIndex":1},
  {"question":"Which of the following is the strongest oxidizing agent?","options":["Fluorine","Chlorine","Oxygen","Nitrogen"],"correctIndex":0},
  {"question":"Hardness of water is primarily caused by the presence of","options":["Sodium and Potassium ions","Calcium and Magnesium ions","Iron and Copper ions","Chloride and Nitrate ions"],"correctIndex":1},
  {"question":"Dry ice is a solid form of","options":["Oxygen","Nitrogen","Carbon dioxide","Methane"],"correctIndex":2},
  {"question":"The equation PV = nRT is known as the","options":["Boyles Law","Charles Law","Ideal Gas Law","Avogadros Law"],"correctIndex":2},
  {"question":"According to Bohrs model, the energy of an electron is","options":["Quantized","Continuous","Zero","Infinite"],"correctIndex":0},
  {"question":"Fog is a colloidal system of","options":["Gas in liquid","Liquid in gas","Liquid in liquid","Solid in gas"],"correctIndex":1},
  {"question":"The electrolyte used in a lead-acid storage battery is","options":["Nitric acid","Sulfuric acid","Hydrochloric acid","Acetic acid"],"correctIndex":1}
];

const MATHS_DATA = [
  {"question":"The value of sin 30° is","options":["0","1/2","√3/2","1"],"correctIndex":1},
  {"question":"The value of cos 60° is","options":["1","0","1/2","√3/2"],"correctIndex":2},
  {"question":"The value of tan 45° is","options":["0","1","√3","1/√3"],"correctIndex":1},
  {"question":"sin²A + cos²A is equal to","options":["0","1","2","sin 2A"],"correctIndex":1},
  {"question":"The value of sec 0° is","options":["0","1","∞","Undefined"],"correctIndex":1},
  {"question":"The value of cosec 90° is","options":["0","1","∞","Undefined"],"correctIndex":1},
  {"question":"If sin A = 1/2, then A is","options":["30°","45°","60°","90°"],"correctIndex":0},
  {"question":"tan A = sin A / cos A represents","options":["Identity","Equation","Function","Formula"],"correctIndex":0},
  {"question":"The value of cos 0° is","options":["0","1","1/2","√3/2"],"correctIndex":1},
  {"question":"If sin A = cos A, then A equals","options":["0°","30°","45°","60°"],"correctIndex":2},
  {"question":"The degree of polynomial 5x³ + 3x² − 7 is","options":["1","2","3","4"],"correctIndex":2},
  {"question":"A quadratic polynomial has degree","options":["1","2","3","4"],"correctIndex":1},
  {"question":"The zeroes of a polynomial are the values of x for which","options":["Polynomial is maximum","Polynomial is minimum","Polynomial is zero","Polynomial is constant"],"correctIndex":2},
  {"question":"The number of zeroes of a linear polynomial is","options":["0","1","2","Infinite"],"correctIndex":1},
  {"question":"The graph of a linear polynomial is a","options":["Curve","Circle","Straight line","Parabola"],"correctIndex":2},
  {"question":"The graph of a quadratic polynomial is a","options":["Line","Circle","Parabola","Ellipse"],"correctIndex":2},
  {"question":"The value of polynomial x² − 4 at x = 2 is","options":["0","2","4","-4"],"correctIndex":0},
  {"question":"If α and β are zeroes of x² − 5x + 6, then α + β is","options":["5","6","-5","-6"],"correctIndex":0},
  {"question":"If α and β are zeroes of x² − 5x + 6, then αβ is","options":["5","6","-5","-6"],"correctIndex":1},
  {"question":"A polynomial of degree zero is","options":["Linear","Quadratic","Constant","Cubic"],"correctIndex":2},
  {"question":"The solution of equation x² = 4 is","options":["1","2","±2","0"],"correctIndex":2},
  {"question":"The standard form of quadratic equation is","options":["ax²+bx+c=0","x²+ax+b=0","ax²+bx=0","x²+bx+c=0"],"correctIndex":0},
  {"question":"The nature of roots depends on","options":["a","b","c","Discriminant"],"correctIndex":3},
  {"question":"If discriminant is zero, roots are","options":["Real and unequal","Real and equal","Complex","Imaginary"],"correctIndex":1},
  {"question":"If discriminant is negative, roots are","options":["Real","Rational","Complex","Equal"],"correctIndex":2},
  {"question":"The discriminant of ax²+bx+c=0 is","options":["b²−4ac","4ac−b²","b²+4ac","a²−4bc"],"correctIndex":0},
  {"question":"The roots of x²−9=0 are","options":["3","−3","±3","0"],"correctIndex":2},
  {"question":"The quadratic formula is","options":["(-b±√(b²−4ac))/2a","(b±√(b²−4ac))/2a","(-b±√(b²+4ac))/2a","(b±√(b²+4ac))/2a"],"correctIndex":0},
  {"question":"A quadratic equation has how many roots?","options":["1","2","3","Infinite"],"correctIndex":1},
  {"question":"If a=0, the equation becomes","options":["Quadratic","Linear","Cubic","Constant"],"correctIndex":1},
  {"question":"The distance formula is","options":["√(x²+y²)","√[(x₂−x₁)²+(y₂−y₁)²]","(x₂−x₁)+(y₂−y₁)","√(x₂+y₂)"],"correctIndex":1},
  {"question":"The coordinates of origin are","options":["(1,0)","(0,1)","(0,0)","(1,1)"],"correctIndex":2},
  {"question":"The midpoint of line joining (x₁,y₁) and (x₂,y₂) is","options":["((x₁+x₂)/2,(y₁+y₂)/2)","(x₁+x₂,y₁+y₂)","(x₁−x₂,y₁−y₂)","((x₁−x₂)/2,(y₁−y₂)/2)"],"correctIndex":0},
  {"question":"The slope of x-axis is","options":["0","1","∞","−1"],"correctIndex":0},
  {"question":"The slope of y-axis is","options":["0","1","∞","−1"],"correctIndex":2},
  {"question":"A point on x-axis has y-coordinate","options":["1","0","−1","Any value"],"correctIndex":1},
  {"question":"A point on y-axis has x-coordinate","options":["1","0","−1","Any value"],"correctIndex":1},
  {"question":"The area of triangle formed by points on same line is","options":["1","2","0","Undefined"],"correctIndex":2},
  {"question":"Collinear points lie on","options":["Circle","Plane","Same line","Triangle"],"correctIndex":2},
  {"question":"The distance between identical points is","options":["1","0","∞","Undefined"],"correctIndex":1},
  {"question":"The value of log₁₀1 is","options":["0","1","10","Undefined"],"correctIndex":0},
  {"question":"The value of log₁₀10 is","options":["0","1","10","Undefined"],"correctIndex":1},
  {"question":"log(ab) equals","options":["log a + log b","log a − log b","log a × log b","log a / log b"],"correctIndex":0},
  {"question":"log(a/b) equals","options":["log a + log b","log a − log b","log a × log b","log b − log a"],"correctIndex":1},
  {"question":"log a² equals","options":["2 log a","log 2a","(log a)²","log a / 2"],"correctIndex":0},
  {"question":"The value of log₁₀(100) is","options":["1","2","10","0"],"correctIndex":1},
  {"question":"If log x = 2, then x is","options":["2","10","100","1000"],"correctIndex":2},
  {"question":"The base of common logarithm is","options":["2","e","10","1"],"correctIndex":2},
  {"question":"The logarithm of a negative number is","options":["0","Defined","Undefined","1"],"correctIndex":2},
  {"question":"log 1/x equals","options":["log x","−log x","1/log x","log x²"],"correctIndex":1},
  {"question":"The derivative of sin x with respect to x is","options":["cos x","-cos x","tan x","sec x"],"correctIndex":0},
  {"question":"The integral of e^x dx is","options":["e^x + C","e^2x + C","log x + C","x e^x + C"],"correctIndex":0},
  {"question":"The value of integral from 0 to π/2 of sin x dx is","options":["0","1","π","1/2"],"correctIndex":1},
  {"question":"The order of the differential equation (dy/dx)² + y = 0 is","options":["1","2","0","3"],"correctIndex":0},
  {"question":"The dot product of two perpendicular vectors is","options":["1","-1","0","Product of magnitudes"],"correctIndex":2},
  {"question":"The magnitude of a unit vector is","options":["0","1","Infinity","-1"],"correctIndex":1},
  {"question":"The probability of a sure event is","options":["0","1","0.5","Infinity"],"correctIndex":1},
  {"question":"A matrix with equal number of rows and columns is a","options":["Row matrix","Column matrix","Square matrix","Identity matrix"],"correctIndex":2},
  {"question":"The determinant of an identity matrix is","options":["0","1","-1","Any value"],"correctIndex":1},
  {"question":"If f(x) = x², then f(3) is","options":["6","9","3","27"],"correctIndex":1}
];

const generateMockQuestions = (subject: SubjectType): Question[] => {
  let baseData: { question: string; options: string[]; correctIndex: number }[] = [];
  
  if (subject === 'Physics') baseData = PHYSICS_DATA;
  else if (subject === 'Chemistry') baseData = CHEMISTRY_DATA;
  else if (subject === 'Mathematics') baseData = MATHS_DATA;

  const questions: Question[] = baseData.map((q, i) => ({
    id: `${subject.toLowerCase()}_${i + 1}`,
    subject,
    text: q.question,
    options: q.options,
    correctIndex: q.correctIndex
  }));

  // Should not happen now as we have 60 questions per subject, but kept for robustness
  while (questions.length < 60) {
    const i = questions.length;
    questions.push({
      id: `${subject.toLowerCase()}_${i + 1}`,
      subject,
      text: `KCET ${subject} Question ${i + 1}: Based on typical competitive patterns, identify the correct theoretical property associated with this unit?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: Math.floor(Math.random() * 4)
    });
  }

  return questions.slice(0, 60);
};

export const seedQuestions = async (): Promise<void> => {
  if (!isFirebaseConfigured) {
    console.warn("Seeding skipped: Firebase keys not provided.");
    return;
  }
  try {
    const subjects: SubjectType[] = ['Physics', 'Chemistry', 'Mathematics'];
    console.log("Starting Seeding Process...");

    for (const subject of subjects) {
      const questions = generateMockQuestions(subject);
      console.log(`Seeding ${subject}...`);
      
      const batch = writeBatch(db);
      questions.forEach((q) => {
        const docRef = doc(collection(db, 'questions'), q.id);
        batch.set(docRef, q);
      });
      await batch.commit();
    }
    console.log("Seeding Complete!");
  } catch (error) {
    console.error("Error seeding questions:", error);
    throw error;
  }
};

export const fetchQuestions = async (subject: SubjectType): Promise<Question[]> => {
  if (!isFirebaseConfigured) {
    return generateMockQuestions(subject);
  }

  try {
    const q = query(collection(db, 'questions'), where('subject', '==', subject));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return generateMockQuestions(subject);
    }

    const fetched = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
    
    return fetched.length >= 60 ? fetched.slice(0, 60) : generateMockQuestions(subject);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return generateMockQuestions(subject);
  }
};

export const saveUser = async (name: string, mobile?: string): Promise<string> => {
  const localId = `user_${Date.now()}`;
  
  if (!isFirebaseConfigured) {
    return localId;
  }

  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name,
      mobile,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    return localId;
  }
};

export const saveAttempt = async (attempt: Omit<Attempt, 'timestamp'>): Promise<void> => {
  if (!isFirebaseConfigured) return;
  try {
    await addDoc(collection(db, 'attempts'), {
      ...attempt,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving attempt:", error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
            const personalDetailsSection = document.getElementById('personal-details-section');
            const questionnaireSection = document.getElementById('questionnaire-section');
            const nextBtn = document.getElementById('next-btn');
            const backBtn = document.getElementById('back-btn');
            const submitBtn = document.getElementById('submit-btn');
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            const successMessage = document.getElementById('success-message');

            const idProofSelect = document.getElementById('idProof');
            const idProofNumberContainer = document.getElementById('idProofNumberContainer');
            const idProofNumberLabel = document.getElementById('idProofNumberLabel');
            const idProofNumberInput = document.getElementById('idProofNumber');
            const idProofNumberError = document.getElementById('idProofNumber-error');
            const idProofError = document.getElementById('idProof-error');

            const workExperienceContainer = document.getElementById('work-experience-container');
            const addWorkExperienceBtn = document.getElementById('add-work-experience-btn');
            const educationContainer = document.getElementById('education-container');
            const addEducationBtn = document.getElementById('add-education-btn');
            const skillsContainer = document.getElementById('skills-container');
            const addSkillBtn = document.getElementById('add-skill-btn');

            let personalInputs = personalDetailsSection.querySelectorAll('input, select, textarea');
            let questionnaireInputs = questionnaireSection.querySelectorAll('input, select, textarea');
            // Force phone input to accept only numbers
            const phoneInput = document.getElementById("phone");
            if (phoneInput) {
                phoneInput.addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, ""); // Remove non-digits
                });
            }

            // To store the form data
            const formData = {};

            let currentSection = 1;

            // Function to validate a single field
            const validateField = (input) => {
                const errorElement = document.getElementById(`${input.id}-error`);
                let isValid = true;
                const value = input.value.trim();

                if (input.type === 'text' || input.type === 'textarea' || input.tagName === 'SELECT') {
                    isValid = value !== '';
                } else if (input.type === 'date') {
                    isValid = value !== '';
                } else if (input.type === 'tel') {
                    const phoneRegex = /^\d{10}$/;
                    isValid = phoneRegex.test(value);
                } else if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value);
                }else if (input.type === 'url') {
                    try {
                        new URL(value);
                        isValid = true;
                    } catch {
                        isValid = false;
                    }
                } else if (input.type === 'file') {
                    isValid = input.files.length > 0;
                }

                if (!isValid) {
                    input.classList.add('input-error');
                    input.classList.remove('input-valid');
                    if (errorElement) errorElement.style.display = 'block';
                } else {
                    input.classList.remove('input-error');
                    input.classList.add('input-valid');
                    if (errorElement) errorElement.style.display = 'none';
                }
                return isValid;
            };

            // Validate ID Proof Type
            const validateIdProofType = () => {
                if (idProofSelect.value === "") {
                    idProofError.style.display = "block";
                    return false;
                } else {
                    idProofError.style.display = "none";
                    return true;
                }
            };

            // Validate ID Proof Number
            const validateIdProofNumber = () => {
                const value = idProofNumberInput.value.trim();
                const type = idProofSelect.value;

                if (type === "") {
                    idProofNumberError.textContent = "Please select ID proof type first.";
                    idProofNumberError.style.display = "block";
                    return false;
                }

                let regex, errorMessage;
                switch (type) {
                    case "aadhar":
                        regex = /^\d{12}$/;
                        errorMessage = "Enter 12-digit Aadhar number.";
                        break;
                    case "passport":
                        regex = /^[A-Z]{1}[0-9]{7}$/;
                        errorMessage = "Enter valid Passport number (1 letter, 7 digits).";
                        break;
                    case "driverLicense":
                        regex = /^[A-Z]{2}[0-9]{2}[0-9]{11}$/;
                        errorMessage = "Enter valid DL number (2 letters, 2 digits, 11 digits).";
                        break;
                    case "voterId":
                        regex = /^[A-Z]{3}[0-9]{7}$/;
                        errorMessage = "Enter valid Voter ID (3 letters, 7 digits).";
                        break;
                    default:
                        regex = /.*/;
                        errorMessage = "Enter valid ID number.";
                        break;
                }

                if (!regex.test(value)) {
                    idProofNumberError.textContent = errorMessage;
                    idProofNumberError.style.display = "block";
                    return false;
                } else {
                    idProofNumberError.style.display = "none";
                    return true;
                }
            };

            // Show/hide ID Proof Number field
            idProofSelect.addEventListener('change', () => {
                const selectedValue = idProofSelect.value;
                const selectedText = idProofSelect.options[idProofSelect.selectedIndex].text;

                if (selectedValue && selectedValue !== '') {
                    idProofNumberContainer.style.display = 'block';
                    idProofNumberLabel.textContent = `${selectedText} Number`;
                } else {
                    idProofNumberContainer.style.display = 'none';
                    idProofNumberLabel.textContent = 'ID Proof Number';
                    idProofNumberInput.value = "";
                    idProofNumberError.style.display = "none";
                }
            });

            // Add real-time validation listeners
            personalInputs.forEach(input => {
                if (input.id === "idProof") {
                    input.addEventListener('change', validateIdProofType);
                } else if (input.id === "idProofNumber") {
                    input.addEventListener('input', validateIdProofNumber);
                } else {
                    input.addEventListener('input', () => validateField(input));
                }
            });
            questionnaireInputs.forEach(input => {
                input.addEventListener('input', () => validateField(input));
            });

            // Function to validate an entire section
            const validateSection = (sectionInputs) => {
                let allValid = true;
                sectionInputs.forEach(input => {
                    if (input.id === "idProof") {
                        if (!validateIdProofType()) allValid = false;
                    } else if (input.id === "idProofNumber" && idProofNumberContainer.style.display !== 'none') {
                        if (!validateIdProofNumber()) allValid = false;
                    } else {
                        if (!validateField(input)) allValid = false;
                    }
                });
                return allValid;
            };

            // Section transition logic
            nextBtn.addEventListener('click', () => {
                if (validateSection(personalInputs)) {
                    personalDetailsSection.classList.add('animate-out-left');

                    setTimeout(() => {
                        personalDetailsSection.classList.add('hidden');
                        questionnaireSection.classList.remove('hidden');
                        questionnaireSection.classList.add('animate-in-right');
                        currentSection = 2;

                        step1.classList.remove('active');
                        step1.classList.add('completed');
                        step2.classList.add('active');

                        personalDetailsSection.classList.remove('animate-out-left');
                        questionnaireSection.classList.remove('animate-in-right');
                    }, 600);
                }
            });

            backBtn.addEventListener('click', () => {
                questionnaireSection.classList.add('animate-out-right');

                setTimeout(() => {
                    questionnaireSection.classList.add('hidden');
                    personalDetailsSection.classList.remove('hidden');
                    personalDetailsSection.classList.add('animate-in-left');
                    currentSection = 1;

                    step1.classList.remove('completed');
                    step1.classList.add('active');
                    step2.classList.remove('active');

                    questionnaireSection.classList.remove('animate-out-right');
                    personalDetailsSection.classList.remove('animate-in-left');
                }, 600);
            });

            // Dynamic Form Fields and Logic
           addWorkExperienceBtn.addEventListener('click', () => {
                const newEntry = document.createElement('div');
                newEntry.classList.add('form-grid-item', 'md-full-width', 'work-experience-entry');
                newEntry.innerHTML = `
                    <div class="relative-container">
                        <label>Company Name</label>
                        <input type="text" class="work-experience-company" style="margin: 10px 0;">
                        
                        <label>Date of Joining</label>
                        <input type="date" class="work-experience-joining" style="margin: 10px 0;">
                        
                        <label>Date of Leaving</label>
                        <input type="date" class="work-experience-leaving" style="margin: 10px 0;">
                        
                        <label>Years of Working</label>
                        <input type="text" class="work-experience-years" readonly style="margin: 10px 0;">
                        
                        <button class="delete-btn" title="Remove work experience">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                `;
                workExperienceContainer.appendChild(newEntry);
                updateListeners();
            });

            addEducationBtn.addEventListener('click', () => {
                const newEntry = document.createElement('div');
                newEntry.classList.add('form-grid-item', 'md-full-width', 'education-entry');
                newEntry.innerHTML = `
                    <div class="relative-container">
                        <label>Institution Name</label>
                        <input type="text" class="education-institution" style="margin: 10px 0;">
                        
                        <label>Degree/Course</label>
                        <input type="text" class="education-degree" style="margin: 10px 0;">
                        
                        <label>Year of Graduation</label>
                        <input type="date" class="education-year" style="margin: 10px 0;">
                        
                        <button class="delete-btn" title="Remove education entry">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                `;
                educationContainer.appendChild(newEntry);
                updateListeners();
            });

            addSkillBtn.addEventListener('click', () => {
                const newEntry = document.createElement('div');
                newEntry.classList.add('form-grid-item', 'md-full-width', 'skill-entry');
                newEntry.innerHTML = `
                    <div class="relative-container">
                        <label>Technical Skill</label>
                        <input type="text" class="technical-skill" style="margin: 10px 0;">
                        
                        <button class="delete-btn" title="Remove skill">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                `;
                skillsContainer.appendChild(newEntry);
                updateListeners();
            });


            function calculateYears(joiningDate, leavingDate) {
                if (!joiningDate || !leavingDate) return '';
                const start = new Date(joiningDate);
                const end = new Date(leavingDate);
                let years = end.getFullYear() - start.getFullYear();
                const months = end.getMonth() - start.getMonth();
                if (months < 0 || (months === 0 && end.getDate() < start.getDate())) {
                    years--;
                }
                return `${years} years`;
            }

            function updateListeners() {
                // Update the input lists for validation and data collection
                personalInputs = personalDetailsSection.querySelectorAll('input, select, textarea');
                questionnaireInputs = questionnaireSection.querySelectorAll('input, select, textarea');

                // Add event listeners for dynamic work experience fields
                workExperienceContainer.querySelectorAll('.work-experience-joining, .work-experience-leaving').forEach(input => {
                    input.addEventListener('change', (e) => {
                        const parent = e.target.closest('.work-experience-entry');
                        const joiningInput = parent.querySelector('.work-experience-joining');
                        const leavingInput = parent.querySelector('.work-experience-leaving');
                        const yearsInput = parent.querySelector('.work-experience-years');

                        yearsInput.value = calculateYears(joiningInput.value, leavingInput.value);
                    });
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.target.closest('.form-grid-item').remove();
                        updateListeners(); // Re-run to update the input lists
                    });
                });
            }

            submitBtn.addEventListener('click', (event) => {
                event.preventDefault();
                
                // Manually validate all fields including dynamic ones
                let allFieldsValid = true;
                personalDetailsSection.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.id === 'idProofNumber' && idProofNumberContainer.style.display === 'none') {
                        return;
                    }
                    if (!input.value && input.type !== 'file' && !input.readOnly) {
                        allFieldsValid = false;
                        document.getElementById(`${input.id}-error`).style.display = 'block';
                    }
                });

                questionnaireSection.querySelectorAll('input, select, textarea').forEach(input => {
                    if (!input.value && input.type !== 'file' && !input.readOnly) {
                        allFieldsValid = false;
                        const errorElement = document.getElementById(`${input.id}-error`);
                        if (errorElement) {
                             errorElement.style.display = 'block';
                        }
                    }
                });
                
                if (allFieldsValid) {
                    const personalData = {};
                    personalDetailsSection.querySelectorAll('input, select, textarea').forEach(input => {
                        if (input.id !== 'idProofNumber') {
                            personalData[input.id] = input.type === 'file' ? input.files[0]?.name : input.value;
                        }
                    });

                    const workExperience = [];
                    workExperienceContainer.querySelectorAll('.work-experience-entry').forEach(entry => {
                        workExperience.push({
                            company: entry.querySelector('.work-experience-company').value,
                            date_of_joining: entry.querySelector('.work-experience-joining').value,
                            date_of_leaving: entry.querySelector('.work-experience-leaving').value,
                            years_of_working: entry.querySelector('.work-experience-years').value
                        });
                    });

                    const education = [];
                    educationContainer.querySelectorAll('.education-entry').forEach(entry => {
                        education.push({
                            institution: entry.querySelector('.education-institution').value,
                            degree: entry.querySelector('.education-degree').value,
                            graduation_year: entry.querySelector('.education-year').value
                        });
                    });

                    const skills = [];
                    skillsContainer.querySelectorAll('.skill-entry').forEach(entry => {
                        skills.push(entry.querySelector('.technical-skill').value);
                    });
                    
                    const otherData = {};
                    const otherInputs = ['motivation', 'reason', 'portfolio', 'linkedin', 'github', 'careerGoals'];
                    otherInputs.forEach(id => {
                        const input = document.getElementById(id);
                        if (input) {
                            otherData[id] = input.value;
                        }
                    });

                    const finalFormData = {
                        ...personalData,
                        work_experience: workExperience,
                        education: education,
                        technical_skills: skills,
                        ...otherData
                    };

                    console.log("Structured form data ready to be sent to a backend for SQL storage:", finalFormData);
                    
                    questionnaireSection.classList.add('animate-out-left');
                    setTimeout(() => {
                        questionnaireSection.classList.add('hidden');
                        successMessage.style.display = 'flex';
                    }, 600);
                } else {
                    console.log("Please fill out all required fields.");
                }
            });
        });

                     
              const countrySelect = document.getElementById("country");
                const stateSelect = document.getElementById("state");
                const districtSelect = document.getElementById("district");

                const indiaData = {
                    "Andhra Pradesh": ["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
                    "Arunachal Pradesh": ["Tawang","West Kameng","East Kameng","Papum Pare","West Siang","East Siang","Upper Siang","Lower Siang","Upper Subansiri","Lower Subansiri","Kurung Kumey","Kra Daadi","Pangin","Siang","Anjaw","Changlang","Lohit","Namsai","Tirap","Longding"],
                    "Assam": ["Baksa","Bajali","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],
                    "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
                    "Chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"],
                    "Goa": ["North Goa","South Goa"],
                    "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udepur","Dahod","Dang","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kachchh","Kheda","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
                    "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
                    "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kullu","Mandi","Shimla","Sirmaur","Solan","Una"],
                    "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela-Kharsawan","Simdega","West Singhbhum"],
                    "Karnataka": ["Bagalkot","Bangalore Rural","Bangalore Urban","Belagavi","Bellary","Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Gulbarga","Hassan","Haveri","Kodagu","Kolar","Koppal","Mandya","Mysore","Raichur","Ramanagara","Shimoga","Tumkur","Udupi","Uttara Kannada","Yadgir"],
                    "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
                    "Madhya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
                    "Maharashtra": ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
                    "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
                    "Meghalaya": ["East Garo Hills","East Khasi Hills","Jaintia Hills","Ri Bhoi","West Garo Hills","West Khasi Hills"],
                    "Mizoram": ["Aizawl","Champhai","Hnahthial","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Saitual","Serchhip"],
                    "Nagaland": ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"],
                    "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khurda","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"],
                    "Puducherry": ["Karaikal","Mahe","Puducherry","Yanam"],
                    "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Pathankot","Patiala","Rupnagar","Sangrur","SAS Nagar","Tarn Taran"],
                    "Rajasthan": ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
                    "Sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],
                    "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
                    "Telangana": ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Komaram Bheem Asifabad","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"],
                    "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
                    "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Rae Bareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharth Nagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
                    "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
                    "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"]
                };

                // Populate states when India is selected
                countrySelect.addEventListener("change", () => {
                    stateSelect.innerHTML = '<option value="">-- Select State --</option>';
                    districtSelect.innerHTML = '<option value="">-- Select District --</option>';

                    if (countrySelect.value === "India") {
                        Object.keys(indiaData).forEach(state => {
                            stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
                        });
                    }
                });

                // Populate districts when a state is selected
                stateSelect.addEventListener("change", () => {
                    districtSelect.innerHTML = '<option value="">-- Select District --</option>';
                    if (indiaData[stateSelect.value]) {
                        indiaData[stateSelect.value].forEach(dist => {
                            districtSelect.innerHTML += `<option value="${dist}">${dist}</option>`;
                        });
                }
});

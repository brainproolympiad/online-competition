import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCalendar, FaMapMarkerAlt, FaHome, } from "react-icons/fa";
const statesAndLgas = {
    Abia: [
        "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North",
        "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo",
        "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"
    ],
    Adamawa: [
        "Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde",
        "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan",
        "Shelleng", "Song", "Toungo", "Yola North", "Yola South"
    ],
    AkwaIbom: [
        "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan",
        "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ikot Abasi", "Ikot Ekpene", "Ini",
        "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara",
        "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko",
        "Uyo"
    ],
    Anambra: [
        "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South",
        "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala",
        "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South",
        "Orumba North", "Orumba South", "Oyi"
    ],
    Bauchi: [
        "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa",
        "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira",
        "Tafawa Balewa", "Toro", "Warji", "Zaki"
    ],
    Bayelsa: [
        "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw",
        "Yenagoa"
    ],
    Benue: [
        "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West",
        "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo",
        "Ohimini", "Oju", "Okpokwu", "Oturkpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"
    ],
    Borno: [
        "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa",
        "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga",
        "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar",
        "Monguno", "Ngala", "Nganzai", "Shani"
    ],
    CrossRiver: [
        "Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal",
        "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani",
        "Ogoja", "Yakuur", "Yala"
    ],
    Delta: [
        "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West",
        "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East",
        "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele",
        "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North",
        "Warri South", "Warri South West"
    ],
    Ebonyi: [
        "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South",
        "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
    ],
    Edo: [
        "Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East",
        "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha",
        "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West",
        "Uhunmwonde"
    ],
    Ekiti: [
        "Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure",
        "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun",
        "Ise/Orun", "Moba", "Oye"
    ],
    Enugu: [
        "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti",
        "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West",
        "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"
    ],
    Gombe: [
        "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami",
        "Nafada", "Shongom", "Yamaltu/Deba"
    ],
    Imo: [
        "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North",
        "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli",
        "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema",
        "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North",
        "Owerri West", "Unuimo"
    ],
    Jigawa: [
        "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki",
        "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure",
        "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim",
        "Roni", "Sule Tankarkar", "Taura", "Yankwashi"
    ],
    Kaduna: [
        "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia",
        "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau",
        "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"
    ],
    Kano: [
        "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta",
        "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam",
        "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya",
        "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa",
        "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa",
        "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"
    ],
    Katsina: [
        "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume",
        "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa",
        "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada",
        "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa",
        "Safana", "Sandamu", "Zango"
    ],
    Kebbi: [
        "Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza",
        "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski",
        "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"
    ],
    Kogi: [
        "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu",
        "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo",
        "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"
    ],
    Kwara: [
        "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South",
        "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun",
        "Pategi"
    ],
    Lagos: [
        "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
        "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe",
        "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu",
        "Surulere"
    ],
    Nasarawa: [
        "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa",
        "Nasarawa Egon", "Obi", "Toto", "Wamba"
    ],
    Niger: [
        "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako",
        "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu",
        "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"
    ],
    Ogun: [
        "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South",
        "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode",
        "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside",
        "Remo North", "Shagamu"
    ],
    Ondo: [
        "Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West",
        "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo",
        "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"
    ],
    Osun: [
        "Aiyedade", "Aiyedire", "Atakunmosa East", "Atakunmosa West", "Boluwaduro",
        "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East",
        "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West",
        "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda",
        "Oriade", "Orolu", "Osogbo"
    ],
    Oyo: [
        "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East",
        "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
        "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa",
        "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo",
        "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East",
        "Saki West", "Surulere"
    ],
    Plateau: [
        "Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam",
        "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin",
        "Qua'an Pan", "Riyom", "Shendam", "Wase"
    ],
    Rivers: [
        "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru",
        "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana",
        "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro",
        "Oyigbo", "Port Harcourt", "Tai"
    ],
    Sokoto: [
        "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa",
        "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame",
        "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno",
        "Yabo"
    ],
    Taraba: [
        "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido",
        "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"
    ],
    Yobe: [
        "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani",
        "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"
    ],
    Zamfara: [
        "Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau",
        "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"
    ],
    FCT: [
        "Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"
    ]
};
const PersonalInfo = ({ formData, setFormData, setStepValid }) => {
    const [selectedState, setSelectedState] = useState(formData.state || "");
    // ✅ Real-time validation
    useEffect(() => {
        const { fullName, email, phone, gender, dob, state, lga, address } = formData;
        const isValid = fullName?.trim() &&
            /\S+@\S+\.\S+/.test(email || "") &&
            phone?.length >= 10 &&
            gender &&
            dob &&
            state &&
            lga &&
            address?.trim();
        setStepValid(!!isValid);
    }, [formData, setStepValid]);
    return (_jsxs("div", { className: "bg-white shadow-md rounded-2xl p-6 md:p-10", children: [_jsxs("div", { className: "text-center mb-10", children: [_jsxs("h2", { className: "text-2xl md:text-3xl font-bold text-blue-700 flex items-center justify-center gap-3", children: [_jsx(FaUser, { className: "text-blue-600" }), " Personal Information"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Please fill in all required details carefully." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaUser, { className: "mr-2 text-blue-600" }), " Full Name *"] }), _jsx("input", { type: "text", placeholder: "Enter your full name", value: formData.fullName || "", onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaEnvelope, { className: "mr-2 text-blue-600" }), " Email Address *"] }), _jsx("input", { type: "email", placeholder: "your.email@example.com", value: formData.email || "", onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaPhone, { className: "mr-2 text-blue-600" }), " Phone Number *"] }), _jsx("input", { type: "tel", placeholder: "08012345678", value: formData.phone || "", onChange: (e) => setFormData({ ...formData, phone: e.target.value }), className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaVenusMars, { className: "mr-2 text-blue-600" }), " Gender *"] }), _jsxs("select", { value: formData.gender || "", onChange: (e) => setFormData({ ...formData, gender: e.target.value }), className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white", children: [_jsx("option", { value: "", children: "Select gender" }), _jsx("option", { value: "Male", children: "Male" }), _jsx("option", { value: "Female", children: "Female" }), _jsx("option", { value: "Other", children: "Other" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaCalendar, { className: "mr-2 text-blue-600" }), " Date of Birth *"] }), _jsx("input", { type: "date", value: formData.dob || "", onChange: (e) => setFormData({ ...formData, dob: e.target.value }), className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2 text-blue-600" }), " State of Origin *"] }), _jsxs("select", { value: selectedState, onChange: (e) => {
                                    const state = e.target.value;
                                    setSelectedState(state);
                                    setFormData({ ...formData, state, lga: "" });
                                }, className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white", children: [_jsx("option", { value: "", children: "Select State" }), Object.keys(statesAndLgas).map((state) => (_jsx("option", { value: state, children: state }, state)))] })] }), selectedState && (_jsxs("div", { children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2 text-blue-600" }), " Local Government Area *"] }), _jsxs("select", { value: formData.lga || "", onChange: (e) => setFormData({ ...formData, lga: e.target.value }), className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white", children: [_jsx("option", { value: "", children: "Select LGA" }), statesAndLgas[selectedState]?.map((lga) => (_jsx("option", { value: lga, children: lga }, lga)))] })] })), _jsxs("div", { className: "md:col-span-2", children: [_jsxs("label", { className: "text-gray-700 font-medium mb-1 flex items-center", children: [_jsx(FaHome, { className: "mr-2 text-blue-600" }), " Home Address *"] }), _jsx("textarea", { placeholder: "Enter your complete home address", value: formData.address || "", onChange: (e) => setFormData({ ...formData, address: e.target.value }), rows: 3, className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] })] }), _jsx("div", { className: "bg-blue-50 border border-blue-100 p-4 rounded-lg mt-8 text-sm text-blue-800", children: _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Note:" }), " All fields marked with * are required. Your information is confidential and will only be used for registration."] }) })] }));
};
export default PersonalInfo;

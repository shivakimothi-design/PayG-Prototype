/* ============================================================
   Default configurations for Partner/Admin and Rohit flows.
   Admin panel overrides are stored in localStorage.
   ============================================================ */

const defaultPartnerConfig = {
  intro: {
    title: "PayG को समझना ज़रूरी है!",
    body: 'PayG मॉडल पर काम शुरू करने से पहले, एक <u>छोटा वीडियो</u> देखें और एक <u>क्विज़</u> पूरा करें। इससे आपकी कमाई शुरू होगी।',
    cta: "शुरू करें"
  },
  video: {
    url: "",
    title: "PayG समझें — वीडियो देखें"
  },
  quiz: [
    {
      question: "PayG connection बुक होने के लिए customer सबसे पहले क्या देता है?",
      options: [
        "₹300 security fee",
        "₹100 booking fee",
        "₹500 advance",
        "₹100 recharge"
      ],
      correct: 1,
      explanation: "PayG connection बुक करने के लिए customer सबसे पहले ₹100 booking fee देता है।"
    },
    {
      question: "Connection लगने के दिन customer को क्या देना होता है?",
      options: [
        "₹100 booking fee",
        "₹300 installation fee",
        "₹300 NetBox security fee",
        "₹300 recharge"
      ],
      correct: 2,
      explanation: "Connection लगने के दिन customer को ₹300 NetBox security fee देनी होती है।"
    },
    {
      question: "Connection लगने के बाद internet शुरू में कितने दिन चलता है?",
      options: [
        "1 दिन",
        "2 दिन",
        "5 दिन",
        "7 दिन"
      ],
      correct: 1,
      explanation: "Connection लगने के बाद internet शुरू में 2 दिन चलता है।"
    },
    {
      question: "PayG मॉडल में customer internet कैसे चलाता है?",
      options: [
        "हर महीने 30 दिन का recharge करना जरूरी है",
        "customer अपनी जरूरत के अनुसार किसी भी दिन का recharge कर सकता है",
        "केवल 7 दिन का recharge कर सकता है",
        "केवल 30 दिन का recharge कर सकता है"
      ],
      correct: 1,
      explanation: "PayG मॉडल में customer अपनी जरूरत के अनुसार किसी भी दिन का recharge कर सकता है।"
    },
    {
      question: "Partner को PayG payout पाने के लिए क्या सुनिश्चित करना होता है?",
      options: [
        "Customer 30 दिन का recharge करे",
        "ISP recharge पूरे 30 दिन का active रहे",
        "Customer रोज recharge करे",
        "Customer 100 Mbps plan ले"
      ],
      correct: 1,
      explanation: "Partner को PayG payout पाने के लिए ISP recharge पूरे 30 दिन का active रहना चाहिए।"
    }
  ],
  success: {
    title: "बधाई हो!",
    subtitle: 'आपने PayG सिस्टम की सभी बातें समझ ली हैं। अब आपको हर <strong>नए सफल इंस्टॉल</strong> पर मिलेंगे',
    payout: "₹300 प्रति नया इंस्टॉल",
    note: "ध्यान दें: पुराना नियम (churned कस्टमर पर ₹300) अब लागू नहीं है। यह पेआउट सिर्फ नए इंस्टॉल पर मिलेगा।",
    cta: "आगे बढ़ें"
  }
};

const defaultRohitConfig = {
  intro: {
    title: "PayG Training — Rohit",
    body: 'PayG मॉडल की पूरी समझ के लिए यह <u>वीडियो</u> देखें और <u>क्विज़</u> पूरा करें।',
    cta: "शुरू करें"
  },
  video: {
    url: "",
    title: "PayG Training — वीडियो देखें"
  },
  quiz: [
    {
      question: "Customer connection बुक करते समय क्या देता है?",
      options: [
        "₹300 security fee",
        "₹100 booking fee",
        "₹500 advance",
        "₹100 recharge"
      ],
      correct: 1,
      explanation: "Customer connection बुक करते समय ₹100 booking fee देता है।"
    },
    {
      question: "Connection लगने के समय customer क्या देता है?",
      options: [
        "₹300 NetBox security fee",
        "₹300 recharge",
        "₹100 booking fee",
        "₹500 advance"
      ],
      correct: 0,
      explanation: "Connection लगने के समय customer ₹300 NetBox security fee देता है।"
    },
    {
      question: "Connection लगने के बाद internet कितने दिन अपने आप चलता है?",
      options: [
        "1 दिन",
        "2 दिन",
        "5 दिन",
        "10 दिन"
      ],
      correct: 1,
      explanation: "Connection लगने के बाद internet 2 दिन अपने आप चलता है।"
    },
    {
      question: "PayG में customer recharge कैसे कर सकता है?",
      options: [
        "केवल 30 दिन का",
        "केवल 7 दिन का",
        "अपनी जरूरत के अनुसार किसी भी दिन का",
        "केवल महीने में एक बार"
      ],
      correct: 2,
      explanation: "PayG में customer अपनी जरूरत के अनुसार किसी भी दिन का recharge कर सकता है।"
    },
    {
      question: "Customer को ₹300 security fee कब वापस मिलती है?",
      options: [
        "जब customer recharge बंद कर देता है",
        "जब NetBox वापस करता है और system उसे verify करता है",
        "30 दिन बाद automatically",
        "Rohit को वापस देने पर"
      ],
      correct: 1,
      explanation: "Customer को ₹300 security fee तब वापस मिलती है जब NetBox वापस करता है और system उसे verify करता है।"
    }
  ],
  success: {
    title: "Training Complete!",
    subtitle: 'आपने PayG मॉडल की सभी ज़रूरी बातें समझ ली हैं।',
    payout: "PayG Certified",
    note: "अब आप customers को PayG मॉडल के बारे में सही जानकारी दे सकते हैं।",
    cta: "पूरा हुआ"
  }
};

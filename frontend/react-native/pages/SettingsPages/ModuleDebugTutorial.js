import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { settingsStyles, moduleStyles } from "../../components/GlobalStyles/settingsStyles";
import { ChevronLeftIcon } from "../../assets/settings-icons/icons";
import { CheckCircleIcon, AlertCircleIcon, InfoIcon, ToolsIcon } from "../../assets/settings-icons/moduleIcons";

const ModuleDebugTutorial = ({ category, onBack, faultyComponent, greenhouse }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTutorialFinished, setTutorialFinished] = useState(false);
  const navigation = useNavigation();

  const debugSteps = { light: [{ title: "Verifică alimentarea", content: "Asigură-te că LED-ul sau senzorul de lumină primește alimentare corectă (3.3V sau 5V).", type: "check", tips: ["Folosește un multimetru pentru a verifica tensiunea", "Verifică conexiunile la breadboard"] }, { title: "Testează conexiunile", content: "Verifică dacă pinii sunt conectați corect la microcontroller.", type: "warning", tips: ["Pin digital pentru LED", "Pin analog pentru senzorul de lumină", "Verifică continuitatea cu multimetrul"] }, { title: "Verifică codul", content: "Asigură-te că în cod folosești pinul corect și valoarea PWM potrivită pentru LED.", type: "info", tips: ["digitalWrite() pentru LED simplu", "analogWrite() pentru control PWM", "analogRead() pentru senzor"] }, { title: "Testează componenta", content: "Înlocuiește temporar componenta cu una care știi că funcționează.", type: "tools", tips: ["Testează cu un LED extern", "Verifică senzorul cu o lanternă"] }], pump: [{ title: "Verifică alimentarea pompei", content: "Pompele necesită de obicei 12V. Verifică sursa de alimentare.", type: "check", tips: ["Folosește alimentare separată pentru pompă", "Verifică amperajul necesar"] }, { title: "Testează releul", content: "Verifică dacă releul comută corect când primește semnal.", type: "warning", tips: ["Ascultă 'click-ul' releului", "Măsoară tensiunea la ieșirea releului"] }, { title: "Verifică conexiunile hidraulice", content: "Asigură-te că tuburile nu sunt înfundate și că pompa are apă de aspirat.", type: "info", tips: ["Verifică filtrul de aspirație", "Curăță tuburile de eventuale blocaje"] }, { title: "Testează manual pompa", content: "Conectează pompa direct la alimentare pentru a verifica funcționarea.", type: "tools", tips: ["Atenție la polaritate!", "Asigură-te că pompa nu funcționează la sec"] }], ventilation: [{ title: "Verifică alimentarea ventilatorului", content: "Ventilatoarele pot necesita 5V sau 12V. Verifică specificațiile.", type: "check", tips: ["Citește eticheta de pe ventilator", "Măsoară tensiunea cu multimetrul"] }, { title: "Testează PWM-ul", content: "Verifică semnalul PWM pentru controlul vitezei.", type: "warning", tips: ["Frecvența PWM trebuie să fie 25kHz", "Verifică duty cycle-ul în cod"] }, { title: "Verifică obstrucțiile", content: "Asigură-te că ventilatorul nu este blocat de obiecte sau praf.", type: "info", tips: ["Curăță paletele ventilatorului", "Verifică rulmenții"] }, { title: "Testează fără microcontroller", content: "Conectează direct ventilatorul la alimentare.", type: "tools", tips: ["Respectă polaritatea", "Ascultă zgomotele neobișnuite"] }], temperature: [{ title: "Verifică tipul senzorului", content: "Identifică dacă ai DS18B20, DHT22 sau alt tip de senzor.", type: "check", tips: ["Citește marcajele de pe senzor", "Verifică datasheet-ul"] }, { title: "Verifică conexiunile", content: "Senzorii digitali au nevoie de pull-up rezistor.", type: "warning", tips: ["4.7kΩ între VCC și pin date pentru DS18B20", "Verifică ordinea pinilor (VCC, GND, Date)"] }, { title: "Testează cu cod simplu", content: "Folosește un exemplu de cod basic pentru testare.", type: "info", tips: ["Printează valorile în Serial Monitor", "Verifică dacă senzorul este detectat"] }, { title: "Calibrează senzorul", content: "Compară citirile cu un termometru de referință.", type: "tools", tips: ["Testează la temperatură ambientală", "Verifică stabilitatea citirilor"] }], humidity: [{ title: "Identifică senzorul de umiditate", content: "Cei mai comuni sunt DHT11, DHT22 sau SHT30.", type: "check", tips: ["DHT11: precizie mai mică, mai ieftin", "DHT22: precizie mai mare", "SHT30: comunicație I2C"] }, { title: "Verifică timpul de răspuns", content: "Senzorii de umiditate au timp de răspuns lent (2-3 secunde).", type: "warning", tips: ["Nu citi mai des de o dată la 2 secunde", "Așteaptă stabilizarea după pornire"] }, { title: "Verifică mediul de testare", content: "Testează în condiții diferite de umiditate.", type: "info", tips: ["Respiră pe senzor pentru a crește umiditatea", "Folosește un uscător de păr pentru test"] }, { title: "Calibrează citirile", content: "Compară cu un higro-termometru de referință.", type: "tools", tips: ["Testează la umidități diferite", "Verifică dacă valorile sunt în intervalul normal (20-80%)"] }], soil_humidity: [{ title: "Verifică tipul senzorului", content: "Ai senzor rezistiv sau capacitiv? Capacitivul este mai durabil.", type: "check", tips: ["Rezistiv: 2 electrozi expuși", "Capacitiv: placă întreagă, fără electrozi expuși"] }, { title: "Calibrează în aer uscat", content: "Citirea în aer uscat reprezintă 0% umiditate.", type: "warning", tips: ["Notează valoarea citită în aer", "Aceasta va fi valoarea maximă (sol uscat)"] }, { title: "Calibrează în apă", content: "Citirea în apă reprezintă 100% umiditate.", type: "info", tips: ["Scufundă senzorul în apă distilată", "Notează valoarea minimă", "Nu scufunda electronica!"] }, { title: "Testează în sol real", content: "Plasează senzorul în sol cu umidități diferite.", type: "tools", tips: ["Sol uscat, moderat umed, foarte umed", "Verifică consistența citirilor", "Curăță senzorul după utilizare"] }],
  };
  const currentCategory = debugSteps[category.id] || [];

  const handleContactSupport = () => {
    const serializableCategory = {
      id: category.id,
      name: category.name,
    };

    navigation.navigate("Contact", {
      category: serializableCategory,
      faultyComponent,
      greenhouse,
    });
  };
  
  const handleNextStep = () => {
    const isLastStep = currentStep === currentCategory.length - 1;
    if (isLastStep) {
      // --- THIS IS THE CORRECTED CODE BLOCK ---
      console.log("[1] ModuleDebugTutorial.js: Triggering modal toast..."); // <-- ADD THIS LOG
      Toast.show({
        type: 'modal', // Ensure this is 'modal'
        text1: 'Tutorial finalizat!',
        text2: 'Dacă problema persistă, poți contacta suportul.',
        autoHide: false,
        onHide: () => {
          // <-- ADD A LOG INSIDE onHide
          console.log("[4] ModuleDebugTutorial.js: onHide callback has been triggered!");
          setTutorialFinished(true);
        },
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepIcon = (type) => { switch (type) { case "check": return CheckCircleIcon; case "warning": return AlertCircleIcon; case "info": return InfoIcon; case "tools": return ToolsIcon; default: return InfoIcon; } };
  const getStepColor = (type) => { switch (type) { case "check": return "#4caf50"; case "warning": return "#ff9800"; case "info": return "#2196f3"; case "tools": return "#9c27b0"; default: return "#2196f3"; } };
  const StepIndicator = ({ step, index, isActive }) => { const StepIcon = getStepIcon(step.type); const stepColor = getStepColor(step.type); return ( <View style={[moduleStyles.stepIndicator, isActive && moduleStyles.stepIndicatorActive]} > <View style={[ moduleStyles.stepIconContainer, { backgroundColor: isActive ? stepColor + "30" : "#f5f5f5", }, ]} > <StepIcon size={24} style={{ color: isActive ? stepColor : "#999", }} /> </View> <Text style={[ moduleStyles.stepNumber, isActive && moduleStyles.stepNumberActive, ]} > {index + 1} </Text> </View> ); };

  return (
    <View style={settingsStyles.container}>
      <View style={settingsStyles.maxWidthContainer}>
        <View style={settingsStyles.paper}>
          <TouchableOpacity style={settingsStyles.headerBox} onPress={onBack} activeOpacity={0.8}>
            <View style={settingsStyles.backIcon}>
              <ChevronLeftIcon size={24} style={{ color: "black" }} />
            </View>
            <View style={settingsStyles.headerContent}>
              <Text style={settingsStyles.headerTitle}>Depanare {category.name}</Text>
              <Text style={settingsStyles.headerSubtitle}>Tutorial pas cu pas</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={settingsStyles.maxWidthContainerScroll}>
          {isTutorialFinished && (
            <View style={settingsStyles.paper}>
              <View style={settingsStyles.contentBox}>
                <View style={moduleStyles.contactSupportSection}>
                  <Text style={moduleStyles.contactSupportTitle}>Problema persistă?</Text>
                  <Text style={moduleStyles.contactSupportDescription}>
                    Dacă ai urmat toți pașii de depanare și problema nu a fost rezolvată, echipa noastră de suport tehnic te poate ajuta.
                  </Text>
                  <TouchableOpacity style={moduleStyles.contactSupportButton} onPress={handleContactSupport} activeOpacity={0.8}>
                    <Text style={moduleStyles.contactSupportButtonText}>Contactează Suportul</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {currentCategory[currentStep] && (
            <View style={settingsStyles.paper}>
              <View style={settingsStyles.contentBox}>
                <View style={moduleStyles.currentStepHeader}>
                  <Text style={moduleStyles.currentStepNumber}>Pasul {currentStep + 1}</Text>
                  <Text style={moduleStyles.currentStepTitle}>{currentCategory[currentStep].title}</Text>
                </View>
                <Text style={moduleStyles.stepContent}>{currentCategory[currentStep].content}</Text>
                {currentCategory[currentStep].tips && (
                  <View style={moduleStyles.tipsContainer}>
                    <Text style={moduleStyles.tipsTitle}>💡 Sfaturi utile:</Text>
                    {currentCategory[currentStep].tips.map((tip, index) => (
                      <Text key={index} style={moduleStyles.tipText}>• {tip}</Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={settingsStyles.paper}>
            <View style={settingsStyles.contentBox}>
              <View style={moduleStyles.navigationButtons}>
                <TouchableOpacity
                  style={[moduleStyles.navButton, currentStep === 0 && moduleStyles.navButtonDisabled]}
                  onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  activeOpacity={0.8}
                >
                  <Text style={[moduleStyles.navButtonText, currentStep === 0 && moduleStyles.navButtonTextDisabled]}>
                    ← Anterior
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[moduleStyles.navButton]}
                  onPress={handleNextStep}
                  activeOpacity={0.8}
                >
                  <Text style={moduleStyles.navButtonText}>
                    {currentStep === currentCategory.length - 1 ? "Finalizează" : "Următor →"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ModuleDebugTutorial;
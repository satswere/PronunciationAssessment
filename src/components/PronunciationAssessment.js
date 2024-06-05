import React, { useState, useRef } from 'react';  
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';  
  
const PronunciationAssessment = () => {  
    const [resultText, setResultText] = useState('');  
    const [accuracy, setAccuracy] = useState('');  
    const [fluency, setFluency] = useState('');  
    const [completeness, setCompleteness] = useState('');  
    const [isRecognizing, setIsRecognizing] = useState(false);  
    const speechRecognizerRef = useRef(null);  
    const [referenceText, setReferenceText] = useState('Hello, how are you?');
  
    // Replace with your Azure Speech service key and region  
    const speechKey = 'speechKey';  
    const serviceRegion = 'serviceRegion';  
    

  
    const startRecognition = () => {  
        if (isRecognizing) {  
            return;  
        }  
  
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);  
        
        const pronunciationConfig = new speechsdk.PronunciationAssessmentConfig(  
            referenceText,  
            speechsdk.PronunciationAssessmentGradingSystem.HundredMark,  
            speechsdk.PronunciationAssessmentGranularity.Phoneme,  
            true // enableMiscue  
        );  
  
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();  
        const speechRecognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);  
        speechRecognizerRef.current = speechRecognizer;  
  
        pronunciationConfig.applyTo(speechRecognizer);  
  
        speechRecognizer.recognized = (s, e) => {  
            if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {  
                const pronunciationResult = speechsdk.PronunciationAssessmentResult.fromResult(e.result);  
                console.log(pronunciationResult);
                setResultText(`Texto reconocido: ${e.result.text}`);  
                setAccuracy(`Precisión: ${pronunciationResult.accuracyScore}`);  
                setFluency(`Fluidez: ${pronunciationResult.fluencyScore}`);  
                setCompleteness(`Completitud: ${pronunciationResult.completenessScore}`);  
            } else if (e.result.reason === speechsdk.ResultReason.NoMatch) {  
                setResultText('No se pudo reconocer el habla.');  
            } else if (e.result.reason === speechsdk.ResultReason.Canceled) {  
                const cancellationDetails = speechsdk.CancellationDetails.fromResult(e.result);  
                setResultText(`El reconocimiento fue cancelado: ${cancellationDetails.reason}`);  
                if (cancellationDetails.reason === speechsdk.CancellationReason.Error) {  
                    setResultText(prev => `${prev}\nError: ${cancellationDetails.errorDetails}`);  
                }  
            }  
        };  
  
        speechRecognizer.startContinuousRecognitionAsync(  
            () => {  
                setIsRecognizing(true);  
                setResultText("Por favor, habla el texto de referencia en el micrófono.");  
            },  
            err => {  
                console.error('Error en el reconocimiento de habla: ', err);  
            }  
        );  
    };  
  
    const stopRecognition = () => {  
        if (speechRecognizerRef.current) {  
            speechRecognizerRef.current.stopContinuousRecognitionAsync(  
                () => {  
                    setIsRecognizing(false);  
                    speechRecognizerRef.current = null;  
                },  
                err => {  
                    console.error('Error al detener el reconocimiento: ', err);  
                }  
            );  
        }  
    };  
  

    const HandleOnChangeText = (e) => {  
        console.log("Texto que se va aplicar:");  
        console.log(e.target.value);  
        setReferenceText(e.target.value);  
    }; 

    return (  
        <div>  
            <h1>Evaluación de Pronunciación con Azure Speech Service</h1>  

            <div class="container mt-5">  
        <div class="row mb-4">  
            <div class="col">  
            <button  onClick={startRecognition} disabled={isRecognizing}>Comenzar Reconocimiento</button>  
            <button onClick={stopRecognition} disabled={!isRecognizing}>Detener Reconocimiento</button>  
            </div>  
       
        </div>  
        <div class="row">  
            <div class="col">  
            <textarea onChange={HandleOnChangeText} value={referenceText}> </textarea>            </div>  
        </div>  
    </div>


          
            <p id="resultText">{resultText}</p>  
            <p id="accuracy">{accuracy}</p>  
            <p id="fluency">{fluency}</p>  
            <p id="completeness">{completeness}</p>  
        </div>  
    );  
};  
  
export default PronunciationAssessment;  


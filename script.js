/* ===========================
   FISI Eignungstest - Script
   Version: 2.2 - FIXED
   =========================== */


/* ===========================
   GLOBALE VARIABLEN
   =========================== */


// Passwort-bezogene Variablen (Frage 3 & 100)
let userPassword3 = '';
let passwordScore3 = 0;
let passwordAttempts100 = 3;
let hasAnsweredQ100 = false;


// Quiz-Statistiken
let quizStats = {
    answered: 0,
    correct: 0,
    total: 16
};


// Terminal
const commandHistory = [];
let historyIndex = -1;
let sudoMode = false;
let sudoCommand = '';


// Versuchszähler
const questionAttempts = {};
const MAX_ATTEMPTS = 3;
const answeredQuestions = new Set();


/* ===========================
   ANTWORTEN-DATENBANK
   =========================== */


const answers = {
    1: { 
        type: 'multiple-text', 
        correct: [
            ['netzwerk', 'netz', 'netzwerke'],
            ['ordner', 'verzeichnis', 'datenbank'],
            ['daten', 'signal', 'signale', 'strom']
        ], 
        explanation: `1. Haus → Garten (umgibt) | Computer → Netzwerk (verbindet) 
2. Buch → Bibliothek (Sammlung) | Datei → Ordner/Verzeichnis (Sammlung) 
3. Straße → Auto (Transport) | Kabel → Daten/Signal (Transport)` 
    },
    2: { 
        type: 'multiple-number', 
        correct: [42, 243, 13, 64],
        explanation: `Reihe 1: n×(n+1) → 6×7 = 42 
Reihe 2: ×3 → 81×3 = 243 
Reihe 3: Fibonacci → 5+8 = 13 
Reihe 4: 2^n → 2^6 = 64` 
    },
    3: {
        type: 'password',
        explanation: 'Passwort-Sicherheit wird anhand von 7 Kriterien bewertet'
    },
    4: { 
        type: 'text', 
        correct: ['mac', 'mac-adresse', 'macadresse', 'mac adresse'], 
        explanation: 'MAC-Adresse (Media Access Control Address)' 
    },
    5: { 
        type: 'radio', 
        correct: 'b', 
        explanation: `Technische Fachbegriffe erkannt:
• "redundant array setup" = RAID-System
• "mirroring your stuff" = Datenspiegelung
• "I/O throughput" = Ein-/Ausgabedurchsatz (Geschwindigkeit)
• "mission-critical data" = kritische Geschäftsdaten

Umgangssprachliche Ausdrücke verstanden:
• "beef up" = verbessern/verstärken
• "goes belly-up" = kaputtgehen/ausfallen
• "rock solid" = sehr stabil/zuverlässig
• "no-brainer" = eine Entscheidung, die sich von selbst versteht
• "way faster" = viel schneller

Die Email beschreibt die Implementierung eines RAID-Systems mit redundanter Datenspeicherung und optimiertem Durchsatz.` 
    },
    6: { 
        type: 'radio', 
        correct: 'b', 
        explanation: `Firewall-Zweck & -Funktionen richtig verstanden:

Eine Firewall wird eingesetzt, um:
✓ Netzwerkverkehr zu filtern und zu kontrollieren
✓ Unerlaubte externe Zugriffe auf interne Systeme zu blockieren
✓ Outbound-Traffic (ausgehende Daten) zu überwachen und zu regulieren
✓ Sicherheitsrichtlinien durchzusetzen (welche Verbindungen erlaubt/blockiert sind)
✓ Das Netzwerk vor unautorisierten Zugriffen zu schützen

Was eine Firewall NICHT leistet:
✗ Daten verschlüsseln (dafür gibt es VPN/SSL/TLS)
✗ Viren und Malware automatisch löschen (dafür gibt es Antivirus-Programme)
✗ Den gesamten Datenschutz gewährleisten (ist nur eine Komponente)

Merksatz: Eine Firewall ist wie ein intelligenter "Türsteher" für dein Netzwerk - sie entscheidet, wer/was rein- und rauskommen darf.` 
    },
    7: { 
        type: 'number', 
        correct: 214, 
        explanation: `Lösung: 11010110 = 214 (im Dezimalsystem)

Schritt-für-Schritt-Erklärung:
Position (von rechts):  7    6    5    4    3    2    1    0
Binärzahl:              1    1    0    1    0    1    1    0
Stellenwert:           128   64   32   16    8    4    2    1

Berechnung (nur die 1er-Positionen):
128 (Position 7: 1) = 128
 64 (Position 6: 1) =  64
 32 (Position 5: 0) =   0
 16 (Position 4: 1) =  16
  8 (Position 3: 0) =   0
  4 (Position 2: 1) =   4
  2 (Position 1: 1) =   2
  1 (Position 0: 0) =   0
                      -----
Summe:                 214

Merksatz: Das Binärsystem ist wie Lichtschalter - 1 = AN, 0 = AUS. 
Die Position bestimmt, wie "wertvoll" dieser Schalter ist!

Warum das wichtig ist: 
Alle Speichergrößen basieren auf Binärzahlen:
- 1 Byte = 8 Bits (können 256 verschiedene Werte darstellen: 0-255)
- 1 KB ≈ 1.000 Bytes = 1.024 Bytes (2^10)
- 1 MB ≈ 1.000.000 Bytes = 1.048.576 Bytes (2^20)` 
    },
    8: { 
        type: 'number', 
        correct: 18000, 
        explanation: '15% von 120.000€ = 18.000€' 
    },
    9: { 
        type: 'radio', 
        correct: 'b', 
        explanation: '192.168.x.x ist privater Adressbereich nach RFC 1918' 
    },
    10: { 
        type: 'radio', 
        correct: 'b', 
        explanation: 'Logische Schlussfolgerung: Wenn alle Server redundant sind → Server A ist redundant' 
    },
    11: { 
        type: 'radio', 
        correct: 'b', 
        explanation: 'Standard (mit d, nicht t)' 
    },
    12: { 
        type: 'radio', 
        correct: 'b', 
        explanation: 'Operating System (nicht Operation System)' 
    },
    13: { 
        type: 'radio', 
        correct: 'b', 
        explanation: 'Muster: Die gefüllten Kreise (●) rotieren von links nach rechts und verschwinden dann. Nächster Schritt: Alle Kreise sind leer (○ ○ ○).' 
    },
    14: { 
        type: 'number', 
        correct: 1024, 
        explanation: '1 GB = 1024 MB' 
    },
    15: { 
        type: 'radio', 
        correct: 'c', 
        explanation: 'HTTPS (HTTP Secure) für sichere Webseiten-Übertragung' 
    },
    16: { 
        type: 'number', 
        correct: 127, 
        explanation: `Lösung: Für 8 Subnetze → 3 Bits → /19 (255.255.224.0)
Schrittweite: 256 - 224 = 32

Subnetz 0: 172.16.0.0 - 172.16.31.255
Subnetz 1: 172.16.32.0 - 172.16.63.255
Subnetz 2: 172.16.64.0 - 172.16.95.255
Subnetz 3: 172.16.96.0 - 172.16.127.255

Drittes Oktett der Broadcast-Adresse von Subnetz 3: 127` 
    }
};


/* ===========================
   INITIALISIERUNG
   =========================== */


function initializeAttempts() {
    for (let i = 1; i <= 16; i++) {
        questionAttempts[i] = 0;
    }
    console.log('📊 Versuchszähler initialisiert');
}


function getRemainingAttempts(questionNum) {
    return MAX_ATTEMPTS - (questionAttempts[questionNum] || 0);
}


function displayAttemptInfo(questionNum, feedbackEl) {
    const remaining = getRemainingAttempts(questionNum);
    const attempted = questionAttempts[questionNum] || 0;
    
    let attemptText = `<div style="margin-top: 10px; padding: 8px; background: var(--bg-terminal); border-left: 3px solid var(--neon-orange); border-radius: 4px;">
        📊 Versuche: ${attempted}/${MAX_ATTEMPTS}`;
    
    if (remaining > 0) {
        attemptText += ` | ⏳ Noch ${remaining} Versuch(e) übrig`;
    } else {
        attemptText += ` | ❌ Keine Versuche mehr!`;
    }
    
    attemptText += `</div>`;
    
    feedbackEl.innerHTML += attemptText;
}


/* ===========================
   PASSWORT-FUNKTIONEN (FRAGE 3)
   =========================== */


function validatePasswordStrength(password) {
    userPassword3 = password;
    
    console.log('🔐 Passwort eingegeben:', password);
    console.log('📊 Länge:', password.length);
    
    let score = 0;
    
    const criteria = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        noCommon: !/(password|123456|qwerty|admin|letmein|welcome)/i.test(password),
        noSequential: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)
    };
    
    updateCriterion('criterion-length', criteria.length);
    updateCriterion('criterion-uppercase', criteria.uppercase);
    updateCriterion('criterion-lowercase', criteria.lowercase);
    updateCriterion('criterion-numbers', criteria.numbers);
    updateCriterion('criterion-special', criteria.special);
    updateCriterion('criterion-no-common', criteria.noCommon);
    updateCriterion('criterion-no-sequential', criteria.noSequential);
    
    if (criteria.length) score += 20;
    if (criteria.uppercase) score += 10;
    if (criteria.lowercase) score += 10;
    if (criteria.numbers) score += 15;
    if (criteria.special) score += 20;
    if (criteria.noCommon) score += 15;
    if (criteria.noSequential) score += 10;
    
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
    
    score = Math.min(score, 100);
    passwordScore3 = score;
    
    console.log('✅ Score berechnet:', score);
    
    const strengthBar = document.getElementById('strength-bar-3');
    const strengthLevel = document.getElementById('strength-level-3');
    const pointsValue = document.getElementById('points-value-3');
    
    if (strengthBar && strengthLevel && pointsValue) {
        strengthBar.style.width = score + '%';
        pointsValue.textContent = score;
        
        if (score < 40) {
            strengthBar.style.backgroundColor = 'var(--neon-red)';
            strengthLevel.textContent = 'Schwach';
            strengthLevel.style.color = 'var(--neon-red)';
        } else if (score < 70) {
            strengthBar.style.backgroundColor = 'var(--neon-yellow)';
            strengthLevel.textContent = 'Mittel';
            strengthLevel.style.color = 'var(--neon-yellow)';
        } else if (score < 90) {
            strengthBar.style.backgroundColor = 'var(--neon-cyan)';
            strengthLevel.textContent = 'Gut';
            strengthLevel.style.color = 'var(--neon-cyan)';
        } else {
            strengthBar.style.backgroundColor = 'var(--neon-green)';
            strengthLevel.textContent = 'Sehr stark';
            strengthLevel.style.color = 'var(--neon-green)';
        }
    }
}


function updateCriterion(criterionId, isMet) {
    const element = document.getElementById(criterionId);
    if (!element) return;
    
    const icon = element.querySelector('.criterion-icon');
    
    if (isMet) {
        element.classList.remove('criterion-unmet');
        element.classList.add('criterion-met');
        if (icon) icon.textContent = '✓';
    } else {
        element.classList.remove('criterion-met');
        element.classList.add('criterion-unmet');
        if (icon) icon.textContent = '✗';
    }
}


/* ===========================
   QUIZ-FUNKTIONEN
   =========================== */


function checkAnswer(questionNum) {
    console.log('🔍 Checking answer for question:', questionNum);
    
    const feedbackEl = document.getElementById(`feedback-${questionNum}`);
    let isCorrect = false;


    if (!questionAttempts[questionNum]) {
        questionAttempts[questionNum] = 0;
    }


    if (questionNum === 3) {
        return checkPasswordCreation(feedbackEl, questionNum);
    }


    if (questionNum === 100) {
        return checkPasswordQuestion();
    }


    const answer = answers[questionNum];
    
    if (!answer) {
        console.error('❌ Keine Antwort für Frage', questionNum);
        return;
    }
    
    if (questionAttempts[questionNum] >= MAX_ATTEMPTS) {
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.innerHTML = `❌ Maximale Versuche (${MAX_ATTEMPTS}) erreicht!<br>
            <em>Diese Frage wird mit 0 Punkten bewertet.</em>`;
        displayAttemptInfo(questionNum, feedbackEl);
        deactivateQuestion(questionNum);
        return;
    }
    
    switch(answer.type) {
        case 'multiple-text':
            isCorrect = handleMultipleText(questionNum, answer, feedbackEl);
            break;
            
        case 'multiple-number':
            isCorrect = handleMultipleNumber(questionNum, answer, feedbackEl);
            break;
            
        case 'radio':
            isCorrect = handleRadio(questionNum, answer, feedbackEl);
            break;
            
        case 'number':
            isCorrect = handleNumber(questionNum, answer, feedbackEl);
            break;
            
        case 'text':
            isCorrect = handleText(questionNum, answer, feedbackEl);
            break;
    }


    questionAttempts[questionNum]++;


    if (isCorrect) {
        quizStats.correct++;
        quizStats.answered++;
        
        feedbackEl.className = 'feedback correct';
        displayAttemptInfo(questionNum, feedbackEl);
        deactivateQuestion(questionNum);
        
        console.log(`✅ Frage ${questionNum} richtig! (Versuch ${questionAttempts[questionNum]}/${MAX_ATTEMPTS})`);
        
        if (quizStats.answered === quizStats.total) {
            showResults();
        }
    } else {
        const remaining = getRemainingAttempts(questionNum);
        
        if (remaining > 0) {
            feedbackEl.className = 'feedback incorrect';
            let hintText = feedbackEl.innerHTML || '';
            
            if (remaining === 2) {
                hintText += `<br><br><em style="color: var(--neon-yellow);">💡 Hinweis: Du hast noch ${remaining} Versuche. Versuche es nochmal!</em>`;
            } else if (remaining === 1) {
                hintText += `<br><br><em style="color: var(--neon-orange);">⚠️ Warnung: Das ist dein letzter Versuch!</em>`;
            }
            
            feedbackEl.innerHTML = hintText;
            displayAttemptInfo(questionNum, feedbackEl);
            
            console.log(`❌ Frage ${questionNum} falsch. ${remaining} Versuch(e) übrig.`);
        } else {
            feedbackEl.className = 'feedback incorrect';
            feedbackEl.innerHTML = `❌ Leider falsch!<br>
                <em style="color: var(--neon-red);">Maximale Versuche (${MAX_ATTEMPTS}) erreicht!</em>`;
            displayAttemptInfo(questionNum, feedbackEl);
            
            // NUR JETZT die Lösung anzeigen
            showCorrectAnswer(questionNum, feedbackEl);
            
            quizStats.answered++;
            deactivateQuestion(questionNum);
            
            console.log(`❌ Frage ${questionNum} nicht bestanden. Maximale Versuche erreicht.`);
            
            if (quizStats.answered === quizStats.total) {
                showResults();
            }
        }
    }
}


function showCorrectAnswer(questionNum, feedbackEl) {
    const answer = answers[questionNum];
    if (!answer) return;
    
    let correctAnswerText = '';
    
    if (answer.type === 'multiple-text') {
        correctAnswerText = `<br><br><div style="background: rgba(255,0,0,0.1); padding: 10px; border-left: 3px solid var(--neon-red); border-radius: 4px; margin-top: 10px;">
            <strong>📋 Korrekte Antworten:</strong><br>
            1. ${answer.correct[0][0]}<br>
            2. ${answer.correct[1][0]}<br>
            3. ${answer.correct[2][0]}
        </div>`;
    } else if (answer.type === 'multiple-number') {
        correctAnswerText = `<br><br><div style="background: rgba(255,0,0,0.1); padding: 10px; border-left: 3px solid var(--neon-red); border-radius: 4px; margin-top: 10px;">
            <strong>📋 Korrekte Antworten:</strong><br>
            1. ${answer.correct[0]}<br>
            2. ${answer.correct[1]}<br>
            3. ${answer.correct[2]}<br>
            4. ${answer.correct[3]}
        </div>`;
    } else if (answer.type === 'radio') {
        correctAnswerText = `<br><br><div style="background: rgba(255,0,0,0.1); padding: 10px; border-left: 3px solid var(--neon-red); border-radius: 4px; margin-top: 10px;">
            <strong>📋 Korrekte Antwort:</strong> Option ${answer.correct.toUpperCase()}
        </div>`;
    } else if (answer.type === 'number' || answer.type === 'text') {
        const correctValue = Array.isArray(answer.correct) ? answer.correct[0] : answer.correct;
        correctAnswerText = `<br><br><div style="background: rgba(255,0,0,0.1); padding: 10px; border-left: 3px solid var(--neon-red); border-radius: 4px; margin-top: 10px;">
            <strong>📋 Korrekte Antwort:</strong> ${correctValue}
        </div>`;
    }
    
    // Erklärung hinzufügen
    if (answer.explanation) {
        correctAnswerText += `<div style="color: #aaa; font-size: 0.9em; white-space: pre-line; margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            💡 <strong>Erklärung:</strong><br>${answer.explanation}
        </div>`;
    }
    
    feedbackEl.innerHTML += correctAnswerText;
}


function deactivateQuestion(questionNum) {
    const buttons = document.querySelectorAll(`[onclick*="checkAnswer(${questionNum})"]`);
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    });
    
    const inputs = document.querySelectorAll(`[id^="q${questionNum}-"]`);
    inputs.forEach(input => {
        if (input.type !== 'hidden') {
            input.disabled = true;
        }
    });
    
    const radios = document.querySelectorAll(`input[name="q${questionNum}"]`);
    radios.forEach(radio => radio.disabled = true);
}


function checkPasswordCreation(feedbackEl, questionNum) {
    console.log('🔐 Checking password creation...');
    
    if (!questionAttempts[questionNum]) {
        questionAttempts[questionNum] = 0;
    }
    
    if (!userPassword3 || userPassword3.length < 8) {
        questionAttempts[questionNum]++;
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.innerHTML = '❌ Bitte geben Sie ein Passwort mit mindestens 8 Zeichen ein.';
        displayAttemptInfo(questionNum, feedbackEl);
        return false;
    }
    
    try {
        sessionStorage.setItem('savedPassword', userPassword3);
        localStorage.setItem('savedPassword', userPassword3);
        localStorage.setItem('passwordTimestamp', Date.now());
    } catch (e) {
        console.error('❌ Speicherfehler:', e);
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.innerHTML = '❌ Fehler beim Speichern: ' + e.message;
        return false;
    }
    
    questionAttempts[questionNum]++;
    feedbackEl.className = 'feedback correct';
    feedbackEl.innerHTML = `
        ✅ Passwort gespeichert! Sie haben <strong>${passwordScore3} von 100</strong> möglichen Punkten erreicht.<br>
        <span style="color: #aaa; font-size: 0.9em; margin-top: 10px; display: block;">💡 Erklärung: ${answers[3].explanation}</span>
    `;
    displayAttemptInfo(questionNum, feedbackEl);
    
    quizStats.correct++;
    quizStats.answered++;
    
    deactivateQuestion(questionNum);
    
    if (quizStats.answered === quizStats.total) {
        showResults();
    }
    
    return true;
}


/* ===========================
   ANTWORT-HANDLER (nach Typ)
   =========================== */


function handleMultipleText(questionNum, answer, feedbackEl) {
    const textInputs = [
        document.getElementById(`q${questionNum}-input-1`),
        document.getElementById(`q${questionNum}-input-2`),
        document.getElementById(`q${questionNum}-input-3`)
    ];
    
    if (textInputs.some(input => !input || !input.value.trim())) {
        alert('Bitte beantworte alle drei Analogien!');
        return false;
    }
    
    let textCorrectCount = 0;
    const textResults = [];
    
    textInputs.forEach((input, index) => {
        const userAns = input.value.toLowerCase().trim();
        const correctAnswers = answer.correct[index];
        const isAnswerCorrect = correctAnswers.some(correct => 
            userAns === correct.toLowerCase() || 
            userAns.includes(correct.toLowerCase())
        );
        
        if (isAnswerCorrect) {
            textCorrectCount++;
            textResults.push(`✓ Analogie ${index + 1}: Richtig`);
        } else {
            textResults.push(`✗ Analogie ${index + 1}: Falsch`);
        }
    });
    
    const isCorrect = (textCorrectCount === 3);
    
    if (isCorrect) {
        feedbackEl.innerHTML = `
            ✓ Alle Analogien richtig!<br>
            <span style="color: #aaa; font-size: 0.9em; white-space: pre-line; margin-top: 10px; display: block;">💡 Erklärung:<br>${answer.explanation}</span>
        `;
    } else {
        feedbackEl.innerHTML = `
            ✗ ${textCorrectCount} von 3 richtig<br>
            ${textResults.join('<br>')}
        `;
    }
    
    return isCorrect;
}


function handleMultipleNumber(questionNum, answer, feedbackEl) {
    const numberInputs = [
        document.getElementById(`q${questionNum}-input-1`),
        document.getElementById(`q${questionNum}-input-2`),
        document.getElementById(`q${questionNum}-input-3`),
        document.getElementById(`q${questionNum}-input-4`)
    ];
    
    if (numberInputs.some(input => !input || !input.value)) {
        alert('Bitte beantworte alle vier Zahlenreihen!');
        return false;
    }
    
    let numberCorrectCount = 0;
    const numberResults = [];
    
    numberInputs.forEach((input, index) => {
        const userNum = parseFloat(input.value);
        const correctAnswer = answer.correct[index];
        const isAnswerCorrect = (userNum === correctAnswer);
        
        if (isAnswerCorrect) {
            numberCorrectCount++;
            numberResults.push(`✓ Reihe ${index + 1}: Richtig`);
        } else {
            numberResults.push(`✗ Reihe ${index + 1}: Falsch`);
        }
    });
    
    const isCorrect = (numberCorrectCount === 4);
    
    if (isCorrect) {
        feedbackEl.innerHTML = `
            ✓ Alle Zahlenreihen richtig!<br>
            <span style="color: #aaa; font-size: 0.9em; white-space: pre-line; margin-top: 10px; display: block;">💡 Erklärung:<br>${answer.explanation}</span>
        `;
    } else {
        feedbackEl.innerHTML = `
            ✗ ${numberCorrectCount} von 4 richtig<br>
            ${numberResults.join('<br>')}
        `;
    }
    
    return isCorrect;
}


function handleRadio(questionNum, answer, feedbackEl) {
    const selectedRadio = document.querySelector(`input[name="q${questionNum}"]:checked`);
    if (!selectedRadio) {
        alert('Bitte wählen Sie eine Antwort aus.');
        return false;
    }
    
    const userAnswer = selectedRadio.value;
    const isCorrect = (userAnswer === answer.correct);
    
    if (isCorrect) {
        feedbackEl.innerHTML = `✓ Richtig!<br>
            <span style="color: #aaa; font-size: 0.9em; white-space: pre-line; margin-top: 10px; display: block;">💡 Erklärung:<br>${answer.explanation || ''}</span>`;
    } else {
        feedbackEl.innerHTML = `✗ Leider falsch.`;
    }
    
    return isCorrect;
}


function handleNumber(questionNum, answer, feedbackEl) {
    const numberInput = document.getElementById(`q${questionNum}-input`);
    if (!numberInput || !numberInput.value) {
        alert('Bitte geben Sie eine Antwort ein.');
        return false;
    }
    
    const userAnswer = parseFloat(numberInput.value);
    const isCorrect = (userAnswer === answer.correct);
    
    if (isCorrect) {
        feedbackEl.innerHTML = `✓ Richtig!<br>
            <span style="color: #aaa; font-size: 0.9em; white-space: pre-line; margin-top: 10px; display: block;">💡 Erklärung:<br>${answer.explanation || ''}</span>`;
    } else {
        feedbackEl.innerHTML = `✗ Leider falsch.`;
    }
    
    return isCorrect;
}


function handleText(questionNum, answer, feedbackEl) {
    const textInput = document.getElementById(`q${questionNum}-input`);
    if (!textInput || !textInput.value) {
        alert('Bitte geben Sie eine Antwort ein.');
        return false;
    }
    
    const userAnswer = textInput.value.toLowerCase().trim();
    const isCorrect = answer.correct.some(correct => 
        userAnswer === correct.toLowerCase() || 
        userAnswer.includes(correct.toLowerCase())
    );
    
    if (isCorrect) {
        feedbackEl.innerHTML = `✓ Richtig!<br>
            <span style="color: #aaa; font-size: 0.9em; margin-top: 10px; display: block;">💡 Erklärung: ${answer.explanation || ''}</span>`;
    } else {
        feedbackEl.innerHTML = `✗ Leider falsch.`;
    }
    
    return isCorrect;
}


/* ===========================
   ERGEBNIS-FUNKTIONEN
   =========================== */


function showResults() {
    const resultsBox = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    
    const percentage = Math.round((quizStats.correct / quizStats.total) * 100);
    let message = '';
    let emoji = '';


    if (percentage >= 90) {
        emoji = '🎉';
        message = 'Hervorragend! Du bist perfekt vorbereitet!';
    } else if (percentage >= 75) {
        emoji = '👍';
        message = 'Sehr gut! Noch etwas Übung und du bist ready!';
    } else if (percentage >= 60) {
        emoji = '📚';
        message = 'Guter Anfang! Weiter üben!';
    } else {
        emoji = '💪';
        message = 'Nicht aufgeben! Du schaffst das!';
    }


    resultsContent.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 20px;">${emoji}</div>
        <div style="font-size: 1.5em; margin-bottom: 10px;">
            ${quizStats.correct} / ${quizStats.total} richtig (${percentage}%)
        </div>
        <div style="color: #888; margin-top: 15px;">
            ${message}
        </div>
    `;


    resultsBox.classList.add('show');
    resultsBox.scrollIntoView({ behavior: 'smooth' });
}


function resetQuiz() {
    quizStats = { answered: 0, correct: 0, total: 16 };
    answeredQuestions.clear();
    initializeAttempts();


    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="number"], input[type="text"], input[type="password"]').forEach(input => {
        input.value = '';
        input.disabled = false;
    });


    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.className = 'feedback';
        feedback.innerHTML = '';
    });


    document.querySelectorAll('.check-btn').forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });


    document.getElementById('results').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ===========================
   TERMINAL-FUNKTIONEN
   =========================== */


const commands = {
    'ls': () => {
        return 'quiz1.html  quiz2.html  quiz3.html  quiz4.html  quiz5.html  README.md';
    },
    'help': () => {
        return `Verfügbare Befehle:
  help        - Zeigt diese Hilfe an
  ls          - Zeigt alle Quiz-Seiten
  cd quiz1    - Öffnet Quiz 1-16
  cd quiz2    - Öffnet Quiz 17-32
  cd quiz3    - Öffnet Quiz 33-48
  cd quiz4    - Öffnet Quiz 49-64
  cd quiz5    - Öffnet Quiz 65-80
  clear       - Löscht das Terminal
  sudo answer - Zeigt alle Lösungen (Passwort = Frage 16!)`;
    },
    'cd': (args) => {
        const pages = {
            'quiz1': 'index.html',
            'quiz2': 'quiz2.html',
            'quiz3': 'quiz3.html',
            'quiz4': 'quiz4.html',
            'quiz5': 'quiz5.html'
        };
        
        if (args[0] && pages[args[0]]) {
            window.location.href = pages[args[0]];
            return `Navigiere zu ${args[0]}...`;
        } else {
            return `cd: ${args[0]}: Quiz nicht gefunden. Nutze 'ls'.`;
        }
    },
    'clear': () => {
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) terminalOutput.innerHTML = '';
        return '';
    },
    'sudo': (args) => {
        if (args[0] === 'answer') {
            sudoMode = true;
            sudoCommand = 'answer';
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) terminalInput.type = 'password';
            return '[sudo] Passwort für root:';
        } else {
            return `sudo: ${args.join(' ')}: Befehl nicht gefunden`;
        }
    }
};


function displayAllAnswers() {
    let output = `
╔════════════════════════════════════════════════════════════════════════════╗
║                      🔓 ROOT ACCESS GRANTED 🔓                             ║
║                   FISI Quiz - Alle Lösungen freigeschaltet                ║
║            Du hast die Expertenfrage richtig beantwortet! 🎓              ║
╚════════════════════════════════════════════════════════════════════════════╝


`;
    
    for (let i = 1; i <= 16; i++) {
        const ans = answers[i];
        if (!ans) continue;
        
        let answerText = '';
        
        if (ans.type === 'multiple-text') {
            answerText = `1: ${ans.correct[0][0]} | 2: ${ans.correct[1][0]} | 3: ${ans.correct[2][0]}`;
        } else if (ans.type === 'multiple-number') {
            answerText = `1: ${ans.correct[0]} | 2: ${ans.correct[1]} | 3: ${ans.correct[2]} | 4: ${ans.correct[3]}`;
        } else if (ans.type === 'password') {
            answerText = 'Passwort nach eigenen Kriterien erstellen';
        } else {
            answerText = Array.isArray(ans.correct) ? ans.correct[0] : ans.correct;
        }
        
        output += `─────────────────────────────────────────────────────────────────
[Frage ${i}]
✓ Korrekte Antwort: ${answerText.toString().toUpperCase()}
💡 Erklärung: ${ans.explanation}


`;
    }
    
    output += `─────────────────────────────────────────────────────────────────
⚠️  HINWEIS: Diese Funktion ist nur zur Überprüfung gedacht!
   Versuche erst selbst die Aufgaben zu lösen! 💪
─────────────────────────────────────────────────────────────────`;
    
    return output;
}


function executeCommand(input) {
    const terminalInput = document.getElementById('terminal-input');
    
    if (sudoMode) {
        sudoMode = false;
        if (terminalInput) terminalInput.type = 'text';
        
        const correctPassword = '127';
        
        if (input === correctPassword) {
            if (sudoCommand === 'answer') {
                return displayAllAnswers();
            }
        } else {
            return `sudo: 1 falscher Passwortversuch
        
💡 TIPP: Löse Frage 16 - die Subnetting-Berechnung!
   Das Passwort ist das dritte Oktett der Broadcast-Adresse des dritten Subnetzes.
   
   Rechenschritte:
   1. Wie viele Bits für 8 Subnetze? (2^n ≥ 8)
   2. Neue Subnetzmaske berechnen
   3. Schrittweite ermitteln (256 - Oktett-Wert)
   4. Drittes Subnetz finden (Subnetz 3!)
   5. Broadcast = letzte IP vor nächstem Subnetz`;
        }
    }
    
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (commands[command]) {
        return commands[command](args);
    } else {
        return `bash: ${command}: Befehl nicht gefunden. Nutze 'help' für Hilfe.`;
    }
}


/* ===========================
   EVENT-LISTENER & INITIALISIERUNG
   =========================== */


document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FISI Eignungstest geladen - Viel Erfolg!');
    
    initializeAttempts();
    
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (terminalInput && terminalOutput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = terminalInput.value;
                
                const inputLine = document.createElement('div');
                if (sudoMode) {
                    inputLine.innerHTML = `<span class="prompt">[sudo] Passwort für root:</span> `;
                } else {
                    inputLine.innerHTML = `<span class="prompt">[root@FiSi]$ </span>${input}`;
                }
                terminalOutput.appendChild(inputLine);
                
                if (input.trim() || sudoMode) {
                    if (!sudoMode) {
                        commandHistory.push(input);
                        historyIndex = commandHistory.length;
                    }
                    
                    const output = executeCommand(input);
                    if (output) {
                        const outputLine = document.createElement('div');
                        outputLine.style.whiteSpace = 'pre-wrap';
                        outputLine.textContent = output;
                        outputLine.style.marginBottom = '10px';
                        terminalOutput.appendChild(outputLine);
                    }
                }
                
                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
            
            if (!sudoMode) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (historyIndex > 0) {
                        historyIndex--;
                        terminalInput.value = commandHistory[historyIndex];
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        terminalInput.value = commandHistory[historyIndex];
                    } else {
                        historyIndex = commandHistory.length;
                        terminalInput.value = '';
                    }
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-window')) {
                terminalInput.focus();
            }
        });
    }
    
    document.querySelectorAll('.text-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const questionBox = input.closest('.question-box');
                if (questionBox) {
                    const questionNum = questionBox.dataset.question;
                    checkAnswer(parseInt(questionNum));
                }
            }
        });
    });
    
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.textContent = '🙈 Verbergen';
                } else {
                    input.type = 'password';
                    this.textContent = '👁️ Anzeigen';
                }
            }
        });
    });
});


window.addEventListener('load', () => {
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        const welcomeLine = document.createElement('div');
        welcomeLine.innerHTML = `<span style="color: var(--neon-green);">FISI Eignungstest Terminal v1.0 gestartet</span>
<span style="color: #888;">Tippe 'help' für verfügbare Befehle</span>
`;
        welcomeLine.style.whiteSpace = 'pre-wrap';
        welcomeLine.style.marginBottom = '10px';
        terminalOutput.appendChild(welcomeLine);
    }
});


console.log('✅ Script.js vollständig geladen');

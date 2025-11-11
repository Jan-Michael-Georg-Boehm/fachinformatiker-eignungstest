/* ===========================
   FISI Eignungstest - Komplett
   =========================== */

// EINHEITLICHES Antwort-System
const answers = {
     1: { 
        type: 'multiple-text', 
        correct: [
            ['netzwerk', 'netz', 'netzwerke'],           // Antwort 1
            ['ordner', 'verzeichnis', 'datenbank'],      // Antwort 2
            ['daten', 'signal', 'signale', 'strom']      // Antwort 3 
        ], explanation: `1. Haus → Garten (umgibt) | Computer → Netzwerk (verbindet) 2. Buch → Bibliothek (Sammlung) | Datei → Ordner/Verzeichnis (Sammlung) 3. Straße → Auto (Transport) | Kabel → Daten/Signal (Transport)` 
    },
    2: { 
        type: 'multiple-number', 
        correct: [42, 243, 13, 64],
        explanation: `Reihe 1: n×(n+1) → 6×7 = 42 Reihe 2: ×3 → 81×3 = 243 Reihe 3: Fibonacci → 5+8 = 13 Reihe 4: 2^n → 2^6 = 64` 
    },    
    3: { type: 'number', correct: 3600, explanation: '450 Anfragen / 15 Min = 30 Anfragen/Min → 120 Min × 30 = 3600 Anfragen' },
    4: { type: 'text', correct: ['mac', 'mac-adresse', 'macadresse', 'mac adresse'], explanation: 'MAC-Adresse (Media Access Control Address)' },
    5: { type: 'radio', correct: 'b', explanation: 'RAID - Redundant Array of Independent Disks' },
    6: { type: 'radio', correct: 'b', explanation: 'Stateful Inspection Firewalls überwachen Verbindungsstatus' },
    7: { type: 'number', correct: 214, explanation: '128+64+16+4+2 = 214 (Binär: 11010110)' },
    8: { type: 'number', correct: 18000, explanation: '15% von 120.000€ = 18.000€' },
    9: { type: 'radio', correct: 'b', explanation: '192.168.x.x ist privater Adressbereich nach RFC 1918' },
    10: { type: 'radio', correct: 'b', explanation: 'Logische Schlussfolgerung: Wenn alle Server redundant sind → Server A ist redundant' },
    11: { type: 'radio', correct: 'b', explanation: 'Standard (mit d, nicht t)' },
    12: { type: 'radio', correct: 'b', explanation: 'Operating System (nicht Operation System)' },
    13: { 
        type: 'radio', 
        correct: 'b', 
        explanation: 'Muster: Die gefüllten Kreise (●) rotieren von links nach rechts und verschwinden dann. Nächster Schritt: Alle Kreise sind leer (○ ○ ○).' 
    },
    14: { type: 'number', correct: 1024, explanation: '1 GB = 1024 MB' },
    15: { type: 'radio', correct: 'c', explanation: 'HTTPS (HTTP Secure) für sichere Webseiten-Übertragung' },
    16: { 
        type: 'number', 
        correct: 95, 
        explanation: `Lösung: Für 8 Subnetze → 3 Bits → /19 (255.255.224.0)
Schrittweite: 256 - 224 = 32
Subnetz 3: 172.16.64.0 - 172.16.95.255
Drittes Oktett der Broadcast-Adresse: 95` 
    }
};

// Quiz-Statistiken
// Quiz-Statistiken
let quizStats = {
    answered: 0,
    correct: 0,
    total: 16
};

// Passwort-bezogene Variablen (Frage 3 & 100)
let userPassword3 = '';
let passwordScore3 = 0;
let passwordAttempts100 = 3;
let hasAnsweredQ100 = false;

/* ===========================
   QUIZ FUNKTIONALITÄT
   =========================== */

function checkAnswer(questionNum) {
    const feedbackEl = document.getElementById(`feedback-${questionNum}`);
    let isCorrect = false;
    let userAnswer = null;

    // Spezielle Fragen zuerst behandeln
    if (questionNum === 3) {
        // Frage 3: Passwort-Erstellung
        if (userPassword3.length < 8) {
            feedbackEl.className = 'feedback incorrect';
            feedbackEl.innerHTML = '❌ Bitte geben Sie ein Passwort mit mindestens 8 Zeichen ein.';
            return;
        }
        
        // Passwort in sessionStorage speichern
        sessionStorage.setItem('savedPassword', userPassword3);
        
        feedbackEl.className = 'feedback correct';
        feedbackEl.innerHTML = `
            ✅ Passwort gespeichert! Sie haben <strong>${passwordScore3} von 100</strong> möglichen Punkten erreicht.<br>
            <em>Merken Sie sich Ihr Passwort gut - Sie werden es in Frage 100 nochmal benötigen!</em>
        `;
        
        quizStats.correct++;
        quizStats.answered++;
        
        // Button deaktivieren
        const button = feedbackEl.previousElementSibling;
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        
        // Input deaktivieren
        document.getElementById('q3-password-input').disabled = true;
        
        // Score aktualisieren
        updateScore(passwordScore3);
        
        // Prüfen, ob alle Fragen beantwortet wurden
        if (quizStats.answered === quizStats.total) {
            showResults();
        }
        return;
    }

    if (questionNum === 100) {
        // Frage 100: Passwort-Abfrage
        checkPasswordQuestion();
        return;
    }

    // Normale Fragen basierend auf Typ
    const answer = answers[questionNum];
    
    switch(answer.type) {
        case 'multiple-text':
            // Prüfe alle drei Analogien
            const textInputs = [
                document.getElementById(`q${questionNum}-input-1`),
                document.getElementById(`q${questionNum}-input-2`),
                document.getElementById(`q${questionNum}-input-3`)
            ];
            
            if (textInputs.some(input => !input || !input.value.trim())) {
                alert('Bitte beantworte alle drei Analogien!');
                return;
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
            
            isCorrect = (textCorrectCount === 3);
            
            if (isCorrect) {
                feedbackEl.className = 'feedback correct';
                feedbackEl.innerHTML = `
                    ✓ Alle Analogien richtig!<br>
                    <span style="color: #aaa; font-size: 0.9em; white-space: pre-line;">${answer.explanation}</span>
                `;
            } else {
                feedbackEl.className = 'feedback incorrect';
                feedbackEl.innerHTML = `
                    ✗ ${textCorrectCount} von 3 richtig<br>
                    ${textResults.join('<br>')}
                    <br><span style="color: #888; font-size: 0.9em;">Versuche es nochmal oder nutze 'sudo answer' im Terminal.</span>
                `;
                return;
            }
            break;

        case 'multiple-number':
            // Prüfe alle vier Zahlenreihen
            const numberInputs = [
                document.getElementById(`q${questionNum}-input-1`),
                document.getElementById(`q${questionNum}-input-2`),
                document.getElementById(`q${questionNum}-input-3`),
                document.getElementById(`q${questionNum}-input-4`)
            ];
            
            if (numberInputs.some(input => !input || !input.value)) {
                alert('Bitte beantworte alle vier Zahlenreihen!');
                return;
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
            
            isCorrect = (numberCorrectCount === 4);
            
            if (isCorrect) {
                feedbackEl.className = 'feedback correct';
                feedbackEl.innerHTML = `
                    ✓ Alle Zahlenreihen richtig!<br>
                    <span style="color: #aaa; font-size: 0.9em; white-space: pre-line;">${answer.explanation}</span>
                `;
            } else {
                feedbackEl.className = 'feedback incorrect';
                feedbackEl.innerHTML = `
                    ✗ ${numberCorrectCount} von 4 richtig<br>
                    ${numberResults.join('<br>')}
                    <br><span style="color: #888; font-size: 0.9em;">Versuche es nochmal oder nutze 'sudo answer' im Terminal.</span>
                `;
                return;
            }
            break;
            
        case 'radio':
            const selectedRadio = document.querySelector(`input[name="q${questionNum}"]:checked`);
            if (!selectedRadio) {
                alert('Bitte wählen Sie eine Antwort aus.');
                return;
            }
            userAnswer = selectedRadio.value;
            isCorrect = (userAnswer === answer.correct);
            
            if (isCorrect) {
                feedbackEl.className = 'feedback correct';
                feedbackEl.innerHTML = `✓ Richtig! ${answer.explanation || ''}`;
            } else {
                feedbackEl.className = 'feedback incorrect';
                feedbackEl.innerHTML = `✗ Leider falsch. Versuche es nochmal oder nutze 'sudo answer' im Terminal. 😉`;
            }
            break;

        case 'number':
            const numberInput = document.getElementById(`q${questionNum}-input`);
            if (!numberInput || !numberInput.value) {
                alert('Bitte geben Sie eine Antwort ein.');
                return;
            }
            userAnswer = parseFloat(numberInput.value);
            isCorrect = (userAnswer === answer.correct);
            
            if (isCorrect) {
                feedbackEl.className = 'feedback correct';
                feedbackEl.innerHTML = `✓ Richtig! ${answer.explanation || ''}`;
            } else {
                feedbackEl.className = 'feedback incorrect';
                feedbackEl.innerHTML = `✗ Leider falsch. Versuche es nochmal oder nutze 'sudo answer' im Terminal. 😉`;
            }
            break;

        case 'text':
            const textInput = document.getElementById(`q${questionNum}-input`);
            if (!textInput || !textInput.value) {
                alert('Bitte geben Sie eine Antwort ein.');
                return;
            }
            userAnswer = textInput.value.toLowerCase().trim();
            isCorrect = answer.correct.some(correct => 
                userAnswer === correct.toLowerCase() || 
                userAnswer.includes(correct.toLowerCase())
            );
            
            if (isCorrect) {
                feedbackEl.className = 'feedback correct';
                feedbackEl.innerHTML = `✓ Richtig! ${answer.explanation || ''}`;
            } else {
                feedbackEl.className = 'feedback incorrect';
                feedbackEl.innerHTML = `✗ Leider falsch. Versuche es nochmal oder nutze 'sudo answer' im Terminal. 😉`;
            }
            break;
    }

    // Nur bei richtigen Antworten weitermachen
    if (isCorrect) {
        quizStats.correct++;
        quizStats.answered++;
        
        // Button deaktivieren
        const button = feedbackEl.previousElementSibling;
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        
        // Prüfen, ob alle Fragen beantwortet wurden
        if (quizStats.answered === quizStats.total) {
            showResults();
        }
    }
}

// Hilfsfunktion für Frage 100
function checkPasswordQuestion() {
    const feedbackEl = document.getElementById('feedback-100');
    
    if (hasAnsweredQ100) {
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.innerHTML = '❌ Sie haben diese Frage bereits beantwortet.';
        return;
    }
    
    const savedPassword = sessionStorage.getItem('savedPassword');
    const userInput = document.getElementById('q100-password-input').value;
    
    // Falls kein Passwort gespeichert wurde
    if (!savedPassword) {
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.innerHTML = '❌ Fehler: Kein Passwort aus Frage 3 gefunden. Bitte beantworten Sie zuerst Frage 3.';
        return;
    }
    
    // Passwort-Vergleich
    if (userInput === savedPassword) {
        hasAnsweredQ100 = true;
        feedbackEl.className = 'feedback correct';
        feedbackEl.innerHTML = `
            🎉 Perfekt! Sie haben sich Ihr Passwort korrekt gemerkt!<br>
            <strong>+100 Bonuspunkte für Merkfähigkeit!</strong>
        `;
        
        quizStats.correct++;
        quizStats.answered++;
        updateScore(100);
        
        // Versuche zurücksetzen und Input deaktivieren
        document.getElementById('q100-password-input').disabled = true;
        const toggleBtn = document.querySelector('[data-target="q100-password-input"]');
        if (toggleBtn) toggleBtn.disabled = true;
        
        // Button deaktivieren
        const button = feedbackEl.previousElementSibling;
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        
        // Prüfen, ob alle Fragen beantwortet wurden
        if (quizStats.answered === quizStats.total) {
            showResults();
        }
        
    } else {
        passwordAttempts100--;
        document.getElementById('attempts-count-100').textContent = passwordAttempts100;
        
        if (passwordAttempts100 > 0) {
            let hint = '';
            if (passwordAttempts100 === 2) {
                hint = `<div class="password-match-hint">
                    💡 Hinweis: Ihr Passwort hatte ${savedPassword.length} Zeichen.
                </div>`;
            } else if (passwordAttempts100 === 1) {
                const firstChar = savedPassword.charAt(0);
                const lastChar = savedPassword.charAt(savedPassword.length - 1);
                hint = `<div class="password-match-hint">
                    💡 Hinweis: Ihr Passwort begann mit "${firstChar}" und endete mit "${lastChar}".
                </div>`;
            }
            
            feedbackEl.className = 'feedback incorrect';
            feedbackEl.innerHTML = `
                ❌ Falsches Passwort! Sie haben noch ${passwordAttempts100} Versuch(e).
                ${hint}
            `;
        } else {
            hasAnsweredQ100 = true;
            feedbackEl.className = 'feedback incorrect';
            feedbackEl.innerHTML = `
                ❌ Leider falsch! Sie haben keine Versuche mehr übrig.<br>
                <strong>Ihr korrektes Passwort war: </strong><code>${savedPassword}</code><br>
                <em>0 Punkte für diese Aufgabe.</em>
            `;
            
            quizStats.answered++;
            
            // Input deaktivieren
            document.getElementById('q100-password-input').disabled = true;
            const toggleBtn = document.querySelector('[data-target="q100-password-input"]');
            if (toggleBtn) toggleBtn.disabled = true;
            
            // Button deaktivieren
            const button = feedbackEl.previousElementSibling;
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
            
            updateScore(0);
            
            // Prüfen, ob alle Fragen beantwortet wurden
            if (quizStats.answered === quizStats.total) {
                showResults();
            }
        }
    }
}



// Neue Funktion zum Zurücksetzen einer einzelnen Frage
function retryQuestion(questionNum) {
    const feedbackEl = document.getElementById(`feedback-${questionNum}`);
    feedbackEl.className = 'feedback';
    feedbackEl.innerHTML = '';
    
    // Eingaben zurücksetzen
    const radioInputs = document.querySelectorAll(`input[name="q${questionNum}"]`);
    radioInputs.forEach(input => input.checked = false);
    
    const textInput = document.getElementById(`q${questionNum}-input`);
    if (textInput) {
        textInput.value = '';
        textInput.focus();
    }
}


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

    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');

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
   TERMINAL FUNKTIONALITÄT
   =========================== */

const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const commandHistory = [];
let historyIndex = -1;
let sudoMode = false;
let sudoCommand = '';

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
        terminalOutput.innerHTML = '';
        return '';
    },
    'sudo': (args) => {
        if (args[0] === 'answer') {
            sudoMode = true;
            sudoCommand = 'answer';
            terminalInput.type = 'password';
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
        let answerText = '';
        
        if (ans.type === 'multiple-text') {
            answerText = `1: ${ans.correct[0][0]} | 2: ${ans.correct[1][0]} | 3: ${ans.correct[2][0]}`;
        } else if (ans.type === 'multiple-number') {
            answerText = `1: ${ans.correct[0]} | 2: ${ans.correct[1]} | 3: ${ans.correct[2]} | 4: ${ans.correct[3]}`;
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
    // Sudo-Passwort-Modus - Passwort ist "95"
    if (sudoMode) {
        sudoMode = false;
        terminalInput.type = 'text';
        
        const correctPassword = '95';
        
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
   4. Drittes Subnetz finden
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

/* ===========================
   INITIALISIERUNG
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('FISI Eignungstest geladen - Viel Erfolg!');
    
    // Enter-Taste für Text-Inputs
    document.querySelectorAll('.text-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const questionBox = input.closest('.question-box');
                const questionNum = questionBox.dataset.question;
                checkAnswer(parseInt(questionNum));
            }
        });
    });
});

window.addEventListener('load', () => {
    const welcomeLine = document.createElement('div');
    welcomeLine.innerHTML = `<span style="color: #0f0;">FISI Eignungstest Terminal v1.0 gestartet</span>
<span style="color: #888;">Tippe 'help' für verfügbare Befehle</span>
`;
    welcomeLine.style.whiteSpace = 'pre-wrap';
    welcomeLine.style.marginBottom = '10px';
    terminalOutput.appendChild(welcomeLine);
});

function validatePasswordStrength(password) {
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
    
    // Kriterien visuell aktualisieren
    document.getElementById('criterion-length').className = criteria.length ? 'met' : '';
    document.getElementById('criterion-uppercase').className = criteria.uppercase ? 'met' : '';
    document.getElementById('criterion-lowercase').className = criteria.lowercase ? 'met' : '';
    document.getElementById('criterion-numbers').className = criteria.numbers ? 'met' : '';
    document.getElementById('criterion-special').className = criteria.special ? 'met' : '';
    document.getElementById('criterion-no-common').className = criteria.noCommon ? 'met' : '';
    document.getElementById('criterion-no-sequential').className = criteria.noSequential ? 'met' : '';
    
    // Punkteberechnung
    if (criteria.length) score += 20;
    if (criteria.uppercase) score += 10;
    if (criteria.lowercase) score += 10;
    if (criteria.numbers) score += 15;
    if (criteria.special) score += 20;
    if (criteria.noCommon) score += 15;
    if (criteria.noSequential) score += 10;
    
    // Bonus für extra Länge
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
    
    // Score begrenzen auf 100
    score = Math.min(score, 100);
    passwordScore3 = score;
    
    // Visuelle Anzeige aktualisieren
    const strengthBar = document.getElementById('strength-bar-3');
    const strengthLevel = document.getElementById('strength-level-3');
    const pointsValue = document.getElementById('points-value-3');
    
    strengthBar.style.width = score + '%';
    pointsValue.textContent = score;
    
    if (score < 40) {
        strengthBar.style.backgroundColor = '#dc3545';
        strengthLevel.textContent = 'Schwach';
        strengthLevel.style.color = '#dc3545';
    } else if (score < 70) {
        strengthBar.style.backgroundColor = '#ffc107';
        strengthLevel.textContent = 'Mittel';
        strengthLevel.style.color = '#ffc107';
    } else if (score < 90) {
        strengthBar.style.backgroundColor = '#17a2b8';
        strengthLevel.textContent = 'Gut';
        strengthLevel.style.color = '#17a2b8';
    } else {
        strengthBar.style.backgroundColor = '#28a745';
        strengthLevel.textContent = 'Sehr stark';
        strengthLevel.style.color = '#28a745';
    }
    
    userPassword3 = password;
}

// Event-Listener nach DOM-Load hinzufügen
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const input = document.getElementById('q3-password-input');
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈 Verbergen';
            } else {
                input.type = 'password';
                this.textContent = '👁️ Anzeigen';
            }
        });
    }
});


const savedPassword = sessionStorage.getItem('savedPassword');
const userInput = document.getElementById('q15-password-verification').value;

if (userInput === savedPassword) {
    showFeedback(15, true, 'Korrekt! Sie haben sich Ihr Passwort gemerkt. +50 Bonuspunkte!');
    updateScore(50);
} else {
    showFeedback(15, false, 'Das eingegebene Passwort stimmt nicht mit Ihrem erstellten Passwort überein.');
}

// Event-Listener für Toggle-Button (Frage 100)
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈 Verbergen';
            } else {
                input.type = 'password';
                this.textContent = '👁️ Anzeigen';
            }
        });
    });
});

// Funktion für checkAnswer(100) - füge dies zu deiner bestehenden checkAnswer-Funktion hinzu
function checkPasswordQuestion() {
    if (hasAnsweredQ100) {
        showFeedback(100, false, 'Sie haben diese Frage bereits beantwortet.');
        return;
    }
    
    const savedPassword = sessionStorage.getItem('savedPassword');
    const userInput = document.getElementById('q100-password-input').value;
    
    // Falls kein Passwort gespeichert wurde
    if (!savedPassword) {
        showFeedback(100, false, 'Fehler: Kein Passwort aus Frage 3 gefunden. Bitte beantworten Sie zuerst Frage 3.');
        return;
    }
    
    // Passwort-Vergleich
    if (userInput === savedPassword) {
        hasAnsweredQ100 = true;
        showFeedback(100, true, 
            '🎉 Perfekt! Sie haben sich Ihr Passwort korrekt gemerkt! <br>' +
            '<strong>+100 Bonuspunkte für Merkfähigkeit!</strong>');
        updateScore(100);
        
        // Versuche zurücksetzen und Input deaktivieren
        document.getElementById('q100-password-input').disabled = true;
        document.querySelector('[data-target="q100-password-input"]').disabled = true;
        
    } else {
        passwordAttempts100--;
        document.getElementById('attempts-count-100').textContent = passwordAttempts100;
        
        if (passwordAttempts100 > 0) {
            let hint = '';
            if (passwordAttempts100 === 2) {
                hint = `<div class="password-match-hint">
                    💡 Hinweis: Ihr Passwort hatte ${savedPassword.length} Zeichen.
                </div>`;
            } else if (passwordAttempts100 === 1) {
                const firstChar = savedPassword.charAt(0);
                const lastChar = savedPassword.charAt(savedPassword.length - 1);
                hint = `<div class="password-match-hint">
                    💡 Hinweis: Ihr Passwort begann mit "${firstChar}" und endete mit "${lastChar}".
                </div>`;
            }
            
            showFeedback(100, false, 
                `❌ Falsches Passwort! Sie haben noch ${passwordAttempts100} Versuch(e).${hint}`);
        } else {
            hasAnsweredQ100 = true;
            showFeedback(100, false, 
                `❌ Leider falsch! Sie haben keine Versuche mehr übrig. <br>` +
                `<strong>Ihr korrektes Passwort war: </strong><code>${savedPassword}</code><br>` +
                `<em>0 Punkte für diese Aufgabe.</em>`);
            
            // Input deaktivieren
            document.getElementById('q100-password-input').disabled = true;
            document.querySelector('[data-target="q100-password-input"]').disabled = true;
            updateScore(0);
        }
    }
}
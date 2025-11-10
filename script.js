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
let quizStats = {
    answered: 0,
    correct: 0,
    total: 16
};

/* ===========================
   QUIZ FUNKTIONALITÄT
   =========================== */

function checkAnswer(questionNum) {
    const answer = answers[questionNum];
    const feedbackEl = document.getElementById(`feedback-${questionNum}`);
    let isCorrect = false;
    let userAnswer = null;

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

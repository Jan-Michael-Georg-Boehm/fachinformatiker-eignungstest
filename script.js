/* ===========================
   FISI Eignungstest - Quiz Logic
   =========================== */

// Antwortdefinitionen für alle Fragen
const answers = {
    1: { type: 'radio', correct: 'c' },
    2: { type: 'number', correct: 42, explanation: 'Muster: n(n+1), also 6×7 = 42' },
    3: { type: 'number', correct: 3600, explanation: '15 Min = 450 Anfragen → 1 Min = 30 Anfragen → 120 Min = 3600 Anfragen' },
    4: { type: 'text', correct: ['mac', 'mac-adresse', 'macadresse', 'mac adresse'], explanation: 'MAC-Adresse (Media Access Control)' },
    5: { type: 'radio', correct: 'b' },
    6: { type: 'matching', correct: ['b', 'a', 'c'], explanation: '64=2^6, 255=2^8-1, 128=2^7' },
    7: { type: 'radio', correct: 'b', explanation: 'Muster: Nach 1, 2, 3, 4 ausgefüllten Rauten folgt eine leere Raute' },
    8: { type: 'text', correct: ['0.0001', '0,0001'], explanation: '0.1% × 0.1% = 0.0001 (0.001 × 0.001)' },
    9: { type: 'text', correct: ['192.168.10.32', '192.168.10.32/27'], explanation: '/27 = 255.255.255.224, Subnetzgröße: 32 IPs, Netzadresse: 192.168.10.32' },
    10: { type: 'radio', correct: 'd' },
    11: { type: 'radio', correct: 'b' },
    12: { type: 'number', correct: 127, explanation: 'Muster: 2^n - 1, also 2^7 - 1 = 127' },
    13: { type: 'text', correct: ['dhcp', 'dhcp-protokoll'], explanation: 'DHCP = Dynamic Host Configuration Protocol' },
    14: { type: 'number', correct: 80, explanation: '65% von 8TB = 5.2TB, +1.2TB = 6.4TB, 6.4/8 = 80%' },
    15: { type: 'radio', correct: 'b' },
    16: { type: 'matching', correct: ['b', 'a', 'c'], explanation: 'HTTPS:443, SSH:22, DNS:53' },
    17: { type: 'number', correct: 64, explanation: 'Muster: Jede Zeile n, n^2, n^3 → 4, 16, 64' },
    18: { type: 'text', correct: ['0.5', '0,5'], explanation: '524.288 MB ÷ 1.048.576 = 0.5 TB' },
    19: { type: 'radio', correct: 'b' },
    20: { type: 'radio', correct: 'c' },
    21: { type: 'text', correct: ['typ 1', 'typ1', 'type 1', 'type1', '1'], explanation: 'Typ 1 Hypervisor (Bare-Metal)' },
    22: { type: 'text', correct: ['order', 'order by'], explanation: 'ORDER BY sortiert Ergebnisse' },
    23: { type: 'number', correct: 29, explanation: 'Primzahlen: nächste nach 23 ist 29' },
    24: { type: 'radio', correct: 'c' },
    25: { type: 'radio', correct: 'c' }
};

// Tracking der Antworten pro Quiz
let quizStats = {
    answered: 0,
    correct: 0,
    total: 5
};

/* ===========================
   ANTWORT ÜBERPRÜFEN
   =========================== */

function checkAnswer(questionNum) {
    const answer = answers[questionNum];
    const feedbackEl = document.getElementById(`feedback-${questionNum}`);
    let isCorrect = false;
    let userAnswer = null;

    // Je nach Antworttyp unterschiedlich prüfen
    switch(answer.type) {
        case 'radio':
            const selectedRadio = document.querySelector(`input[name="q${questionNum}"]:checked`);
            if (!selectedRadio) {
                alert('Bitte wählen Sie eine Antwort aus.');
                return;
            }
            userAnswer = selectedRadio.value;
            isCorrect = (userAnswer === answer.correct);
            break;

        case 'number':
            const numberInput = document.getElementById(`q${questionNum}-input`);
            if (!numberInput.value) {
                alert('Bitte geben Sie eine Antwort ein.');
                return;
            }
            userAnswer = parseFloat(numberInput.value);
            isCorrect = (userAnswer === answer.correct);
            break;

        case 'text':
            const textInput = document.getElementById(`q${questionNum}-input`);
            if (!textInput.value) {
                alert('Bitte geben Sie eine Antwort ein.');
                return;
            }
            userAnswer = textInput.value.toLowerCase().trim();
            isCorrect = answer.correct.some(correct => 
                userAnswer === correct.toLowerCase() || 
                userAnswer.includes(correct.toLowerCase())
            );
            break;

        case 'matching':
            const matches = [];
            for (let i = 1; i <= answer.correct.length; i++) {
                const selected = document.querySelector(`input[name="q${questionNum}-${i}"]:checked`);
                if (!selected) {
                    alert(`Bitte beantworten Sie alle Zuordnungen (${i}/${answer.correct.length}).`);
                    return;
                }
                matches.push(selected.value);
            }
            userAnswer = matches.join(',');
            isCorrect = JSON.stringify(matches) === JSON.stringify(answer.correct);
            break;
    }

    // Feedback anzeigen
    if (isCorrect) {
        feedbackEl.className = 'feedback correct';
        feedbackEl.innerHTML = `✓ Richtig! ${answer.explanation || ''}`;
        quizStats.correct++;
    } else {
        feedbackEl.className = 'feedback incorrect';
        let correctAnswerText = '';
        
        if (answer.type === 'radio' || answer.type === 'matching') {
            correctAnswerText = answer.explanation || 'Siehe korrekte Lösung oben.';
        } else {
            correctAnswerText = answer.explanation || `Korrekte Antwort: ${answer.correct}`;
        }
        
        feedbackEl.innerHTML = `✗ Leider falsch. ${correctAnswerText}`;
    }

    quizStats.answered++;
    
    // Button deaktivieren nach Beantwortung
    const button = feedbackEl.previousElementSibling;
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';

    // Prüfen, ob alle Fragen beantwortet wurden
    if (quizStats.answered === quizStats.total) {
        showResults();
    }
}

/* ===========================
   ERGEBNISSE ANZEIGEN
   =========================== */

function showResults() {
    const resultsBox = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    
    const percentage = Math.round((quizStats.correct / quizStats.total) * 100);
    let message = '';
    let emoji = '';

    if (percentage >= 80) {
        emoji = '🎉';
        message = 'Hervorragend! Sie sind sehr gut vorbereitet.';
    } else if (percentage >= 60) {
        emoji = '👍';
        message = 'Gut gemacht! Noch etwas Übung und Sie sind perfekt vorbereitet.';
    } else if (percentage >= 40) {
        emoji = '📚';
        message = 'Nicht schlecht, aber es gibt noch Verbesserungspotenzial.';
    } else {
        emoji = '💪';
        message = 'Kopf hoch! Üben Sie weiter, Sie schaffen das!';
    }

    resultsContent.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 20px;">${emoji}</div>
        <div style="font-size: 1.5em; margin-bottom: 10px;">
            ${quizStats.correct} / ${quizStats.total} richtig (${percentage}%)
        </div>
        <div style="color: var(--text-secondary); margin-top: 15px;">
            ${message}
        </div>
    `;

    resultsBox.classList.add('show');
    resultsBox.scrollIntoView({ behavior: 'smooth' });
}

/* ===========================
   QUIZ ZURÜCKSETZEN
   =========================== */

function resetQuiz() {
    // Statistiken zurücksetzen
    quizStats = {
        answered: 0,
        correct: 0,
        total: 5
    };

    // Alle Inputs zurücksetzen
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');

    // Alle Feedback-Elemente ausblenden
    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.className = 'feedback';
        feedback.innerHTML = '';
    });

    // Alle Buttons wieder aktivieren
    document.querySelectorAll('.check-btn').forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });

    // Ergebnisbox ausblenden
    document.getElementById('results').classList.remove('show');

    // Nach oben scrollen
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===========================
   INITIALISIERUNG
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('FISI Eignungstest geladen - Viel Erfolg!');
    
    // Enter-Taste für Text-Inputs
    document.querySelectorAll('.text-input').forEach((input, index) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const questionBox = input.closest('.question-box');
                const questionNum = questionBox.dataset.question;
                checkAnswer(parseInt(questionNum));
            }
        });
    });
});
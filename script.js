$(function() {
    let questionCount = 0; // Counter to keep track of the number of questions

    // Load survey from local storage if available
    loadSurvey();

    // Handle dragging of question types
    $('#questionTypes .list-group-item').on('dragstart', function(event) {
        event.originalEvent.dataTransfer.setData('text/plain', $(this).data('type'));
    });

    // Handle dropping of questions
    $('#surveyQuestions').on('dragover', function(event) {
        event.preventDefault(); // Prevent default to allow drop
    });

    $('#surveyQuestions').on('drop', function(event) {
        const questionType = event.originalEvent.dataTransfer.getData('text/plain');
        addQuestion(questionType); // Add question on drop
    });

    // Add question to the survey
    function addQuestion(type) {
        questionCount++; // Increment the question count for numbering
        let questionHTML = '';

        switch (type) {
            case 'multipleChoice':
                questionHTML = getMultipleChoiceHTML();
                break;
            case 'likertScale':
                questionHTML = getLikertScaleHTML();
                break;
            case 'textField':
                questionHTML = getTextFieldHTML();
                break;
            case 'starRating':
                questionHTML = getStarRatingHTML();
                break;
            case 'image':
                questionHTML = getImageUploadHTML();
                break;
        }

        const $questionItem = $(questionHTML);
        $questionItem.find('.question-title').val(`Question ${questionCount}`); // Set title to "Question X"
        $('#surveyQuestions').append($questionItem); // Append the new question
        makeSortable(); // Ensure sorting is enabled
    }

    function makeSortable() {
        $("#surveyQuestions").sortable({
            handle: ".question-title", // Drag handle
            placeholder: "sortable-placeholder",
            start: function(event, ui) {
                ui.placeholder.height(ui.item.height()); // Match the height of the dragged item
            },
            stop: function(event, ui) {
                updateQuestionTitles(); // Update titles after sorting
            }
        }).disableSelection();
    }

    function updateQuestionTitles() {
        $(".question-item").each(function(index) {
            $(this).find('.question-title').val(`Question ${index + 1}`);
        });
    }

    function getMultipleChoiceHTML() {
        return `
            <div class="question-item" data-type="multipleChoice">
                <input type="text" class="form-control mb-2 question-title" placeholder="Enter question">
                <div class="options" id="options-${questionCount}">
                    <div class="form-check">
                        <input type="radio" name="option-group-${questionCount}" class="form-check-input" id="option1-${questionCount}" value="Option 1">
                        <input type="text" class="form-control mb-1 option-input" placeholder="Option 1" onchange="updateOptionLabel(this, 'option1-${questionCount}')">
                    </div>
                    <div class="form-check">
                        <input type="radio" name="option-group-${questionCount}" class="form-check-input" id="option2-${questionCount}" value="Option 2">
                        <input type="text" class="form-control mb-1 option-input" placeholder="Option 2" onchange="updateOptionLabel(this, 'option2-${questionCount}')">
                    </div>
                </div>
                <button type="button" class="btn btn-primary add-option" data-question-id="${questionCount}"><i class="fas fa-plus"></i></button>
                <div class="required-checkbox form-check">
                    <input type="checkbox" class="form-check-input" id="required-${questionCount}">
                    <label class="form-check-label" for="required-${questionCount}">Required</label>
                </div>
                <button class="delete-question btn btn-danger"><i class="fas fa-trash"></i></button>
            </div>`;
    }

    function updateOptionLabel(input, radioId) {
        const newValue = input.value;
        const radioInput = document.getElementById(radioId);
        if (radioInput) {
            radioInput.value = newValue; // Update the value of the radio input
        }
    }

    // Add event listener for dynamically adding options
    $(document).on('click', '.add-option', function() {
        const questionId = $(this).data('question-id');
        const optionCount = $(`#options-${questionId} .form-check`).length + 1; // Count current options
        const newOptionHTML = `
            <div class="form-check">
                <input type="radio" name="option-group-${questionId}" class="form-check-input" id="option${optionCount}-${questionId}" value="Option ${optionCount}">
                <input type="text" class="form-control mb-1 option-input" placeholder="Option ${optionCount}" onchange="updateOptionLabel(this, 'option${optionCount}-${questionId}')">
            </div>`;
        $(`#options-${questionId}`).append(newOptionHTML); // Append new option
    });

    function getLikertScaleHTML() {
        return `
            <div class="question-item" data-type="likertScale">
                <input type="text" class="form-control mb-2 question-title" placeholder="Enter Likert Scale Question">
                <div class="options">
                    <label><input type="radio" name="likert-${questionCount}" value="1"> Strongly Disagree</label><br>
                    <label><input type="radio" name="likert-${questionCount}" value="2"> Disagree</label><br>
                    <label><input type="radio" name="likert-${questionCount}" value="3"> Neutral</label><br>
                    <label><input type="radio" name="likert-${questionCount}" value="4"> Agree</label><br>
                    <label><input type="radio" name="likert-${questionCount}" value="5"> Strongly Agree</label>
                </div>
                <div class="required-checkbox form-check">
                    <input type="checkbox" class="form-check-input" id="required-${questionCount}">
                    <label class="form-check-label" for="required-${questionCount}">Required</label>
                </div>
                <button class="delete-question btn btn-danger"><i class="fas fa-trash"></i></button>
            </div>`;
    }

    function getTextFieldHTML() {
        return `
            <div class="question-item" data-type="textField">
                <input type="text" class="form-control mb-2 question-title" placeholder="Enter your question here">
                <input type="text" class="form-control mb-2 answer-field" placeholder="Your answer here">
                <div class="required-checkbox form-check">
                    <input type="checkbox" class="form-check-input" id="required-${questionCount}">
                    <label class="form-check-label" for="required-${questionCount}">Required</label>
                </div>
                <button class="delete-question btn btn-danger"><i class="fas fa-trash"></i></button>
            </div>`;
    }

    function getStarRatingHTML() {
        return `
            <div class="question-item" data-type="starRating">
                <input type="text" class="form-control mb-2 question-title" placeholder="Enter Star Rating Question">
                <div class="stars">
                    <span class="star" data-value="1">&#9734;</span>
                    <span class="star" data-value="2">&#9734;</span>
                    <span class="star" data-value="3">&#9734;</span>
                    <span class="star" data-value="4">&#9734;</span>
                    <span class="star" data-value="5">&#9734;</span>
                </div>
                <div class="required-checkbox form-check">
                    <input type="checkbox" class="form-check-input" id="required-${questionCount}">
                    <label class="form-check-label" for="required-${questionCount}">Required</label>
                </div>
                <button class="delete-question btn btn-danger"><i class="fas fa-trash"></i></button>
            </div>`;
    }

    // Star click event
    $(document).on('click', '.star', function() {
        const rating = $(this).data('value');
        const stars = $(this).parent().children('.star');

        // Fill stars based on the clicked star's value
        stars.each(function(index) {
            if (index < rating) {
                $(this).addClass('filled'); // Add filled class
            } else {
                $(this).removeClass('filled'); // Remove filled class
            }
        });
    });

    // Updated Image Upload Code
    function getImageUploadHTML() {
        return `
            <div class="question-item" data-type="image">
                <input type="text" class="form-control mb-2 question-title" placeholder="Image Upload Question">
                <div class="image-preview" style="display: none; margin-bottom: 10px;">
                    <img id="imagePreview-${questionCount}" style="max-width: 100%; height: auto;" alt="Image Preview">
                </div>
                <input type="file" class="form-control mb-1" accept="image/*" onchange="previewImage(event, ${questionCount})">
                <div class="required-checkbox form-check">
                    <input type="checkbox" class="form-check-input" id="required-${questionCount}">
                    <label class="form-check-label" for="required-${questionCount}">Required</label>
                </div>
                <button class="delete-question btn btn-danger"><i class="fas fa-trash"></i></button>
            </div>`;
    }

    // Preview image before upload
    window.previewImage = function(event, questionCount) {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.getElementById(`imagePreview-${questionCount}`);
            img.src = reader.result; // Set the source to the reader's result
            img.parentElement.style.display = 'block'; // Show the image preview
        }
        reader.readAsDataURL(event.target.files[0]); // Read the file
    }

    // Handle deletion of a question
    $(document).on('click', '.delete-question', function() {
        $(this).closest('.question-item').remove(); // Remove the question item
        updateQuestionTitles(); // Update the titles after deletion
    });

    // Save the survey
    $('#saveSurvey').click(function() {
        const surveyTitle = $('#surveyTitle').val();
        const surveyDescription = $('#surveyDescription').val();
        const questions = [];

        // Collect questions and their data
        $('#surveyQuestions .question-item').each(function() {
            const questionType = $(this).data('type');
            const questionText = $(this).find('.question-title').val();
            const required = $(this).find('.form-check-input').is(':checked');

            if (questionType === 'multipleChoice') {
                const options = [];
                $(this).find('.option-input').each(function() {
                    options.push($(this).val());
                });
                questions.push({ type: questionType, text: questionText, options, required });
            } else if (questionType === 'likertScale' || questionType === 'textField' || questionType === 'starRating' || questionType === 'image') {
                questions.push({ type: questionType, text: questionText, required });
            }
        });

        const surveyData = { title: surveyTitle, description: surveyDescription, questions };
        localStorage.setItem('surveyData', JSON.stringify(surveyData)); // Save to local storage
        alert('Survey saved successfully!'); // Alert on successful save
    });

    // Load survey from local storage
    function loadSurvey() {
        const surveyData = JSON.parse(localStorage.getItem('surveyData'));
        if (surveyData) {
            $('#surveyTitle').val(surveyData.title); // Set the survey title
            $('#surveyDescription').val(surveyData.description); // Set the survey description
            surveyData.questions.forEach(question => {
                addQuestion(question.type); // Recreate each question
                const lastQuestion = $('#surveyQuestions .question-item').last(); // Get the last added question
                lastQuestion.find('.question-title').val(question.text); // Set question text

                // Handle options for multiple choice questions
                if (question.type === 'multipleChoice' && question.options) {
                    question.options.forEach(option => {
                        lastQuestion.find('.add-option').click(); // Add an option
                        lastQuestion.find('.option-input').last().val(option); // Set the value of the last option
                    });
                }
                // Set required checkbox if applicable
                if (question.required) {
                    lastQuestion.find('.form-check-input').prop('checked', true);
                }
            });
        }
    }
});

$(document).ready(function() {
    // Event listener for the Preview Survey button
    $('#previewSurvey').on('click', function() {
        const surveyTitle = $('#surveyTitle').val(); // Get survey title
        const surveyDescription = $('#surveyDescription').val(); // Get survey description
        const questionsHtml = [];

        // Collect questions and options
        $('.question-item').each(function() {
            const questionTitle = $(this).find('.question-title').val(); // Get question title
            const questionType = $(this).data('type'); // Get question type
            const required = $(this).find('.form-check-input[type="checkbox"]').is(':checked'); // Get required status
            
            let questionHtml = `<div class="question"><strong>${questionTitle}</strong>${required ? ' (Required)' : ''}</div>`;

            // Display options if the question type is multipleChoice
            if (questionType === 'multipleChoice') {
                questionHtml += '<ul>';
                $(this).find('.options .option-input').each(function() {
                    const optionText = $(this).val();
                    questionHtml += `<li>${optionText}</li>`;
                });
                questionHtml += '</ul>';
            }

            questionsHtml.push(questionHtml);
        });

        // Set preview data in the modal
        $('#previewTitle').text(surveyTitle);
        $('#previewDescription').text(surveyDescription);
        $('#previewQuestions').html(questionsHtml.join('')); // Join all questions into HTML

        // Show the preview modal
        $('#previewModal').modal('show');
    });
});

$(document).ready(function() {
    // Event listener for Save as PDF button
    $('#savePdf').on('click', function() {
        const { jsPDF } = window.jspdf; // Import jsPDF
        const doc = new jsPDF();

        const surveyTitle = $('#surveyTitle').val(); // Get survey title
        const surveyDescription = $('#surveyDescription').val(); // Get survey description
        const questions = [];

        // Collect questions and options
        $('.question-item').each(function() {
            const questionTitle = $(this).find('.question-title').val(); // Get question title
            const questionType = $(this).data('type'); // Get question type
            
            let questionData = `${questionTitle}`;

            // Display options if the question type is multipleChoice
            if (questionType === 'multipleChoice') {
                const options = [];
                $(this).find('.options .option-input').each(function() {
                    const optionText = $(this).val();
                    options.push(optionText);
                });
                questionData += `\nOptions: ${options.join(', ')}`;
            }

            questions.push(questionData);
        });

        // Add title and description to PDF
        doc.setFontSize(16);
        doc.text(surveyTitle, 10, 10);
        doc.setFontSize(12);
        doc.text(surveyDescription, 10, 20);

        // Add questions to PDF
        doc.setFontSize(14);
        questions.forEach((question, index) => {
            doc.text(`${index + 1}. ${question}`, 10, 30 + (index * 10));
        });

        // Save the PDF
        doc.save('survey.pdf');
    });
});

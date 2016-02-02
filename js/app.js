/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    // ********************* Model *********************
    var model = {
        getAttendence: function () {
            return JSON.parse(localStorage.attendance);
        },
        updateAttendance: function (attendance) {
            localStorage.attendance = JSON.stringify(attendance);
        }
    };

    // ********************* Octopus *********************
    var octopus = {
        init: function() {
            this.attendance = model.getAttendence();
            view.init();
        },

        getAttendence: function() {
            return this.attendance;
        },

        updateAttendance: function(student, day) {
            this.attendance[student][day] = !this.attendance[student][day]
            model.updateAttendance(this.attendance);
            view.render();
        },

        calculateMissedDays: function(student) {
            return this.attendance[student].filter(function (element) {
                return !element;
            }).length;
        }
    };


    // ********************* View *********************
    var view = {

        init: function () {
            this.render();
        },

        render: function () {
            var list = octopus.getAttendence();
            var $studentsList = $('#studentsList');
            
            $studentsList.html('');
            for (student in list) {
                var newStudentElement = '<tr class="student">\n' +
                                        '    <td class="name-col">' + student + '</td>\n';
                for (i in list[student]) {
                    newStudentElement += '    <td class="attend-col"><input type="checkbox" id="' + i + '" name="' + student + '" ' + (list[student][i] ? 'checked="checked"': '') + '/></td>'
                }
                newStudentElement += '    <td class="missed-col">' + octopus.calculateMissedDays(student) + '</td>'

                $studentsList.append(newStudentElement);
            }

            $('tbody input').on('click', function(e) {
                var day = e.target.id;
                var student = e.target.name;
                octopus.updateAttendance(student, day);
            });
        },
    };

    octopus.init();
}());

//menu tab "router"
var menuAction = {
        bi_online: {
            id: 'bi_online',
            label: 'Online',
            color: '#ef5350',
            callback: bi_online
        },
        /*view menu*/
        view_menu:{
            id: 'view_menu',
            label: 'menu',
            color: '#ef5350',
            callback: view_menu
        },
      
       /*end*/ 
        answers_by_date: {
            id: 'answers_by_date',
            label: 'Answers by date',
            color: '#66bb6a',
            callback: answers_by_date
        },
        /*companies*/
        companies_view:{
            id: 'companies_view',
            label: 'companies',
            color: '#a5a5a5',
            callback: companies_view
        },
        /*end */
        /*items*/
        items_view:{
          id: 'items_view',
          label: 'items',
          color: '#777',
          callback: items_view
        },
        /*end*/
         /*articles*/
        articles_view:{
          id: 'articles_view',
          label: 'articles',
          color: '#ccc',
          callback: articles_view
        },
        /*end*/
        analyse_questions: {
            id: 'analyse_questions',
            label: 'Analyse answers',
            color: '#66bb6a',
            callback: analyse_questions
        },
        bi_patients_answers: {
            id: 'bi_patients_answers',
            label: 'Patient answers',
            color: '#66bb6a',
            callback: bi_patients_answers
        },
        bi_workers_answers: {
            id: 'bi_workers_answers',
            label: 'Care team answers',
            color: '#66bb6a',
            callback: bi_workers_answers
        },
        bi_workers_not_answered: {
            id: 'bi_careteam_not_answered',
            label: 'Care team not answered',
            color: '#66bb6a',
            callback: bi_careteam_not_answered
        },
        questions_per_site: {
            id: 'questions',
            label: 'Questions by site',
            color: '#42a5f5',
            callback: questions_per_site
        },
        questions_unit_type: {
            id: 'questions_unit_type',
            label: 'Questions by unit type',
            color: '#ef5350',
            callback: questions_unit_type
        },
        sites: {
            id: 'sites',
            label: 'Sites',
            color: '#42a5f5',
            callback: sites
        },
        daily_sumary: {
             id: 'daily_summary',
             label: 'Daily summary',
             color: '#ef5350',
             callback: daily_sumary_callback
        },
        questions_summary: {
             id: 'questions_summary',
             label: 'Questions summary',
             color: '#42A5F5',
             callback: questions_summary_callback
        },
        units: {
            id: 'units',
            label: 'Units',
            color: '#ef5350',
            callback: units
        },
        categories: {
            id: 'categories',
            label: 'Categories',
            color: '#fad53e',
            callback: categories
        },
        question_list_patients: {
            id: 'question_list_patients',
            label: 'Patients questions',
            color: '#ab47bc',
            callback: question_list_patients
        },
        question_list_workers: {
            id: 'question_list_workers',
            label: 'Care team questions',
            color: '#ab47bc',
            callback: question_list_workers
        },
        not_applicable: {
            id: 'not_applicable',
            label: 'Not applicable',
            color: '#ab47bc',
            callback: not_applicable_questions
        },
        workers: {
            id: 'workers',
            label: 'Care team',
            color: '#ef5350',
            callback: workers
        },
        employees_absences: {
            id: 'employees_absences',
            label: 'Employees Absences',
            color: '#ef5350',
            callback: absenceWorkers
        },
        static_questions: {
            id: 'static_questions',
            label: 'Static questions',
            color: '#ab47bc',
            callback: static_questions
        },
        hot_questions: {
            id: 'hot_questions',
            label: 'Hot questions',
            color: '#EF5350',
            callback: hot_questions_callback
        },
        targets: {
            id: 'targets',
            label: 'Targets',
            color: '#ab47bc',
            callback: targets_callback
        },
        parameters: {
            id: 'parameters',
            label: 'Parameters',
            color: '#42a5f5',
            callback: parameters
        },
        users: {
            id: 'users',
            label: 'Users',
            color: '#ef5350',
            callback: users
        },
        events: {
            id: 'events',
            label: 'Events',
            color: '#ef5350',
            callback: events_callback
        },
        daily_members: {
            id: 'daily_members',
            label: 'Daily numbers',
            color: '#ef5350',
            callback: daily_members_callback
        },
        login_logs: {
            id: 'login_logs',
            label: 'Logins',
            color: '#ab47bc',
            callback: user_logins
        }
    },
    tabsContainer = {};

TableForm.default.contentType = 'application/x-www-form-urlencoded';
TableForm.default.actionNotification = false;
TableForm.default.onDelete = function(form, continueCallback){

    //To stop autofocus and display calendar on load
    form.datePickerOptions.showOn = 'button';
    var containerForm = form.table.addRowContainer(form.render(), true);
    form.after = function(form){
        $('.field input, .field select, .field textarea', containerForm).prop('disabled', true);

        $('.field .ui-datepicker-trigger', containerForm).remove();

        $('.field input.hasDatepicker', containerForm).datepicker('destroy');
    }
    form.onComplete = function(){
        form.datePickerOptions.showOn = 'focus';
        this.table.resetTable();
    }
    form.onCancel = function(){
        form.datePickerOptions.showOn = 'focus';
    }
    return false;
}

Table.default.editedNotification = false;
Table.default.datePickerOptions.dateFormat = "dd/mm/yy";
Table.default.heightOfParent = 'li';
Table.default.showDefaultOrder = true;
Table.default.arrowNavigation = true;
Table.default.margin = -49;
Table.default.defaultAction = 'edit';
/*Table.default.onCloseRowContainer = function(index, force, thisObject, rowContainer, continueCallback){
    if(!force && rowContainer.is('.edited')) {
        confirmDialog('You are sure?\n Added/edited data not was saved', continueCallback, true);
        return false;
    }
}*/

$(document).on('keyup', '.table-data .head input.hasDatepicker', function (evt) {
    if( !$(this).val() ) $(this).datepicker('hide');
});

function bi_online(content) {
    $('body').addClass('no-logo'); // don't show logo for BiOnline

    var columns = [
            [
                {name: 'site', label: 'Site', attrs: {width: 350, rowspan: 2}},
                {label: 'Patients', attrs: {colspan: 3, class: 'text-center'}},
                {label: 'Care team', attrs: {colspan: 3, class: 'text-center'}}
            ],
            [
                {name: 'patients_answers', label: 'Answers', order: false, filter: false, attrs: {width: 100}},
                {name: 'patients_avg_answer', label: 'Avg answer', order: false, filter: false, attrs: {width: 100}},
                {name: 'patients_last_answer', label: 'Last answer', order: false, filter: false, attrs: {width: 130}},
                {name: 'workers_answers', label: 'Answers', order: false, filter: false, attrs: {width: 100}},
                {name: 'workers_avg_answer', label: 'Avg answer', order: false, filter: false, attrs: {width: 100}},
                {name: 'workers_last_answer', label: 'Last answer', order: false, filter: false, attrs: {width: 130}}
            ]
        ],
        footer = [
            'Total:', {
                value: '',
                attrs: {
                    class: 'text-right'
                }
            }, {
                value: '',
                attrs: {
                    class: 'text-right'
                }
            }, '', {
                value: '',
                attrs: {
                    class: 'text-right'
                }
            }, {
                value: '',
                attrs: {
                    class: 'text-right'
                }
            }, ''
        ],
        table = new Table({
            attrs: {class: 'bi-online auto-width'},
            selectFirst: true,
            order: '-site',
            columns: columns,
            selectable: false,
            url: '/dashboard/bi/online/',
            onGetData: function (response, table) {
                var
                    rows = [],
                    patients_answers = parseInt(footer[1].value ? footer[1].value : 0),
                    patients_avg_answer = parseInt(footer[2].value ? footer[2].value : 0),
                    workers_answers = parseInt(footer[4].value ? footer[4].value : 0),
                    workers_avg_answer = parseInt(footer[5].value ? footer[5].value : 0);
                for (var i = 0; i < response.length; i++) {
                    patients_answers += response[i].patients_answers ? response[i].patients_answers : 0;
                    patients_avg_answer += response[i].patients_avg_answer ? response[i].patients_avg_answer : 0;
                    workers_answers += response[i].workers_answers ? response[i].workers_answers : 0;
                    workers_avg_answer += response[i].workers_avg_answer ? response[i].workers_avg_answer : 0;
                    rows.push([
                        response[i].site,
                        {value: response[i].patients_answers, attrs: {class: 'text-right'}},
                        {value: response[i].patients_avg_answer, attrs: {class: 'text-right'}},
                        response[i].patients_last_answer,
                        {value: response[i].workers_answers, attrs: {class: 'text-right'}},
                        {value: response[i].workers_avg_answer, attrs: {class: 'text-right'}},
                        response[i].workers_last_answer
                    ]);
                }
                if (!rows.length) {
                    rows = [[{
                        value: 'No data today',
                        attrs: {
                            colspan: 7,
                            class: 'text-center',
                            style: 'color: red;'
                        }
                    }]];
                    table.renderFooter([]);
                } else {
                    var patients_count = 0,
                        workers_count = 0;
                    $.each(response, function(i, obj){
                        obj['patients_avg_answer'] ? patients_count++ : '';
                        obj['workers_avg_answer'] ? workers_count++ : '';
                    });
                    footer[1].value = patients_answers ? patients_answers : '';
                    footer[2].value = patients_avg_answer ? patients_avg_answer/patients_count : '';
                    footer[4].value = workers_answers ? workers_answers : '';
                    footer[5].value = workers_avg_answer ? workers_avg_answer/workers_count : '';
                    table.renderFooter([footer]);
                }
                return rows;
            }
        });
    tabsContainer.bi_online = table;
    table.getData();

    var container =
    "<div class='chart-block row' style='max-width: 100%;'>" +
        "<div class='chart-row col-lg-7 col-md-6 col-sm-6' style='max-width: 100%;'>" +
                "<div class='vertical-box box pull-right'>" +
                    "<div class='drop-box box-filters'><div class='box-header'><input type='checkbox' id='all_sites' checked='checked' data-filter='allSites' value='sites' class='filter-all hidden' /><label for='all_sites'>Sites</label></div><div id='daily_sites_container' class='bi-container' ><ul id='daily_sites' class='bi-list'></ul></div></div>" +
                    "<div class='drop-box box-filters'><div class='box-header'><input type='checkbox' id='all_subjects' checked='checked' data-filter='allSubjects' value='subjects' class='filter-all hidden' /><label for='all_subjects'>Subjects</label></div><div id='daily_subjects_container' class='bi-container'><ul id='daily_subjects' class='bi-list'></ul></div></div>" +
                "</div>" +
                "<div class='vertical-box box pull-right'>" +
                    "<div class='drop-box box-filters roles-box' data-box='careteam' id='compare_roles_box' style='display:none' >" +
                        "<div class='box-header'><input type='checkbox' id='all_roles' checked='checked' data-filter='allRoles' value='roles' class='filter-all hidden' /><label for='all_roles'>Roles</label></div><div id='daily_roles_container' class='bi-container'><ul id='daily_roles' class='bi-list'></ul></div>" +
                    "</div>" +
                    "<div class='drop-box box-filters gender-box' data-box='careteam' id='compare_gender_box' style='display:none' >" +
                        "<div class='box-header'><input type='checkbox' id='all_genders' checked='checked' data-filter='allGenders' value='genders' class='filter-all hidden' /><label for='all_genders'>Gender</label></div><div id='daily_gender_container' class='bi-container'><ul id='daily_gender' class='bi-list'></ul></div>" +
                    "</div>" +
                "</div>" +
                "<div class=''>" +
                    "<div class='drop-box'>" +
                        "<ul class='graphs-nav' id='graphs_nav'>" +
                            "<li>" +
                                "<input type='radio' id='toggle_daily_answers' name='toggle_graph' class='hidden' checked='checked' value='line' />" +
                                "<label for='toggle_daily_answers' class='active'>Graph</label> " +
                            "</li>" +
                            "<li>" +
                                "<input type='radio' id='toggle_compare_sites' name='toggle_graph' data-filter='sites' class='hidden' value='bar' />" +
                                "<label for='toggle_compare_sites'>Compare sites</label> " +
                            "</li>" +
                            "<li>" +
                                "<input type='radio' id='toggle_compare_subjects' name='toggle_graph' data-filter='subjects' class='hidden' value='bar' />" +
                                "<label for='toggle_compare_subjects'>Compare subjects</label> " +
                            "</li>" +

                        "</ul>" +
                    "</div>" +
                "</div>" +

                "<div class='margin-top-20'>" +
                    "<div class='drop-box'>" +
                        "<div class='switcher'>" +
                            "<div class='rss'>" +
                                "<input type='checkbox' id='toggle_type' name='toggle_type' class='hidden' />" +
                                "<label for='toggle_type'>" +
                                    "<span>Patients</span>" +
                                    "<i></i>" +
                                    "<span>Care team</span>" +
                                "</label>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +

                    "<div class='drop-box'>" +
                        "<div class='switcher'>" +
                            "<div class='rss'>" +
                                "<input type='checkbox' id='toggle_mood' name='toggle_mood' class='hidden' />" +
                                "<label for='toggle_mood'>" +
                                    "<span>Answers</span>" +
                                    "<i></i>" +
                                    "<span>Sentiment</span>" +
                                "</label>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
            "</div>" +
            "<div class='box chart-block margin-top-20'>" +
                "<div class='spinner-block' id='preloader' style='display: none;'>" +
                    "<div class='spinner'>" +
                        "<div class='spinner-container container1'>" +
                            "<div class='circle1'></div>" +
                            "<div class='circle2'></div>" +
                            "<div class='circle3'></div>" +
                            "<div class='circle4'></div>" +
                        "</div>" +
                        "<div class='spinner-container container2'>" +
                            "<div class='circle1'></div>" +
                            "<div class='circle2'></div>" +
                            "<div class='circle3'></div>" +
                            "<div class='circle4'></div>" +
                        "</div>" +
                        "<div class='spinner-container container3'>" +
                            "<div class='circle1'></div>" +
                            "<div class='circle2'></div>" +
                            "<div class='circle3'></div>" +
                            "<div class='circle4'></div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div id='line_graph' data-chart='line' style='display: none'></div>" +
                "<div id='bar_graph' data-chart='bar' style='display: none'></div>" +
            "</div>" +

            "<div class='drop-box'>" +
                "<ul class='range chart-row' id='daily_period'>" +
                    "<li>" +
                        "<label for='today_period'>Today</label> " +
                        "<input type='radio' id='today_period' data-id='today' name='period'  class='hidden'/>" +
                    "</li>" +
                    "<li>" +
                        "<label for='week_period'>This week</label> " +
                        "<input type='radio' id='week_period' data-id='week' name='period' class='hidden'/>" +
                    "</li>" +
                    "<li>" +
                        "<label for='month_period' class='active'>This month</label> " +
                        "<input type='radio' id='month_period' data-id='month' name='period' class='hidden'  checked='checked' />" +
                    "</li>" +
                    "<li>" +
                        "<label for='three_month_period'>Last 3 months</label> " +
                        "<input type='radio' id='three_month_period' data-id='quarter' name='period' class='hidden'/>" +
                    "</li>" +
                    "<li>" +
                       "<label for='six_month_period'>Last 6 months</label> " +
                      "<input type='radio' id='six_month_period' data-id='half-year' name='period' class='hidden'/>" +
                    "</li>" +
                    "<li>" +
                        "<label for='year_period'>Last year</label> " +
                        "<input type='radio' id='year_period' data-id='year' name='period' class='hidden'/>" +
                    "</li>" +
                    "<li class='date-picker'>" +
                        "<label><input type='text' id='day_select_mood_datepicker' /></label>" +
                        "<input type='radio' id='specific_date_period' data-id='specific_date' name='period' class='hidden'/>" +
                    "</li>" +
                "</ul>" +
            "</div>" +
            "</div><br /><br /><br />" +
    "</div>";

    content.html(container).append(table.render());

    var $sites = {
            compare: $('#compare_sites'),
            daily: $('#daily_sites'),
            special_date: $('#day_select_mood_datepicker')
        },
        $roles = {
            daily: $('#daily_roles'), // list container to insert input checkbox options
            compare: $('#compare_roles')
        },
        $gender = {
            daily: $('#daily_gender') // list container to insert input checkbox options
        },
        $subjects = {
            compare: $('#compare_subjects'),
            daily: $('#daily_subjects')
        },
        $dateFields = {
            date: $('#day_datepicker'),
            period_date: $('#day_select_mood_datepicker')
        },

        // generate graphs
        lineGraph = c3.generate({
            bindto: '#line_graph',
            data: {columns: []},
            axis: {
                y: {label: {text: "Answers", position: 'outer-middle'}, min: 0, padding: {bottom: 25, top: 25}},
                x: {
                    label: {text: "Period"}, padding: {left: 0, right: 0}, min: 0, tick: {centered: false},
                    type: 'category',
                    categories: []
                }
            }
        }),
        barGraph = c3.generate({
            bindto: '#bar_graph',
            data: {x: 'Subjects', columns: [], type: 'bar'},
            axis: {
                rotated: true,
                x: {type: 'category', tick: {centered: true, outer: true, multiline: false, width: 300}}
            }
        });

        // functions
        populateBIList([
            {
                key: 'daily',
                list : $sites['daily']
            }, {
                key: 'compare',
                list : $sites['compare']
            }
        ], "/dashboard/site");
        populateBISubjectList([
            {
                key: 'daily',
                list : $subjects['daily']
            }, {
                key: 'compare',
                list : $subjects['compare']
            }
        ], "/dashboard/subject");
        populateBIRolesList([
            {
                key: 'daily',
                list : $roles['daily']
            }, {
                key: 'compare',
                list : $roles['compare']
            }
        ], "/roles/");
        populateBIGenderList([
            {
                key: 'daily',
                list : $gender['daily']
            }
        ], "dashboard/gender");

    var datePickerOptions = {
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAjtJREFUOE+FU7tuU0EQPbP3YcexowQUgUA0UEQgIYIQDUUkJEQJJRISbUDwAXwDP0A6+IAUPMIXRIgKRIF4hSaYAKG4PKJgO/bdWc7sNQQDEUe+d69nZ2bPnJmVEwsrIYiDiIeoIADoe0EmCiQJHC1eFX0NqGUCRx+RhDaPhL6OD1xgWEhQ8rueJThzaBwTjRQhKAbcm6ylOHtwAvU0hULgQwnHSOaqEhjMWYJgLFEcns7Ryh1PM3tgoODI7lpcoWTLaAkuJpDZm2/CRm/AL/40gyYlMiYqaVB6JEzomTxjmSU8k5I4y1UybtWZ6OLi23B9bhrdLQXjYpC4wBMoAQNLSSNDoQYhJSUm4NkYqzncWC6Aa0trZLkTdLj+G1cfrAXHxL9gWhrWN/tY/cKyWMaz9S5uPymw8LjAV7IEy2Bs9CPBbRENwhLuvPyMy/c+4nXRi7a7r77h6J4G5g40o8BRudjsCiMJWCXOzezCpWNTKL2dBiy3O3jY/o7nRYd951RYhIlFlPQfSWAbCS3jmZGvnM7PNDF/cgovPg3w6H2XViofd0zkPxPY9FHhko+RtH8bW0CDw7W3maLnzYkvq5VwkdNvqAbZIefI5hwa2xT288LiKopOH6f212mp5sCgjuv8/XexJer1P02roH74QVxZageXDklEcXaEMQscMraQQ2ZjbxBlNMuLMGl+ivM3bIclOavZbmN1Wsa2yulbK+H4vhavK6/zdntHYGY7x3tesHiheF/SHE8/bOIHi1tOytTyvFkAAAAASUVORK5CYII=",
        buttonImageOnly: true,
        buttonText: "Select date"
    };
    $dateFields.period_date.val($.datepicker.formatDate('dd/mm/yy', new Date())).datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAjtJREFUOE+FU7tuU0EQPbP3YcexowQUgUA0UEQgIYIQDUUkJEQJJRISbUDwAXwDP0A6+IAUPMIXRIgKRIF4hSaYAKG4PKJgO/bdWc7sNQQDEUe+d69nZ2bPnJmVEwsrIYiDiIeoIADoe0EmCiQJHC1eFX0NqGUCRx+RhDaPhL6OD1xgWEhQ8rueJThzaBwTjRQhKAbcm6ylOHtwAvU0hULgQwnHSOaqEhjMWYJgLFEcns7Ryh1PM3tgoODI7lpcoWTLaAkuJpDZm2/CRm/AL/40gyYlMiYqaVB6JEzomTxjmSU8k5I4y1UybtWZ6OLi23B9bhrdLQXjYpC4wBMoAQNLSSNDoQYhJSUm4NkYqzncWC6Aa0trZLkTdLj+G1cfrAXHxL9gWhrWN/tY/cKyWMaz9S5uPymw8LjAV7IEy2Bs9CPBbRENwhLuvPyMy/c+4nXRi7a7r77h6J4G5g40o8BRudjsCiMJWCXOzezCpWNTKL2dBiy3O3jY/o7nRYd951RYhIlFlPQfSWAbCS3jmZGvnM7PNDF/cgovPg3w6H2XViofd0zkPxPY9FHhko+RtH8bW0CDw7W3maLnzYkvq5VwkdNvqAbZIefI5hwa2xT288LiKopOH6f212mp5sCgjuv8/XexJer1P02roH74QVxZageXDklEcXaEMQscMraQQ2ZjbxBlNMuLMGl+ivM3bIclOavZbmN1Wsa2yulbK+H4vhavK6/zdntHYGY7x3tesHiheF/SHE8/bOIHi1tOytTyvFkAAAAASUVORK5CYII=",
        buttonImageOnly: true,
        buttonText: "Select date",
        onSelect: function (dateText, inst) {
            dateText = inst.selectedYear + '-' + ('0' + (inst.selectedMonth + 1)).substr(-2) + '-' + ('0' + inst.selectedDay).substr(-2);
            var radio = inst.input.parent().next(':radio');
            radio.data('id', dateText);
            radio.trigger('change');
        }
    });

    /*
    *  all charts
    */
    var charts = [
        {
            graphs: {
                line: lineGraph,
                bar: barGraph
            },
            filters: {
                // box filters
                boxes:      $('.box-filters .bi-container'),
                period:     $('#daily_period input[name="period"]'), // by time period

                type:       $('input[name="toggle_type"]'), // by Patients | Workers
                mood:       $('input[name="toggle_mood"]'), // by Mood | Answers
                graphs:     $('input[name="toggle_graph"]'), // by graphs views

                roles:      $('#daily_roles'),
                gender:      $('#daily_gender')
            },
            ajax: {
                   url: {
                        line: "/dashboard/bi/answers/per-month/quantity",
                        bar: "/dashboard/bi/answers/date-range"
                   },
                   status: null
            },
            data: {
                sites: [],
                subjects: [],
                roles: [],
                genders: [],
                allSites:   1,
                allSubjects:   1,
                allRoles:   1,
                allGenders:   1,
                byPatients:  1,
                bySites: 1,
                byMood: 0,
                range: 'month'
            }
        }
    ];

    populateBICharts(charts);

    // ****************************************************
    // ****************************************************
    // ****************************************************
    // ****************** events  ******************
    // ****************************************************
    // ****************************************************
    // ****************************************************

    $.each(charts, function(i, chart){
        // register events for filters -> in cycle
        var boxFilters          = chart['filters']['boxes'],
            filterByPeriod      = chart['filters']['period'],

            filterByAll         = $('input[type=checkbox].filter-all'),
            toggleByMood        = chart['filters']['mood'] ? chart['filters']['mood'] : null,
            toggleByType        = chart['filters']['type'] ? chart['filters']['type'] : null,
            toggleGraphs        = chart['filters']['graphs'],
            data                = chart['data'];


        // filter data by box filters
        boxFilters.on('click', 'input', function (evt) {
            var checkbox        = $(evt.target),
                checkAll        = checkbox.closest('.box-filters').find('[data-filter]'),
                boxFilter       = checkbox.closest('.bi-container'),
                filterType      = checkAll.val(),   // sites | subjects | roles
                inputId         = checkbox.attr('data-id'),
                found           = $.inArray(inputId, data[filterType]);

            if( found == -1){ // not found
                data[filterType].push(inputId); // add to array
            } else {
                data[filterType].splice(found, 1); // Element was found, remove from array
            }

            if( checkbox.prop('checked') ){   // checkbox is unchecked -> becomes checked
            } else {
                // checkbox is checked -> becomes unchecked
                checkAll.prop('checked', false);
            }
            if( !boxFilter.find('input[type="checkbox"]:not(:checked)').length ) checkAll.prop('checked', true);

            populateBICharts([chart]);
        });

        // filter data by time period
        filterByPeriod.on("change", function (evt) {
            filterByPeriod.prev().removeClass('active');
            $(this).prev().addClass('active');
            data['range'] = $(this).data('id');
            populateBICharts([chart]);
        });

        //
        // need to optimize
        //
        // filter data by mood
        toggleByMood.on("change", function (evt) {
            toggleByMood.prev().removeClass('active');
            $(this).prev().addClass('active');

            data['byMood'] = $(this).prop('checked') ? 1 : 0;
            populateBICharts([chart]);
        });

        // filter data by type filters
        if(toggleByType){
            toggleByType.on('click', function(evt){
                data['byPatients'] = $(this).prop('checked') ? 0 : 1;

                populateBICharts([chart]);
            });
        }

        if(toggleGraphs) {
                // filter data by mood
                toggleGraphs.on("change", function (evt) {

                populateBICharts([chart]);
            });
        }

        // filter by all option
        if( filterByAll ){
            filterByAll.on('click', function(evt){
                var checkbox = $(evt.target),
                        all  = checkbox.val(),
                    dataAll  = checkbox.attr('data-filter');

                // clear stored params
                data[all].splice(0, data[all].length);

                if( checkbox.prop('checked') ){   // checkbox is unchecked -> becomes checked
                    data[dataAll] = 1;
                    checkbox.closest('.box-filters').find('input[type="checkbox"]:not("[data-filter]")').prop('checked', true);   // select all
                } else {
                    // checkbox is checked -> becomes unchecked
                    checkbox.closest('.box-filters').find('input[type="checkbox"]:not("[data-filter]")').prop('checked', false);   // deselect all
                    data[dataAll] = 0;  // set allSites to zero
                    data[all].push(0);
                }

                populateBICharts([chart]);
            });
        }
    });

    $( window ).resize( function(){
        $.each($('.filter-container:visible').getNiceScroll(), function(i, scroll){
            scroll.resize();
        });
    });

    function populateBIList(fields, url) {
        $.getJSON(url, function (data) {
            if (data) {
                $.each(fields, function (i, field) {
                    $.each(data, function (i, obj) {
                        var checkbox = $('<input />', {
                            id: field['key'] + '_site_id_' + obj['id'],
                            'data-id': obj['id'],
                            checked: 'checked',
                            type: 'checkbox',
                            class: 'hidden'
                        });
                        var span = $('<label />', {text: obj['text'], for: field['key'] + '_site_id_' + obj['id']});
                        var li = $('<li />');
                        if(obj.id == 0) {li.addClass('hidden');}
                        field['list'].append(li.append(checkbox).append(span));
                    });
                });
                //init nicescroll
                $sites['daily'].parent().niceScroll({cursorwidth : '3px', cursorborder: '0', autohidemode: false, railalign: 'left'});
            }
        });
    }
    function populateBISubjectList(fields, url) {
        $.getJSON(url, function (data) {
            if (data) {
                $.each(fields, function (i, field) {
                    $.each(data, function (i, obj) {
                        var checkbox = $('<input />', {
                            id: field['key'] + '_subject_id_' + obj['id'],
                            'data-id': obj['id'],
                            checked: 'checked',
                            type: 'checkbox',
                            class: 'hidden'
                        });
                        var span = $('<label />', {text: obj['text'], for: field['key'] +'_subject_id_' + obj['id']});
                        var li = $('<li />');

                        field['list'].append(li.append(checkbox).append(span));
                    });
                });
                //init nicescroll
                $subjects['daily'].parent().niceScroll({cursorwidth : '3px', cursorborder: '0', autohidemode: false, railalign: 'left'});
            }
        });
    }

    // need to optimize for multiple lists
    function populateBIRolesList(fields, url) {
        $.getJSON(url, function (data) {
            if (data) {
                $.each(fields, function (i, field) {
                    $.each(data, function (i, obj) {
                        var checkbox = $('<input />', {
                            id:  field['key'] + '_role_id_' + obj['id'],
                            'data-id': obj['id'],
                            checked: 'checked',
                            type: 'checkbox',
                            class: 'hidden'
                        });
                        var span = $('<label />', {text: obj['name'], for: field['key'] + '_role_id_' + obj['id']});
                        var li = $('<li />');

                        field['list'].append(li.append(checkbox).append(span));
                    });
                });

                //init nicescroll
                $roles['daily'].parent().niceScroll({cursorwidth : '3px', cursorborder: '0', autohidemode: false, railalign: 'left'});
            }
        });
    }
    function populateBIGenderList(fields, url) {
        $.getJSON(url, function (data) {
            if (data) {
                $.each(fields, function (i, field) {
                    $.each(data, function (i, obj) {
                        var checkbox = $('<input />', {
                            id:  field['key'] + '_gender_id_' + i,
                            'data-id': i,
                            checked: 'checked',
                            type: 'checkbox',
                            class: 'hidden'
                        });
                        var span = $('<label />', {text: data[i], for: field['key'] + '_gender_id_' + i});
                        var li = $('<li />');

                        field['list'].append(li.append(checkbox).append(span));
                    });
                });

                //init nicescroll
                $roles['daily'].parent().niceScroll({cursorwidth : '3px', cursorborder: '0', autohidemode: false, railalign: 'left'});
            }
        });
    }
}

function daily_sumary_callback() {       
     var columns = [
         [
             {label: '', attrs: {colspan: 3}},
             {label: 'Patients', attrs: {colspan: 3, class: 'text-center', 'data-border': ''}},
             {label: 'Care team', attrs: {colspan: 3, class: 'text-center', 'data-border': ''}},
         ],
         [   {name: 'date', label: 'Date', order: true, attrs: {width: 100}, filter: 'date', required: true},
             {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 200}},
             {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 200}},
             {name: 'pCount', label: 'Present', order: true, filter: 'text', attrs: {width: 60}},
             {name: 'patientAnswers', label: 'Answers', order: true, filter: 'text', attrs: {width: 60}},
             {name: 'Psummary', label: '%', order: true, filter: 'text', attrs: {class: 'text-center',width: 60}},
             {name: 'wCount', label: 'Present', order: true, filter: 'text', attrs: {width: 60}},
             {name: 'workersAnswers', label: 'Answers', order: true, filter: 'text', attrs: {width: 60}},
             {name: 'Wsummary', label: '%', order: true, filter: 'text', attrs: {class: 'text-center',width: 60}}
          ],
     ],

               
         table = new Table({
             attrs: {class: 'auto-width'},      
             columns: columns,      
             order: '-date',
             selectFirst: true,     
             url: '/dashboard/dailysumary/',        
             onGetData: function (response) {
                  for (var i=0;i<response.length;i++){
                      response[i]['pCount'] = {value: response[i]['pCount'], attrs: {class: 'text-right'}};
                      response[i]['patientAnswers'] = {value: response[i]['patientAnswers'], attrs: {class: 'text-right under p-answers '}};
                      response[i]['Psummary'] = {value: response[i]['Psummary'], attrs: {class: 'text-right'}};
                      response[i]['Wsummary'] = {value: response[i]['Wsummary'], attrs: {class: 'text-right'}};
                      response[i]['workersAnswers'] = {value: response[i]['workersAnswers'], attrs: {class: 'text-right  under w-answers'}};
                      response[i]['wCount'] = {value: response[i]['wCount'], attrs: {class: 'text-right'}};

                  }

                  
                  //response[i]["answers"].attrs = {class: "abcdeFR"}
                 return _dataRows(response, columns[1]);
             },
             actions: [
                 {
                 id: 'patients_answers',
                 label: 'Patients answers',
                 class: 'btn-info patients-answers hide',
                 callback: function (row) {
                     $("#menu").find("a[href='#bi_patients_answers']").trigger('click');
                     tabsContainer.bi_patients_answers.head.find('[name=date]').val(arguments[0]['cells'][0]['value']).trigger('keyup');
                     tabsContainer.bi_patients_answers.head.find('[name=site]').val(arguments[0]['cells'][1]['value']).trigger('keyup');
                     tabsContainer.bi_patients_answers.head.find('[name=unit]').val(arguments[0]['cells'][2]['value']).trigger('keyup');
                 }
             },
                 {
                 id: 'workers_answers',
                 label: 'Workers answers',
                 class: 'btn-info workers-answers hide',
                 callback: function (row) {
                     $("#menu").find("a[href='#bi_workers_answers']").trigger('click');
                     tabsContainer.bi_workers_answers.head.find('[name=date]').val(arguments[0]['cells'][0]['value']).trigger('keyup');
                     tabsContainer.bi_workers_answers.head.find('[name=site]').val(arguments[0]['cells'][1]['value']).trigger('keyup');
                     tabsContainer.bi_workers_answers.head.find('[name=unit]').val(arguments[0]['cells'][2]['value']).trigger('keyup');
                 }
             },
             ]
         });

    tabsContainer.daily_sumary = table;
    table.getData();
    return table.renderActions().add(table.render());
     
}

$(document).on('click', '.p-answers', function(){
        var actions =  $('.table-actions').find('.patients-answers');
        actions.trigger('click');
});
$(document).on('click', '.w-answers', function(){
        var actions =  $('.table-actions').find('.workers-answers');
        actions.trigger('click');
});

function questions_summary_callback() {
     var columns = [
         [
             {name: 'fromDate', label: 'From', order: false, filter: 'date', attrs: {colspan: 1, class: 'from' }},
             {name: 'toDate', label: 'To', order: false, filter: 'date', attrs: {colspan: 1, class: 'to' }},
             {name: 'site_id', label: 'Site', order: false, filter: 'number', attrs: {colspan: 2,width: 115}},
             {name: 'unit_id', label: 'Unit', order: false, filter: 'number', attrs: {colspan: 4,width: 115}},
         ],
         [
             {name: 'type',
             label: 'Type',
             order: true,
             attrs: {width: 100},
             filter: 'select',
             filterData: [{value: "-1", label: "All"}, {value: "0", label: "Patients"}, {value: "1", label: "Care team"}]
         },
         {name: 'subject', label: 'Subject', filter: 'text',  order: true,  attrs: {width: 260}},
         {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 400}},
         {name: 'answers', label: 'Answers', filter: 'text',  order: true,  attrs: {width: 120}},
         {name: 'high', label: 'High', order: true, filter: 'text', attrs: {width: 90}},
         {name: 'low', label: 'Low', order: true, filter: 'text', attrs: {width: 90}},
         {name: 'average', label: 'Average', order: true, filter: 'text', attrs: {width: 90}},
         {name: 'target', label: 'Target', order: true, filter: 'text', attrs: {width: 90}},

         ]
     ],

         table = new Table({
             attrs: {class: 'auto-width'},
             columns: columns,
             order: '-type',
             selectFirst: true,
             url: '/dashboard/questionssummary/',
             onGetData: function (response) {
                 return _dataRows(response, columns[1]);
             }
         });

     table.render();

    var sites_select = table.head.find("[name='site_id']");
    var units_select = table.head.find("[name='unit_id']");

    sites_select.select2({
        allowClear: true,
        placeholder: 'Select site',
         query: function (queryObj) {
             $.getJSON("/dashboard/site", {start: 0, length: 50, select: true, ordering: 'id', site_id:'' }, function (result) {
                 var data = {more: false, results: []};
                 $.each(result, function (index, value) {
                     data.results.push({id: value['id'].toString(), text: value['text'].toString()})
                 });
                 queryObj.callback(data);
             });
         }
    }).on('change', function (e) {
        $(e.target).trigger('keyup');
        units_select.select2('val', '').trigger('change');
     });


    units_select.select2({
        allowClear: true,
        placeholder: 'Select unit',
        query: function (queryObj) {
            var  siteId =  sites_select.val();
            var rez= $.getJSON("/dashboard/unit", {start: 0, length: 50, select: true, ordering: 'id', site_id: siteId, text: queryObj.term}, function (result) {
                var data = {more: false, results: []};
                $.each(result, function (index, value) {
                    data.results.push({id: value['id'].toString(), text: value['text'].toString()})
                });
                queryObj.callback(data);
            });
        }

    }).on('change', function (e) {
        $(e.target).trigger('keyup');

    });


     tabsContainer.questions_summary = table;
     table.getData();
     return table.renderActions().add(table.table);

}
function answers_by_date() {
    var columns = [

                                [
                                    {name: 'date', label: 'Date', order: true, filter: 'date', attrs: {rowspan: 2, width: 120, style: 'vertical-align: bottom' }},
                                    {name: 'SiteName', label: 'Site', order: true, filter: 'text', attrs: {rowspan: 2, width: 200, style: 'vertical-align: bottom'}},
                                    {name: 'UnitName', label: 'Unit', order: true, filter: 'text', attrs: {rowspan: 2, width: 200, style: 'vertical-align: bottom'}},
                                    {label: 'Answers', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}}
                                ],
                                [
                                    {name: 'patientAnswers', label: 'Patients', order: true, filter: 'comparison', attrs: {style: 'width: 120px'}},
                                    {name: 'workersAnswers', label: 'Workers', order: true, filter: 'comparison', attrs: {style: 'width: 120px'}}
                                ]
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            selectable: false,
            margin: -5,
            order: '-date',
            columns: columns,
            url: '/dashboard/bi/answers/date/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    rows.push({
                        attrs: {'data-id': response[i].id || null},
                        cells: [
                            response[i].date,
                            response[i].site,
                            response[i].unit,
                            {value: response[i].patients, attrs: {class: 'text-right'}},
                            {value: response[i].workers, attrs: {class: 'text-right'}}
                        ]
                    })
                }
                return rows;
            },
        });
        tabsContainer.bi_patients_answers = table;
        table.getData();
        return table.render();
}

function analyse_questions(){
    var columns = [
        [   {label: '', attrs: {colspan: 1}},
            {name: 'fromDate', label: 'From', order: false, filter: 'date', attrs: {colspan: 2, class: 'inline-label fromH' }},
            {name: 'toDate', label: 'To', order: false, filter: 'date', attrs: {colspan: 2, class: 'inline-label toH' }},
            {label: '', attrs: {colspan: 5}},
        ],
        [
            {name: 'type', label: 'Type', order: true, filter: 'select', filterData: [{value: "-1", label: "All"}, {value: "0", label: "Patients"}, {value: "1", label: "Care team"}], attrs: {width: 90}},
            {name: 'question', label: 'Question', order: true, filter: 'text', attrs:{colspan: 3}},
            {name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'answers', label: 'Answers', order: true, filter: 'text', attrs: {width: 80}},
            {name: 'high', label: 'High', order: true, filter: 'text', attrs: {width: 60}},
            {name: 'low', label: 'Low', order: true, filter: 'text', attrs: {width: 60}},
            {name: 'average', label: 'Average', order: true, filter: 'text', attrs: {width: 80}}
        ]
    ],
    table = new Table({
        attrs: {class: 'auto-width'},
        selectable: false,
        margin: -5,
        order: 'type',
        columns: columns,
        url: '/dashboard/analyse_questions/',
        onGetData: function (response) {
            var rows = [];
            for (var i = 0; i < response.length; i++) {
                rows.push({
                    attrs: {
                        'data-id': response[i].id || null,
                        'class': response[i].average < response[i].target ? ' text-red ':'',
                    },
                    cells: [
                        response[i].type,
                        {value: response[i].question, attrs: {colspan:3}},
                        response[i].subject,
                        response[i].site,
                        response[i].unit,
                        {value: response[i].answers, attrs: {class: 'text-right'}},
                        {value: response[i].high, attrs: {class: 'text-right'}},
                        {value: response[i].low, attrs: {class: 'text-right'}},
                        {value: response[i].average, attrs: {class: 'text-right'}}
                    ]
                })
            }
            return rows;
        }
    });

    tabsContainer.bi_patients_answers = table;
    table.getData();
    table.render();

    var todayDate = new Date(),
    currentDate = new Date(todayDate.setDate(todayDate.getDate() ));
    table.head.find('.fromH').find('.hasDatepicker').val((currentDate.getDate() < 10 ? '0'+ currentDate.getDate() : currentDate.getDate()) + '/' + (currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1)  + '/' + currentDate.getFullYear()).datepicker('refresh').trigger('change');

    return table.table;
}

function bi_patients_answers() {
    var columns = [
            {name: 'date', label: 'Date time', order: true, filter: 'date', attrs: {width: 130}},
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 160}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 180}},
            {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 430}},
            {name: 'answer', label: 'Answer', order: true, filter: 'text', attrs: {width: 180}},
            {name: 'target', label: 'Target', order: true, filter: 'text', attrs: {width: 75}},
            {
                name: 'under_target',
                label: 'Under',
                order: false,
                filter: 'checkbox',
                attrs: {width: 60, class:'table-head-checkbox'}
            }
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            selectable: false,
            margin: -5,
            order: '-date',
            columns: columns,
            url: '/dashboard/bi/answers/patients/',
            onGetData: function (response) {
                var rows = [];

                for (var i = 0; i < response.length; i++) {
                    var answer = parseInt((response[i].answer.split('-')[0]).trim());
                    var textDanger = answer < response[i].target ?  ' text-red ': '';
                    var lineBottom = '';
                    if(typeof response[i+1] != 'undefined'){
                        if(response[i].date != response[i+1].date || (response[i].unit != response[i+1].unit) || (response[i].site != response[i+1].site) ){
                            lineBottom = 'separated-row';
                        }
                    }
                    rows.push({
                        attrs: {
                            'data-id': response[i].id || null,
                            'class' : textDanger+' '+lineBottom,
                        },

                        cells: [
                            response[i].date,
                            response[i].site,
                            response[i].unit,
                            response[i].question,
                            response[i].answer,
                            {value:response[i].target ,attrs:{class: 'text-right'}},
                            response[i].under_target
                        ]
                    })


                }
                return rows;
               // return _dataRows(response, columns);
            }
        });
    tabsContainer.bi_patients_answers = table;
    table.getData();
    return table.render();
}

function bi_workers_answers() {
    var columns = [
            //{name: 'id', label: '#', order: true, filter: 'number', attrs: {width: 80}},
            {name: 'date', label: 'Date', order: true, filter: 'date', attrs: {width: 130}},
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 160}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 100}},
            {name: 'role', label: 'Role', order: true, filter: 'text', attrs: {width: 180}},
            {name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 140}},
            {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 320}},
            {name: 'answer', label: 'Answer', order: true, filter: 'text', attrs: {width: 120}},
            {name: 'target', label: 'Target', order: true, filter: 'text', attrs: {width: 80}},
            {
                name: 'under_target',
                label: 'Under',
                order: false,
                filter: 'checkbox',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 60, class:'table-head-checkbox'}
            }
             ],
        table = new Table({
            attrs: {class: 'auto-width'},
            selectable: false,
            order: '-date',
            margin: -5,
            columns: columns,
            url: '/dashboard/bi/answers/workers/',
            onGetData: function (response) {
                var rows = [];

                for (var i = 0; i < response.length; i++) {
                    var answer = parseInt((response[i].answer.split('-')[0]).trim());
                    var lineBottom = '';
                    if(typeof response[i+1] != 'undefined'){
                        if(response[i].employeeId != response[i+1].employeeId){
                            lineBottom = 'separated-row';
                        }
                    }

                    rows.push({
                        attrs: {
                            'data-id': response[i].id || null,
                            'class' : answer < response[i].target ?  ' text-red ': '' +' '+lineBottom,
                        },

                        cells: [
                            response[i].date,
                            response[i].site,
                            response[i].unit,
                            response[i].role,
                            response[i].subject,
                            response[i].question,
                            response[i].answer,
                            {value:response[i].target ,attrs:{class: 'text-right '}},
                            (response[i].under_target == '1')?'Yes':'No',
                        ]
                    })


                }
                return rows;
               //return _dataRows(response, columns);
            }
        });
    tabsContainer.bi_workers_answers = table;
    table.getData();
    return table.render();

}

function bi_careteam_not_answered() {
    var isAdmin = $('#company_id').data('admin') === $('#user-name').data('user'),
        columns = [
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 200}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'firstName', label: 'First name', order: true, filter: 'text', attrs: {width: 120}},
            {name: 'lastName', label: 'Last name', order: true, filter: 'text', attrs: {width: 130}},
            {name: 'role', label: 'Role', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'fromPeriod', label: 'From period', order: true, filter: 'date', attrs: {width: 110}},
            {name: 'phone', label: 'Phone', order: true, filter: 'text', attrs: {width: 120}},
            {name: 'email', label: 'Email', order: true, filter: 'text', attrs: {width: 220}}
        ],
        fields = [
            {
                name: 'site_id',
                label: {text: 'Site', class: 'label-130'},
                type: 'related',
                url: '/dashboard/site',
                order: 'id',
                text: 'site_name',
                placeholder: 'Site',
                children: 'unit_id',
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'site_id'}),
                required: true,
                attrs: {style: 'width: 300px;'}
            }, {
                name: 'unit_id',
                label: {text: 'Unit', class: 'label-130'},
                type: 'related',
                url: '/dashboard/unit',
                order: 'id',
                text: 'unit_name',
                placeholder: 'Unit',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
                required: true,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'firstName',
                label: {text: 'First name', class: 'label-130'},
                type: 'text',
                required: false,
                length: 24,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'lastName',
                label: {text: 'Last name', class: 'label-130'},
                type: 'text',
                required: false,
                length: 24,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'role_id',
                label: {text: 'Role', class: 'label-130'},
                type: 'related',
                url: '/dashboard/role',
                order: 'id',
                text: 'role_name',
                placeholder: 'Role',
                results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
                required: true,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'phone',
                label: {text: 'Phone', class: 'label-130'},
                type: 'text',
                required: true,
                length: 19,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'email',
                label: {text: 'E-mail', class: 'label-130'},
                type: 'text',
                required: true,
                attrs: {style: 'width: 300px;', autocomplete: 'off'}
            },
            {
                name: 'send',
                value: true,
                label: {text: 'Send via email', position: 'before', class: 'label-130'},
                type: 'checkbox',
                required: false,
                attrs: {class: "send-email skip-focus"}
            },
            {
                name: 'birthday',
                label: {text: 'Birthday year', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: (function(){
                    var dateRange = {'0': ''};
                    for( var i = 1940, endDate = (new Date()).getFullYear(); i <= endDate; i++ ){
                        dateRange[i] = i;
                    }
                    return dateRange;
                })()
            },
            {
                name: 'gender',
                label: {text: 'Gender', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: {'0': '', '1': 'Male', '2': 'Female'}
            },
            {
                name: 'startWork',
                label: {text: 'Career start at', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: (function(){
                    var dateRange = {'0': ''};
                    for( var i = 1960, endDate = (new Date()).getFullYear(); i <= endDate; i++ ){
                        dateRange[i] = i;
                    }
                    return dateRange;
                })()
            },
            {
                name: 'stopDate',
                label: {text: 'Inactive date', class: 'label-130'},
                type: 'date',
                attrs: {class: "input-100"}
            }
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            columns: columns,
            selectable : isAdmin ? true : false,
            selectFirst: isAdmin ? true : false,
            margin: isAdmin ? undefined : 0,
            order: 'site',
            url: '/dashboard/worker/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    var row = [], disabled = [];

                    for (var c = 0; c < columns.length; c++) {
                        var val = response[i][columns[c]['name']];
                        var column = columns[c]['name'];
                        var regExp = /^\d{1,2}-\d{1,2}-\d{4}$/;

                        row.push({
                            attrs: {class: $.isNumeric(val) && $.type(val) == 'number' ? 'text-right' : ''},
                            value: val
                        });
                    }
                    rows.push({
                        attrs: {
                            'data-id': response[i]['id'] || null,
                            'data-action-disabled': JSON.stringify(disabled),
                            'data-action-content-disabled': JSON.stringify(['delete', 'edit'])
                        },
                        cells: row
                    })
                }
                return rows;
            },
            actions: isAdmin ? [
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/worker/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields)),
                            after: function(form){
                                if( form.form.find('input[type=checkbox]').length ) form.form.find('input[type=checkbox]').prop('checked', false).addClass('hidden');
                                if ( form.form.find('input[type=checkbox]').prev().length ) form.form.find('input[type=checkbox]').prev().addClass('hidden');
                            }
                        });
                        table.addRowContainer(content.render(), true);
                    }
                }
            ] : []
        });
    tabsContainer.workers = table;
    table.getData();
    table.render();
    var todayDate = new Date(),
    currentDate = new Date(todayDate.setDate(todayDate.getDate() - 7 ));
    table.head.find('.hasDatepicker').val((currentDate.getDate() < 10 ? '0'+ currentDate.getDate() : currentDate.getDate()) + '/' + (currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1)  + '/' + currentDate.getFullYear()).datepicker('refresh').trigger('change');

    return isAdmin ? table.renderActions().add(table.table) : table.table;
}
/*function view menu*/
 function view_menu(){       
     var columns = [
         [   {label: 'Visible', attrs: {colspan: 1, class: 'text-center', 'data-border': ''}},
             {label: 'Id_menu', attrs: {colspan: 1, class: 'text-center', 'data-border': ''}},
             {label: 'Den_menu', attrs: {colspan: 1, class: 'text-center', 'data-border': ''}},
         ],
         [   
             {name: 'visible', label: 'visible', order: true, filter: 'checkbox', attrs: {width: 100}},
             {name: 'id_menu', label: 'id', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'den_menu', label: 'Denumirea menu', order: true, filter: 'text', attrs: {width: 100}},
         ],
     ]
    
    
    table = new Table({
             attrs: {class: 'auto-width'},      
             columns: columns,           
             url: 'admin/viewmenu',        
             onGetData: function (response) {
                 var rows = [];
                  for (var i=0;i<response.length;i++){
                     rows.push({
                        cells: [
                            {value: '<input>' , filter: 'checkbox'},
                            {value: response[i].id_menu, attrs: {class: 'text-right'}},
                            {value: response[i].den_menu, attrs: {class: 'text-right'}}
                        ]
                    });
                  }

                  
                  //response[i]["answers"].attrs = {class: "abcdeFR"}
                 return rows;
             }
         });

    
    tabsContainer.viewmenu = table;
    table.getData();
    return table.renderActions().add(table.render());       
}
 /*end function*/
 
 /*function view companies*/
 function companies_view(){       
     var columns = [
         [   
             {name: 'Id', label: 'id', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'Name', label: 'Name', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'Email', label: 'Email', order: true, filter: 'email', attrs: {width: 100}},
             {name: 'Address', label: 'Address', order: true, filter: 'text', attrs: {width: 100}}
         ],
     ]
    
    table = new Table({
             attrs: {class: 'auto-width'},      
             columns: columns,           
             url: 'admin/companiview',        
             onGetData: function (response) {
                 var rows = [];
                  for (var i=0;i<response.length;i++){
                     rows.push({
                        cells: [
                            {value: response[i].C, attrs: {class: 'text-right'}},
                            {value: response[i].Nm, attrs: {class: 'text-right'}},
                            {value: response[i].Email, attrs: {class: 'text-right'}},
                            {value: response[i].Address, attrs: {class: 'text-right'}}
                        ]
                    });
                  }

                  
              
                 return rows;
             }
         });

    
    tabsContainer.companiview = table;
    table.getData();
    return table.renderActions().add(table.render());       
}
 /*end functi0n*/
 
 
 /*functia mea*/
 function items_view(){       
     var columns = [
         [   
             {name: 'Id', label: 'id', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'Name_Items', label: 'Name Items', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'Description', label: 'Description', order: true, filter: 'text', attrs: {width: 100}},
         ],
     ]
    
    table = new Table({
             attrs: {class: 'auto-width'},      
             columns: columns,           
             url: 'admin/itemsview',        
             onGetData: function (response) {
                 var rows = [];
                  for (var i=0;i<response.length;i++){
                     rows.push({
                        cells: [
                            {value: response[i].Code, attrs: {class: 'text-right'}},
                            {value: response[i].Nm, attrs: {class: 'text-right'}},
                            {value: response[i].Description, attrs: {class: 'text-right'}}
                        ]
                    });
                  }

                  
                  //response[i]["answers"].attrs = {class: "abcdeFR"}
                 return rows;
             }
         });

    
    tabsContainer.itemsview = table;
    table.getData();
    return table.renderActions().add(table.render());       
}
 /*end functi0n*/
 
 
 /*functia mea*/
 function articles_view(){       
     var columns = [
         [   {label: 'Id', attrs: {colspan: 1, class: 'text-center', 'data-border': ''}},
             {label: 'Title', attrs: {colspan: 1, class: 'text-center', 'data-border': ''}},
             {label: 'Description', attrs: {colspan: 1, class: 'text-center',width: 200, 'data-border': ''}},
             {label: 'Data', attrs: {colspan: 1, class: 'text-center', 'data-border': ''}},
         ],
         [   
             {name: 'id', label: 'id', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'Title', label: 'title', order: true, filter: 'text', attrs: {width: 100}},
             {name: 'Description', label: 'description', order: true, filter: 'text', attrs: {width: 200}},
             {name: 'Data', label: 'data', order: true, filter: 'date', attrs: {width: 100}},
         ],
     ]
    
    table = new Table({
             attrs: {class: 'auto-width'},      
             columns: columns,           
             url: 'admin/articlesview',        
             onGetData: function (response) {
                 var rows = [];
                  for (var i=0;i<response.length;i++){
                     rows.push({
                        cells: [
                            {value: response[i].id, attrs: {class: 'text-right'}},
                            {value: response[i].title, attrs: {class: 'text-right'}},
                            {value: response[i].description, attrs: {class: 'text-right'}},
                            {value: response[i].created, attrs: {class: 'text-right'}}
                        ]
                    });
                  }

                  
                  //response[i]["answers"].attrs = {class: "abcdeFR"}
                 return rows;
             }
         });

    
    tabsContainer.articlesview = table;
    table.getData();
    return table.renderActions().add(table.render());       
}
 /*end functi0n*/
 
 
 
function questions_per_site() {
    var columns = [
                    [
                        {name: 'name', label: 'Site', order: true, filter: 'text', attrs: {width: 400, rowspan: 2, style: 'vertical-align: bottom;'}},
                        {label: 'Questions', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}}
                    ],
                    [
                        {
                            name: 'workers_questions',
                            label: 'Care team',
                            order: true,
                            filter: 'comparison',
                            attrs: {width: 100, style: 'text-align: center'}
                        },
                        {
                            name: 'patients_questions',
                            label: 'Patients',
                            order: true,
                            filter: 'comparison',
                            attrs: {width: 100, style: 'text-align: center'}
                        }
                    ]
        ],
        table = new Table({
            selectFirst: true,
            attrs: {class: 'auto-width'},
            columns: columns,
            order: 'id',
            url: '/dashboard/organization/questions/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    rows.push({
                        attrs: {'data-id': response[i].id || null},
                        cells: [
                            response[i].name,
                            {value: response[i].workers_questions, attrs: {class: 'text-right'}},
                            {value: response[i].patients_questions, attrs: {class: 'text-right'}}
                        ]
                    })
                }
                return rows;
            },
            actions: [
                {
                    id: 'questions_patients',
                    label: 'Patients',
                    class: 'btn-info',
                    callback: function (row) {
                        Tab.add({
                            id: 'patients_questions_tab_' + row['attrs']['data-id'],
                            label: 'Patients Q. by site',
                            color: '#5BC0DE',
                            callback: function () {
                                return patients_questions_list(row);
                            }
                        });
                    }
                },
                {
                    id: 'questions_workers',
                    label: 'Care team',
                    class: 'btn-info',
                    callback: function (row) {
                        Tab.add({
                            id: 'workers_questions_tab_' + row['attrs']['data-id'],
                            label: 'Care team Q. by site',
                            color: '#5BC0DE',
                            callback: function () {
                                return workers_questions_list(row);
                            }
                        });
                    }
                }
            ]
        });
    tabsContainer.questions_per_site = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function questions_unit_type() {
    var columns =  [
                    [
                        {name: 'type', label: 'Unit type', order: true, filter: 'text', attrs: {rowspan: 2, width: 400, style: 'vertical-align: bottom;'}},
                        {name: 'units_questions', label: 'Units', order: true, filter: 'comparison', attrs: {rowspan: 2, width: 100, style: 'vertical-align: bottom;', class:"text-center"}},
                        {label: 'Questions', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}},
                    ],
                    [
                        {name: 'workers_questions', label: 'Care team', order: true, filter: 'comparison', attrs: {width: 100, style: 'text-align:center'}},
                        {name: 'patients_questions', label: 'Patients', order: true, filter: 'comparison', attrs: {width: 100, style: 'text-align:center'}}
                    ]
            ],
            table = new Table({
            selectFirst: true,
            attrs: {class: 'auto-width'},
            columns: columns,
            order: 'type',
            url: '/dashboard/questions/unit/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    rows.push({
                        attrs: {'data-id': response[i].id || null},
                        cells: [
                            response[i].type,
                            {value: response[i].units_questions, attrs: {class: 'text-right'}},
                            {value: response[i].workers_questions, attrs: {class: 'text-right'}},
                            {value: response[i].patients_questions, attrs: {class: 'text-right'}}
                        ]
                    })
               
                }  
                
                return rows;
            },
            actions: [
                {
                    id: 'questions_patients',
                    label: 'Patients',
                    class: 'btn-info',
                    callback: function (row) {
                        Tab.add({
                            id: 'patients_questions_tab' + '_' + row['attrs']['data-id'],
                            label: 'Patients Q. by unit type',
                            color: '#5BC0DE',
                            callback: function () {
                                return patients_questions_list(row, true);
                            }
                        });
                    }
                },
                {
                    id: 'questions_workers',
                    label: 'Care team',
                    class: 'btn-info',
                    callback: function (row) {
                        Tab.add({
                            id: 'workers_questions_tab' + '_' + row['attrs']['data-id'],
                            label: 'Care team Q. by unit type',
                            color: '#5BC0DE',
                            callback: function () {
                                return workers_questions_list(row, true);
                            }
                        });
                    }
                }
            ]
        });
    tabsContainer.questions_unit_type = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function workers_questions_list(row, unit) {
    var columns = [
            {
                name: 'checked',
                label: 'Choose',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 90}
            },
            {name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 300}},
            {name: 'questions', label: 'Questions', order: true, filter: 'text', attrs: {width: 640}}
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            arrowNavigation: false,
            order: 'id',
            filter: unit ? {id: row['attrs']['data-id']} : {site: row['attrs']['data-id']},
            columns: columns,
            contextMenu: false,
            url: unit ? '/dashboard/workers/unit/' : '/dashboard/workers/questions/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    var row = [], disabled = [];

                    for (var c = 0; c < columns.length; c++) {
                        var val = response[i][columns[c]['name']];
                        var input = '<input type="checkbox" onclick="return false" ' + (response[i]['checked'] ? 'checked="checked"' : '') + ' />';

                        columns[c]['name'] == 'checked' ? row.push({
                            attrs: {class: 'text-center'},
                            safe: true,
                            value: input
                        }) :
                            row.push({value: val});
                    }
                    rows.push({
                        attrs: {
                            'data-id': response[i]['id'] || null,
                            'data-action-disabled': JSON.stringify(disabled),
                            class: response[i]['checked'] ? ' active' : ''
                        },
                        cells: row
                    })
                }
                return rows;
            },
            onRowSelect: function (selected, tr) {
                var input = $(tr).find('input');
                $(tr).toggleClass('active');

                var checked = !input.prop('checked');
                input.prop('checked', checked);

                var container = $('[data-qty]:visible'),
                    qty = container.data('qty');
                checked  ? qty++ : qty--;    // new row selected -> increment qty ++
                                            // or deselected qty --
                container.data('qty', qty).html('(' + qty + ' questions)');

                $.ajax({
                    method: checked ? 'PUT' : 'DELETE',
                    url: unit ? '/dashboard/workers/unit/' + row['attrs']['data-id'] + '/' : '/dashboard/workers/questions/' + row['attrs']['data-id'] + '/',
                    data: {
                        question: selected['attrs']['data-id'],
                        id: row['attrs']['data-id']
                    },
                    success: function (data, status, response) {
                        if (response.status == 400) {
                            Notify('Some questions from list were not saved');
                        }
                    }
                });
                return false;
            }
        });

    tabsContainer.workers_questions_list = table;
    table.getData();
    table.actionsDiv.attr({'style': 'width:690px;'});
    var header = $("<span />").append((unit ? ('Unit type: ' + row['cells'][0]) : ('Site: ' + row['cells'][0])) + ' ').append($("<strong />", {class: 'total-qty', text: '', 'data-qty': ''})),
        obj =  {id: row['attrs']['data-id'], type: 'workers', questionType: unit ? 'unit' : 'site'};

    header.css({
        fontSize: '16px',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        float: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '34px'
    });

    questionsCount(obj, header);
    return table.renderActions().append(header).add(table.render());
}

function patients_questions_list(row, unit, name) {
    var columns = [
            {
                name: 'checked',
                label: 'Choose',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 90}
            },
            {name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 300}},
            {name: 'questions', label: 'Question', order: true, filter: 'text', attrs: {width: 640}}
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            arrowNavigation: false,
            order: 'id',
            filter: unit ? {id: row['attrs']['data-id']} : {site: row['attrs']['data-id']},
            columns: columns,
            contextMenu: false,
            url: unit ? '/dashboard/patients/unit/' : '/dashboard/patients/questions/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    var row = [], disabled = [];

                    for (var c = 0; c < columns.length; c++) {
                        var val = response[i][columns[c]['name']],
                            input = '<input type="checkbox" onclick="return false" ' + (response[i]['checked'] ? 'checked="checked"' : '') + ' />';

                        columns[c]['name'] == 'checked' ? row.push({
                            attrs: {class: 'text-center'},
                            safe: true,
                            value: input
                        }) :
                            row.push({value: val});
                    }
                    rows.push({
                        attrs: {
                            'data-id': response[i]['id'] || null,
                            'data-action-disabled': JSON.stringify(disabled),
                            class: response[i]['checked'] ? ' active' : ''
                        },
                        cells: row
                    })
                }
                return rows;
            },
            onRowSelect: function (selected, tr) {
                var input = $(tr).find('input');
                $(tr).toggleClass('active');

                var checked = !input.prop('checked');
                input.prop('checked', checked);

                var container = $('[data-qty]:visible'),
                    qty = container.data('qty');
                checked ? qty++ : qty--;    // new row selected -> increment qty ++
                                            // or deselected qty --
                container.data('qty', qty).html('(' + qty + ' questions)');

                $.ajax({
                    method: checked ? 'PUT' : 'DELETE',
                    url: unit ? '/dashboard/patients/unit/' + row['attrs']['data-id'] + '/' : '/dashboard/patients/questions/' + row['attrs']['data-id'] + '/',
                    data: {
                        question: selected['attrs']['data-id'],
                        id: row['attrs']['data-id']
                    },
                    success: function (data, status, response) {
                        if (response.status == 400) {
                            Notify('Some questions from list were were not saved');
                        }
                    }
                });

                return false;
            }
        });
    tabsContainer.patients_questions_list = table;
    table.getData();
    table.actionsDiv.attr({'style': 'width:890px;'});
    var header = $("<span />").append( (unit ? ('Unit type: ' + (name ? name['value'] : row['cells'][0]) + ' ') : ('Site: ' + row['cells'][0]) + ' ') ).append($("<strong />", {class: 'total-qty', text: '', 'data-qty': ''})),
        obj =  {id: row['attrs']['data-id'], type: 'patients', questionType: unit ? 'unit' : 'site'};

    header.css({
        fontSize: '16px',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        float: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '34px'
    });

    questionsCount(obj, header);
    return table.renderActions().append(header).add(table.render());
}

function sites() {
    var columns = [
            {name: 'name', label: 'Name', order: true, filter: 'text', required: true, attrs: {width: 350}},
            {name: 'units_count', label: 'Units', order: true, filter: 'comparison', attrs: {width: 90}},
            {name: 'workers_count', label: 'Care team', order: true, filter: 'comparison', extendedFilter: true, attrs: {width: 90}}
        ],
        fields = [
            {name: 'name', label: 'Name', type: 'text', required: true, attrs: {style: 'width: 320px;'}},
            {name: 'address', label: 'Address', type: 'text', attrs: {style: 'width: 320px;'}},
            [
                {name: 'areacode', label: 'Phone', type: 'text', attrs: {class: "input-50"}},
                {name: 'phone', label: '-', type: 'text', attrs: {class: "input-140"}}
            ],
            {
                name: 'mailNoonInterval',
                label: 'Send Mail noon time',
                type: 'time'
            },
            {
                name: 'mailAfterNoonInterval',
                label: 'Send mail afternoon time',
                type: 'time'
            },
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            selectFirst: true,
            columns: columns,
            order: 'name',
            url: '/dashboard/organization/',
            onGetData: function (response) {
                for (var i=0;i<response.length;i++){
                      response[i]["units_count"] = {value: response[i]["workers_count"], attrs: {class: "text-right"}};
                      response[i]["workers_count"] = {value: response[i]["workers_count"], attrs: {class: "text-right"}};
                  }
                return _dataRows(response, columns);
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add'},
                                attrs: {action: '/dashboard/organization/', method: 'post'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row, table) {
                        var content = new TableForm({
                            table: table,
                            pinned: true,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/organization/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/organization/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                },
                {
                    id: 'departments',
                    label: 'Units',
                    class: 'btn-info',
                    callback: function (row) {
                        $("#menu").find("a[href='#units']").trigger('click');
                        tabsContainer.units.head.find('[name=organization]').val(arguments[0]['cells'][0]['value']).trigger('keyup');
                    }
                },
                {
                    id: 'patients_survey_units',
                    label: 'Patients questions screen',
                    class: 'btn-info',
                    callback: function (row) {
                        var company_id = $('#company_id').length ? $('#company_id').attr('data-company-id') : '';
                        var site_id = row.attrs['data-id'];
                        var http = window.location.href.match(/^\w{4}\:\/\//);
                        var url = http + window.location.hostname + '/survey/patients/site/' + company_id + '/' + site_id;
                        window.open(url);
                    }
                }
            ]
        });
    tabsContainer.sites = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function units() {
    var columns = [
            {name: 'organization', label: 'Site', order: true, filter: 'text', attrs: {width: 260}},
            {name: 'name', label: 'Unit name', order: true, filter: 'text', attrs: {width: 360}},
            {name: 'type', label: 'Unit type', order: true, filter: 'text', attrs: {width: 260}},
            {name: 'mobileId', label: 'Mobile ID', order: true, filter: 'text', attrs: {width: 140}},
            {name: 'workers_count', label: 'Care team', order: true, filter: 'number', attrs: {width: 100}}
        ],
        fields = [
            {
                name: 'organization__id',
                label: 'Site',
                type: 'related',
                url: '/dashboard/site',
                text: 'organization',
                placeholder: 'Site',
                order: 'name',
                children: 'type__id',
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'organization__id'}),
                required: true,
                attrs: {style: 'width: 400px;', 'data-field': 'select-field'}
            },
            {
                name: 'name',
                label: 'Unit name',
                type: 'text',
                required: true,
                length: 255,
                attrs: {style: 'width: 400px;', 'data-field': 'input-field'}
            },
            {
                name: 'type__id',
                label: 'Unit type',
                type: 'related',
                url: '/unit/type/',
                text: 'type',
                order: 'name',
                placeholder: 'Type',
                related: {},
                results: JSON.stringify({id: 'id', text: 'name', term: 'name'}),
                required: true,
                attrs: {style: 'width: 400px;', 'data-field': 'select-field'}
            },
            {name: 'mobileId', label: 'Mobile ID', type: 'text', length: 19, attrs: {style: 'width: 400px;'}}
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            order: 'name',
            columns: columns,
            selectFirst: true,
            url: '/dashboard/department/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    var row = [], disabled = [];

                    for (var c = 0; c < columns.length; c++) {
                        var val = response[i][columns[c]['name']];
                        var column = columns[c]['name'];
                        var regExp = /^\d{1,2}-\d{1,2}-\d{4}$/;
                        var obj = {
                            attrs: {class: $.type(val) == 'number' ? 'text-right' : ''},
                            value: val
                        };
                        if (column == 'workers_count' && response[i]['workerId']) obj.attrs['data-worker-id'] = response[i]['workerId'];
                        row.push(obj);
                    }

                    response[i]['workers_count'] ? disabled.push('delete') : (disabled.push('workers'), disabled.push('workers_survey'));

                    rows.push({
                        attrs: {
                            'data-id': response[i]['id'] || null,
                            'data-action-disabled': JSON.stringify(disabled),
                            'data-action-content-disabled': JSON.stringify(['delete', 'edit'])
                        },
                        cells: row
                    })
                }
                return rows;
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/department/add', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: true,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/department/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/department/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                },
                {
                    id: 'workers',
                    label: 'Care team',
                    class: 'btn-info',
                    callback: function (row) {
                        $("#menu").find("a[href='#workers']").trigger('click');
                        tabsContainer.workers.head.find('[name=site]').val(arguments[0]['cells'][0]['value']).trigger('keyup');
                        tabsContainer.workers.head.find('[name=unit]').val(arguments[0]['cells'][1]['value']).trigger('keyup');
                    }
                },
                {
                    id: 'patients_survey',
                    label: 'Patients questions screen',
                    class: 'btn-info',
                    callback: function (row) {
                        var company_id = $('#company_id').length ? $('#company_id').attr('data-company-id') : '';
                        var unit_id = row.attrs['data-id'];
                        var http = window.location.href.match(/^\w{4}\:\/\//);
                        var url = http + window.location.hostname + '/survey/patients/' + company_id + '/' + unit_id;
                        window.open(url);
                    }
                },
                {
                    id: 'workers_survey',
                    label: 'Care team questions screen',
                    class: 'btn-info',
                    callback: function (row) {
                        var company_id = $('#company_id').length ? $('#company_id').attr('data-company-id') : '';
                        var unit_id = row.attrs['data-id'];
                        var worker_id = row.cells[row.cells.length - 1].attrs['data-worker-id'];
                        var http = window.location.href.match(/^\w{4}\:\/\//);
                        var url = http + window.location.hostname + '/survey/employees?company=' + company_id + '&unit=' + unit_id + '&employee=' + worker_id;
                        window.open(url);
                    }
                }
            ]
        });
    tabsContainer.units = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function categories() {
    var columns = [
             [
                 {name: 'code', label: 'Code', order: true, filter: 'number', attrs: {rowspan: 2, width: 10, style: 'vertical-align: bottom' }},
                 {name: 'name', label: 'Name', order: true, filter: 'text', attrs: {rowspan: 2, width: 60, style: 'vertical-align: bottom' }},
                 {label: 'Questions', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}},
             ],
             [
                {name: 'patientsCount', label: 'Patients', order: true, filter: 'text', attrs: {width: 13}},
                {name: 'workersCount', label: 'Care team', order: true, filter: 'text', attrs: {width: 13}}
             ]
        ],
        fields = [
            {name: 'code', label: 'Code', type: 'digits', required: true, attrs: {style: 'width: 90px;'}},
            {name: 'name', label: 'Name', type: 'text', required: true, attrs: {style: 'width: 380px;'}}
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            order: 'code',
            columns: columns,
            url: '/dashboard/categories/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                  var disabled = [];
                   if (response[i].workersCount || response[i].patientsCount ) disabled.push('delete');
                    rows.push({
                    attrs: {'data-id': response[i].id || null,
                        'data-action-disabled': JSON.stringify(disabled),
                    },

                 cells: [
                            {value: response[i].code,  attrs: {class: 'text-right'}},
                            response[i].name,
                            {value: response[i].patientsCount, attrs: {class: 'text-right'}},
                            {value: response[i].workersCount, attrs: {class: 'text-right'}}
                        ]
                    })
                }

                return rows;

            },
        /*    onGetData: function (response){

                for (var i = 0; i < response.length; i++) {
                     response[i]["patientsCount"] = {value: response[i]["patientsCount"], attrs: {class: "text-right"}};
                     response[i]["workersCount"] = {value: response[i]["workersCount"], attrs: {class: "text-right"}};
                }
                return _dataRows(response, columns);
            },*/

            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: ['code'],
                            formData: {
                                name: {label: 'Add'},
                                attrs: {action: '/dashboard/categories/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields)),
                            after: function (form) {
                                form.form.find('[name="name"]').focus().trigger('click');
                                form.formData.attrs.action = '/dashboard/categories/';
                            }
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: true,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/categories/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Remove',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/categories/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                },
                {
                    id: 'question_list_patients',
                    label: 'Patients questions',
                    class: 'btn-info',
                    callback: function (row) {
                        $("#menu").find("a[href='#question_list_patients']").trigger('click');
                   /*    tabsContainer.workers.head.find('[name=unit]').val(arguments[0]['cells'][1]['value']).trigger('keyup');*/
                    }
                },
                {
                    id: 'question_list_workers',
                    label: 'Care team questions',
                    class: 'btn-info',
                    callback: function (row) {
                        $("#menu").find("a[href='#question_list_workers']").trigger('click');
               /*         tabsContainer.workers.head.find('[name=site]').val(arguments[0]['cells'][0]['value']).trigger('keyup');
                        tabsContainer.workers.head.find('[name=unit]').val(arguments[0]['cells'][1]['value']).trigger('keyup');*/
                    }
                },
            ]
        });

    tabsContainer.categories = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function question_list_workers() {

    var columns = [
            {name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
            {name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 240}},
            {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 420, class: 'question-title'}},
            {name: 'categories', label: 'Categories', order: true,  filter: 'number', attrs: {width: 110}}
        ],
        table = new Table({
            attrs: {class: 'auto-width top-align'},
            order: 'code',
            columns: columns,
            url: '/dashboard/workers',
            onGetData: function (response) {
                response.forEach(function(element, index, array){
                    array[index]['categories'] = {value : array[index]['categories'], attrs: {class: "text-right"}};

                });
                return _dataRows(response, columns);
            },
            actions: [
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        promptCategories('/dashboard/categories/byworkerquestion/', row.attrs['data-id'], function(output){
                            var content = new TableForm({
                                table: table,
                                pinned: true,
                                edit: row.attrs['data-id'],
                                formData: {
                                    name: {label: 'Edit'},
                                    attrs: {action: '/dashboard/workers/', method: 'PUT'}
                                },
                                fields: JSON.parse(JSON.stringify(convertCategoriesToCheckboxes(output)))
                            });
                            table.addRowContainer(content.render(), true);
                        });
                    }
                }
            ]
        });
    tabsContainer.workers = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function question_list_patients() {
    
    var columns = [
            {name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
            {name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 240}},
            {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 420, class: 'question-title'}},
            {name: 'categories', label: 'Categories', order: true, filter: 'text', attrs: {width: 100}}
        ],
        table = new Table({
            attrs: {class: 'auto-width top-align'},
            order: 'code',
            columns: columns,
            url: '/dashboard/patients',
            onGetData: function (response) {
                response.forEach(function(element, index, array){
                    //var test = parseInt(element['categories']);
                    //array[index]['categories'] = isNaN(test)?'':test;
                    response[index]['categories'] = {value: response[index]['categories'], attrs: {class: 'text-right'} }
                });
                return _dataRows(response, columns);
            },
            actions: [
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        promptCategories('/dashboard/categories/bypatientquestion/', row.attrs['data-id'], function(output){
                            var content = new TableForm({
                                table: table,
                                pinned: true,
                                edit: row.attrs['data-id'],
                                formData: {
                                    name: {label: 'Edit'},
                                    attrs: {action: '/dashboard/patients/', method: 'PUT'}
                                },
                                fields: JSON.parse(JSON.stringify(convertCategoriesToCheckboxes(output)))
                            });
                            table.addRowContainer(content.render(), true);
                        });
                    }
                }
            ]
        });
    tabsContainer.workers = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function convertCategoriesToCheckboxes(data){
    for(category in data){
        data[category].label={text: data[category].name , position: "after", class: 'category-label'};
        data[category].name = "category["+data[category].id+"]";
        data[category].type = 'checkbox';
        data[category].attrs = {class: 'category', border: 0, width : 'auto', style: 'border:none;box-shadow:none;outline-style:none;box-shadow:none;border-color:transparent;margin-left: 50px;'}
    }

    if(data[0] != null){
        var tmp =
        {
                name: 'site_id',
                type: 'text',
                order: 'id',
                text: 'site_name',
                value: data[0].question,
                disabled : true,
                attrs : {disabled : true, class: 'form-control', style: 'border:0;box-shadow:none;font-weight:700;'}
        };
        data.unshift(tmp);
    }
    return data;
}


function promptCategories(url, questionId, callback){
    $.ajax({
        url: url+questionId+'/',
        type: 'GET',
    }).done(function(data){
        return callback(data);
    });
}

function not_applicable_questions(){
    var columns = [
            {name: 'date', label: 'Date', order: true, filter: 'date', attrs: {width: 110}},
            {name: 'firstName', label: 'First name', order: true, filter: 'text', attrs: {width: 240}},
            {name: 'lastName', label: 'Last name', order: true, filter: 'text', attrs: {width: 240}},
            {name: 'role', label: 'Role', order: true, filter: 'text', attrs: {width: 240}},
            {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 420}},
        ],
        fields = [],
        table = new Table({
            attrs: {class: 'auto-width top-align'},
            order: '-date',
            columns: columns,
            url: '/dashboard/notapplicable/',
            onGetData: function (response) {
                return _dataRows(response, columns);
            }
        });
    tabsContainer.workers = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function absenceWorkers() {
    var columns = [
            {name: 'fromDate', label: 'From date', order: true, filter: 'date', attrs: {width: 100}},
            {name: 'toDate', label: 'To date', order: true, filter: 'date', attrs: {width: 100}},
            {name: 'firstName', label: 'First name', order: true, filter: 'text', attrs: {width: 130}},
            {name: 'lastName', label: 'Last name', order: true, filter: 'text', attrs: {width: 130}},
            {name: 'reason', label: 'Reason', order: true, filter: 'text', attrs: {width: 530}}
        ],

        fields = [
            {
                name: 'worker_id',
                label: {text: 'Employee', class: 'label-130'},
                type: 'related',
                url: '/dashboard/worker/get-workers',
                text: 'worker_name',
                placeholder: 'Employee',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
                attrs: {class: 'select2 input-140'},
                required: true
            },
            {
                name: 'fromDate',
                label: {text: 'From date', class: 'label-130'},
                type: 'date',
                required: true,
                length: 24,
                attrs: {style: 'width: 100px;'}
            },
            {
                name: 'toDate',
                label: {text: 'To date', class: 'label-130'},
                type: 'date',
                required: true,
                length: 24,
                attrs: {style: 'width: 100px;'}
            },
            {
                name: 'reason',
                label: {text: 'Reason', class: 'label-130'},
                type: 'textarea',
                required: false,
                length: 24,
                attrs: {style: 'width: 300px;'}
            }
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            columns: columns,
            order: 'fromDate',
            url: '/dashboard/employees-absences/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {

                    rows.push({
                        attrs: {'data-id': response[i].id || null},
                        cells: [
                            response[i].fromDate,
                            response[i].toDate,
                            response[i].firstName,
                            response[i].lastName,
                            response[i].reason
                        ]
                        });

                }
                return rows;
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/employees-absences/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/employees-absences/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });

                        table.addRowContainer(content.render(), true);
                    }


                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/employees-absences/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                }
             ]
        });
    tabsContainer.absenceWorkers = table;
    table.getData();
    return table.renderActions().add(table.render());

}

function workers() {
    var columns = [
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 200}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'firstName', label: 'First name', order: true, filter: 'text', attrs: {width: 120}},
            {name: 'lastName', label: 'Last name', order: true, filter: 'text', attrs: {width: 130}},
            {name: 'role', label: 'Role', order: true, filter: 'text', attrs: {width: 150}},
            {name: 'phone', label: 'Phone', order: true, filter: 'text', attrs: {width: 120}},
            {name: 'email', label: 'Email', order: true, filter: 'text', attrs: {width: 220}},
            {name: 'answerDate', label: 'Last answer', order: true, filter: 'date', attrs: {width: 110}},
            {name: 'confirmed', label: 'Confirmed', order: true, filter: 'select', filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}], attrs: {width: 90}}
        ],

        fields = [
            {
                name: 'site_id',
                label: {text: 'Site', class: 'label-130'},
                type: 'related',
                url: '/dashboard/site',
                order: 'id',
                text: 'site_name',
                placeholder: 'Site',
                children: 'unit_id',
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'site_id'}),
                required: true,
                attrs: {style: 'width: 300px;'}
            }, {
                name: 'unit_id',
                label: {text: 'Unit', class: 'label-130'},
                type: 'related',
                url: '/dashboard/unit',
                order: 'id',
                text: 'unit_name',
                placeholder: 'Unit',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
                required: true,
                attrs: {style: 'width: 300px;'}
            },{
                name: 'secondUnit_id',
                label: {text: 'Secodary unit', class: 'label-130'},
                type: 'related',
                url: '/dashboard/unit',
                order: 'id',
                text: 'secondUnit_name',
                placeholder: 'Secondary unit',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
                required: false,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'firstName',
                label: {text: 'First name', class: 'label-130'},
                type: 'text',
                required: false,
                length: 24,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'lastName',
                label: {text: 'Last name', class: 'label-130'},
                type: 'text',
                required: false,
                length: 24,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'role_id',
                label: {text: 'Role', class: 'label-130'},
                type: 'related',
                url: '/dashboard/role',
                order: 'id',
                text: 'role_name',
                placeholder: 'Role',
                results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
                required: true,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'phone',
                label: {text: 'Phone', class: 'label-130'},
                type: 'text',
                required: true,
                length: 19,
                attrs: {style: 'width: 300px;'}
            },
            {
                name: 'email',
                label: {text: 'E-mail', class: 'label-130'},
                type: 'text',
                required: true,
                attrs: {style: 'width: 300px;', autocomplete: 'off'}
            },
            {
                name: 'send',
                value: true,
                label: {text: 'Send via email', position: 'before', class: 'label-130'},
                type: 'checkbox',
                required: false,
                attrs: {class: "send-email skip-focus"}
            },
            {
                name: 'birthday',
                label: {text: 'Birthday year', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: (function(){
                    var dateRange = {'0': ''};
                    for( var i = (new Date()).getFullYear(), endDate = 1940; i >= endDate; i-- ){
                        dateRange['_' + i] = i;
                    }
                    return dateRange;
                })()
            },
            {
                name: 'fullTime',
                label: {text: 'Full time/Part time', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: {0: '', 1: 'Full time', 2: 'Part time'}
            },
            {
                name: 'gender',
                label: {text: 'Gender', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: {0: '', 1: 'Male', 2: 'Female'}
            },
            {
                name: 'yearStartedWork',
                label: {text: 'Year started', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: (function(){
                    var dateRange = {'0': ''};
                    for( var i = (new Date()).getFullYear(), endDate = 1940; i >= endDate; i-- ){
                        dateRange['_' + i] = i;
                    }
                    return dateRange;
                })()
            },
            {
                name: 'startWork',
                label: {text: 'Career start at', class: 'label-130'},
                type: 'select',
                attrs: {class: "input-100"},
                options: (function(){
                    var dateRange = {'0': ''};
                    for( var i = (new Date()).getFullYear(), endDate = 1960; i >= endDate; i-- ){
                        dateRange['_' + i] = i;
                    }
                    return dateRange;
                })()
            },
            {
                name: 'stopDate',
                label: {text: 'Inactive date', class: 'label-130'},
                type: 'date',
                attrs: {class: "input-100"}
            }
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            columns: columns,
            selectFirst: true,
            order: 'site',
            url: '/dashboard/worker/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    var row = [], disabled = [];

                    for (var c = 0; c < columns.length; c++) {
                        var val = response[i][columns[c]['name']];
                        var column = columns[c]['name'];
                        var regExp = /^\d{1,2}-\d{1,2}-\d{4}$/;

                        row.push({
                            attrs: {class: $.isNumeric(val) && $.type(val) == 'number' ? 'text-right' : ''},
                            value: val
                        });
                    }
                    // code refactoring for onShow Delete button
                    if (!(response[i]['department_count'] || response[i]['units_count'])) disabled.push('departments');
                    if (response[i]['department_count'] || response[i]['workers']) disabled.push('delete');
                    if (response[i]['lastLogin'] || response[i]['units_count']) disabled.push('delete');
                    if (response[i]['answerDate']) disabled.push('delete');
                    if ($('#company_id').data('admin') !== $('#user-name').data('user') ){
                        disabled.push('delete', 'edit', 'send_email');
                    }

                    rows.push({
                        attrs: {
                            'data-id': response[i]['id'] || null,
                            'data-action-disabled': JSON.stringify(disabled),
                            'data-action-content-disabled': JSON.stringify(['delete', 'edit']),
                            'class' : response[i]['confirmed'] == 'No' ? ' text-red': '',
                        },
                        cells: row
                    })
                }
                return rows;
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/worker/'}
                            },
                            fields: JSON.parse(JSON.stringify(fields)),
                            after: function(form){
                                // form created
                                if ( form.form.find('.btn-success').length ) form.form.find('.btn-success').addClass('spinner');
                            },
                            onSubmit: function(form){
                                if( form.form.find('.btn-success').length ) form.form.find('.btn-success').addClass('locked');
                            },
                            onComplete: function (form, response){
                                if( form.form.find('.btn-success').length ) form.form.find('.btn-success').removeClass('locked');
                                if (response.status == 201) {
                                    var msg = 'New Worker created',
                                    cssClass = 'success';
                                    Notify(msg, cssClass);
                                }
                                return response;
                            }
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/worker/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields)),
                            after: function(form){
                                if( form.form.find('input[type=checkbox]').length ) form.form.find('input[type=checkbox]').prop('checked', false).addClass('hidden');
                                if ( form.form.find('input[type=checkbox]').prev().length ) form.form.find('input[type=checkbox]').prev().addClass('hidden');
                            }
                        });
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/worker/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                },
                {
                    id: 'upload',
                    label: 'Import excel file',
                    class: 'btn-default',
                    global: true,
                    callback: function () {
                        $('.modal-box-import').modal({
                            keyboard: true
                        });
                    }
                },
                {
                    id: 'export',
                    label: 'Export to excel',
                    class: 'btn-default',
                    callback : function () {
                        window.location.href = '/dashboard/worker/export';
                    }
                },
                {
                    id: 'send_email',
                    label: 'Send email',
                    class: 'btn-info spinner',
                    callback: function (row) {
                        table.lockAction('send_email', true);
                        var form = new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/worker/send-link/', method: 'GET'}
                            },
                            getData: function (response) {
                                var msg = 'Email sending error',
                                    cssClass = 'danger';
                                if ('ok' in response) {
                                    msg = response.ok;
                                    cssClass = 'success';
                                } else if ('ko' in response) {
                                    msg = response.ko;
                                }
                                Notify(msg, cssClass);
                                table.lockAction('send_email', false);

                                return response;
                            }
                        });
                        form.render();
                    }
                }
            ]
        });
    tabsContainer.workers = table;
    table.getData();
    var modal = $("<div />", {id: "import-xls", class: "modal modal-box-import fade"}).append(
        $("<div> /", {class: "modal-dialog", style: 'z-index: 1050;'}).append(
            $("<div> /", {class: "modal-content"}).append(
                $("<div />", {class: "modal-header"}).append(
                    $("<h4 />").text('Import Care team')
                ),
                $("<iframe />", {id: "file-import-form", frameBorder: 0, src: "/dashboard/worker/import"}),
                $("<div> /", {class: "modal-footer"}).append([
                    $("<button > /", {class: "btn btn-default", 'data-dismiss': "modal"}).text('Close'),
                    $("<button > /", {
                        class: "btn btn-primary",
                        'data-submit': "submit"
                    }).text('Import file')
                ])
            )));

    if (!$('.modal-box-import').length) {
        modal.appendTo($('body')).on('show.bs.modal', function (modal) {
            $(this).css('display', 'block');
            var $dialog = $(this).find(".modal-dialog");
            var offset = ($(window).height() - $dialog.height()) / 2;
            $dialog.css("margin-top", offset);
        });

        $('[data-dismiss]').on('click', function () {
            $('iframe').attr("src", "/dashboard/worker/import");
        });

        $('[data-submit]').on('click', function () {
            $('iframe').contents().find('.overlay').fadeIn('fast');
            $('iframe').contents().find('form').trigger('submit');
        });
    }
    return table.renderActions().add(table.render());
}

function questions(filter) {
    filter = filter || {};
    var columns = [
            {name: 'id', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
            {name: 'content', label: 'Question', order: true, filter: 'text', attrs: {width: 500}}
        ],
        fields = [
            {name: 'content', label: 'Question', type: 'text', required: true, attrs: {style: 'width: 380px;'}}
        ],
        table = new Table({
            defaultAction: 'edit',
            attrs: {class: 'auto-width'},
            order: 'id',
            columns: columns,
            selectFirst: true,
            filter: filter,
            url: '/dashboard/question/',
            onGetData: function (response) {
                return _dataRows(response, columns);
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/question/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), false);
                    }
                }, {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/question/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), true);
                    }
                }, {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/question/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                }
            ]
        })
        ;
    tabsContainer.questions = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function static_questions() {
    var fields = [
            {
                name: 'workers_static_id',
                label: 'Care team question',
                type: 'related',
                url: '/dashboard/questions/workers',
                order: 'id',
                text: 'workers_question',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
            {
                name: 'patients_static_id',
                label: 'Patients question',
                type: 'related',
                url: '/dashboard/questions/patients',
                order: 'id',
                text: 'patients_question',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            }
        ],
        $form = new TableForm({
            pinned: false,
            edit: $('#menus').find('a[href=#static_questions]').data('id'),
            formData: {
                attrs: {action: '/dashboard/static-questions/', method: 'PUT'}
            },
            fields: JSON.parse(JSON.stringify(fields)),
            actions: [{
                id: 'save',
                label: 'Save',
                class: 'btn btn-info',
                attrs: {style : userIsAdmin ? userIsAdmin : "display : none;"},
                callback: function (form) {
                    form.sendData();
                }
            }],
            after: function (form) {
                form.form.find('[data-select="related"]').each(function () {
                    $(this).data('format', function (element) {
                        for (key in element) {
                            if (key !== 'id') {
                                element['code'] += (key != 'code') ? element[key] + ' / ' : '';
                            } else {
                                element['code'] += ' - ';
                            }
                        }
                        element['code'] = element['code'].substr(0, element['code'].length - 3);
                        return element;
                    });
                });
            },
            onComplete: function (data, response) {
                if( response.status == 200 ){
                    Notify('Static questions saved');
                    $('#tab').find('a[href=#static_questions]').next().trigger('click');
                    return false;
                }
            }
        }).render();

    return $("<div class='table table-data static-questions-form' />")
        .html($("<div class='body' />"))
        .html($("<table />")
            .html($("<tbody />")
                .html($("<tr class='tr row-content' />")
                    .html($("<td class='td no-border' />")
                        .html($form)))
        ));

}
function hot_questions_callback() {
    var fields = [
            {
                name: 'workers_static_id1',
                label: 'Care team question 1',
                type: 'related',
                url: '/dashboard/questions/workers',
                order: 'id',
                text: 'workers_question1',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
            {
                name: 'workers_static_id2',
                label: 'Care team question 2',
                type: 'related',
                url: '/dashboard/questions/workers',
                order: 'id',
                text: 'workers_question2',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
           {
                name: 'workers_static_id3',
                label: 'Care team question 3',
                type: 'related',
                url: '/dashboard/questions/workers',
                order: 'id',
                text: 'workers_question3',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
        {
                name: 'workers_static_id4',
                label: 'Care team question 4',
                type: 'related',
                url: '/dashboard/questions/workers',
                order: 'id',
                text: 'workers_question4',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
            {
                name: 'patients_static_id1',
                label: 'Patients question 1',
                type: 'related',
                url: '/dashboard/questions/patients',
                order: 'id',
                text: 'patients_question1',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
            {
                name: 'patients_static_id2',
                label: 'Patients question 2',
                type: 'related',
                url: '/dashboard/questions/patients',
                order: 'id',
                text: 'patients_question2',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
           {
                name: 'patients_static_id3',
                label: 'Patients question 3',
                type: 'related',
                url: '/dashboard/questions/patients',
                order: 'id',
                text: 'patients_question3',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
           {
                name: 'patients_static_id4',
                label: 'Patients question 4',
                type: 'related',
                url: '/dashboard/questions/patients',
                order: 'id',
                text: 'patients_question4',
                placeholder: 'Select question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 680px;'},
                required: true
            },
        ],
        $form = new TableForm({
            pinned: false,
            edit: $('#menus').find('a[href=#hot_questions]').data('id'),
            formData: {
                attrs: {action: '/dashboard/hot-questions/', method: 'PUT'}
            },
            fields: JSON.parse(JSON.stringify(fields)),
            actions: [{
                id: 'save',
                label: 'Save',
                class: 'btn btn-info',
                attrs: {style : userIsAdmin ? userIsAdmin : "display : none;"},
                callback: function (form) {
                    form.sendData();
                }
            }],
            after: function (form) {
                form.form.find('[data-select="related"]').each(function () {
                    $(this).data('format', function (element) {
                        for (key in element) {
                            if (key !== 'id') {
                                element['code'] += (key != 'code') ? element[key] + ' / ' : '';
                            } else {
                                element['code'] += ' - ';
                            }
                        }
                        element['code'] = element['code'].substr(0, element['code'].length - 3);
                        return element;
                    });
                });
            },
            onComplete: function (data, response) {
                if( response.status == 200 ){
                    Notify('Hot questions saved');
                    $('#tab').find('a[href=#hot_questions]').next().trigger('click');
                    return false;
                }
            }
        }).render();

    return $("<div class='table table-data static-questions-form' />")
        .html($("<div class='body' />"))
        .html($("<table />")
            .html($("<tbody />")
                .html($("<tr class='tr row-content' />")
                    .html($("<td class='td no-border' />")
                        .html($form)))
            ));
}

function targets_callback(){
    var columns = [
        {   name: 'type',
            label: 'Type',
            order: true,
            attrs: {width: 125},
            filter: 'select',
            filterData: [{value: "-1", label: "All"}, {value: "0", label: "Patients"}, {value: "1", label: "Care team"}]
        },
        {name: 'question', label: 'Question', order: true, filter: 'text', attrs: {width: 700}},
        {name: 'subject', label: 'Subject', filter: 'text',  order: true,  attrs: {width: 260}},
        {name: 'answer', label: 'Target answer', filter: 'text',  order: true,  attrs: {width: 120}}
    ],
    fields = [
        {name: 'answer', label: 'Answer', type: 'number', required: false, attrs: {style: 'width: 90px;', min: 0, max: 5}}
    ],
    table = new Table({
        attrs: {class: 'auto-width targets'},
        selectFirst: true,
        columns: columns,
        order: '-answer',
        url: '/dashboard/target',
        onGetData: function (response) {
            for (var i=0; i<response.length; i++){
                response[i]["answer"] = {value: response[i]["answer"], attrs: {class: "text-right target-value"}};
            }
            return _dataRows(response, columns);
        },
        actions: [
            {
                id: 'edit',
                label: 'Edit',
                class: 'btn-primary',
                callback: function (row, table) {
                    var content = new TableForm({
                        table: table,
                        pinned: true,
                        edit: row.attrs['data-id'],
                        formData: {
                            name: {label: 'Edit'},
                            attrs: {action: '/dashboard/target/', method: 'PUT'}
                        },
                        fields: JSON.parse(JSON.stringify(fields))
                    });
                    table.addRowContainer(content.render(), true);
                }
            },
            {
                id: 'set_all_targets',
                label: 'Set all',
                class: 'btn-info',
                callback: function (row) {
                    var modalWindow = $('.confirm').clone().addClass('modal-window').appendTo('body');

                    $('.dialog .title', modalWindow).text('Set target');
                    $('.dialog p.info', modalWindow).text('Set target for all questions: ');

                    var inputContainer = $('<div class="input-container" />');
                    inputContainer.insertAfter($('.dialog p.info', modalWindow));

                    var input = $('<input type="number" name="target" min="0" max="5" />');
                    input.appendTo(inputContainer);

                    var errorField = $('<span class="error-text" />');
                    errorField.insertAfter(input);

                    $('.dialog button.cancel', modalWindow).on('click', function(){
                        modalWindow.remove();
                    });
                    $('.dialog a.btn-success', modalWindow).on('click', function(e){
                        e.preventDefault();

                        errorField.removeClass('show-error');

                        var targetValue = input.val();
                        var typeValue = table.head.find('[name="type"]').val();
                        var subjectValue = table.head.find('[name="subject"]').val();
                        $.ajax({
                            method: 'PUT',
                            url: '/dashboard/target/set_all/',
                            data: {
                                target: targetValue,
                                type: typeValue,
                                subject: subjectValue
                            },
                            dataType: 'json',
                            complete: function (response, status) {
                                if (response.status == 400) {
                                    errorField.text(response.responseJSON.target.join(' ')).addClass('show-error');
                                }else if (response.status === 200){
                                    table.resetTable();
                                    modalWindow.remove();
                                }
                            }
                        });

                    });
                    modalWindow.show();
                }
            }
        ]
    });
    table.render();

    var timeout;
    table.body.on('dblclick.table', 'tr:not(.row-content) td.target-value', function(e) {
        e.preventDefault();
        clearTimeout(timeout);
        table.request = {};//is used just to stop TR DBLCLICK after CLICK event when a target is prepared to e changed
    });
    table.body.on('click.table', 'tr:not(.row-content) td.target-value:not(.edit-target)', function(e){
        e.preventDefault();

        var
            td = $(this),
            td_value = td.text(),
            fields = [
                {
                    name: 'answer',
                    label: '',
                    type: 'text',
                    required: false,
                    attrs: {style: 'width: 90px; color: black;', value: td_value}
                }
            ],
            tr = td.parent()
        ;

        //Avoid edit row that is already on edit by Edit button
        var next_tr = tr.next();
        if(next_tr.hasClass('row-content')){
            return false;
        }
        //Close opened edit forms
        table.body.find('tr.row-content form .btn-cancel').trigger('click');

        var $form = new TableForm({
            pinned: false,
            edit: tr.data('id'),
            formData: {
                attrs: {action: '/dashboard/target/', method: 'PUT'}
            },
            fields: JSON.parse(JSON.stringify(fields)),
            actions: [
                {
                    id: 'save',
                    label: 'Save',
                    class: 'hide',
                    callback: function (form) {
                        var input = form.form.find('input[name="answer"]');
                        //if value is OK send data
                        if (input.val().trim()) {
                            form.sendData();
                        } else {
                            //otherwise just resotre TD value without any AJAX request
                            afterCompleteSubmitCallback(false);
                        }
                    }
                }
            ],
            after: function (form) {
                //Remove some style to avoid change of row height, to not be confused when rows are move because of height
                form.form.find('form').css('padding', 0);
                form.form.find('div.field').css('margin-bottom', 0);

                var input = form.form.find('input[name="answer"]');
                var submitButton = form.form.find('button.btn-save');
                input.on('focusout', function () {
                    submitButton.trigger('click');
                })
            },
            onComplete: function (data, response) {
                afterCompleteSubmitCallback(response.status == 200 ? true : false);
                return false;
            }
        }).render();

        timeout = setTimeout(function() {
            td.addClass('edit-target');
            td.html($form);
        }, 500);

        function afterCompleteSubmitCallback(status) {
            var input = $($form).find('input[name="answer"]');
            var input_value = input.val();

            //CLear form and other details from edited TD
            $($form).remove();
            td.removeClass('edit-target');

            if (status === true) {
                td.text(input_value);
            } else {
                td.text(td_value);
            }
            table.request = null;
        }

    });

    tabsContainer.targets = table;
    table.getData();
    return table.renderActions().add(table.table);
}

function parameters() {
    var fields = [
            {
                name: 'workersQuestionSource',
                label: 'Care team question source',
                type: 'select',
                attrs: {class: "input-140"},
                options: {0: "By site", 1: "By unit type"}
            },
            {
                name: 'patientsQuestionSource',
                label: 'Patients question source',
                type: 'select',
                attrs: {class: "input-140"},
                options: {0: "By site", 1: "By unit type"}
            },
            {
                name: 'surveyOptions',
                label: 'Patients survey questions',
                type: 'select',
                attrs: {class: "input-140"},
                options: {0: "By procedures", 1: "By unit type"}
            },
            {
                name: 'timeZone',
                label: 'Select time zone',
                type: 'select',
                attrs: {class: "input-160"},
                options: {1: "Europe/Bucharest", 2: "US/Pacific"}
            },
            {
                name: 'mailNoonInterval',
                label: 'Send Mail noon time',
                type: 'time'
            },
            {
                name: 'mailAfterNoonInterval',
                label: 'Send mail afternoon time',
                type: 'time'
            },
            {
                type: 'multiple',
                attrs: {
                    class: 'weekdays'
                },
                fields: [
                    {
                        name: 'sun',
                        label: 'Sunday',
                        type: 'checkbox'
                    },
                    {
                        name: 'mon',
                        label: 'Monday',
                        type: 'checkbox'
                    },
                    {
                        name: 'tue',
                        label: 'Tuesday',
                        type: 'checkbox'
                    },
                    {
                        name: 'wed',
                        label: 'Wednesday',
                        type: 'checkbox'
                    },
                    {
                        name: 'thu',
                        label: 'Thursday',
                        type: 'checkbox'
                    },
                    {
                        name: 'fri',
                        label: 'Friday',
                        type: 'checkbox'
                    },
                    {
                        name: 'sat',
                        label: 'Saturday',
                        type: 'checkbox'
                    }
                ]
            }
        ],
        $form = new TableForm({
            pinned: false,
            edit: $('#menus').find('a[href=#parameters]').data('id'),
            formData: {
                attrs: {action: '/dashboard/question-source/', method: 'PUT'}
            },
            fields: JSON.parse(JSON.stringify(fields)),
            onCancel: function () {
                $('#tab').find('a[href=#parameters]').next().trigger('click');
                return false;
            },
            onComplete: function () {
                Notify('Parameters were saved');
                $('#tab').find('a[href=#parameters]').next().trigger('click');
                return false;
            }
        }).render();

    return $("<div class='table table-data stand-alone-form' />")
        .html($("<div class='body' />"))
        .html($("<table />")
            .html($("<tbody />")
                .html($("<tr class='tr row-content' />")
                    .html($("<td class='td no-border' />")
                        .html($form)))
        ));
}

function users() {
    var columns = [
            {name: 'id', label: 'Code', order: true, filter: 'number', attrs: {width: 70}},
            {name: 'fname', label: 'First name', order: true, filter: 'text', attrs: {width: 160}},
            {name: 'lname', label: 'Last name', order: true, filter: 'text', attrs: {width: 160}},
            {name: 'email', label: 'Email', order: true, filter: 'text', attrs: {width: 200}},
            {name: 'lastLogin', label: 'Last login', order: true, filter: 'date', attrs: {width: 120}},
            {name: 'creationDate', label: 'Created date', order: true, filter: 'date', attrs: {width: 120}},
            {
                name: 'is_active',
                label: 'Active',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 80}
            },
            {
                name: 'is_manager',
                label: 'Manager',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 90}
             },
             {
                name: 'is_admin',
                label: 'Admin',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 80}
             },
            {
                name: 'daily_mail',
                label: 'Daily Mail',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 80}
            },
            {
                name: 'is_targets',
                label: 'Is targets',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"},{value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 80}
            },
            {
                name: 'average_warning',
                label: 'Send average',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"},{value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 130}
            }
        ],
        fields = [
            {name: 'first_name', label: 'First name', type: 'text', required: true, attrs: {style: "width: 260px;"}},
            {name: 'last_name', label: 'Last name', type: 'text', required: true, attrs: {style: "width: 260px;"}},
            {name: 'email', label: 'Email', type: 'text', required: true, attrs: {style: "width: 260px;"}},
            {name: 'password', label: 'Password', type: 'password', required: true, attrs: {class: "input-140"}},
            {name: 'is_active', label: 'Active', type: 'checkbox', value: true},
            {name: 'is_admin', label: 'Admin', type: 'checkbox', value: true},
            {name: 'is_manager', label: 'Manager', type: 'checkbox', value: true, attrs: {class: "toggle-group"}},
            {name: 'daily_mail', label: 'Send daily mail', type: 'checkbox', value: true, attrs: {class: "grouped-checkbox"}},
            {name: 'is_targets', label: 'Send answer warnings', type: 'checkbox', value: true, attrs: {class: "grouped-checkbox"}},
            {name: 'average_warning', label: 'Send target average warnings', type: 'checkbox', value: true, attrs: {style: "color:red", class: "grouped-checkbox"}}
        ],
        table = new Table({
            attrs: {class: 'auto-width users-table'},
            columns: columns,
            order: 'id',
            selectFirst: true,
            url: '/dashboard/staff/',
            onGetData: function (response) {
                var rows = [];
                for (var i = 0; i < response.length; i++) {
                    var row = [], disabled = [];

                    for (var c = 0; c < columns.length; c++) {
                        var val = response[i][columns[c]['name']];
                        var column = columns[c]['name'];
                        var regExp = /^\d{1,2}-\d{1,2}-\d{4}$/;

                        row.push({
                            attrs: {class: $.isNumeric(val) && $.type(val) == 'number' ? 'text-right' : ''},
                            value: val
                        });
                    }
                    // code refactoring for onShow Delete button
                    if (!(response[i]['department_count'] || response[i]['units_count'])) disabled.push('departments');
                    if (response[i]['department_count'] || response[i]['workers']) disabled.push('delete');
                    if (response[i]['lastLogin'] || response[i]['units_count']) disabled.push('delete');
                    if (response[i]['answerDate']) disabled.push('delete');
     /*               if ($('#company_id').data('admin') !== $('#user-name').data('user') ){
                        disabled.push('delete', 'edit', 'send_email');
                    }*/

                    rows.push({
                        attrs: {
                            'data-id': response[i]['id'] || null,
                            'data-action-disabled': JSON.stringify(disabled),
                            'data-action-content-disabled': JSON.stringify(['delete', 'edit']),
                            'class' : response[i]['is_active'] == 'No' ? ' text-red': '',
                        },
                        cells: row
                    })
                }
                return rows;
            },
  /*          onGetData: function (response) {
                for(var i=0; i<response.length; i++){
               response[i].id =  {value : response[i].id, attrs : {class : 'text-right'} };

                }
                return _dataRows(response, columns);
            },*/
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/staff/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/staff/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(removeCheckboxIfAdmin( JSON.parse(JSON.stringify(fields)), row)))
                        });
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/staff/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                }
            ]
        });
    tabsContainer.users = table;
    table.getData();
    return table.renderActions().add(table.render());
}

$(document).on('DOMNodeInserted', 'tbody', function(e) {
    var toggle = $(e.target).find('.toggle-group').prop('checked');
    if(toggle == false){
        $('.grouped-checkbox').attr("disabled", true);
    }
});

$(document).on('change', '.toggle-group', function(){
    var addClass = $(this).prop("checked");
    if(!addClass){
        $('.grouped-checkbox').attr("disabled", true);
        $('.grouped-checkbox').attr("checked", false);
    }else{
        $('.grouped-checkbox').removeAttr("disabled");
    }
});

function removeCheckboxIfAdmin(flds, row){
    if(row.attrs['data-id'] == currentUserId){
        var tmpIndex = false;
        flds.forEach(function(element, index, array){
            if(element['name'] == 'is_admin'){
                tmpIndex = index;
            }
        });
        if(tmpIndex != false){
            flds[tmpIndex].attrs={style: "display:none;"};
            flds[tmpIndex].label ="";
        }
    }
    return flds;
}

function events_callback() {
    var columns = [
             {name: 'date', label: 'Date', order: true, filter: 'date', attrs: {width: 100}},
            {   name: 'type',
                label: 'Type',
                order: true,
                attrs: {width: 90},
                filter: 'select',
                filterData: [{value: "0", label: "All"}, {value: 1, label: "Bad"}, {value: 2, label: "Good"}],
                required: true
            },
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 200}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 240}},
            {name: 'description', label: 'Description', order: true, filter: 'text', attrs: {width: 600}}
        ],
        fields = [
            {name: 'date', label: 'Date', type: 'date', required: true},
            {
                name: 'type',
                label: 'Type',
                type: 'select',
                attrs: {class: "input-100"},
                options: {0: '', 1: 'Bad', 2: 'Good'}
            },  
            {
                name: 'site_id',
                label: 'Site',
                type: 'related',
                url: '/dashboard/site',
                text: 'site',
                placeholder: 'Site',
                children: 'unit_id',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'site_id'}),
                attrs: {class: 'select2 input-140'},
                required: false
            },
            {
                name: 'unit_id',
                label: 'Unit',
                type: 'related',
                url: '/dashboard/unit',
                text: 'unit',
                placeholder: 'Unit',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'unit_id'}),
                attrs: {class: 'select2 input-140'},
                required: false
            },
            {name: 'description', label: 'Description', type: 'text', required: true, attrs: {style: 'width: 600px'}}
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            columns: columns,
            order: '-type',
            selectFirst: true,
            url: '/dashboard/review/',
            onGetData: function (response) {
                return _dataRows(response, columns);
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/review/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/review/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        content.datePickerOptions.showOn = 'focus';
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/review/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                }
            ]
        });
    tabsContainer.users = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function daily_members_callback() {
    var columns = [
            {name: 'date', label: 'Date', order: true, attrs: {width: 100}, filter: 'date', required: true},
            {name: 'site', label: 'Site', order: true, filter: 'text', attrs: {width: 300}},
            {name: 'unit', label: 'Unit', order: true, filter: 'text', attrs: {width: 300}},
            {name: 'employees', label: 'Employees', order: true, filter: 'number', attrs: {width: 100}},
            {name: 'patients', label: 'Patients', order: true, filter: 'number', attrs: {width: 100}}
        ],
        fields = [
            {name: 'date', label: 'Date', type: 'date', required: true},
            {
                name: 'site_id',
                label: 'Site',
                type: 'related',
                url: '/dashboard/site',
                text: 'site',
                placeholder: 'Site',
                children: 'unit_id',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'site_id'}),
                attrs: {class: 'select2 input-140'},
                required: true
            },
            {
                name: 'unit_id',
                label: 'Unit',
                type: 'related',
                url: '/dashboard/unit',
                text: 'unit',
                placeholder: 'Unit',
                related: {},
                results: JSON.stringify({id: 'id', text: 'text', term: 'name', reference: 'unit_id'}),
                attrs: {class: 'select2 input-140'},
                required: false
            },
            {name: 'employees', label: 'Employees', type: 'number', required: false, attrs:{min: 0}},
            {name: 'patients', label: 'Patients', type: 'number', required: false, attrs:{min: 0}}
        ],
        table = new Table({
            attrs: {class: 'auto-width'},
            columns: columns,
            order: 'id',
            selectFirst: true,
            url: '/dashboard/dailymembers/',
            onGetData: function (response) {
                response.forEach(function(element, index, array){
                    var employees = parseInt(element['employees']);
                    var patients = parseInt(element['patients']);
                    array[index]['employees'] = isNaN(employees)|| employees == 0?'':employees;
                    array[index]['patients'] = isNaN(patients)|| patients == 0?'':patients;
                });
                return _dataRows(response, columns);
            },
            actions: [
                {
                    id: 'add',
                    label: 'Add',
                    class: 'btn-success',
                    global: true,
                    callback: function () {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            formData: {
                                name: {label: 'Add', attrs: {class: 'text-success'}},
                                attrs: {action: '/dashboard/dailymembers/', method: 'POST'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        content.datePickerOptions.showOn = 'focus';
                        table.addRowContainer(content.render(), false);
                    }
                },
                {
                    id: 'edit',
                    label: 'Edit',
                    class: 'btn-primary',
                    callback: function (row) {
                        var content = new TableForm({
                            table: table,
                            pinned: false,
                            edit: row.attrs['data-id'],
                            formData: {
                                name: {label: 'Edit'},
                                attrs: {action: '/dashboard/dailymembers/', method: 'PUT'}
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        });
                        content.datePickerOptions.showOn = 'focus';
                        table.addRowContainer(content.render(), true);
                    }
                },
                {
                    id: 'delete',
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: function (row) {
                        new TableForm({
                            table: table,
                            edit: row.attrs['data-id'],
                            formData: {
                                attrs: {action: '/dashboard/dailymembers/', method: 'DELETE'},
                                name: {label: 'Delete'},
                            },
                            fields: JSON.parse(JSON.stringify(fields))
                        }).delData();
                    }
                }
            ]
        });
    tabsContainer.users = table;
    table.getData();
    return table.renderActions().add(table.render());
}

function user_logins() {
    var columns = [
            {name: 'loginTime', label: 'Last login', order: true, filter: 'date', attrs: {width: 125}},
            {name: 'logoutTime', label: 'Logout time', order: true, filter: 'date', attrs: {width: 125,class: 'text-center' }},
            {name: 'duration', label: 'Duration', order: true, attrs: {width: 125,class: 'text-center' }},
            {name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 300}}
        ],
    
        table = new Table({
            attrs: {class: 'auto-width'},
            selectable: false,
            margin: -5,
            order: '-loginTime',
            columns: columns,
            url: '/dashboard/users/login/',
            onGetData: function (response) {
                return _dataLogin(response, columns);
            }
        });
    tabsContainer.user_logins = table;
    table.getData();
    return table.render();
}
// systems->logins
function _dataLogin(response, columns) {
    var rows = [];
    for (var i = 0; i < response.length; i++) {
        var row = [], disabled = [];

        for (var c = 0; c < columns.length; c++) {
            var val = response[i][columns[c]['name']];
            var column = columns[c]['name'];
            var regExp = /^\d{1,2}-\d{1,2}-\d{4}$/;
            
            row.push({
                attrs: {class: val.match(/\d\d:\d\d(:\d\d)?/)!=null  ? 'text-center' : ''},
                value: val
            });
        }

        rows.push({
            attrs: {
                'data-id': response[i]['id'] || null,
                'data-action-disabled': JSON.stringify(disabled),
                'data-action-content-disabled': JSON.stringify(['delete', 'edit'])
            },
            cells: row
        })
    }
    return rows;
}

function _dataRows(response, columns) {
    var rows = [];
    for (var i = 0; i < response.length; i++) {
        var row = [], disabled = [];

        for (var c = 0; c < columns.length; c++) {

             var val,attrs;
             if(typeof response[i][columns[c]['name']] == "object" && response[i][columns[c]['name']] != null){

                     val = response[i][columns[c]['name']].value || '';
                     attrs = response[i][columns[c]['name']].attrs;

             }else{
                 val = response[i][columns[c]['name']] || '';
                 attrs ={};
             }

            val = (val==='0')? '': val;

            var column = columns[c]['name'];
            var regExp = /^\d{1,2}-\d{1,2}-\d{4}$/;
            
            var attrs2 = {class:  ($.isNumeric(val) && $.type(val) == 'number' ? 'text-right' : '')};

            attrs = mergeObjects(attrs, attrs2);

            row.push({
                attrs: attrs,
                value: val
            });
        }
        // code refactoring for onShow Delete button
        if (!(response[i]['department_count'] || response[i]['units_count'])){ disabled.push('departments'); disabled.push('patients_survey_units')}
        if (response[i]['department_count'] || response[i]['workers']) disabled.push('delete');
        if (response[i]['lastLogin'] || response[i]['units_count'] || response[i]['workers_count']) disabled.push('delete');
        if (response[i]['answerDate']) disabled.push('delete');
        if (response[i]['patientsCount'] || response[i]['workersCount']) disabled.push('delete');



        rows.push({
            attrs: {
                'data-id': response[i].id.value || response[i]['id'] || null,
                'data-action-disabled': JSON.stringify(disabled),
                'data-action-content-disabled': JSON.stringify(['delete', 'edit'])
            },
            cells: row
        });

    }
    return rows;
}

function questionsCount(data, container){
    $.get('/dashboard/workers/questions-count',
        {id: data['id'], type: data['type'], questionType: data['questionType']},
        function( response ){
            container.find('strong').data('qty', parseInt(response['total'], 10)).html('('+ response['total'] + ' questions)');
        });
}

function populateBICharts(data){
    $('#preloader').show();
    $.each(data, function(i, chart){
        var chart_type  = $('[name="toggle_graph"]:checked').val(),
            ajax_url    = chart['ajax']['url'][ chart_type ];

        chart['data']['bySites'] = $('[name="toggle_graph"]:checked').attr('data-filter') == 'subjects' ?  0 : 1;

        if(chart['ajax']['status']){
            chart['ajax']['status'].abort();
        }
        chart['ajax']['status'] = $.post(ajax_url, chart['data'], function (data) {
            if (chart_type == 'bar') {
                var columns = [['Subjects']];
                    columns.push(data['key']);
                for (var i in data['data']) {
                    columns[0].push(data['data'][i].Subjects);
                    columns[1].push( data['data'][i][data['key'][0]] ? data['data'][i][data['key'][0]] : 0 ) ;
                }
                chart['graphs']['bar'].load({
                    columns: columns,
                    unload: ['Patients', 'Care team'],
                    keys: {value: data['key']},
                    colors:({
                        'Patients': '#1F77B4',
                        'Care team': '#FF7F0E'
                    }),
                    done: function () {
                        if( $('[data-chart="line"]:visible').length ){
                            $('[data-chart]').hide();
                        }
                        $('[data-chart="bar"]').show();
                        $('#preloader').hide();
                    }
                });
            } else {
                chart['graphs']['line'].load({
                        json: data['data'],
                        unload: ['Patients', 'Care team'],
                        keys: {value: data['key']},
                        categories: data['categories'],
                        types: {'Patients': 'area', 'Care team': 'area'},
                        type: 'line',
                        colors:({
                            'Patients': '#1F77B4',
                            'Care team': '#FF7F0E'
                        }),
                        axes: {x: {label: {text: "Hours"}}},
                        done: function () {
                            if( $('[data-chart="bar"]:visible').length ){
                                $('[data-chart]').hide();
                            }
                            $('[data-chart="line"]').show();
                            $('#preloader').hide();
                        }
                    });
            }

            // show roles if employees data
            // need to update
            $.inArray('Care team', data['key']) == -1 ? chart['filters']['boxes'].closest('[data-box]').slideUp('slow') : chart['filters']['boxes'].closest('[data-box]').slideDown('slow');
            chart['ajax']['status'] = null;
        });
    });
}

function mergeObjects(obj1, obj2){
    for (var key in obj2) {
        if(typeof obj1[key] == typeof obj2[key] && typeof obj1[key] == "object"){
            obj1[key] = mergeObjects(obj1[key], obj2[key]);
        } else
        if (obj1.hasOwnProperty(key)){
            // number
            if ($.isNumeric(obj1[key]) && $.isNumeric(obj2[key])){
                obj1[key] = obj1[key] + obj2[key];
            }else{
                obj1[key] = obj1[key] +" "+ obj2[key];
            }
        }else{
            obj1[key] = obj2[key];
        }
    }

    return obj1;
}

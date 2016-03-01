//menu tab "router"
var menuAction = {
        bi_online: {
            id: 'bi_online',
            label: 'Today activity',
            color: '#ef5350',
            callback:  bi_online
        },
		customers: {
			id: 'customers',
			label: 'Customers',
			color: '#42a5f5',
			callback: customers
		},
		control_screen: {
			id: 'control_screen',
			label: 'Control screen',
			color: '#42a5f5',
			callback: control_screen
		},
		subjects: {
			id: 'subjects',
			label: 'Subjects',
			color: '#fad53e',
			callback: subjects
		},
		reasons: {
			id: 'reasons',
			label: 'Reasons',
			color: '#fad53e',
			callback: reasons
		},
		unit_types: {
			id: 'unit_types',
			label: 'Unit types',
			color: '#42a5f5',
			callback: unit_types
		},
		unit_type_procedures: {
			id: 'unit_type_procedures',
			label: 'Unit type procedures',
			color: '#42a5f5',
			callback: unit_type_procedures
		},
		question_list_patients: {
			id: 'question_list_patients',
			label: 'Questions to patients',
			color: '#ab47bc',
			callback: question_list_patients
		},
		question_list_workers: {
			id: 'question_list_workers',
			label: 'Questions to care team',
			color: '#ab47bc',
			callback: question_list_workers
		},
		answer_types: {
			id: 'answer_types',
			label: 'Answer types',
			color: '#66bb6a',
			callback: answer_types
		},
		worker_types: {
			id: 'worker_types',
			label: 'Care team types',
			color: '#42a5f5',
			callback: worker_types
		},
		roles: {
			id: 'roles',
			label: 'Roles',
			color: '#ffa726',
			callback: roles
		},
		users: {
			id: 'users',
			label: 'Users',
			color: '#ef5350',
			callback: users
		},
		login_logs: {
			id: 'login_logs',
			label: 'Users logins',
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
Table.default.defaultAction = 'edit';
Table.default.selectFirst = true;
Table.default.margin = -49;
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
    var columns = [
            [
                {label: '', attrs: {colspan: 2}},
                {label: 'Answers', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}},
                {label: 'Compare Last Week', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}}
            ],[
                {name: 'id', label: 'Code', order: true, filter: "text", attrs: {width: 60}},
                {name: 'name', label: 'Customer name', order: true, filter: "text", attrs: {width: 600}},
                {name: 'patient_count', label: 'Patients', order: true, filter: "number", attrs: {width: 80}},
                {name: 'worker_count', label: 'Workers', order: true, filter: "number", attrs: {width: 80}},
                {name: 'patient_count_lastweek', label: 'Patients', order: true, filter: "text", attrs: {width: 80}},
                {name: 'worker_count_lastweek', label: 'Workers', order: true, filter: "text", attrs: {width: 80}}
            ]
        ],
        table = new Table({
            attrs: { class: 'auto-width'},
            selectFirst: false,
            order: 'id',
            columns: columns,
            selectable: false,
            margin: -5,
            url: '/backoffice/bi/online',
            onGetData: function (response, table) {
                return _dataRows(response, columns[1]);
            }
        });
    tabsContainer.bi_online = table;
    table.getData();
	var container = "<div class='chart-row backoffice-chart row'>" +
                        "<h2>Today activity</h2>" +
                        "<div class='col-lg-9 col-md-8 col-sm-8'>" +
                            "<div class='vertical-box box pull-right no-background-box'>" +
                            "<div class='drop-box box-filters'>" +
                            "<div class='box-header'>" +
                            "<input type='checkbox' id='all_customers' checked='checked' data-filter='all' value='companies' class='filter-all hidden'>" +
                            "<label for='all_customers'>Customers</label>" +
                            "</div>" +
                            "<div id='customers_container' class='bi-container'>" +
                            "<ul id='customers_list' class='bi-list'></ul>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div id='graph_answers_by_customer' class=''></div>" +
                        "</div>";
                    "</div>";

    content.html(table.render()).find('.table').first().before(container);

	var today_answers = c3.generate({
			bindto: '#graph_answers_by_customer',
			data: {columns: []},
			axis: {     y: {label: { text: "Answers", position: 'outer-middle'}, min: 0, padding: {bottom: 25, top: 25}},
                        x: {label: { text: "Hours"}, padding: {left: 0, right: 0}, min: 0, tick: {centered: false},
                            type: 'category',
                            categories: []}
                    }
		}),

        bi = {
            customers: $('#customers_list')
        },
        charts = [{
            chart: today_answers, // generated chart
            filters: {
                boxes:      $('.box-filters .bi-container'),
                customers:  $('#customers_list'),
                all:        $('input[type=checkbox].filter-all'),
            },
            ajax: {
                url: "/backoffice/dashboard/bi/answers/per-day",
                status: null
            },
            data: {
                companies: [],
                all:   1
            }
        }];

    // generate list options
    generateBiList(
        [{
            prefix: 'client',
            container : bi['customers']
        }],
        "/backoffice/bi/customer?show=active");

    // generate charts
    populateBICharts(charts);

    //  register events
    $.each(charts, function(i, chart){
        var
            boxFilters      = chart['filters']['boxes'],
            filterByAll     = chart['filters']['all'],
            data            = chart['data']; // ajax params


        // filter data by box filters
        boxFilters.on('click', 'input', function (evt) {
            var checkbox        = $(evt.target),
                checkAll        = checkbox.closest('.box-filters').find('[data-filter]'),
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
            if( !boxFilters.find('input[type="checkbox"]:not(:checked)').length ) checkAll.prop('checked', true);

            populateBICharts([chart]);
        });

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
        $('#customers_list').parent().getNiceScroll().resize();
    });



}
// generate filters lists
function generateBiList(fields, url) {
    $.getJSON(url, function (data) {
        if (data) {
            $.each(fields, function (i, field) {
                $.each(data, function (i, obj) {
                    var checkbox = $('<input />', {
                        id: field['prefix'] + '_id_' + obj['id'],
                        'data-id': obj['id'],
                        checked: 'checked',
                        type: 'checkbox',
                        class: 'hidden'
                    });
                    var span = $('<label />', {text: obj['text'], for: field['prefix'] + '_id_' + obj['id']});
                    var li = $('<li />');
                    if(obj.id == 0) {li.addClass('hidden');}
                    field['container'].append(li.append(checkbox).append(span));
                });
            });
            //init nicescroll
            $('#customers_list').parent().niceScroll({cursorwidth : '3px', cursorborder: '0', autohidemode: false, railalign: 'left'});
            $('.table-data').parent().niceScroll({cursorwidth : '3px', cursorborder: '0', autohidemode: false});
        }
    });
}

function customers() {
	var columns = [
			{name: 'id', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 350}},
			{name: 'contactName', label: 'Contact', order: true, filter: 'text', attrs: {width: 200}},
			{name: 'staff_count', label: 'Users', order: true, filter: 'comparison', attrs: {width: 90}},
			{name: 'organizations_count', label: 'Sites', order: true, filter: 'comparison', attrs: {width: 90}},
			{name: 'workers_count', label: 'Care team', order: true, filter: 'comparison', attrs: {width: 90}},
			{name: 'createDate', label: 'Create date', order: true, filter: 'date', attrs: {width: 107}},
			//{name: 'deleteDate', label: 'Stop date', order: true, filter: 'date', attrs: {width: 107}}
			{name: 'active', label: 'Active', order: true, filter: 'select', filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}], filterValue: "1", attrs: {width: 107}}
		],
		fields = [
			{name: 'name', label: 'Name', type: 'text', required: true, length: 100, attrs: {class: "input-300"}},
			{name: 'address', label: 'Address', type: 'text', required: true, length: 100, attrs: {class: "input-300"}},
			{name: 'email', label: 'Email', type: 'text', required: true, length: 100, attrs: {class: "input-300"}},
			{name: 'contactName', label: 'Contact name', type: 'text', required: true, length: 20, attrs: {class: "input-300"}},
			{name: 'password', label: 'Password', type: 'password', required: true, attrs: {class: "input-140"}},
			[
				{name: 'areacode', label: 'Phone', type: 'text', required: true, length: 4, attrs: {class: "input-50"}},
				{name: 'phone', label: '-', type: 'text', required: false, length: 28, attrs: {class: "input-140"}}
			],
			[
				{name: 'workersQuestionSource', label: {text: 'Question source Care team', class: "width-auto"}, type: 'select', attrs: {class: "input-140"}, options: {0: "By site", 1: "By unit type"}},
				{name: 'patientsQuestionSource', label: 'Patients', type: 'select', attrs: {class: "input-140"}, options: {0: "By site", 1: "By unit type"}},
				{name: 'workersContact', label: 'Contact Care team', type: 'select', attrs: {class: "input-100"}, options: {0: "By mail", 1: "By SMS"}}
			],
			{name: 'stopDate', label: 'Stop date', type: 'date'}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			columns: columns,
			order: 'id',
			url: '/backoffice/dashboard/customer/',
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
								name: {label: 'Add'},
								attrs: {action: '/backoffice/dashboard/customer/', method: 'POST', class: 'label-107'}
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
								attrs: {action: '/backoffice/dashboard/customer/', method: 'PUT', class: 'label-107'}
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
								attrs: {action: '/backoffice/dashboard/customer/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.customers = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function control_screen() {
	var columns = [
				[
					{label: '', attrs: {colspan: 2}},
					{label: 'Last question', attrs: {colspan: 1, class: 'text-center', 'data-border': '', width: 150}},
					{label: 'Last answer', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}}
				],
				[
					{name: 'name', label: 'Customer', order: true, filter: 'text', attrs: {width: 220}},
					{name: 'website', label: 'Site', order: true, filter: 'text', attrs: {width: 220}},
					{name: 'lastQuestionDate', label: 'Employers', order: true, filter: 'date', attrs: {width: 150}},
					{name: 'lastWorkerAnswer', label: 'Employers', order: true, filter: 'date', attrs: {width: 120}},
					{name: 'lastPatientAnswer', label: 'Patients', order: true, filter: 'date', attrs: {width: 120}}
				],

		],
		table = new Table({
			attrs: {class: 'auto-width'},
			columns: columns,
			order: 'id',
			url: '/backoffice/controlscreen/',
			onGetData: function (response) {
				return _dataRows(response, columns[1]);
			}
		});
	tabsContainer.customers = table;
	table.getData();
	var tableRender = table.renderActions().add(table.render());
	 $(tableRender[0]).css('display','none');

	return tableRender;
}

function subjects() {
	var columns = [
			[
				{label: '', attrs: {colspan: 3}},
				{label: 'Questions', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}}
			],
			[
				{name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 60}},
				{name: 'name', label: 'Description', order: true, filter: 'text', attrs: {width: 200}},
				{name: 'category', label: 'Category', order: true, filter: 'number', attrs: {width: 215}},
				{name: 'patients_qty', label: 'Patients', order: true, filter: 'comparison', attrs: {width: 50}},
				{name: 'workers_qty', label: 'Care team', order: true, filter: 'comparison', attrs: {width: 50}}
			]
		],
		fields = [
			{name: 'code', label: 'Code', type: 'digits', required: true, attrs: {style: 'width: 90px'}},
			{name: 'name', label: 'Description', type: 'text', required: true, attrs: {style: 'width: 380px;'}},
            {
                name: 'category_id',
                label: 'Category',
                type: 'related',
                url: '/backoffice/categories/',
                text: 'category_name',
                placeholder: 'Category',
                order: 'name',
                results: JSON.stringify({id: 'id', text: 'name', term: 'categoryname'}),
                required: true,
                attrs: {style: 'width: 380px;', 'data-field': 'select-field'}
            }
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			order: 'code',
			columns: columns,
			url: '/subjects/',
			onGetData: function (response) {
				return _dataRows(response, columns[1]);
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
							edit: ['code'],
							formData: {
								name: {label: 'Add'},
								attrs: {action: '/subjects/', method: 'POST'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
                                var elms = form.form.find('.field');

                                $.each(elms, function(i, container) {
                                    var isFieldValue = $(container).find('[type="text"]').val() ? true : false;
                                    var isNextField = $(container).next().find('[type="text"]').length ? $(container).next().find('[type="text"]') : false;
									var isSelectField  = $(container).next().next().find('[type="text"]').length ? $(container).next().next().find('[type="text"]') : false;

                                    if (isFieldValue && isNextField && isSelectField) {
                                        isNextField.focus().trigger('click');
                                        return true;

                                    }


                                });

								form.formData.attrs.action = '/subjects/';
							}
						});
						console.log(content.fields);
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
								attrs: {action: '/subjects/', method: 'PUT'}
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
								attrs: {action: '/subjects/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	
	table.render();
	table.head.find("[name='category']").select2({
		allowClear: true,
        placeholder: 'Select category',
		query: function (queryObj) {
			$.getJSON("/backoffice/categories/", {start: 0, length: 50, select: true, ordering: 'name', categoryname: queryObj.term, text: queryObj.term}, function (result) {
				var data = {more: false, results: []};
				$.each(result, function (index, value) {
					data.results.push({id: value['id'].toString(), text: value['name'].toString()})
				});
				queryObj.callback(data);
			});
		}
	}).on('change', function (e) {
		$(e.target).trigger('keyup');
	});




	tabsContainer.subjects = table;
	table.getData();
	return table.renderActions().add(table.table);
}

function reasons() {
	var columns = [
            {name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 60}},
            {name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 600}}
		],
		fields = [
			{name: 'code', label: 'Code', type: 'digits', required: true, attrs: {style: 'width: 90px'}},
			{name: 'name', label: 'Name', type: 'text', required: true, attrs: {style: 'width: 380px;'}},
            {name: 'active', label: 'Active', type: 'checkbox', value: true}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			order: 'code',
			columns: columns,
			url: '/backoffice/reasons/',
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
							edit: ['code'],
							formData: {
								name: {label: 'Add'},
								attrs: {action: '/backoffice/reasons/', method: 'POST'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
								form.formData.attrs.action = '/backoffice/reasons/';
								form.form.find('[name="name"]').focus().trigger('click');
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
								attrs: {action: '/backoffice/reasons/', method: 'PUT'}
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
								attrs: {action: '/backoffice/reasons/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.reasons = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function unit_types() {
	var columns = [
			{name: 'id', label: 'Code', order: true, filter: 'number', attrs: {'width': 90}},
			{name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 400}},
			{name: 'events_count', label: 'Procedures', order: true, filter: 'number', attrs: {width: 105}},
			{name: 'workers_count', label: 'Care team', order: true, filter: 'number', attrs: {width: 90}}
		],
		fields = [
			{name: 'name', label: 'Name', type: 'text', required: true, attrs: {style: 'width: 380px;'}}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			order: 'id',
			columns: columns,
			url: '/unit/type/',
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
								name: {label: 'Add'},
								attrs: {action: '/unit/type/', method: 'POST'}
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
								attrs: {action: '/unit/type/', method: 'PUT'}
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
								attrs: {action: '/unit/type/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				},
				{
					id: 'procedures',
					label: 'Procedures',
					class: 'btn-info',
					callback: function (row) {
						$("#menu").find("a[href='#unit_type_procedures']").trigger('click');
						tabsContainer.procedures.head.find('.select2-container').select2('data', {id: row['cells'][0]['value'], text: row['cells'][1]['value']});
						tabsContainer.procedures.head.find("[name='type']").trigger('keyup');
					}
				}
			]
		});
	tabsContainer.unit_types = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function unit_type_procedures() {
	var columns = [
			{name: 'type', label: 'Unit type', order: true, filter: 'number', attrs: {width: 360}},
			{name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 420}}
		],
		fields = [
			{
				name: 'department_type_id',
				label: 'Unit type',
				type: 'related',
				url: '/unit/type/',
				order: 'id',
				text: 'department',
				attrs: {style: 'width: 340px;'},
				placeholder: 'Unit type',
				results: JSON.stringify({id: 'id', text: 'name', term: 'name'}),
				required: true
			},
			{name: 'name', label: 'Name', type: 'text', required: true, length: 40, attrs: {style: 'width: 340px;'}}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			selectFirst: true,
			columns: columns,
			order: 'id',
			url: '/unit/type/event/',
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
								name: {label: 'Add'},
								attrs: {action: '/unit/type/event/', method: 'POST'}
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
								attrs: {action: '/unit/type/event/', method: 'PUT'}
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
								attrs: {action: '/unit/type/event/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	table.render();
	table.head.find("[name='type']").select2({
		allowClear: true,
        placeholder: "Select unit type",
		query: function (queryObj) {
			$.getJSON("/unit/type/", {start: 0, length: 50, select: true, ordering: 'id', name: queryObj.term, text: queryObj.term}, function (result) {
				var data = {more: false, results: []};
				$.each(result, function (index, value) {
					data.results.push({id: value['id'].toString(), text: value['name'].toString()})
				});
				queryObj.callback(data);
			});
		}
	}).on('change', function (e) {
		$(e.target).trigger('keyup');
	});
	tabsContainer.procedures = table;
	table.getData();
	return table.renderActions().add(table.table);
}

function question_list_patients() {
	var columns = [
			{name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 240}},
			{name: 'question', label: 'Description', order: true, filter: 'text', attrs: {width: 420}},
			{name: 'answer_code', label: 'Answer type', order: true, filter: 'text', attrs: {width: 120}},
			{name: 'forAll',
                label: 'For all',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 70}},
            {name: 'answers', label: 'Answers', order: true, filter: 'text', attrs: {width: 90}},
            {name: 'archived',
                label: 'Archived',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 90}}
        ],
		fields = [
			{name: 'code', label: 'Code', type: 'digits', required: true, attrs: {style: 'width: 80px;'}},
			{
				name: 'subject__id',
				label: 'Subject',
				type: 'related',
				url: '/subject',
				order: 'id',
				text: 'subject',
				placeholder: 'Subjects',
				results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
				attrs: {style: 'width: 500px;'},
				required: true
			},
			{name: 'question', label: 'Description', type: 'textarea', required: true, attrs: {style: 'width:500px;'}},
			{name: 'spanish', label: 'Spanish', type: 'textarea', attrs: {style: 'width:500px;'}},
			{
				name: 'answer_code',
				label: 'Answer type',
				type: 'related',
				url: '/answertype/',
				order: 'id',
				text: 'answer',
				placeholder: 'Answer type',
				results: JSON.stringify({id: 'id', text: 'code', term: 'name'}),
				attrs: {style: 'width: 500px;'},
				required: true
			},
            {
                name: 'workersRelated1',
                label: 'Related',
                type: 'related',
                url: '/workers/',
                order: 'id',
                text: 'workersRelatedQuestion1',
                placeholder: '1. Care team related question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 440px;'},
                required: false
            },
            {
                name: 'workersRelated2',
                label: 'Related',
                type: 'related',
                url: '/workers/',
                order: 'id',
                text: 'workersRelatedQuestion2',
                placeholder: '2. Care team related question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 440px;'},
                required: false
            },
            {
                name: 'workersRelated3',
                label: 'Related',
                type: 'related',
                url: '/workers/',
                order: 'id',
                text: 'workersRelatedQuestion3',
                placeholder: '3. Care team related question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 440px;'},
                required: false
            },
			{name: 'forAll', label: 'For all', type: 'checkbox'},
            {name: 'archived', label: 'Archived', order: true, type: 'checkbox' }
		],
		table = new Table({
			attrs: {class: 'auto-width top-align'},
			columns: columns,
			order: 'code',
			url: '/patients/',
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
							edit: ['code'],
							formData: {
								name: {label: 'Add'},
								attrs: {action: '/patients/', method: 'POST'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
								form.form.find('[name="answer_code"]').data('format', function (element) {
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

								form.formData.attrs.action = '/patients/';
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
								attrs: {action: '/patients/', method: 'PUT'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
								form.form.find('[name="answer_code"]').data('format', function (element) {
									for (key in element) {
										if (key !== 'id') {
											element['code'] += (key != 'code') ? element[key] + ' / ' : '' ;
										} else {
                                            element['code'] += ' - ';
                                        }
									}
									return element;
								});
							}
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
								attrs: {action: '/patients/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.patients = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function question_list_workers() {
	var columns = [
			{name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'subject', label: 'Subject', order: true, filter: 'text', attrs: {width: 240}},
			{name: 'question', label: 'Description', order: true, filter: 'text', attrs: {width: 420}},
			{name: 'answer_code', label: 'Answer type', order: true, filter: 'text', attrs: {width: 120}},
            {name: 'forAll',
                label: 'For all',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 70}},
            {name: 'answers', label: 'Answers', order: true, filter: 'text', attrs: {width: 90}},
            {name: 'archived',
                label: 'Archived',
                order: true,
                filter: 'select',
                filterData: [{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}],
                attrs: {width: 90}}
		],
		fields = [
			{name: 'code', label: 'Code', type: 'digits', required: true, attrs: {style: 'width: 90px;'}},
			{
				name: 'subject__id',
				label: 'Subject',
				type: 'related',
				url: '/subject',
				order: 'id',
				attrs: {style: 'width: 440px;'},
				text: 'subject',
				placeholder: 'Subjects',
				results: JSON.stringify({id: 'id', text: 'text', term: 'name'}),
				required: true
			},
			{name: 'question', label: 'Description', type: 'textarea', required: true, attrs: {style: 'width: 440px;'}},
			{name: 'spanish', label: 'Spanish', type: 'textarea', attrs: {style: 'width:440px;'}},
			{
				name: 'answer_code',
				label: 'Answer type',
				type: 'related',
				url: '/answertype/',
				order: 'id',
				text: 'answer',
				placeholder: 'Answer type',
				results: JSON.stringify({id: 'id', text: 'code', term: 'name'}),
				attrs: {style: 'width: 440px;'},
				required: true
			},
            {
                name: 'patientsRelated1',
                label: 'Patients related',
                type: 'related',
                url: '/patients/',
                order: 'id',
                text: 'patientsRelatedQuestion1',
                placeholder: '1. Patients related question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 440px;'},
                required: false
            },
            {
                name: 'patientsRelated2',
                label: 'Patients related',
                type: 'related',
                url: '/patients/',
                order: 'id',
                text: 'patientsRelatedQuestion2',
                placeholder: '2. Patients related question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 440px;'},
                required: false
            },
            {
                name: 'patientsRelated3',
                label: 'Patients related',
                type: 'related',
                url: '/patients/',
                order: 'id',
                text: 'patientsRelatedQuestion3',
                placeholder: '3. Patients related question',
                results: JSON.stringify({id: 'id', text: 'question', term: 'name'}),
                attrs: {style: 'width: 440px;'},
                required: false
            },
			{name: 'forAll', label: 'For all', type: 'checkbox'},
            {name: 'archived', label: 'Archived', order: true, type: 'checkbox' }
		],
		table = new Table({
			attrs: {class: 'auto-width top-align'},
			order: 'code',
			columns: columns,
			url: '/workers/',
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
							edit: ['code'],
							formData: {
								name: {label: 'Add'},
								attrs: {action: '/workers/', method: 'POST'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
								form.form.find('[name="answer_code"]').data('format', function (element) {
									for (key in element) {
										if (key != 'id') {
											element['code'] += (key != 'code') ? element[key] + ' / ' : '';
										} else {
                                            element['code'] += ' - ';
                                        }
									}
									element['code'] = element['code'].substr(0, element['code'].length - 3);
									return element;
								});
								form.formData.attrs.action = '/workers/';
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
								attrs: {action: '/workers/', method: 'PUT'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
								form.form.find('[name="answer_code"]').data('format', function (element) {
									for (key in element) {
										if (key !== 'id') {
											element['code'] += (key != 'code') ? element[key] + ' / ' : '';
										} else {
                                            element['code'] += ' - ';
                                        }
									}
									return element;
								});
							}
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
								attrs: {action: '/workers/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.workers = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function answer_types() {
	var columns = [
				[
					{label: '', attrs: {colspan: 6}},
					{label: 'Questions', attrs: {colspan: 2, class: 'text-center', 'data-border': ''}}
				],
			[
				{name: 'code', label: 'Code', order: true, filter: 'text', attrs: {width: 80}},
				{name: 'answer1', label: 'Answer 1', order: true, filter: 'text', attrs: {width: 200}},
				{name: 'answer2', label: 'Answer 2', order: true, filter: 'text', attrs: {width: 200}},
				{name: 'answer3', label: 'Answer 3', order: true, filter: 'text', attrs: {width: 200}},
				{name: 'answer4', label: 'Answer 4', order: true, filter: 'text', attrs: {width: 200}},
				{name: 'answer5', label: 'Answer 5', order: true, filter: 'text', attrs: {width: 200}},
				{name: 'workers', label: 'Care team', order: true, filter: 'comparison', attrs: {width: 90}},
				{name: 'patients', label: 'Patients', order: true, filter: 'comparison', attrs: {width: 90}}
			],

		],
		fields = [
			{name: 'code', label: 'Code', required: true, attrs: {style: 'width: 70px;'}},
			[
				{name: 'answer_1', label: 'Answer 1', type: 'text', required: true, attrs: {style: 'width: 170px;'}},
				{name: 'spanish_answer_1', label: 'Spanish', type: 'text', attrs: {style: 'width: 170px;'}}
			], [
				{name: 'answer_2', label: 'Answer 2', type: 'text', required: true, attrs: {style: 'width: 170px;'}},
				{name: 'spanish_answer_2', label: 'Spanish', type: 'text', attrs: {style: 'width: 170px;'}}
			], [
				{name: 'answer_3', label: 'Answer 3', type: 'text', required: true, attrs: {style: 'width: 170px;'}},
				{name: 'spanish_answer_3', label: 'Spanish', type: 'text', attrs: {style: 'width: 170px;'}}
			], [
				{name: 'answer_4', label: 'Answer 4', type: 'text', required: true, attrs: {style: 'width: 170px;'}},
				{name: 'spanish_answer_4', label: 'Spanish', type: 'text', attrs: {style: 'width: 170px;'}}
			], [
				{name: 'answer_5', label: 'Answer 5', type: 'text', required: true, attrs: {style: 'width: 170px;'}},
				{name: 'spanish_answer_5', label: 'Spanish', type: 'text', attrs: {style: 'width: 170px;'}}
			]
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			columns: columns,
			order: 'code',
			url: '/answertype/',
			onGetData: function (response) {
				var rows = [];
				for (var i = 0; i < response.length; i++) {
					var row = response[i];
					row.workers = parseInt(row.workers);
					row.patients = parseInt(row.patients);
					rows.push({
						attrs: {
							'data-id': row.id,
							'data-action-disabled': JSON.stringify(row.workers || row.patients ? ['delete'] : [])
						},
						cells: [
							row.code,
							row.answer1,
							row.answer2,
							row.answer3,
							row.answer4,
							row.answer5,
							{attrs: {class: 'text-right'}, value: row.workers ? row.workers : ''},
							{attrs: {class: 'text-right'}, value: row.patients ? row.patients : ''}
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
								name: {label: 'Add'},
								attrs: {action: '/answertype/'}
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
								attrs: {action: '/answertype/'}
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
								attrs: {action: '/answertype/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.answer_types = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function worker_types() {
	var columns = [
			{name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 270}}
		],
		fields = [
			{name: 'code', label: 'Code', type: 'digits', required: true, attrs: {'style': 'width: 80px;'}},
			{name: 'name', label: 'Name', type: 'text', required: true, attrs: {'style': 'width: 200px;'}}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			order: '-code',
			columns: columns,
			url: '/backoffice/worker/type/',
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
								name: {label: 'Add'},
								attrs: {action: '/backoffice/worker/type/', method: 'POST'}
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
								attrs: {action: '/backoffice/worker/type/', method: 'PUT'}
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
								attrs: {action: '/backoffice/worker/type/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.worker_types = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function roles() {
	var columns = [
			{name: 'code', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'name', label: 'Description', order: true, filter: 'text', attrs: {width: 270}},
			{name: 'workers_count', label: 'Care team', order: true, filter: 'number', attrs: {width: 90}}
		],
		fields = [
			{name: 'code', label: 'Code', type: 'digits', required: true, attrs: {'style': 'width: 80px;'}},
			{name: 'name', label: 'Description', type: 'text', required: true, attrs: {'style': 'width: 240px;'}}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			order: '-code',
			columns: columns,
			url: '/roles/',
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
							edit: ['code'],
							formData: {
								name: {label: 'Add'},
								attrs: {action: '/roles/', method: 'POST'}
							},
							fields: JSON.parse(JSON.stringify(fields)),
							after: function (form) {
                                var elms = form.form.find('.field');

                                $.each(elms, function(i, container){
                                    var isFieldValue    = $(container).find('[type="text"]').val() ? true : false;
                                    var isNextField     = $(container).next().find('[type="text"]').length ? $(container).next().find('[type="text"]') : false;
                                    if ( isFieldValue && isNextField ) {
                                        isNextField.focus().trigger('click');
                                        return true;
                                    }
                                });

								form.formData.attrs.action = '/roles/';
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
								attrs: {action: '/roles/', method: 'PUT'}
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
								attrs: {action: '/roles/', method: 'DELETE'},
								name: {label: 'Delete'},
							},
							fields: JSON.parse(JSON.stringify(fields))
						}).delData();
					}
				}
			]
		});
	tabsContainer.roles = table;
	table.getData();
	return table.renderActions().add(table.render());
}

function users() {
	var columns = [
			{name: 'id', label: 'Code', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 200}},
			{
				name: 'userType', label: 'Type', order: true, filter: 'select', filterData: [
				{value: 0, label: "All"}, {value: 1, label: "Master"}, {value: 2, label: "Regular"}
			], attrs: {width: 100}
			},
			{name: 'loginTime', label: 'Last login', order: true, filter: 'date', attrs: {width: 107}},
			{
				name: 'isActive', label: 'Active', order: true, filter: 'select',
				filterData: [
					{value: "-1", label: "All"}, {value: "1", label: "Yes"}, {value: "0", label: "No"}
				],
                filterValue: 1,
				attrs: {width: 70}
			},
			{name: 'creationDate', label: 'Created', order: true, filter: 'date', attrs: {width: 107}},
			{name: 'createdBy', label: 'Created by', order: true, filter: 'text', attrs: {width: 130}},
			{name: 'stopDate', label: 'Blocked', order: true, filter: 'date', attrs: {width: 107}}
		],
		fields = [
			{name: 'name', label: 'Name', type: 'text', required: true, attrs: {style: 'width: 240px;'}},
			{
				name: 'userType',
				label: 'User type',
				type: 'related',
				url: '/backoffice/dashboard/user/types/',
				order: 'id',
				text: 'role',
				placeholder: 'User type',
				results: JSON.stringify({id: 'id', text: 'role', term: 'role'}),
				required: true
			},
			{name: 'email', label: 'Email', type: 'text', required: true, attrs: {style: 'width: 240px;'}},
            {name: 'password', label: 'Password', type: 'password', required: true, attrs: {class: "input-140"}},
			{name: 'isActive', label: 'Is active', type: 'checkbox', value: true}
		],
		table = new Table({
			attrs: {class: 'auto-width table-system'},
			columns: columns,
			order: 'id',
            filter: {
                isActive: '1'
            },
			url: '/backoffice/dashboard/user',
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
								name: {label: 'Add'},
								attrs: {action: '/backoffice/dashboard/user/', method: 'POST'}
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
								attrs: {action: '/backoffice/dashboard/user/', method: 'PUT'}
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
								attrs: {action: '/backoffice/dashboard/user/', method: 'DELETE'},
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
			{name: 'id', label: '#', order: true, filter: 'number', attrs: {width: 90}},
			{name: 'name', label: 'Name', order: true, filter: 'text', attrs: {width: 200}},
			{name: 'loginTime', label: 'Login time', order: true, filter: 'date', attrs: {width: 125}},
			{name: 'logoutTime', label: 'Logout time', order: true, filter: 'date', attrs: {width: 135}}
		],
		table = new Table({
			attrs: {class: 'auto-width'},
			order: '-loginTime',
			selectable: false,
			margin: -5,
			columns: columns,
			url: '/backoffice/users/login',
			onGetData: function (response) {
				return _dataRows(response, columns);
			}
		});
	tabsContainer.user_logins = table;
	table.getData();
	return table.render();
}

function _dataRows(response, columns) {
	var rows = [];
	for (var i = 0; i < response.length; i++) {
		var row = [], disabled = [];
		for (var c = 0; c < columns.length; c++) {

            var val = response[i][columns[c]['name']] == 0 && ( columns[c]['name'] == 'patient_count' || columns[c]['name'] == 'worker_count') ? '' : response[i][columns[c]['name']];
            var result_val = val;
            var red_text = false;
            var result_class = [];

            if(columns[c]['name'] == 'patient_count_lastweek' || columns[c]['name'] == 'worker_count_lastweek'){
            	result_val = parseFloat(result_val.replace('%', ''));
            	red_text = result_val < 0;
            }

            result_class.push($.isNumeric(result_val) && $.type(result_val) == 'number' ? 'text-right' : '');
            result_class.push(red_text ? 'text-red' : '');

			var regExp = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
			row.push({
				attrs: {class: result_class.join(' ')},
				value: val
			});
		}
		if (response[i]['users'] || response[i]['clinics']) disabled.push('delete');
		if (response[i]['staff_count'] || response[i]['organizations_count'] || response[i]['workers_count']) disabled.push('delete');
		if (response[i]['events_qty']) disabled.push('delete');
		response[i]['events_count'] ? disabled.push('delete') : disabled.push('procedures');
		if (response[i]['department_count']) disabled.push('delete');
		if (response[i]['workers_count']) disabled.push('delete');
		if (response[i]['patients_qty'] || response[i]['workers_qty']) disabled.push('delete');
		if (response[i]['loginTime'] || response[i]['loginTime']) disabled.push('delete');
		if (response[i]['answers']) disabled.push('delete');
		rows.push({
			attrs: {'class': response[i]['class'] || null, 'data-id': response[i]['id'] || null, 'data-action-disabled': JSON.stringify(disabled), 'data-action-content-disabled': JSON.stringify(['delete', 'edit'])},
			cells: row
		})
	}

	return rows;
}

function pwdToggle(tableForm) {
	var $pwd = tableForm.form.find(':password');
	var val = $pwd.val();
	$pwd.removeAttr('value').val(val);
	$pwd.parent().children('.show_password').click(function () {
		if ($(this).is(':checked')) {
			$pwd.attr('type', 'password');
		} else {
			$pwd.attr('type', 'text');
		}
	})
}

// select2 dropbox populating "BI/Online"
function populateBISelect($input, url, postfix) {
    return
	url = postfix ? url + "/" + postfix : url;

	$input.select2({placeholder: "All", data: []});

	$.getJSON(url, function(data) {
		if(data){
            data.splice(0, 0, {id: 0, 'text': 'All'});
            $input.removeAttr('disabled').css({'display': 'inline-block'}).select2({data: data});
            $input.select2('val', 0);
		}
	});
}

/*
 * @param array[]
 *
 */
function populateBICharts(charts){
    $.each(charts, function(i, chart){
        var url = chart['ajax']['url'];

        // cancel prev ajax
        if(chart['ajax']['status']){
            chart['ajax']['status'].abort();
        }
        // ajax query
        chart['ajax']['status'] =  $.post(url, chart['data'], function (data) {
            chart['chart'].load({
                json: data.data,
                keys: {value: ['Patients', 'Care team']},
                types: {'Patients': 'area', 'Care team': 'area'},
                categories: data['categories'],
                axes: {x: {label: {text: "Hours"}}}
            })
        }).always(function() {
            chart['ajax']['status'] = null;   // ajax complete -> set to null
        });
    });
}
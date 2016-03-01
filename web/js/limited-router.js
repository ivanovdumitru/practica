//menu tab "router"
var tabsContainer = {};
TableForm.default.contentType = 'application/x-www-form-urlencoded';
TableForm.default.actionNotification = false;
Table.default.editedNotification = false;
Table.default.datePickerOptions.dateFormat = "dd/mm/yy";
Table.default.heightOfParent = 'li';
Table.default.showDefaultOrder = true;
Table.default.margin = -45;

/**
 * util functions
 */

function listAvg(data) {
	var i, sum = 0,
		count = 0;
	for (i = 0; i < data.length; i++) {
		if (!data[i].avg) continue;
		count += data[i].count;
		sum += data[i].avg * data[i].count;
	}
	return count ? (sum / count) : 0;
}

function objectAvg(data) {
	var i, sum = 0,
		count = 0;
	if (data.hasOwnProperty('count') && Array.isArray(data.count) && data.hasOwnProperty('avg') && Array.isArray(data.avg)) {
		for (i = 0; i < data.count.length; i++) {
			if (!data.avg[i]) continue;
			count += data.count[i];
			sum += data.avg[i] * data.count[i];
		}
	}
	return count ? (sum / count) : 0;
}

/**
 * end util functions
 */

function bi_online(filter) {
	filter = filter || {};
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
					$.each(response, function (i, obj) {
						obj['patients_avg_answer'] ? patients_count++ : '';
						obj['workers_avg_answer'] ? workers_count++ : '';
					});
					footer[1].value = patients_answers ? patients_answers : '';
					footer[2].value = patients_avg_answer ? patients_avg_answer / patients_count : '';
					footer[4].value = workers_answers ? workers_answers : '';
					footer[5].value = workers_avg_answer ? workers_avg_answer / workers_count : '';
					table.renderFooter([footer]);
				}
				return rows;
			}
		});
	tabsContainer.bi_online = table;
	table.getData();
	return table.render();
}

function parameters() {
	var fields = [
			{
				name: 'workersQuestionSource',
				label: 'Workers question source',
				type: 'select',
				required: true,
				attrs: {class: "input-100, input-before-60"},
				options: {0: "By site", 1: "By unit type"}
			},
			{
				name: 'patientsQuestionSource',
				label: 'Patients question source',
				type: 'select',
				required: true,
				attrs: {class: "input-100, input-before-60"},
				options: {0: "By site", 1: "By unit type"}
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
				$('#tab').find('a[href=#parameters]').next().trigger('click')
			}
		}).render();

	return $("<div class='table table-data stand-alone-form' />")
		.html($("<div class='body' />")
			.html($("<div class='tr row-content' />")
				.html($("<div class='td no-border' />")
					.html($form))
			));
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
					var span = $('<label />', {text: obj['text'], for: field['key'] + '_subject_id_' + obj['id']});
					var li = $('<li />');
					if (obj.id == 0) {
						li.addClass('hidden');
					}
					field['list'].append(li.append(checkbox).append(span));
				});
			});
			//init nicescroll
			$('#daily_subjects_container').niceScroll({
				cursorwidth: '3px',
				cursorborder: '0',
				autohidemode: false,
				railalign: 'left'
			});
		}
	});
}

function populateBICategoryQuestionsList(fields, url) {
	$.getJSON(url, function (data) {
		if (data) {
			$.each(fields, function (i, field) {
				$.each(data, function (i, obj) {
					var checkbox = $('<input />', {
						id: field['key'] + '_categoryQuestions_id_' + obj['id'],
						'data-id': obj['id'],
						checked: 'checked',
						type: 'checkbox',
						class: 'hidden'
					});
					var span = $('<label />', {
						text: obj['text'],
						for: field['key'] + '_categoryQuestions_id_' + obj['id']
					});
					var li = $('<li />');
					if (obj.id == 0) {
						li.addClass('hidden');
					}
					field['list'].append(li.append(checkbox).append(span));
				});
			});
			//init nicescroll
			$('#daily_categoryQuestions_container').niceScroll({
				cursorwidth: '3px',
				cursorborder: '0',
				autohidemode: false,
				railalign: 'left'
			});
		}
	});
}

// need to optimize for multiple lists
function populateBIRolesList(data) {
	$.each(data, function (i, obj) {
		$.each(obj, function (id, value) {
			var checkbox = $('<input />', {
				id: 'daily_role_id_' + id,
				'data-id': id,
				checked: 'checked',
				type: 'checkbox',
				class: 'hidden'
			});
			var span = $('<label />', {text: value, for: 'daily_role_id_' + id});
			var li = $('<li />');

			$('#daily_roles').append(li.append(checkbox).append(span));
		});
	});

	//init nicescroll
	$('#daily_roles_container').niceScroll({
		cursorwidth: '3px',
		cursorborder: '0',
		autohidemode: false,
		railalign: 'left'
	});
}

// charts populating "BI/Online"
function populateBICharts(data, referrer) {
	$(window).trigger("adjustpreloader");
	$('#preloader').show();

	$.each(data, function (i, chart) {
		var graphType = $('[name="toggle_graph"] option:selected').data('graphtype'),
			chartType = $('[name="toggle_graph"]').val(),
			ajax_url = chart['ajax']['url'][graphType],
			GLOBAL_data_index,
			responseData = {},
			dataTypeLabel = 'Hours',
			graphDefaultOptions = {
				line: {
					type: 'line',
					data: {
						columns: [],
						colors: {
							'Patients': '#1F77B4',
							'Care team': '#FF7F0E'
						}
					},
					axis: {
						y: {
							label: {
								text: 'Score',
								position: 'outer-middle'
							},
							min: 0,
							max: 5,
							tick: {values: [0, 1, 2, 3, 4, 5]},
							padding: {bottom: 15, top: 0}
						},
						x: {
							label: {text: dataTypeLabel},
							padding: {bottom: 25, top: 25},
							min: 0,
							tick: {centered: false},
							type: 'category',
							categories: []
						}
					},
					size: {
						height: 240
					},
					tooltip: {
						format: {
							name: function (name, ratio, id, index) {
								try {
									var info = responseData[GLOBAL_data_index][chart['data']['byMood'] ? 'count' : 'avg'][index];
									return name + " (" + (typeof info == 'object' ? info[name] : info) + ")";
								} catch (e) {
									return name;
								}
							},
							value: function (val) {
								return val.toFixed(2);
							}
						}
					},
					onmouseover: function () {
						if (typeof this.config.bindto == 'string') {
							GLOBAL_data_index = this.config.bindto.replace('#line_graph_for_', '');
						}
					}
				},
				bar: {
					data: {
						type: 'bar',
						x: 'Subjects',
						columns: [],
						axes: {
							'Patients': 'y'
						}
					},
					axis: {
						rotated: true,
						x: {
							type: 'category',
							tick: {centered: true, outer: true, multiline: false, width: 300}
						},
						y: {
							tick: {
								values: [0, 1, 2, 3, 4, 5]
							},
							min: 0,
							max: 5,
							padding: {bottom: 0, top: 0}
						}
					}
				}
			};

		if (graphType == 'bar') {
			chart['data']['bySites'] = chartType == 'subjects' ? 0 : 1;
		} else {
			chart['data']['byHours'] = chartType == 'hours' ? 1 : 0;
		}

		if (chart['ajax']['status']) {
			chart['ajax']['status'].abort();
		}

		chart['ajax']['status'] = $.post(ajax_url, chart['data'], function (response) {
			responseData = response;

			if (typeof responseData['current_month'] !== "undefined") {
				graphDefaultOptions.line.tooltip.format.title = function (d) {
					return responseData['current_month']['short'] + ' ' + parseInt(responseData['categories'][d]);
				}
			}

			if (chartType == 'problems') {
				var $template = $('#problems').find('.template'),
					$siteClone = $template.clone().removeClass('template'),
					$unitClone = $siteClone.children('.unit').children().clone(),
					$subjectClone = $unitClone.children('.subject').children().clone(),
					$appendBlocks = $(),
					$siteBlock = null,
					$unitBlock = null,
					$subjectBlock = null;
				$template.siblings().remove();
				$siteClone.children('.unit').empty();
				$unitClone.children('.subject').empty();
				if (responseData.problems) {
					for (var siteId in responseData.problems) {
						$siteBlock = $siteClone.clone();
						$appendBlocks = $appendBlocks.add($siteBlock);
						$siteBlock.find('.site-name').text(responseData.problems[siteId].siteName);
						for (var departmentId in responseData.problems[siteId].departments) {
							$unitBlock = $unitClone.clone();
							$siteBlock.append($unitBlock);
							$unitBlock.find('.unit-name').text(responseData.problems[siteId].departments[departmentId].departmentName);
							for (var subjectId in responseData.problems[siteId].departments[departmentId].subjects) {
								$subjectBlock = $subjectClone.clone();
								$unitBlock.append($subjectBlock);
								$subjectBlock.find('.subject-name').text(responseData.problems[siteId].departments[departmentId].subjects[subjectId].subjectName);
								$subjectBlock.find('.subject-answers').text(responseData.problems[siteId].departments[departmentId].subjects[subjectId].count);
								updateGaugeChart({
									mood: responseData.problems[siteId].departments[departmentId].subjects[subjectId].answers.score,
									target: responseData.problems[siteId].departments[departmentId].subjects[subjectId].answers.target
								}, $subjectBlock.find('.gauge'), '');
								(function () {
									var bindElm = $subjectBlock.find('.chart').get(0),
										graphTarget = responseData.problems[siteId].departments[departmentId].subjects[subjectId].answers.target,
										loadGraphData = $.extend({}, chart.data, {
											siteId: siteId,
											departmentId: departmentId,
											subjectId: subjectId,
											range: 'last-month'
										});
									setTimeout(function () {
										var graphOptions = $.extend({}, graphDefaultOptions.line),
											graph, count = [], dates = [];
										graphOptions.bindto = bindElm;
										graphOptions.legend = {show: false};
										graphOptions.size.height = 150;
										graphOptions.axis.x.categories = responseData['categories'];
										graphOptions.data.columns = [];
										graphOptions.axis.x.label.text = 'Days';
										graphOptions.grid = {y: {lines: [{value: graphTarget}]}};
										graphOptions.tooltip.format.title = function (index) {
											if (index < dates.length) {
												return typeof Date.toLocaleString == 'function' ? (new Date(dates[index])).toLocaleString('en', {month: "short", day: "numeric"}) : dates[index];
											}
											return index;
										};
										graphOptions.tooltip.format.name = function (name, ratio, id, index) {
											if (index < count.length) {
												return 'Patients (' + count[index] + ')';
											}
											return 'Patients';
										};
										graph = c3.generate(graphOptions);
										$.post(ajax_url, loadGraphData, function (subjectGraphData) {
											count = subjectGraphData.subject.count;
											dates = subjectGraphData.dates;
											graph.load({
												unload: true,
												categories: subjectGraphData['categories'],
												json: [subjectGraphData.subject.avg.map(function (val) {
													return val ? parseFloat(val) : null;
												})]
											})
										})
									}, 0);
								})();
							}
						}
					}
					$template.parent().append($appendBlocks);
				}
			} else if (graphType == 'bar') {
				$('#answers_gauges').hide();
				$('#bar_block').show();

				var columns = {};
				if (responseData['key']) {
					$.each(responseData['key'], function (dataType, keys) {
						columns[dataType] = [['Subjects']];
						$.each(keys, function (i, column) {
							columns[dataType].push([column]);
						});
					});
				}

				// update odometer charts
				updateGaugeChart(responseData['gauge'] && responseData['gauge']['patients'] ? responseData['gauge']['patients'] : {}, $('#gauge_patients'), '');
				updateGaugeChart(responseData['gauge'] && responseData['gauge']['careteam'] ? responseData['gauge']['careteam'] : {}, $('#gauge_careteam'), '');

				for (var dataType in responseData['data']) {
					for (var key in responseData['data'][dataType]) {
						var subjectsColName = {}, patientsColName = {}, targetColName = {};

						subjectsColName[dataType] = columns[dataType][0][0]; // Subject column name
						patientsColName[dataType] = columns[dataType][1] ? columns[dataType][1][0] : null; // Patients column name
						targetColName[dataType] = columns[dataType][2] ? columns[dataType][2][0] : null; //  Target column name

						if (subjectsColName[dataType]) columns[dataType][0].push(responseData['data'][dataType][key][subjectsColName[dataType]]);
						if (patientsColName[dataType]) columns[dataType][1].push(parseFloat(responseData['data'][dataType][key][patientsColName[dataType]] ? responseData['data'][dataType][key][patientsColName[dataType]] : 0));
						if (targetColName[dataType]) columns[dataType][2].push(parseFloat(responseData['data'][dataType][key][targetColName[dataType]] ? responseData['data'][dataType][key][targetColName[dataType]] : 0));

						//subjects.push(data['data'][key][subjectsColName]); // refresh BiSubjects List
					}
				}

				$('[data-chart="bar"]').parent().hide();

				for (var dataType in responseData['key']) {
					var graphElementObject = $.extend(true, {}, graphDefaultOptions.bar);
					graphElementObject.bindto = '#bar_graph_' + dataType;
					graphElementObject.size = {width: $(graphElementObject.bindto).parent().width()};

					chart['graphs']['bar'] = c3.generate(graphElementObject);
					// load data
					chart['graphs']['bar'].load({
						columns: columns[dataType],
						unload: true,
						keys: {value: responseData['key'][dataType]},
						colors: ({
							'Patients': '#1F77B4',
							'Care Team': '#1F77B4',
							'Target': '#FF7F0E'
						}),
						done: function () {
							if ($('[data-chart="line"]:visible').length) {
								$('[data-chart]').parent().hide();
							}
							$(graphElementObject.bindto).parent().show();
						}
					});

					// force to redraw charts on update
					chart['graphs']['bar'].flush();
				}
			} else {
				$('#answers_gauges').show();
				$('#bar_block').hide();

				chart['graphs']['line'].destroy();
				$('[data-chart="line"]').not('[id="line_graph"]').each(function (index, element) {
					$(element).parent().remove();
				});

				function cloneLineGraph(container_id, title) {
					var base_container = $('#line_graph').parent();
					var new_container = base_container.clone().appendTo(base_container.parent());
					new_container.find('h3').html(title);
					new_container.find('#line_graph').empty('').prop('id', container_id);

					return new_container;
				}

				if (chart['data']['byHours'] === 0) {
					switch (chart['data']['range']) {
						case 'week':
							dataTypeLabel = 'Days of week';
							break;
						case 'month':
							dataTypeLabel = responseData['current_month']['long'];
							break;
						case 'quarter':
						case 'half-year':
							dataTypeLabel = 'Weeks';
							break;
						case 'year':
							dataTypeLabel = 'Months';
							break;
						default:
							dataTypeLabel = 'Hours';
					}
				}

				updateGaugeChart({
					mood: responseData['total']['Patients']['avg'],
					target: listAvg(responseData['Patients_data']['target'])
				}, $('#gauge_patients_answers'), '');
				$('#gauge_patients_answers').next().find('.count').text(responseData['Patients_data']['count'].reduce(function (prev, current) {
					return prev + current;
				}));
				updateGaugeChart({
					mood: responseData['total']['Care Team']['avg'],
					target: listAvg(responseData['Care_Team_data']['target'])
				}, $('#gauge_careteam_answers'), '');
				$('#gauge_careteam_answers').next().find('.count').text(responseData['Care_Team_data']['count'].reduce(function (prev, current) {
					return prev + current;
				}));

				var new_container = null;

				var graphs_by_list = ['type', 'sites', 'subjects', 'categories'],
					graphs_by_list_titles = ['type', 'site', 'subjects', 'categories'],
					types_list = ['Patients', 'Care_Team'],
					types_list_titles = ['Patients', 'Care Team'];
				var graph = {};
				for (var graph_by_index in graphs_by_list) {
					var graph_by = graphs_by_list[graph_by_index];
					graph[graph_by] = {};

					if (chartType == 'static' && (graph_by == 'subjects' || graph_by == 'categories')) {
						continue;
					}

					for (var type_index in types_list) {
						var type = types_list[type_index];

						if (chart['data']['byHours'] === 1 && graph_by === 'unitTypes') {
							continue;
						}

						graph[graph_by][type] = $.extend(true, {}, graphDefaultOptions.line);

						graph[graph_by][type].axis.x.label.text = dataTypeLabel;

						if (!chart['data']['byMood']) {
							var axeY = graph[graph_by][type].axis.y;
							axeY.label.text = 'Answers';
							axeY.max = undefined;
							axeY.tick.values = undefined;
						}

						var container_title = graph_by == 'type' ? types_list_titles[type_index] : types_list_titles[type_index] + ' benchmark by ' + graphs_by_list_titles[graph_by_index],
							data_index = (graph_by == 'type' ? '' : graph_by + '_') + type + '_data',
							key_index = graph_by + '_' + type + '_key',
							container_id = 'line_graph_for_' + data_index;

						new_container = cloneLineGraph(container_id, container_title);

						graph[graph_by][type].bindto = '#' + container_id;

						var loadOptions = {
							unload: true,
							categories: responseData['categories'],
							json: (typeof responseData[data_index] != "undefined" ? (chart['data']['byMood'] ? (typeof responseData[data_index]['avg'] === "undefined" ? [] : responseData[data_index]['avg']) : (typeof responseData[data_index]['count'] === "undefined" ? [] : responseData[data_index]['count'])) : []).map(function (val) {
								if (typeof val == 'object') {
									for (var site in val) {
										val[site] = val[site] ? parseFloat(val[site]) : null;
									}
								} else {
									var result = {};
									result[responseData.key[type_index]] = val ? parseFloat(val) : null;
									return result;
								}
								return val;
							}),
							done: function () {
								if ($('[data-chart="bar"]:visible').length) {
									$('[data-chart]').parent().hide();
								}
								new_container.show();
								var graphResize = chart['graphs']['line'],
									width = new_container.find('[data-chart=line]').innerWidth();
								setTimeout(function () {
									graphResize.resize({
										width: width,
										height: $(graphResize.element).height()
									})
								}, 0);
							}
						};
						if (graph_by != 'type') {
							loadOptions.keys = {value: responseData[key_index]};
							loadOptions.json = typeof responseData[data_index] != "undefined" ? (chart['data']['byMood'] ? (typeof responseData[data_index]['avg'] === "undefined" ? [] : responseData[data_index]['avg']) : (typeof responseData[data_index]['count'] === "undefined" ? [] : responseData[data_index]['count'])) : [];
							new_container.prepend($('<div />').css('clear', 'both'));
							new_container.addClass('col-md-12');
						} else {
							loadOptions.keys = {value: [responseData.key[type_index]]};
							graph[graph_by][type].legend = {show: false};
							var target = listAvg(responseData[data_index]['target']);
							if (target) {
								graph[graph_by][type].grid = {
									y: {
										lines: [
											{value: target}
										]
									}
								};
							}
							graph[graph_by][type].size.height = 150;
							new_container.addClass('col-md-9').find('h3').text(types_list_titles[type_index] + ' total benchmark');
						}

						chart['graphs']['line'] = c3.generate(graph[graph_by][type]);
						chart['graphs']['line'].load(loadOptions);
						if (graph_by == 'sites') {
							var gaugeBySites = {};
							responseData['sites_' + type + '_key'].forEach(function (elm) {
									gaugeBySites[elm] = {
										count: 0,
										sum: 0,
										targetCount: 0,
										targetSum: 0
									};
								});
							if (responseData.hasOwnProperty('sites_' + type + '_data')) {
								var responseSitesTypeData = responseData['sites_' + type + '_data'],
									target = {sum: 0, count: 0};
								for (i in responseSitesTypeData['avg']) {
									for (var site in responseSitesTypeData['avg'][i]) {
										var elm = gaugeBySites[site],
											count = responseSitesTypeData['count'][i][site],
											avg = responseSitesTypeData['avg'][i][site],
											targetCount = responseSitesTypeData['target']['count'][i][site];
										if (!elm.hasOwnProperty('count')) {
											elm.count = 0;
										}
										if (!elm.hasOwnProperty('sum')) {
											elm.sum = 0;
										}
										elm.count += count;
										elm.sum += avg * count;
										if (targetCount) {
											elm.targetCount += targetCount;
											elm.targetSum += targetCount * responseSitesTypeData['target']['avg'][i][site];
											target.count += targetCount;
											target.sum += targetCount * responseSitesTypeData['target']['avg'][i][site];
										}
									}
								}
								if (target.count) {
									chart['graphs']['line'].ygrids.add({value: target.sum / target.count});
								}
							}
							var gaugeRow = $('<div />', {class: 'row'});
							new_container.append(gaugeRow);
							for (var siteName in gaugeBySites) {
								var elm = gaugeBySites[siteName];
								elm.avg = elm.count ? (elm.sum / elm.count) : 0;
								elm.target = elm.targetCount ? (elm.targetSum / elm.targetCount) : 0;

								var gaugeBySiteContainer = $('<div />', {class: 'col-md-2'}),
									gaugeBySiteGraph = $('<div />', {class: 'gauge-graph'});
								gaugeBySiteContainer.append(gaugeBySiteGraph).append($('<h5 />', {class: 'text-center'}).append($('<span />').text(siteName).css('color', elm.avg < elm.target ? 'red' : '')).append('<br>Answers: ' + elm.count));
								gaugeRow.append(gaugeBySiteContainer);

								updateGaugeChart({
									mood: elm.avg,
									target: elm.target
								}, gaugeBySiteGraph, '', {
									width: 120,
									height: 120
								});
							}
						}
					}
				}
			}

			if (referrer || !chart.options.showFiltersFirstTime) {
				if (responseData.roles) {
					$('#daily_roles').html('');
					populateBIRolesList(responseData.roles);
				}
				$('#all_roles').prop('checked', true);
				chart.options.showFiltersFirstTime = true;
			}

			if (responseData.roles && responseData.roles.length) {
				$('#daily_roles, #daily_gender').closest('.drop-box').slideDown();
			} else {
				$('#daily_roles, #daily_gender').closest('.drop-box').slideUp();
			}

			chart['ajax']['status'] = null;
			$('#preloader').hide();
		});
	});
}

function updateGaugeChart(updateData, container, label, options) {
	var defaults = {target: 0, mood: 0},
		update = $.extend({}, defaults, updateData);

	update['mood'] = parseFloat(parseFloat(update['mood']).toFixed(2));
	update['target'] = parseFloat(parseFloat(update['target']).toFixed(2));

	var data = google.visualization.arrayToDataTable([
			['Label', 'Value'],
			[label, update['mood']]
		]),
		formatter = new google.visualization.NumberFormat({
			negativeColor: 'red',
			negativeParens: true,
			fractionDigits: 2
		}),
		defaultOptions = {
			width: 140, height: 140,
			redFrom: 0, redTo: update['target'],
			greenFrom: update['target'], greenTo: 5,
			min: 0,
			max: 5,
			minorTicks: 5,
			majorTicks: ['0', '1', '2', '3', '4', '5']
		};
	formatter.format(data, 1);

	if (typeof options != 'object') options = {};

	var chart = new google.visualization.Gauge(container.get(0)),
		mergedOptions = $.extend(defaultOptions, options);
	chart.draw(data, mergedOptions);

	chart.draw(data, mergedOptions);

	container.data('graph', {
		data: data,
		chart: chart,
		options: options
	});
}

function updateGraph(updateData, container, charts, entity) {
	var data = new google.visualization.DataTable(),
		entitySlug = entity.replace(' ', '_');
	data.addColumn('date', 'Date');

	if ($.inArray(entity, updateData.key) !== -1) {
		data.addColumn('number', entity);
	}

	var data_type = charts['byMood'] ? 'avg' : 'count';
	var max_value = charts['byMood'] ? 5 : 'automatic';
	var min_value = 0;

	var graphData = updateData[entitySlug + '_data'];
	var rows = [];
	var dates = updateData.dates;

	for (var key in dates) {
		var row = [new Date(dates[key])];
		if ($.inArray(entity, updateData.key) !== -1) {
			row.push(typeof graphData[data_type][key] === 'undefined' ? 0 : parseFloat(graphData[data_type][key]));
		}
		rows.push(row);
	}
	data.addRows(rows);

	var options = {
		displayAnnotations: false,
		displayExactValues: false,
		max: max_value,
		min: min_value
	};

	var chart = new google.visualization.AnnotationChart(container.find('[data-chart="line"]').get(0));
	container.show();

	chart.draw(data, options);

	//on ready update, gouge graph change
	google.visualization.events.addListener(chart, 'ready', function () {
		var range = chart.getVisibleChartRange(),
			values = data.getFilteredRows([
				{
					column: 0, //date
					minValue: range['start'],
					maxValue: range['end']
				}
			]),
			avg = 0,
			sum = 0,
			answers = 0,
			gauge = $('#gauge_' + entitySlug.toLowerCase() + '_answers').data('graph');
		if (values.length) {
			for (var i = 0; i < values.length; i++) {
				answers += graphData.count[values[i]];
				sum += graphData.avg[values[i]] * graphData.count[values[i]];
			}
			avg = answers ? (sum / answers).toFixed(2) : 0;
		}

		gauge.data.setValue(0, 1, avg);
		gauge.chart.draw(gauge.data, gauge.options);
	});

	//hide specific zoom buttons
	container.find('.zoomControls').children().filter('[id$=6-months], [id$=1-year], [id$=max]').hide();
}

$(function () {
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
		$categoryQuestions = {
			compare: $('#compare_categoryQuestions'),
			daily: $('#daily_categoryQuestions')
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
				y: {
					label: {text: "Answers", position: 'outer-middle'},
					min: 0,
					padding: {bottom: 25, top: 25},
					tick: {values: []}
				},
				x: {
					label: {text: "Period"}, padding: {left: 0.5, right: 0.5}, min: 0, tick: {centered: false},
					type: 'category',
					categories: []
				}
			}
		}),
		barGraph = c3.generate({
			bindto: '#bar_graph',
			data: {
				type: 'bar',
				x: 'Subjects',
				columns: []
			},
			axis: {
				rotated: true,
				x: {type: 'category', tick: {centered: true, outer: true, multiline: false, width: 300}},
				y: {}
			}
		});


	// functions
	populateBIList([
		{
			key: 'daily',
			list: $sites['daily']
		}, {
			key: 'compare',
			list: $sites['compare']
		}
	], "/dashboard/site");

	populateBIGenderList([
		{
			key: 'daily',
			list: $gender['daily']
		}
	], "dashboard/gender");

	populateBISubjectList([
		{
			key: 'daily',
			list: $subjects['daily']
		}
	], "dashboard/subject");

	populateBICategoryQuestionsList([
		{
			key: 'daily',
			list: $categoryQuestions['daily']
		}
	], "dashboard/category-questions");

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
			/*var radio = inst.input.parent().next(':radio');
			 radio.data('id', dateText);
			 radio.trigger('change');*/
			charts[0].data.range = dateText;
			populateBICharts(charts);
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
				boxes: $('.box-filters .filter-container'),
				period: $('#daily_period'), // by time period

				mood: $('[name="toggle_mood"]'), // by Mood | Answers
				graphs: $('[name="toggle_graph"]'), // by graphs views

				roles: $('#daily_roles'),
				gender: $('#daily_gender'),
				//type:       $('#daily_type') // by Patients | Workers

				sites: $('#sites'),
			},
			ajax: {
				url: {
					line: "/dashboard/bi/answers/per-month/quantity",
					bar: "/dashboard/bi/answers/date-range"
				},
				status: null
			},
			options: {
				showFiltersFirstTime: false
			},
			data: {
				sites: [],
				subjects: [],
				categoryQuestions: [],
				roles: [],
				genders: [],
				//hours: [],
				//types: ['Patients'],
				allSites: 1,
				allSubjects: 1,
				allCategoryQuestions: 1,
				allRoles: 1,
				allGenders: 1,
				//allHours: 1,
				bySites: 1,
				byHours: 0,
				byMood: 1,
				byStatic: 0,
				range: 'month'
			}
		}
	];

	populateBICharts(charts);

	// register events for filters boxes
	$.each(charts, function (i, chart) {
		var boxFilters = chart['filters']['boxes'],
			filterByPeriod = chart['filters']['period'],

			filterByAll = $('input[type=checkbox].filter-all'),
			toggleByMood = chart['filters']['mood'].length ? chart['filters']['mood'] : null,
		//filterByType        = chart['filters']['type'].length ? chart['filters']['type'] : null,

			toggleGraphs = chart['filters']['graphs'],
			data = chart['data'];

		// filter data by box filters
		boxFilters.on('click', 'input', function (evt) {
			var checkbox = $(evt.target),
				checkAll = checkbox.closest('.box-filters').find('[data-filter]'),
				boxFilter = checkbox.closest('.filter-container'),
				filterType = checkAll.val(),   // sites | subjects | roles
				inputId = checkbox.attr('data-id'),
				found = $.inArray(inputId, data[filterType]);

			if (found == -1) { // not found
				data[filterType].push(inputId); // add to array
			} else {
				data[filterType].splice(found, 1); // Element was found, remove from array
			}

			if (checkbox.prop('checked')) {   // checkbox is unchecked -> becomes checked
			} else {
				// checkbox is checked -> becomes unchecked
				checkAll.prop('checked', false);
			}

			if (!boxFilter.find('input[type="checkbox"]:not(:checked)').length) checkAll.prop('checked', true);

			populateBICharts([chart]);
		});

		// filter data by type filters
		/*if(filterByType){
		 filterByType.on('change', function(evt){ // Patients | Workers
		 var inputId  = $(this).find('option:selected').data('type');
		 if(inputId !== 'All'){
		 data['types'] = [inputId];
		 }else{
		 data['types'] = ['Patients', 'Care team'];
		 }

		 populateBICharts([chart], true);
		 });
		 }*/

		// filter data by time period
		filterByPeriod.on("change", function (evt) {

			$('.date-picker').hide();
			data['range'] = $(this).val();
			if (data['range'] === 'date') {
				$('.date-picker').show();
				return false;
			}

			data['roles'].splice(0, data['roles'].length);

			populateBICharts([chart], true);
		});

		//
		// need to optimize
		//
		// filter data by mood
		toggleByMood.on("change", function (evt) {
			//toggleByMood.prev().removeClass('active');
			//$(this).prev().addClass('active');

			//data['byMood'] = $(this).prop('checked') ? 0 : 1;
			data['byMood'] = parseInt($(this).val());
			populateBICharts([chart]);
		});


		if (toggleGraphs) {
			// filter data by mood
			toggleGraphs.on("change", function (evt) {
				var type = $(this).val();
				if (type == 'static') {
					data.byStatic = 1;
					$('#daily_subjects_container').closest('.box-filters').slideUp();
				} else {
					data.byStatic = 0;
					$('#daily_subjects_container').closest('.box-filters').slideDown();
				}
				if (type == 'problems') {
					data.byProblems = 1;
					$('#generated').hide();
					$('#problems').show();
					$('#problems_subjects').children().not('.template').remove();
					$('#daily_period').closest('.filter-box').hide();
				} else {
					data.byProblems = 0;
					$('#generated').show();
					$('#problems').hide();
					$('#problems_subjects').children().not('.template').remove();
					$('#daily_period').closest('.filter-box').show();
				}
				populateBICharts([chart], !!type);
			});
		}

		// filter by all option
		if (filterByAll) {
			filterByAll.on('click', function (evt) {
				var checkbox = $(evt.target),
					all = checkbox.val(),
					dataAll = checkbox.attr('data-filter');

				// clear stored params
				data[all].splice(0, data[all].length);

				if (checkbox.prop('checked')) {   // checkbox is unchecked -> becomes checked
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

		chart['filters']['sites'].on('change', function () {
			var sites = $(this).select2('data');
			if (sites && sites.length) {
				data.sites = sites.map(function (elm) {
					return elm.id
				});
				data.allSites = 0;
			} else {
				delete data.sites;
				data.allSites = 1;
			}
			populateBICharts([chart], true);
		})
	});

	// declare functions
	//
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
						if (obj.id == 0) {
							li.addClass('hidden');
						}
						field['list'].append(li.append(checkbox).append(span));
					});
					if (field['key'] == 'daily') {
						$("#sites").empty();
						for (var i in data) {
							$("#sites").append($('<option />').val(data[i].id).text(data[i].text));
						}
					}
				});
				//init nicescroll
				$('#daily_sites_container').niceScroll({
					cursorwidth: '3px',
					cursorborder: '0',
					autohidemode: false,
					railalign: 'left'
				});
			}
		});
	}


	function populateBIGenderList(fields, url) {
		$.getJSON(url, function (data) {
			if (data) {
				$.each(fields, function (i, field) {
					$.each(data, function (i, obj) {
						var checkbox = $('<input />', {
							id: field['key'] + '_gender_id_' + i,
							'data-id': i,
							checked: 'checked',
							type: 'checkbox',
							class: 'hidden'
						});
						var span = $('<label />', {text: data[i], for: field['key'] + '_gender_id_' + i});
						var li = $('<li />');

						$('#daily_gender').append(li.append(checkbox).append(span));
					});
				});

				//init nicescroll
				$('#daily_gender_container').niceScroll({
					cursorwidth: '3px',
					cursorborder: '0',
					autohidemode: false,
					railalign: 'left'
				});
			}
		});
	}

	var content_position = $("#charts-area").position().top;
	var user_bar_height = $("#user-bar").outerHeight(true);
	$('#charts-area').height($(window).height() - content_position - 40 - user_bar_height);
	// niceScroll init
	//$('#content').niceScroll();

	$('#charts-area').niceScroll({
		horizrailenabled: false,
		railoffset: {
			left: 10
		}
	});

	$('#left_side_filters').height($(window).height() - user_bar_height - 30);
	$('#left_side_filters').niceScroll();
	$("#left_side_filters").mouseover(function () {
		$("#left_side_filters").getNiceScroll().resize();
	});

	$(window).on("adjustpreloader", function () {
		var preloaderHeight = 0;
		$("[data-chart]:visible").map(function () {
			preloaderHeight += $(this).outerHeight(true) + $(this).prev().outerHeight(true);
		});
		//$("#preloader").css("height", preloaderHeight);
	});
	$('.the_select2').not('[multiple]').select2({width: '100%'});
	$('#sites').select2({width: '100%'});

	$('#menu-icon').on('click', function () {
		$('#filters').toggleClass('active');
	});
	$(document).on('click', function (e) {
		if (!$(e.target).closest('#filters').length && !$('#ui-datepicker-div').is(':visible')) {
			$('#filters').removeClass('active');
		}
	});
});

$(window).resize(function () {
	var content_position = $("#charts-area").position().top;
	var user_bar_height = $("#user-bar").outerHeight(true);
	$('#charts-area').height($(window).height() - content_position - 70 - user_bar_height);

	$(window).trigger("adjustpreloader");

	$('#left_side_filters').height($(window).height() - user_bar_height - 30);
	$("#left_side_filters").getNiceScroll().resize();
});

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

function getListOfRandomColors(num) {
	if (parseInt(num) <= 0) {
		return [];
	}

	var list = [];
	while (num > 0) {
		var newColor = getRandomColor();
		if (list.indexOf(newColor) === -1) {
			list.push(newColor);
			num--;
		} else {
			continue;
		}
	}

	return list;
}
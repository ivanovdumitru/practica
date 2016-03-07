class Table
	@VERSION = '1.2.0'
	@default = {
		start: 0
		length: 100
		loadMoreLength: 50
		fromBottomNextPage: 50
		attrs: {}
		actions: []
		columns: []
		footer: []
		rows: []
		url: ''
		datePickerOptions: {
			dateFormat: 'dd/mm/yy'
			constrainInput: true
		}
		timePickerOptions: {
			timeFormat: 'HH:mm'
		}
		showDefaultOrder: false
		editedNotification: true
		contextMenu: true
		selectable: true
		selectFirst: false
		defaultAction: null
		scrollAlign: 'right'
		arrowNavigation: false
		height: null
		heightOfParent: null
		MSSQLPagination: false
		filterTimeOut: 300
		autoRefresh: true
		margin: null
	}

	constructor: (data) ->
		@request = null
		@existMore = true
		@order = ''
		@filter = {}

		@actionsDiv = $('<div />')
		@menuDiv = $('<ul />')
		@table = $('<div class="table" />')
		@head = $('<div class="head" />')
		@body = $('<div class="body" />')
		@foot = $('<div class="foot" />')
		@onOrder = null
		@onFilter = null
		@onGetData = null
		@onRowSelect = null
		@onCloseRowContainer = null
		@current = null

		swig.setFilter 'hasValue', (input) ->
			return typeof input.value != 'undefined'

		@templates = {
			actions: swig.compile('{% for action in actions %}{% if not action.element %}<button type="button" class="btn {{action.class}}" data-action="{{action.id}}">{{action.label}}</button>{% endif%}{% endfor %}'),
			menu: swig.compile('{% for action in actions %}<li data-action="{{action.id}}">{{action.label}}</li>{% endfor %}'),
			columns: swig.compile('<table><thead><tr>{% for i in Array.prototype.constructor.call(null, rows.columns) %}<th class="col-{{loop.index0}}"></th>{% endfor %}</tr></thead><tbody>{% for row in rows %}<tr>{% for column in row %}<td{% if column.attrs and column.attrs.class %} class="{{column.attrs.class}}"{% endif %}{% for attr, value in column.attrs %}{% if attr != "width" and attr != "class" %} {{attr}}="{{value}}"{% endif %}{% endfor %}>{% if column.label %}<label{% if column.name and column.order %} data-order="{{column.name}}" class="order{% if order and order.field == column.name %} {{order.sort}}{% endif %}"{% endif %}{% if column.label.key %} data-i18n="{{column.label.key}}">{{column.label.text}}{% else %}>{{column.label}}{% endif %}</label>{% endif %} {% if column.filter == "select" %}<select name="{{column.name}}">{% for option in column.filterData %}<option value="{{option.value}}"{% if column.filterValue and column.filterValue == option.value %} selected="selected"{% endif %}{% if option.label.key %} data-i18n="{{option.label.key}}">{{option.label.text}}{% else %}>{{option.label}}{% endif %}</option>{% endfor %}</select>{% elif column.filter == "date" or column.filter == "datetime" or column.filter == "time" %}{% if column.filter != "time" %}<div class="date-picker"><input autocomplete="off" type="text" name="{{column.name}}{% if column.filter == "datetime" %}[date]{% endif %}" value="{{column.filterValue}}"/></div>{% endif %}{% if column.filter != "date" %}<div class="time-picker"><input autocomplete="off" type="text" name="{{column.name}}{% if column.filter == "datetime" %}[time]{% endif %}" value="{{column.filterValue}}"/></div>{% endif %}{% elif column.filter == "text" %}<input autocomplete="off" type="text" name="{{column.name}}" value="{{column.filterValue}}"/>{% elif column.filter == "number" or column.filter == "comparison" %}<input autocomplete="off" type="text" name="{{column.name}}" class="number{% if column.filter == "comparison" %} comparison{% if column.extendedFilter %} extended{% endif %}{% endif %}" value="{{column.filterValue}}"/>{% elif column.filter %}<input autocomplete="off" type="{{column.filter}}" name="{{column.name}}" value="{{column.filterValue}}"/>{% endif %}</td>{% endfor %}</tr>{% endfor %}</tbody></table>'),
			rows: swig.compile('{% if rows.head %}<table><thead><tr>{% for i in Array.prototype.constructor.call(null, rows.columns) %}<th class="col-{{loop.index0}}"></th>{% endfor %}</tr></thead><tbody>{% endif %}{% for row in rows %}<tr{% if row.attrs %}{% for attr, value in row.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}>{% for cell in row.cells %}<td{% if cell.attrs %}{% for attr, value in cell.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}{% if cell|hasValue %}{% if not cell.safe %} title="{{cell.value}}"{% endif %}>{% if cell.safe %}{{cell.value|safe}}{% else %}{{cell.value}}{% endif %}{% else %} title="{{cell}}">{{cell}}{% endif %}</td>{% endfor %}</tr>{% endfor %}{% if rows.head %}</tbody></table>{% endif %}'),
			foot: swig.compile('<table><thead><tr>{% for i in Array.prototype.constructor.call(null, rows.columns) %}<th class="col-{{loop.index0}}"></th>{% endfor %}</tr></thead><tbody>{% for row in rows %}<tr{% if row.attrs %}{% for attr, value in row.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}>{% for cell in row.cells %}<td{% if cell.attrs %}{% for attr, value in cell.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}{% if cell|hasValue %}{% if not cell.safe %} title="{{cell.value}}"{% endif %}>{% if cell.safe %}{{cell.value|safe}}{% else %}{{cell.value}}{% endif %}{% else %} title="{{cell}}">{{cell}}{% endif %}</td>{% endfor %}</tr>{% endfor %}</tbody><tfoot><tr><th colspan="{{rows.columns}}"><div class="spinner"><div></div><div></div><div></div><div></div></div></th></tr></tfoot></table>')
		}

		for prop, value of @constructor.default
			@[prop] = value

		for i of data
			if i of @
				@[i] = data[i]

		@tableBinds()

	getData: ->
		table = @
		data = {
			start: @start
			length: if table.start then table.loadMoreLength else table.length
		}
		if @order
			data.ordering = @order
		if @filter
			for filter, value of @filter
				data[filter] = value
		if table.start and @MSSQLData?
			data.lastRow = @MSSQLData
		if @existMore
			@table.addClass('loading')
			@request = $.getJSON(@url, data, (response) ->
				table.table.removeClass('loading')
				table.request = null
				if table.MSSQLPagination
					table.MSSQLData = response[response.length - 1]
				if table.onGetData?
					response = table.onGetData(response, table)
				table.renderRows(response, !!table.start)
				if not response.length or response.length < (if table.start then table.loadMoreLength else table.length)
					table.existMore = false
				else
					table.start += response.length
			).always ->
				table.table.removeClass('loading')
				table.request = null
				return
		return

	nextPage: ->
		if not @request?
			@getData()
		return

	resetTable: ->
		if @request?
			@request.abort()
		@request = null
		@start = 0
		@existMore = true
		@body.html('')
		@getData()
		@updateActions()
		return

	columnsBinds: ->
		@orderBind()
		@filterBind()
		return

	filterBind: ->
		table = @
		filter = null

		if $.fn.datepicker?
			datePickerOptions = $.extend({}, @datePickerOptions)
			datePickerOptions.showOn = 'button'
			if datePickerOptions.constrainInput? and datePickerOptions.constrainInput
				datePickerOptions.constrainInput = false
			@head.find('.date-picker input').datepicker(datePickerOptions)
			@head.find('.date-picker .ui-datepicker-trigger').attr('tabIndex', -1)
			if @datePickerOptions.constrainInput? and @datePickerOptions.constrainInput
				@head.find('.date-picker input').on 'keydown.table blur', (e) ->
					if e.keyCode in [13, 9] or e.type == 'blur'
						now = new Date()
						date = {d: '', m: '', y: ''}
						dateFormat = datePickerOptions.dateFormat.replace(/[^\w]/g, '').replace(/y/g, 'yy')
						val = $(@).val()
						if val.match(/^(\+|-)\d+$/g)
							now.setDate(now.getDate() + parseInt(val))
						else if val.match(/^\d+$/)
							for c, i in dateFormat
								if i < val.length
									date[c] += val[i]
							if date.y.length != 4
								restOfYear = ''
								for i in [0...4 - date.y.length]
									restOfYear += now.getFullYear().toString()[i]
								date.y = restOfYear + date.y
						else if val.match(/^((\+|-)(\d+)(d|m|y)){1,3}$/ig)
							while val.match(/((\+|-)(\d+)(d|m|y))/i)
								change = val.match(/((\+|-)(\d+)(d|m|y))/i)[0]
								val = val.replace(change, '')
								changeValue = parseInt(change.slice(0, -1))
								if change.toLowerCase().slice(-1) == 'd'
									now.setDate(now.getDate() + changeValue)
								if change.toLowerCase().slice(-1) == 'm'
									now.setMonth(now.getMonth() + changeValue)
								if change.toLowerCase().slice(-1) == 'y'
									now.setFullYear(now.getFullYear() + changeValue)
						else
							$(@).trigger('change')
							return
						if date.d
							now.setDate(parseInt(date.d))
						if date.m
							now.setMonth(parseInt(date.m) - 1)
						if date.y
							now.setFullYear(parseInt(date.y))
						$(@).datepicker('setDate', now)
						$(@).trigger('change')
					return
				@head.find('.date-picker input').each ->
					allEvents = $(@).data('events') || $._data($(@)[0], 'events');
					typeEvents = allEvents['keydown']
					typeEvents.unshift(typeEvents.pop());
					return

			@head.find('.date-picker input').on 'change keyup.table', (e) ->
				dateInput = $(@).val()
				if e.type == 'keyup' and not (e.keyCode? and e.keyCode == 13 or not dateInput.length or dateInput.length == table.datePickerOptions.dateFormat.replace(/y/g, 'yy').length)
					return
				###
				if dateInput.length == 0 && $(@).datepicker.is(':focus')
					$(@).datepicker('hide')
				###
				if table.datePickerOptions.datePickerToFormat?
					filter = table.datePickerOptions.datePickerToFormat(dateInput)
					if filter == 'Invalid Date' or not filter?
						filter = null
					else
						if e.type == 'keyup' and not (e.ctrlKey or e.keyCode == 17)
							$(@).datepicker('setDate', filter)
						filter = filter.toISOString()
				else
					filter = dateInput
				table.doFilter(@, filter)
				return

		if $.fn.timepicker?
			timePickerOptions = $.extend({}, @timePickerOptions)
			timePickerOptions.showOn = 'button'
			@head.find('.time-picker input').timepicker(timePickerOptions)
			@head.find('.time-picker .ui-datepicker-trigger').attr('tabIndex', -1)
			if timePickerOptions.showSecond? and timePickerOptions.showSecond
				@head.find('.time-picker').addClass('seconds')
			@head.find('.time-picker input').on 'change keyup.table', (e) ->
				timeInput = $(@).val()
				if e.type == 'keyup' and not (e.keyCode? and e.keyCode == 13 or not timeInput.length or timeInput.length == table.timePickerOptions.timeFormat.length)
					return
				if table.timePickerOptions.timePickerToFormat?
					filter = table.datePickerOptions.datePickerToFormat(timeInput)
				else
					filter = timeInput
				table.doFilter(@, filter, false)
				return

		@head.find('input').on 'focus.table', ->
			$(@).select()
			return

		@head.find('input').on 'keypress.table', (e) ->
			if not e.charCode
				return
			if $(@).hasClass('number')
				keyCode = e.which || e.keyCode
				if keyCode < 48 or keyCode > 57
					value = $(@).val()
					if $(@).hasClass('comparison') and (not value.match(/\./) and keyCode == 46 or (not value.match(/[=><]/) or $(@).hasClass('extended') and (value.match(/([=><]+)/g) and value.match(/([=><]+)/g)[0] + String.fromCharCode(keyCode) in ['<=', '<>', '>='])) and keyCode in [62, 61, 60])
						return
					return false
			return
		@head.find('input').on 'keyup.table', ->
			if not $(@).parent().hasClass('date-picker') and not $(@).parent().hasClass('time-picker')
				filter = $(@).val()
				table.doFilter(@, filter, false)
			return
		@head.find('select').on 'change', ->
			table.doFilter(@, $(@).val())
			return
		@head.find('input:checkbox').on 'change', ->
			table.doFilter(@, $(@).prop("checked"))
			return
		return

	doFilter: (element, filter, doNow = true) ->
		oldFilter = $.extend(true, {}, @filter)
		name = $(element).attr('name')
		table = @
		if not @timeoutBind?
			@timeoutBind = null
		if @onFilter?
			@onFilter(element, filter)
		else
			if filter? and not filter
				filter = null
			if filter?
				@filter[name] = filter
			else
				delete @filter[name]
			if oldFilter[name] != @filter[name] and @autoRefresh
				clearTimeout(@timeoutBind)
				if doNow
					table.resetTable()
				else
					@timeoutBind = setTimeout(()->
						table.resetTable()
						return
					, table.filterTimeOut)
		return

	orderBind: ->
		table = @
		@head.find('label.order').on 'click.table', ->
			if table.request
				return false
			oldOrder = table.order
			orderBy = $(@).data('order')
			orderByIndex = table.order.indexOf(orderBy)
			table.head.find('label.order').removeClass('asc desc')
			if orderByIndex != -1
				if orderByIndex
					table.order = orderBy
					$(@).addClass('asc')
				else
					table.order = "-#{orderBy}"
					$(@).addClass('desc')
			else
				table.order = orderBy
				$(@).addClass('asc')
			if table.onOrder?
				table.onOrder(table.order)
			else
				if oldOrder != table.order
					table.resetTable()
			return false
		return

	tableBinds: ->
		table = @
		@bindActions()
		if @contextMenu
			@body.on 'contextmenu.table', 'tr:not(.row-content)', (e)->
				table.menu(@, e)
				return false
		if @selectable
			@body.on 'mousedown.table', 'tr:not(.row-content)', ->
				if table.request?
					return false
				if table.rowSelect($(@).index() - $(@).prevAll('.row-content').length, @)
					$(table.body).find('tr').removeClass('active')
					$(@).addClass('active')
				return
		if @defaultAction and @actions
			for action in @actions
				if action.id == @defaultAction
					defaultAction = action
					actionsDiv = @actionsDiv
					@body.on 'dblclick.table', 'tr:not(.row-content)', ->
						if table.request?
							return false
						document.getSelection().removeAllRanges()
						if actionsDiv.find("[data-action=#{defaultAction.id}]").length
							actionsDiv.find("[data-action=#{defaultAction.id}]").trigger('click.table')
						else
							defaultAction.callback(table.rows[table.current], table)
						return
		@body.on 'scroll.table', ->
			if table.body.find('tr.row-content').find('form').length
				positionLimit = {
					top: table.body.position().top
					bottom: table.body.position().top + table.body.height()
				}
				table.body.find('tr.row-content').find('form').find('.error').each ->
					top = $(@).position().top
					toolTip = $(@).find('.error-text')
					if top > positionLimit.top and top + toolTip.height() < positionLimit.bottom
						toolTip.css('top', top)
					else
						toolTip.css('top', -9999)
					return
			bodyPos = table.body.position()
			bodyHeight = table.body.height()
			if table.body.find('tbody tr').length
				lastPos = table.body.find('tbody tr:last').position()
				lastHeight = table.body.find('tbody tr:last').outerHeight()
				fromBottom = (lastPos.top + lastHeight) - (bodyHeight + bodyPos.top)
				if fromBottom < table.fromBottomNextPage && fromBottom >= 0
					table.nextPage()
			return
		$('body').off 'keydown.table'
		$('body').on 'keydown.table', (e) ->
			if not (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) or $(e.target).is('input, textarea, select')
				return
			tables = $('.table-data.arrow-navigation:visible')
			if tables.find('.body tr.active').length
				tables = tables.find('.body tr.active').closest('.table-data')
				if tables.filter('.active').length
					tables = tables.filter('.active')
				else
					tables = tables.first()

				body = $('.body', tables);
				row = $('tr.active', tables);

				if row.length
					if e.keyCode == 13
						row.trigger('dblclick.table')
					else
						if e.keyCode == 38
							newRow = row.prevAll().not('.row-content')
						else
							newRow = row.nextAll().not('.row-content')
						newRow = newRow.first()

						if newRow.length
							newRow.trigger('mousedown.table')
							H = body.height()
							E = newRow.height()
							ST = body.scrollTop()
							RM = newRow.offset().top - body.offset().top

							if RM < 0
								body.scrollTop(ST + RM)
							else if RM + E > H
								body.scrollTop((RM - H) + ST + E)
			return
		return

	menu: (element, event) ->
		if @contextMenu
			@menuDiv.html(@templates.menu({actions: @actions}))
			table = @
			for action in @actions
				@menuDiv.attr({id: 'contextmenu'}).find("[data-action=#{action.id}]").data('action-data', action).on 'mousedown.table', ->
					action = $(@).data('action-data')
					if action.callback?
						action.callback(table.rows[table.current], table)
					return
				menuAction = @menuDiv.find("[data-action=#{action.id}]")
				if not (action.global? or action.global) and $(element).data('action-disabled')? and action.id in $(element).data('action-disabled')
					menuAction.addClass('disabled')
				else
					menuAction.removeClass('disabled')
			$(document.body).append(@menuDiv)
			top = event.clientY
			left = event.clientX
			if top + @menuDiv.height() + 5 > $(document).height()
				top -= @menuDiv.height()
			if left + @menuDiv.width() + 5 > $(document).width()
				left -= @menuDiv.width()

			@menuDiv.css({
				top: top,
				left: left,
			})
			$(document).on 'mousedown.table', ->
				$('#contextmenu').remove()
				$(document).unbind 'mousedown.table'
		return

	rowSelect: (rowIndex, element) ->
		@current = rowIndex
		@updateActions(element)
		if @onRowSelect?
			return @onRowSelect(@rows[rowIndex], element)
		return true

	addRowContainer: (content, pinned = false) ->
		rowContainer = $('<tr />')
		container = $("<td colspan=\"#{@cols}\" />")
		container.html(content)
		rowContainer.addClass('row-content').html(container)
		if pinned
			if @body.find('tr.active').next().hasClass('row-content')
				return
			rowContainer.addClass('pinned')
			rowContainer.insertAfter(@body.find('tr.active'))
			@updateActions(@body.find('tr.active'))
		else
			if not @body.find('tbody').length
				rows = []
				rows.columns = @cols
				rows.head = true
				@body.html(@templates.rows({rows: rows}))
			@body.find('tbody').prepend(rowContainer)
		@scrollRowContainer(rowContainer)
		return rowContainer

	scrollRowContainer: (rowContainer) ->
		@rowResize()
		topPosition = @body.position()
		if rowContainer.hasClass('pinned')
			topPosition.top += @body.find('tr.active').height()
		@body.scrollTop(@body.scrollTop() + (rowContainer.position().top - topPosition.top))
		return

	closeRowContainer: (index, force = false) ->
		table = @
		rowContainers = @body.find('tbody tr')
		if not @editedNotification
			force = true
		if rowContainers.length > index
			rowContainer = rowContainers.eq(index)
			continueCallback = ->
				rowActive = rowContainer.prev('.active')
				rowContainer.remove()
				if rowActive.length
					table.updateActions(rowActive)
				if not table.body.find('tbody tr').length
					table.body.html('')
				table.rowResize()
				return
			if @onCloseRowContainer?
				cb = @onCloseRowContainer(index, force, @, rowContainer, continueCallback)
				if cb? and not cb
					return false
			else if not force and rowContainer.is('.edited') and not confirm('You are sure?\n Added/edited data not was saved')
				return false
			continueCallback()
		return true

	lockAction: (id, lock = null, disable = false) ->
		for action in @actions
			if action.id == id
				if action.element?
					actionButton = $(action.element)
				else
					actionButton = @actionsDiv.find("[data-action=#{action.id}]")
				if actionButton.hasClass('locked') and (not lock? or lock? and not lock)
					actionButton.removeClass('locked')
				else
					actionButton.addClass('locked')
				if disable
					actionButton.addClass('disabled')
				else
					actionButton.removeClass('disabled')
				return
		return

	updateActions: (rowElement = null) ->
		if rowElement?
			actionDisabled = if $(rowElement).data('action-disabled')? then $(rowElement).data('action-disabled') else null
			actionContentDisabled = if $(rowElement).data('action-content-disabled')? and $(rowElement).next('.row-content').length then $(rowElement).data('action-content-disabled') else null
		else
			actionDisabled = actionContentDisabled = null
		for action in @actions
			if action.element?
				actionButton = $(action.element)
			else
				actionButton = @actionsDiv.find("[data-action=#{action.id}]")
			menuAction = @menuDiv.find("[data-action=#{action.id}]")
			if @request? or not (action.global? or action.global) and (not rowElement? or (rowElement? and (actionDisabled? and action.id in actionDisabled or actionContentDisabled? and action.id in actionContentDisabled)))
				actionButton.addClass('disabled')
				menuAction.addClass('disabled')
			else
				actionButton.removeClass('disabled')
				menuAction.removeClass('disabled')
		return

	renderActions: ->
		@actionsDiv.addClass('table-actions')
		makeActions = []
		for action in @actions
			if not action.element?
				makeActions.push(action)
		@actionsDiv.html(@templates.actions({actions: makeActions}))
		@bindActions()
		@updateActions()
		return @actionsDiv

	bindActions: ->
		table = @
		for action in @actions
			if action.element?
				actionButton = $(action.element)
			else
				actionButton = @actionsDiv.find("[data-action=#{action.id}]")
			actionButton.data('action-data', action).off 'click.table'
			actionButton.data('action-data', action).on 'click.table', ->
				if $(@).hasClass('disabled') or $(@).hasClass('locked')
					return
				action = $(@).data('action-data')
				if action.callback?
					action.callback(table.rows[table.current], table)
				return
		return

	renderRows: (data, append = false) ->
		if not append
			@rows = []
			@body.scrollTop(0)
			@updateActions()
		appendRows = []
		for row in data
			if Array.isArray(row)
				appendRows.push({attrs: null, cells: row})
			else
				appendRows.push row
		Array.prototype.push.apply(@rows, appendRows)
		appendRows.columns = @cols
		if @rows.length
			if appendRows.length
				if !append
					appendRows.head = true
					@body.html(@templates.rows({rows: appendRows}))
				else
					@body.find('tbody').append(@templates.rows({rows: appendRows}))
		else
			@body.html('')
		if @table.is(':visible')
			@rowResize()
		if not append and @selectable and @selectFirst and @rows.length
			@body.find('tbody tr:first').trigger('mousedown.table')
		return @body

	columnRule: (index, style = null) ->
		rule = "##{@table.attr('id')} table > thead > tr > .col-#{index}"
		if not $('#table_columns').length
			$('head').append($('<style />').attr({id: 'table_columns', type: 'text/css'}))
		if (document.styleSheets)
			sheets = document.styleSheets
			for sheet in sheets
				if $(sheet.ownerNode).attr('id') == 'table_columns' then break
		if sheet.cssRules
			cssRule = sheet.cssRules
		else
			cssRule = sheet.rules
		exist = false
		for selector, rulePos in cssRule
			if selector.selectorText? and selector.selectorText.toLowerCase() == rule
				exist = true
				break
		if not style?
			if exist
				if sheet.cssRules
					sheet.deleteRule(rulePos)
				else
					sheet.removeRule(rulePos)
			return
		if not exist
			rulePos = cssRule.length
			exist = true
			if sheet.addRule
				sheet.addRule(rule, null, rulePos)
			else
				sheet.insertRule("#{rule} {}", rulePos)
		if exist
			for attr, value of style
				cssRule[rulePos].style[attr] = value
		return

	columnsResize: ->
		table = @
		fixedCols = 0
		columns = []
		rows = []
		@cols = 0
		if @columns.length
			if not Array.isArray(@columns[0])
				rows = [@columns]
			else
				rows = @columns
			for column in rows[0]
				@cols += if column.attrs? and column.attrs.colspan? then column.attrs.colspan else 1
		rows.columns = @cols
		for i in [0..@cols - 1]
			table.columnRule(i)
		@table.css({width: ''})
		@head.css({display: 'inline-block', width: 'auto'}).find('table').css({width: 'auto'})
		@body.hide()
		@foot.hide()
		tableWidth = @table.width()
		@head.css({display: '', width: ''}).find('table').css({width: ''})
		@body.show()
		@foot.show()
		@table.width(tableWidth)
		for check in ['fixed', 'percent', 'auto']
			for row in rows
				i = -1
				for column in row
					i++
					if columns.length <= i
						columns.push({rowspan: 0}) for [0..(columns.length - i)]
					if columns[i].rowspan
						columns[i].rowspan--
						i++
					if column.attrs? and column.attrs.rowspan? and column.attrs.rowspan != 1
						columns[i].rowspan += column.attrs.rowspan - 1
					if column.attrs? and column.attrs.colspan? and column.attrs.colspan != 1
						i += column.attrs.colspan - 1
						continue
					if not columns[i].width?
						width = 'auto'
						minWidth = 'initial'
						if column.attrs?
							if column.attrs.width?
								width = column.attrs.width
							if column.attrs.minWidth?
								minWidth = column.attrs.minWidth
					else
						width = columns[i].width
						minWidth = columns[i].minWidth
					if check == 'fixed' and width.toString().match(/^\d+(px)?$/)
						width = parseInt(width)
						tableWidth -= width
						fixedCols++
					else if check == 'percent' and width.toString().match(/^\d+%$/)
						width = parseInt(tableWidth * (parseFloat(width) / 100))
						fixedCols++
					else if check == 'auto' and width == 'auto'
						width = parseInt(tableWidth * (1 / (@cols - fixedCols)))
					columns[i].width = width
					columns[i].minWidth = minWidth
		@table.css {paddingRight: (tableWidth - parseInt(tableWidth * (1 / (@cols - fixedCols))) * (@cols - fixedCols))}
		for columnRule, colIndex in columns
			table.columnRule(colIndex, {
				width: columnRule.width + 'px',
				minWidth: columnRule.minWidth + (if not isNaN(parseInt(columnRule.minWidth)) then 'px' else '')
			})
		if @head.width() < @head.find('table').width()
			@table.width(@head.find('table').width())
		if not @body.getNiceScroll().length
			@rowResize()
		return

	rowResize: ->
		if @height?
			@table.css('maxHeight', @height)
			fullHeight = @table.height() - @head.height() - @foot.height()
		else if @body.height()
			@body.css('display', 'none')
			fullHeight = parseInt(@table.closest(@heightOfParent).height()) - (parseFloat(@table.outerHeight()) + (if @body.is(':empty') then 1 else 0) - (if @margin? then @margin else 0))
		@body.css({
			maxHeight: if fullHeight then fullHeight else ''
			display: 'block'
		})
		if @body.get(0).scrollHeight > fullHeight
			if not @body.getNiceScroll().length
				@body.niceScroll({
					horizrailenabled: false
					cursoropacitymin: 1
					railalign: @scrollAlign
					enablekeyboard: not @arrowNavigation
					cursorwidth: 3
					railpadding: {top: 1, right: 1, left: 1, bottom: 1}
				})
			else
				@body.getNiceScroll().resize()
		else
			@body.getNiceScroll().remove()
		return

	renderColumns: (columns) ->
		@columns = columns
		order = null
		rows = []
		@cols = 0
		if @columns.length
			if not Array.isArray(@columns[0])
				rows = [@columns]
			else
				rows = @columns
			for column in rows[0]
				@cols += if column.attrs? and column.attrs.colspan? then column.attrs.colspan else 1
		rows.columns = @cols
		if @showDefaultOrder and @order
			order = {
				field: @order.substr(!@order.indexOf('-')),
				sort: if not @order.indexOf('-') then 'desc' else 'asc'
			}
		@head.html(@templates.columns({rows: rows, order: order}))
		@columnsBinds()
		return @head

	renderFooter: (footerRows) ->
		@footer = footerRows
		rows = []
		if @footer.length
			for row in @footer
				if Array.isArray(row)
					rows.push({attrs: null, cells: row})
				else
					rows.push row
		rows.columns = @cols
		@foot.html(@templates.foot({rows: rows}))
		return @foot

	uid: ->
		Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1)

	render: ->
		attrs = JSON.parse(JSON.stringify(@attrs))
		if not attrs.id?
			attrs.id = "uid_#{@uid()}"
		while $("#uid_#{@attrs.id}").length
			attrs.id = "uid_#{@uid()}"
		if attrs.class?
			@table.addClass(attrs.class)
			delete attrs.class
		@table.attr(attrs).addClass("table-data scroll-#{@scrollAlign}#{if @selectable then ' selectable' else ''}#{if @arrowNavigation then ' arrow-navigation' else ''}")
		@renderColumns(@columns)
		@renderRows(@rows)
		@renderFooter(@footer)
		@table.append(@head)
		@table.append(@body)
		@table.append(@foot)
		table = @
		$(window).on 'resize.table', ->
			if table.table.is(':visible')
				table.columnsResize()
				table.rowResize()
			return
		return @table
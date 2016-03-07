class TableForm
	@VERSION = '2.2.6'
	@default = {
		contentType: false
		actionNotification: true
		datePickerOptions:
			dateFormat: 'dd/mm/yy'
		timePickerOptions:
			parse: 'loose'
			timeFormat: 'HH:mm:ss'
		loadLength: 50
		after: null
		onSubmit: null
		onComplete: null
		onCancel: null
		onActionNotification: null
		onDelete: null
		sendCSRFTokenHeader: true
	}
	constructor: (data) ->
		@edit = false
		@form = $('<div class="form" />')
		@table = null
		@pinned = false
		@formData = null
		@getData = null
		@request = null
		@fields = []
		@actions = []
		@template = swig.compile('<form{% for attr, value in form.attrs %} {{attr}}="{{value}}"{% endfor %}> {% if form.name %}<p class="name {{form.name.attrs.class}}">{{form.name.label}}</p>{% endif %} {% for field in fields %} {% if field.type == "hidden" %}<input type="hidden" name="{{field.name}}" value="{{field.value}}" />{% else %} <div class="field{% if field.fields.length > 1 %} multiple{% endif %}{% if field.attrs.class %} {{field.attrs.class}}{% endif %}">{% if field.group %}<p class="group{% if field.group.class %} {{field.group.class}}{% endif %}">{% if field.group.label %}{{field.group.label}}{% else %}{{field.group}}{% endif %}</p>{% endif %}{% for input in field.fields %}{% if input.label and (not input.label.position or input.label.position and input.label.position == "before") %} <label for="{{_prefix}}input_{{input.name}}"{% if input.label.class or input.required %} class="{% if input.required %}required{% endif %}{% if input.label.class %} {{input.label.class}}{% endif %}"{% endif %}>{% if input.label.text %}{{input.label.text}}{% else %}{{input.label}}{% endif %}</label>{% endif %}{% if input.type == "textarea" %} <textarea id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" {% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}{% if input.length %} data-length="{{input.length}}"{% endif %}>{{input.value}}</textarea>{% elif input.type == "date" %} <div class="date-picker" id="{{_prefix}}input_{{input.name}}"><input type="text" name="{{input.name}}" value="{{input.value}}" {% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %} /></div>{% elif input.type == "time" %} <div class="time-picker" id="{{_prefix}}input_{{input.name}}"><input type="text" name="{{input.name}}" value="{{input.value}}"/></div>{% elif input.type == "select" %} <select id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" {% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}>{% for value, label in input.options %}<option value="{{value}}"{% if value == input.value %} selected="selected"{% endif %}>{{label}}</option>{% endfor %}</select>{% elif input.type == "related" %} <input type="hidden" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" data-select="related" value="{{input.value}}" data-text="{{input.text}}" data-url="{{input.url}}" data-placeholder="{{input.placeholder}}" data-order="{{input.order}}" data-results=\'{{input.results}}\'{% if input.related %} data-related=\'{{input.related|json}}\'{% endif %}{% if input.children %} data-children=\'{{input.children|json}}\'{% endif %}{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}/>{% elif input.type == "checkbox" %} <input type="checkbox" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}"{% if input.value %} checked="checked" {% endif %}{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %} />{% elif input.type == "text" or input.type == "digits" %} <input type="text" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" value="{{input.value}}" data-type="{{input.type}}"{% if input.length %} data-length="{{input.length}}"{% endif %}{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %} />{% else %} <input type="{{input.type}}" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" value="{{input.value}}"{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}{% if input.length %} data-length="{{input.length}}"{% endif %} />{% endif %}{% if input.label and (input.label.position and input.label.position == "after") %} <label for="{{_prefix}}input_{{input.name}}"{% if input.label.class or input.required %} class="{% if input.required %}required{% endif %}{% if input.label.class %} {{input.label.class}}{% endif %}"{% endif %}>{% if input.label.text %}{{input.label.text}}{% else %}{{input.label}}{% endif %}</label>{% endif %}{% endfor %} <span class="error-text"></span></div>{% endif %}{% endfor %}{% if actions.length %}{% for action in actions %} <button type="button" class="btn btn-{{action.id}}{% if action.class %} {{action.class}}{% endif %}"{% for attr, value in action.attrs %} {{attr}}="{{value}}"{% endfor %}>{{action.label}}</button>{% endfor %}{% else %} <button type="button" class="btn btn-success btn-ok">Ok</button> <button type="button" class="btn btn-danger btn-cancel">Cancel</button>{% endif %}</form>')

		for prop, value of @constructor.default
			@[prop] = value

		for i of data
			if i of @
				@[i] = data[i]

		if @formData.attrs? and @formData.attrs.id
			@prefix = @formData.attrs.id
		else
			@prefix = "uid_#{@uid()}"
			while $("[id^='#{@prefix}']").length
				@prefix = "uid_#{@uid()}"
		return

	getCsrfToken: ->
		nameEQ = "csrftoken="
		ca = document.cookie.split(";")
		i = 0
		while i < ca.length
			c = ca[i]
			c = c.substring(1, c.length)  while c.charAt(0) is " "
			return c.substring(nameEQ.length, c.length).replace(/"/g, '')  if c.indexOf(nameEQ) is 0
			i++
		return ca

	uid: ->
		Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1)

	bindForm: ->
		tableForm = @
		@form.find(":input").change ->
			tableForm.form.closest('tr').addClass('edited')
			return

		@form.on 'focus', 'input, textarea', ->
			try
				@setSelectionRange(0, @value.length)
			return

		@form.on 'keypress', 'input, textarea', (e) ->
			input = $(e.target)
			if input.data('length')?
				if input.val().length >= parseInt(input.data('length'))
					return false
			if input.data('type')?
				switch input.data('type')
					when 'digits'
						charCode = if e.charCode? then e.charCode else e.keyCode
						return false if charCode and (charCode > 57 or charCode < 48)
			return

		@form.on 'keyup', 'input', (e) ->
			if e.keyCode == 13
				next = $(e.target).nextAll('input, textarea, select').not('.skip-focus').first()
				if not next.length
					next = $(e.target).closest('.field').nextAll('.field').not('.skip-focus').first().find('input, textarea, select')
				if not next.length
					next = tableForm.form.find('.btn-ok')
				next.first().focus()

		if $.fn.datepicker?
			@form.find('.date-picker input').datepicker(@datePickerOptions)
			@form.find('.date-picker').click ->
				$(@).find('input').datepicker('show')
				return

		if $.fn.timepicker?
			@form.find('.time-picker input').timepicker(@timePickerOptions)
			@form.find('.time-picker').click ->
				$(@).find('input').timepicker('show')
				return

		@form.find('[data-select=related]').each ->
			$(@).select2($.extend(true, (if $(@).data('options') then $(@).data('options') else {}), {
				initSelection: (element, callback) ->
					related = element.data()
					data = {id: element.val(), text: related.text}
					callback(data);
					return
				query: (queryObj) ->
					related = queryObj.element.data()
					data = {more: false, results: []}
					if related.related?
						if typeof related.related == 'object'
							postData = $.extend({}, related.related)
						else
							postData = {related: related.related}
					else
						postData = {}
					postData.select = true
					postData.ordering = related.order
					postData.text = queryObj.term
					postData.start = (queryObj.page - 1) * tableForm.loadLength
					postData.length = tableForm.loadLength
					postData[related.results.term] = queryObj.term
					$.getJSON(
						related.url,
						postData,
						(list) ->
							data.more = list.length == tableForm.loadLength
							for element in list
								if related.format?
									element = related.format(element)
								data.results.push({id: element[related.results.id].toString(), text: element[related.results.text].toString()})
							queryObj.callback(data)
							return
					)
					return
			})).change((e) ->
				element = $(e.target)
				related = element.data()
				if related.children?
					for child in related.children
						select = tableForm.form.find("[name=#{child}]")
						relatedData = select.data()
						if related.results.reference? and relatedData['related']? and typeof relatedData['related'] == 'object'
							relatedData['related'][related.results.reference] = element.val()
						else
							relatedData['related'] = element.val()
						if not relatedData['relatedElements']?
							relatedData['relatedElements'] = {}
						relatedData['relatedElements'][element.attr('name')] = !!element.val()
						select.data(relatedData)
						if e.added?
							select.select2('val', '').trigger('change')
						disable = false
						for state, value of relatedData['relatedElements']
							disable = true if not value
						select.prop('disabled', disable)
				return
			).trigger('change')

		@form.find('.btn-cancel').click ->
			if tableForm.onCancel?
				cb = tableForm.onCancel(tableForm)
				if cb? and not cb
					return
			if tableForm.table?
				tableForm.table.closeRowContainer(tableForm.form.closest('tr.row-content').index())
			return

		@form.find('.btn-ok').click ->
			tableForm.sendData()
			return

		for action in @actions
			if action.callback?
				do (action) ->
					tableForm.form.find(".btn-#{action.id}").click ->
						action.callback(tableForm)
						return
					return

		@form.on 'submit', ->
			tableForm.sendData()
			return false
		return

	render: ->
		form = @
		if @edit and not @form.html() and not @request?
			@form.html($('<em />').text('Loading form data'))
			@formData.attrs.action = "#{@formData.attrs.action}#{@edit}/"
			@loadData()
		else
			fieldData = []
			for field in @fields
				if field.type? and field.type == 'hidden'
					fieldData.push field
				if field instanceof Array
					fieldData.push {
						fields: field
					}
				else if not field.fields?
					fieldData.push {
						fields: [field]
					}
				else
					fieldData.push field
				for input in fieldData[fieldData.length - 1].fields
					if input.type == 'related' and input.children? and typeof input.children == 'string'
						input.children = [input.children]
					if input.value?
						if input.type == 'date' and $.fn.datepicker? and new Date(input.value).toString() != 'Invalid Date'
							input.value = $.datepicker.formatDate(@datePickerOptions.dateFormat, new Date(input.value))
						if input.type == 'time' and $.fn.timepicker?
							time = new Date(input.value)
							if time.toString() == 'Invalid Date' and input.value.match(/(\d{2})(\.\d{3})?/g)
								time = new Date(new Date().toISOString().substr(0, 11) + input.value.match(/(\d{2})(\.\d{3})?/g).join(':') + 'Z')
							if time.toString() != 'Invalid Date'
								input.value = $.datepicker.formatTime(@timePickerOptions.timeFormat, {hour: time.getUTCHours(), minute: time.getUTCMinutes(), second: time.getUTCSeconds()})
			@form.html($(@template({form: @formData, fields: fieldData, actions: @actions, _prefix: "#{@prefix}_"})))
			@bindForm()
			if @table? and @form.closest('.row-content').length
				@table.scrollRowContainer(@form.closest('.row-content'))
			setTimeout(() ->
				if form.form.find('.auto-focus').length
					form.form.find('.auto-focus').focus()
				else
					form.form.find(':input:visible:not([disabled]):first').focus()
				if form.after?
					form.after(form)
				return
			, 0)
		return @form

	delData: ->
		form = @
		continueCallback = ->
			data = []
			form.formData.attrs.action = "#{form.formData.attrs.action}#{form.edit}/"
			form.request = $.ajax({
				url: form.formData.attrs.action
				data: JSON.stringify(data)
				type: if form.formData.attrs.method? then form.formData.attrs.method else 'DELETE'
				contentType: if form.formData.contentType? then form.formData.contentType else form.contentType
				dataType: 'json'
				headers: if form.sendCSRFTokenHeader then {'X-CSRFToken': form.getCsrfToken()} else {}
				complete: (response) ->
					form.request = null
					if form.actionNotification
						if form.onActionNotification?
							cb = form.onActionNotification(response, form)
							if cb? and not cb
								return false
					if response.status == 204
						if form.actionNotification and not form.onActionNotification?
							alert 'Deleted!'
						form.table.resetTable()
					else
						console.error 'unknown status'
					return
			})
			return
		if @edit and not @request?
			if @onDelete?
				cb = @onDelete(form, continueCallback)
				if cb? and not cb
					return
			else if not confirm('You are sure?')
				return
			continueCallback()
		return

	loadData: ->
		form = @
		if not @request?
			@request = $.getJSON(@formData.attrs.action, {},
				(fields) ->
					if form.getData?
						fields = form.getData(fields)
					for fieldData in form.fields
						if fieldData.fields? or fieldData instanceof Array
							for input in (if fieldData.fields? then fieldData.fields else fieldData)
								if fields[input.name]?
									form.fieldValue(input, fields)
						else if fields[fieldData.name]?
							form.fieldValue(fieldData, fields)
					form.request = null
					form.render()
					return
			)
		return

	fieldValue: (field, value) ->
		if field.name? and value[field.name]?
			if field.type == 'related' and value[field.text]?
				field.text = value[field.text]
			else if field.type == 'date' and new Date(value[field.name]).toString() != 'Invalid Date'
				value[field.name] = new Date(value[field.name])
			else if field.type == 'time' and value[field.name].length >= 4
				time = value[field.name].match(/(\d{2})(\.\d{3})?/g)
				value[field.name] = new Date(new Date().toISOString().substr(0, 11) + time.join(':') + 'Z')
			field.value = value[field.name]
		return

	sendData: ->
		if @onSubmit?
			cb = @onSubmit(@)
			if cb? and not cb
				return
		if not @request?
			data = {}
			tableForm = @
			for field in @form.find('[name]')
				if $(field).parent().is('.date-picker')
					fieldDate = $(field).attr('name')
					if $(field).datepicker('getDate')
						date = $(field).datepicker('getDate')
						date.setMinutes(-date.getTimezoneOffset())
						data[fieldDate] = date.toISOString().match(/^[^T]+/g)[0]
					else
						data[fieldDate] = ''
				else if $(field).parent().is('.time-picker')
					fieldDate = $(field).attr('name')
					if $(field).timepicker('getDate')
						data[fieldDate] = $(field).val().match(/(\d{2}:\d{2}(:\d{2})?)/g)
					else
						data[fieldDate] = ''
				else if $(field).attr('type') == 'checkbox'
					if $(field).is(':checked')
						data[$(field).attr('name')] = if $(field).val() then $(field).val() else 'on'
				else
					data[$(field).attr('name')] = $(field).val()
			contentType = if @formData.contentType? then @formData.contentType else @contentType
			@request = $.ajax({
				url: @formData.attrs.action
				data: if contentType == 'application/json' then JSON.stringify(data) else data
				type: if @formData.attrs.method? then @formData.attrs.method else (if @edit then 'PUT' else 'POST')
				contentType: contentType
				dataType: 'json'
				headers: if @sendCSRFTokenHeader then {'X-CSRFToken': @getCsrfToken()} else {}
				complete: (response) ->
					tableForm.request = null
					if tableForm.onComplete?
						cbReturn = tableForm.onComplete(tableForm, response)
						if cbReturn? and not cbReturn
							return
					tableForm.form.find('.field').removeClass('error').find('.error-text').text('')
					if response.status in [200, 201]
						if tableForm.actionNotification
							if tableForm.onActionNotification?
								cb = tableForm.onActionNotification(response, tableForm)
								if cb? and not cb
									return false
							else
								alert if response.status == 200 then 'Updated!' else 'Added!'
						tableForm.table.closeRowContainer(tableForm.form.closest('tr').index(), true)
						tableForm.table.resetTable()
					else if response.status == 400
						if '__all__' of response.responseJSON
							field = tableForm.form.find('[name]')
							if field.length
								fieldContainer = $(field).parent()
								fieldContainer.addClass('error')
								fieldContainer.find('.error-text').text(response.responseJSON['__all__'].join(', '))
						for field in tableForm.form.find('[name]')
							field = $(field)
							fieldContainer = field.parent()
							if fieldContainer.is('.date-picker')
								fieldContainer = fieldContainer.parent()
							if field.attr('name') of response.responseJSON
								fieldContainer.addClass('error')
								text = if fieldContainer.hasClass('multiple') and fieldContainer.find('.error-text').text() then "#{fieldContainer.find('.error-text').text()}, " else ''
								fieldContainer.find('.error-text').text(text + response.responseJSON[field.attr('name')].join(', '))
					else
						console.error 'unknown status'
					if tableForm.table?
						tableForm.table.body.trigger('scroll')
					return
			})
		return

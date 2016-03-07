var TableForm;

TableForm = (function() {
  TableForm.VERSION = '2.2.6';

  TableForm["default"] = {
    contentType: false,
    actionNotification: true,
    datePickerOptions: {
      dateFormat: 'dd/mm/yy'
    },
    timePickerOptions: {
      parse: 'loose',
      timeFormat: 'HH:mm:ss'
    },
    loadLength: 50,
    after: null,
    onSubmit: null,
    onComplete: null,
    onCancel: null,
    onActionNotification: null,
    onDelete: null,
    sendCSRFTokenHeader: true
  };

  function TableForm(data) {
    var i, prop, ref, value;
    this.edit = false;
    this.form = $('<div class="form" />');
    this.table = null;
    this.pinned = false;
    this.formData = null;
    this.getData = null;
    this.request = null;
    this.fields = [];
    this.actions = [];
    this.template = swig.compile('<form{% for attr, value in form.attrs %} {{attr}}="{{value}}"{% endfor %}> {% if form.name %}<p class="name {{form.name.attrs.class}}">{{form.name.label}}</p>{% endif %} {% for field in fields %} {% if field.type == "hidden" %}<input type="hidden" name="{{field.name}}" value="{{field.value}}" />{% else %} <div class="field{% if field.fields.length > 1 %} multiple{% endif %}{% if field.attrs.class %} {{field.attrs.class}}{% endif %}">{% if field.group %}<p class="group{% if field.group.class %} {{field.group.class}}{% endif %}">{% if field.group.label %}{{field.group.label}}{% else %}{{field.group}}{% endif %}</p>{% endif %}{% for input in field.fields %}{% if input.label and (not input.label.position or input.label.position and input.label.position == "before") %} <label for="{{_prefix}}input_{{input.name}}"{% if input.label.class or input.required %} class="{% if input.required %}required{% endif %}{% if input.label.class %} {{input.label.class}}{% endif %}"{% endif %}>{% if input.label.text %}{{input.label.text}}{% else %}{{input.label}}{% endif %}</label>{% endif %}{% if input.type == "textarea" %} <textarea id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" {% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}{% if input.length %} data-length="{{input.length}}"{% endif %}>{{input.value}}</textarea>{% elif input.type == "date" %} <div class="date-picker" id="{{_prefix}}input_{{input.name}}"><input type="text" name="{{input.name}}" value="{{input.value}}" {% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %} /></div>{% elif input.type == "time" %} <div class="time-picker" id="{{_prefix}}input_{{input.name}}"><input type="text" name="{{input.name}}" value="{{input.value}}"/></div>{% elif input.type == "select" %} <select id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" {% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}>{% for value, label in input.options %}<option value="{{value}}"{% if value == input.value %} selected="selected"{% endif %}>{{label}}</option>{% endfor %}</select>{% elif input.type == "related" %} <input type="hidden" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" data-select="related" value="{{input.value}}" data-text="{{input.text}}" data-url="{{input.url}}" data-placeholder="{{input.placeholder}}" data-order="{{input.order}}" data-results=\'{{input.results}}\'{% if input.related %} data-related=\'{{input.related|json}}\'{% endif %}{% if input.children %} data-children=\'{{input.children|json}}\'{% endif %}{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}/>{% elif input.type == "checkbox" %} <input type="checkbox" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}"{% if input.value %} checked="checked" {% endif %}{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %} />{% elif input.type == "text" or input.type == "digits" %} <input type="text" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" value="{{input.value}}" data-type="{{input.type}}"{% if input.length %} data-length="{{input.length}}"{% endif %}{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %} />{% else %} <input type="{{input.type}}" id="{{_prefix}}input_{{input.name}}" name="{{input.name}}" value="{{input.value}}"{% for attr, value in input.attrs %} {{attr}}="{{value}}"{% endfor %}{% if input.length %} data-length="{{input.length}}"{% endif %} />{% endif %}{% if input.label and (input.label.position and input.label.position == "after") %} <label for="{{_prefix}}input_{{input.name}}"{% if input.label.class or input.required %} class="{% if input.required %}required{% endif %}{% if input.label.class %} {{input.label.class}}{% endif %}"{% endif %}>{% if input.label.text %}{{input.label.text}}{% else %}{{input.label}}{% endif %}</label>{% endif %}{% endfor %} <span class="error-text"></span></div>{% endif %}{% endfor %}{% if actions.length %}{% for action in actions %} <button type="button" class="btn btn-{{action.id}}{% if action.class %} {{action.class}}{% endif %}"{% for attr, value in action.attrs %} {{attr}}="{{value}}"{% endfor %}>{{action.label}}</button>{% endfor %}{% else %} <button type="button" class="btn btn-success btn-ok">Ok</button> <button type="button" class="btn btn-danger btn-cancel">Cancel</button>{% endif %}</form>');
    ref = this.constructor["default"];
    for (prop in ref) {
      value = ref[prop];
      this[prop] = value;
    }
    for (i in data) {
      if (i in this) {
        this[i] = data[i];
      }
    }
    if ((this.formData.attrs != null) && this.formData.attrs.id) {
      this.prefix = this.formData.attrs.id;
    } else {
      this.prefix = "uid_" + (this.uid());
      while ($("[id^='" + this.prefix + "']").length) {
        this.prefix = "uid_" + (this.uid());
      }
    }
    return;
  }

  TableForm.prototype.getCsrfToken = function() {
    var c, ca, i, nameEQ;
    nameEQ = "csrftoken=";
    ca = document.cookie.split(";");
    i = 0;
    while (i < ca.length) {
      c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length).replace(/"/g, '');
      }
      i++;
    }
    return ca;
  };

  TableForm.prototype.uid = function() {
    return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
  };

  TableForm.prototype.bindForm = function() {
    var action, j, len, ref, tableForm;
    tableForm = this;
    this.form.find(":input").change(function() {
      tableForm.form.closest('tr').addClass('edited');
    });
    this.form.on('focus', 'input, textarea', function() {
      try {
        this.setSelectionRange(0, this.value.length);
      } catch (undefined) {}
    });
    this.form.on('keypress', 'input, textarea', function(e) {
      var charCode, input;
      input = $(e.target);
      if (input.data('length') != null) {
        if (input.val().length >= parseInt(input.data('length'))) {
          return false;
        }
      }
      if (input.data('type') != null) {
        switch (input.data('type')) {
          case 'digits':
            charCode = e.charCode != null ? e.charCode : e.keyCode;
            if (charCode && (charCode > 57 || charCode < 48)) {
              return false;
            }
        }
      }
    });
    this.form.on('keyup', 'input', function(e) {
      var next;
      if (e.keyCode === 13) {
        next = $(e.target).nextAll('input, textarea, select').not('.skip-focus').first();
        if (!next.length) {
          next = $(e.target).closest('.field').nextAll('.field').not('.skip-focus').first().find('input, textarea, select');
        }
        if (!next.length) {
          next = tableForm.form.find('.btn-ok');
        }
        return next.first().focus();
      }
    });
    if ($.fn.datepicker != null) {
      this.form.find('.date-picker input').datepicker(this.datePickerOptions);
      this.form.find('.date-picker').click(function() {
        $(this).find('input').datepicker('show');
      });
    }
    if ($.fn.timepicker != null) {
      this.form.find('.time-picker input').timepicker(this.timePickerOptions);
      this.form.find('.time-picker').click(function() {
        $(this).find('input').timepicker('show');
      });
    }
    this.form.find('[data-select=related]').each(function() {
      return $(this).select2($.extend(true, ($(this).data('options') ? $(this).data('options') : {}), {
        initSelection: function(element, callback) {
          var data, related;
          related = element.data();
          data = {
            id: element.val(),
            text: related.text
          };
          callback(data);
        },
        query: function(queryObj) {
          var data, postData, related;
          related = queryObj.element.data();
          data = {
            more: false,
            results: []
          };
          if (related.related != null) {
            if (typeof related.related === 'object') {
              postData = $.extend({}, related.related);
            } else {
              postData = {
                related: related.related
              };
            }
          } else {
            postData = {};
          }
          postData.select = true;
          postData.ordering = related.order;
          postData.text = queryObj.term;
          postData.start = (queryObj.page - 1) * tableForm.loadLength;
          postData.length = tableForm.loadLength;
          postData[related.results.term] = queryObj.term;
          $.getJSON(related.url, postData, function(list) {
            var element, j, len;
            data.more = list.length === tableForm.loadLength;
            for (j = 0, len = list.length; j < len; j++) {
              element = list[j];
              if (related.format != null) {
                element = related.format(element);
              }
              data.results.push({
                id: element[related.results.id].toString(),
                text: element[related.results.text].toString()
              });
            }
            queryObj.callback(data);
          });
        }
      })).change(function(e) {
        var child, disable, element, j, len, ref, ref1, related, relatedData, select, state, value;
        element = $(e.target);
        related = element.data();
        if (related.children != null) {
          ref = related.children;
          for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            select = tableForm.form.find("[name=" + child + "]");
            relatedData = select.data();
            if ((related.results.reference != null) && (relatedData['related'] != null) && typeof relatedData['related'] === 'object') {
              relatedData['related'][related.results.reference] = element.val();
            } else {
              relatedData['related'] = element.val();
            }
            if (relatedData['relatedElements'] == null) {
              relatedData['relatedElements'] = {};
            }
            relatedData['relatedElements'][element.attr('name')] = !!element.val();
            select.data(relatedData);
            if (e.added != null) {
              select.select2('val', '').trigger('change');
            }
            disable = false;
            ref1 = relatedData['relatedElements'];
            for (state in ref1) {
              value = ref1[state];
              if (!value) {
                disable = true;
              }
            }
            select.prop('disabled', disable);
          }
        }
      }).trigger('change');
    });
    this.form.find('.btn-cancel').click(function() {
      var cb;
      if (tableForm.onCancel != null) {
        cb = tableForm.onCancel(tableForm);
        if ((cb != null) && !cb) {
          return;
        }
      }
      if (tableForm.table != null) {
        tableForm.table.closeRowContainer(tableForm.form.closest('tr.row-content').index());
      }
    });
    this.form.find('.btn-ok').click(function() {
      tableForm.sendData();
    });
    ref = this.actions;
    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];
      if (action.callback != null) {
        (function(action) {
          tableForm.form.find(".btn-" + action.id).click(function() {
            action.callback(tableForm);
          });
        })(action);
      }
    }
    this.form.on('submit', function() {
      tableForm.sendData();
      return false;
    });
  };

  TableForm.prototype.render = function() {
    var field, fieldData, form, input, j, k, len, len1, ref, ref1, time;
    form = this;
    if (this.edit && !this.form.html() && (this.request == null)) {
      this.form.html($('<em />').text('Loading form data'));
      this.formData.attrs.action = "" + this.formData.attrs.action + this.edit + "/";
      this.loadData();
    } else {
      fieldData = [];
      ref = this.fields;
      for (j = 0, len = ref.length; j < len; j++) {
        field = ref[j];
        if ((field.type != null) && field.type === 'hidden') {
          fieldData.push(field);
        }
        if (field instanceof Array) {
          fieldData.push({
            fields: field
          });
        } else if (field.fields == null) {
          fieldData.push({
            fields: [field]
          });
        } else {
          fieldData.push(field);
        }
        ref1 = fieldData[fieldData.length - 1].fields;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          input = ref1[k];
          if (input.type === 'related' && (input.children != null) && typeof input.children === 'string') {
            input.children = [input.children];
          }
          if (input.value != null) {
            if (input.type === 'date' && ($.fn.datepicker != null) && new Date(input.value).toString() !== 'Invalid Date') {
              input.value = $.datepicker.formatDate(this.datePickerOptions.dateFormat, new Date(input.value));
            }
            if (input.type === 'time' && ($.fn.timepicker != null)) {
              time = new Date(input.value);
              if (time.toString() === 'Invalid Date' && input.value.match(/(\d{2})(\.\d{3})?/g)) {
                time = new Date(new Date().toISOString().substr(0, 11) + input.value.match(/(\d{2})(\.\d{3})?/g).join(':') + 'Z');
              }
              if (time.toString() !== 'Invalid Date') {
                input.value = $.datepicker.formatTime(this.timePickerOptions.timeFormat, {
                  hour: time.getUTCHours(),
                  minute: time.getUTCMinutes(),
                  second: time.getUTCSeconds()
                });
              }
            }
          }
        }
      }
      this.form.html($(this.template({
        form: this.formData,
        fields: fieldData,
        actions: this.actions,
        _prefix: this.prefix + "_"
      })));
      this.bindForm();
      if ((this.table != null) && this.form.closest('.row-content').length) {
        this.table.scrollRowContainer(this.form.closest('.row-content'));
      }
      setTimeout(function() {
        if (form.form.find('.auto-focus').length) {
          form.form.find('.auto-focus').focus();
        } else {
          form.form.find(':input:visible:not([disabled]):first').focus();
        }
        if (form.after != null) {
          form.after(form);
        }
      }, 0);
    }
    return this.form;
  };

  TableForm.prototype.delData = function() {
    var cb, continueCallback, form;
    form = this;
    continueCallback = function() {
      var data;
      data = [];
      form.formData.attrs.action = "" + form.formData.attrs.action + form.edit + "/";
      form.request = $.ajax({
        url: form.formData.attrs.action,
        data: JSON.stringify(data),
        type: form.formData.attrs.method != null ? form.formData.attrs.method : 'DELETE',
        contentType: form.formData.contentType != null ? form.formData.contentType : form.contentType,
        dataType: 'json',
        headers: form.sendCSRFTokenHeader ? {
          'X-CSRFToken': form.getCsrfToken()
        } : {},
        complete: function(response) {
          var cb;
          form.request = null;
          if (form.actionNotification) {
            if (form.onActionNotification != null) {
              cb = form.onActionNotification(response, form);
              if ((cb != null) && !cb) {
                return false;
              }
            }
          }
          if (response.status === 204) {
            if (form.actionNotification && (form.onActionNotification == null)) {
              alert('Deleted!');
            }
            form.table.resetTable();
          } else {
            console.error('unknown status');
          }
        }
      });
    };
    if (this.edit && (this.request == null)) {
      if (this.onDelete != null) {
        cb = this.onDelete(form, continueCallback);
        if ((cb != null) && !cb) {
          return;
        }
      } else if (!confirm('You are sure?')) {
        return;
      }
      continueCallback();
    }
  };

  TableForm.prototype.loadData = function() {
    var form;
    form = this;
    if (this.request == null) {
      this.request = $.getJSON(this.formData.attrs.action, {}, function(fields) {
        var fieldData, input, j, k, len, len1, ref, ref1;
        if (form.getData != null) {
          fields = form.getData(fields);
        }
        ref = form.fields;
        for (j = 0, len = ref.length; j < len; j++) {
          fieldData = ref[j];
          if ((fieldData.fields != null) || fieldData instanceof Array) {
            ref1 = (fieldData.fields != null ? fieldData.fields : fieldData);
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              input = ref1[k];
              if (fields[input.name] != null) {
                form.fieldValue(input, fields);
              }
            }
          } else if (fields[fieldData.name] != null) {
            form.fieldValue(fieldData, fields);
          }
        }
        form.request = null;
        form.render();
      });
    }
  };

  TableForm.prototype.fieldValue = function(field, value) {
    var time;
    if ((field.name != null) && (value[field.name] != null)) {
      if (field.type === 'related' && (value[field.text] != null)) {
        field.text = value[field.text];
      } else if (field.type === 'date' && new Date(value[field.name]).toString() !== 'Invalid Date') {
        value[field.name] = new Date(value[field.name]);
      } else if (field.type === 'time' && value[field.name].length >= 4) {
        time = value[field.name].match(/(\d{2})(\.\d{3})?/g);
        value[field.name] = new Date(new Date().toISOString().substr(0, 11) + time.join(':') + 'Z');
      }
      field.value = value[field.name];
    }
  };

  TableForm.prototype.sendData = function() {
    var cb, contentType, data, date, field, fieldDate, j, len, ref, tableForm;
    if (this.onSubmit != null) {
      cb = this.onSubmit(this);
      if ((cb != null) && !cb) {
        return;
      }
    }
    if (this.request == null) {
      data = {};
      tableForm = this;
      ref = this.form.find('[name]');
      for (j = 0, len = ref.length; j < len; j++) {
        field = ref[j];
        if ($(field).parent().is('.date-picker')) {
          fieldDate = $(field).attr('name');
          if ($(field).datepicker('getDate')) {
            date = $(field).datepicker('getDate');
            date.setMinutes(-date.getTimezoneOffset());
            data[fieldDate] = date.toISOString().match(/^[^T]+/g)[0];
          } else {
            data[fieldDate] = '';
          }
        } else if ($(field).parent().is('.time-picker')) {
          fieldDate = $(field).attr('name');
          if ($(field).timepicker('getDate')) {
            data[fieldDate] = $(field).val().match(/(\d{2}:\d{2}(:\d{2})?)/g);
          } else {
            data[fieldDate] = '';
          }
        } else if ($(field).attr('type') === 'checkbox') {
          if ($(field).is(':checked')) {
            data[$(field).attr('name')] = $(field).val() ? $(field).val() : 'on';
          }
        } else {
          data[$(field).attr('name')] = $(field).val();
        }
      }
      contentType = this.formData.contentType != null ? this.formData.contentType : this.contentType;
      this.request = $.ajax({
        url: this.formData.attrs.action,
        data: contentType === 'application/json' ? JSON.stringify(data) : data,
        type: this.formData.attrs.method != null ? this.formData.attrs.method : (this.edit ? 'PUT' : 'POST'),
        contentType: contentType,
        dataType: 'json',
        headers: this.sendCSRFTokenHeader ? {
          'X-CSRFToken': this.getCsrfToken()
        } : {},
        complete: function(response) {
          var cbReturn, fieldContainer, k, len1, ref1, ref2, text;
          tableForm.request = null;
          if (tableForm.onComplete != null) {
            cbReturn = tableForm.onComplete(tableForm, response);
            if ((cbReturn != null) && !cbReturn) {
              return;
            }
          }
          tableForm.form.find('.field').removeClass('error').find('.error-text').text('');
          if ((ref1 = response.status) === 200 || ref1 === 201) {
            if (tableForm.actionNotification) {
              if (tableForm.onActionNotification != null) {
                cb = tableForm.onActionNotification(response, tableForm);
                if ((cb != null) && !cb) {
                  return false;
                }
              } else {
                alert(response.status === 200 ? 'Updated!' : 'Added!');
              }
            }
            tableForm.table.closeRowContainer(tableForm.form.closest('tr').index(), true);
            tableForm.table.resetTable();
          } else if (response.status === 400) {
            if ('__all__' in response.responseJSON) {
              field = tableForm.form.find('[name]');
              if (field.length) {
                fieldContainer = $(field).parent();
                fieldContainer.addClass('error');
                fieldContainer.find('.error-text').text(response.responseJSON['__all__'].join(', '));
              }
            }
            ref2 = tableForm.form.find('[name]');
            for (k = 0, len1 = ref2.length; k < len1; k++) {
              field = ref2[k];
              field = $(field);
              fieldContainer = field.parent();
              if (fieldContainer.is('.date-picker')) {
                fieldContainer = fieldContainer.parent();
              }
              if (field.attr('name') in response.responseJSON) {
                fieldContainer.addClass('error');
                text = fieldContainer.hasClass('multiple') && fieldContainer.find('.error-text').text() ? (fieldContainer.find('.error-text').text()) + ", " : '';
                fieldContainer.find('.error-text').text(text + response.responseJSON[field.attr('name')].join(', '));
              }
            }
          } else {
            console.error('unknown status');
          }
          if (tableForm.table != null) {
            tableForm.table.body.trigger('scroll');
          }
        }
      });
    }
  };

  return TableForm;

})();

//# sourceMappingURL=TableForm.js.map

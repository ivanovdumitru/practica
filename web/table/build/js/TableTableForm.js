var Table,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Table = (function() {
  Table.VERSION = '1.2.0';

  Table["default"] = {
    start: 0,
    length: 100,
    loadMoreLength: 50,
    fromBottomNextPage: 50,
    attrs: {},
    actions: [],
    columns: [],
    footer: [],
    rows: [],
    url: '',
    datePickerOptions: {
      dateFormat: 'dd/mm/yy',
      constrainInput: true
    },
    timePickerOptions: {
      timeFormat: 'HH:mm'
    },
    showDefaultOrder: false,
    editedNotification: true,
    contextMenu: true,
    selectable: true,
    selectFirst: false,
    defaultAction: null,
    scrollAlign: 'right',
    arrowNavigation: false,
    height: null,
    heightOfParent: null,
    MSSQLPagination: false,
    filterTimeOut: 300,
    autoRefresh: true,
    margin: null
  };

  function Table(data) {
    var i, prop, ref, value;
    this.request = null;
    this.existMore = true;
    this.order = '';
    this.filter = {};
    this.actionsDiv = $('<div />');
    this.menuDiv = $('<ul />');
    this.table = $('<div class="table" />');
    this.head = $('<div class="head" />');
    this.body = $('<div class="body" />');
    this.foot = $('<div class="foot" />');
    this.onOrder = null;
    this.onFilter = null;
    this.onGetData = null;
    this.onRowSelect = null;
    this.onCloseRowContainer = null;
    this.current = null;
    swig.setFilter('hasValue', function(input) {
      return typeof input.value !== 'undefined';
    });
    this.templates = {
      actions: swig.compile('{% for action in actions %}{% if not action.element %}<button type="button" class="btn {{action.class}}" data-action="{{action.id}}">{{action.label}}</button>{% endif%}{% endfor %}'),
      menu: swig.compile('{% for action in actions %}<li data-action="{{action.id}}">{{action.label}}</li>{% endfor %}'),
      columns: swig.compile('<table><thead><tr>{% for i in Array.prototype.constructor.call(null, rows.columns) %}<th class="col-{{loop.index0}}"></th>{% endfor %}</tr></thead><tbody>{% for row in rows %}<tr>{% for column in row %}<td{% if column.attrs and column.attrs.class %} class="{{column.attrs.class}}"{% endif %}{% for attr, value in column.attrs %}{% if attr != "width" and attr != "class" %} {{attr}}="{{value}}"{% endif %}{% endfor %}>{% if column.label %}<label{% if column.name and column.order %} data-order="{{column.name}}" class="order{% if order and order.field == column.name %} {{order.sort}}{% endif %}"{% endif %}{% if column.label.key %} data-i18n="{{column.label.key}}">{{column.label.text}}{% else %}>{{column.label}}{% endif %}</label>{% endif %} {% if column.filter == "select" %}<select name="{{column.name}}">{% for option in column.filterData %}<option value="{{option.value}}"{% if column.filterValue and column.filterValue == option.value %} selected="selected"{% endif %}{% if option.label.key %} data-i18n="{{option.label.key}}">{{option.label.text}}{% else %}>{{option.label}}{% endif %}</option>{% endfor %}</select>{% elif column.filter == "date" or column.filter == "datetime" or column.filter == "time" %}{% if column.filter != "time" %}<div class="date-picker"><input autocomplete="off" type="text" name="{{column.name}}{% if column.filter == "datetime" %}[date]{% endif %}" value="{{column.filterValue}}"/></div>{% endif %}{% if column.filter != "date" %}<div class="time-picker"><input autocomplete="off" type="text" name="{{column.name}}{% if column.filter == "datetime" %}[time]{% endif %}" value="{{column.filterValue}}"/></div>{% endif %}{% elif column.filter == "text" %}<input autocomplete="off" type="text" name="{{column.name}}" value="{{column.filterValue}}"/>{% elif column.filter == "number" or column.filter == "comparison" %}<input autocomplete="off" type="text" name="{{column.name}}" class="number{% if column.filter == "comparison" %} comparison{% if column.extendedFilter %} extended{% endif %}{% endif %}" value="{{column.filterValue}}"/>{% elif column.filter %}<input autocomplete="off" type="{{column.filter}}" name="{{column.name}}" value="{{column.filterValue}}"/>{% endif %}</td>{% endfor %}</tr>{% endfor %}</tbody></table>'),
      rows: swig.compile('{% if rows.head %}<table><thead><tr>{% for i in Array.prototype.constructor.call(null, rows.columns) %}<th class="col-{{loop.index0}}"></th>{% endfor %}</tr></thead><tbody>{% endif %}{% for row in rows %}<tr{% if row.attrs %}{% for attr, value in row.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}>{% for cell in row.cells %}<td{% if cell.attrs %}{% for attr, value in cell.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}{% if cell|hasValue %}{% if not cell.safe %} title="{{cell.value}}"{% endif %}>{% if cell.safe %}{{cell.value|safe}}{% else %}{{cell.value}}{% endif %}{% else %} title="{{cell}}">{{cell}}{% endif %}</td>{% endfor %}</tr>{% endfor %}{% if rows.head %}</tbody></table>{% endif %}'),
      foot: swig.compile('<table><thead><tr>{% for i in Array.prototype.constructor.call(null, rows.columns) %}<th class="col-{{loop.index0}}"></th>{% endfor %}</tr></thead><tbody>{% for row in rows %}<tr{% if row.attrs %}{% for attr, value in row.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}>{% for cell in row.cells %}<td{% if cell.attrs %}{% for attr, value in cell.attrs %} {{attr}}="{{value}}"{% endfor %}{% endif %}{% if cell|hasValue %}{% if not cell.safe %} title="{{cell.value}}"{% endif %}>{% if cell.safe %}{{cell.value|safe}}{% else %}{{cell.value}}{% endif %}{% else %} title="{{cell}}">{{cell}}{% endif %}</td>{% endfor %}</tr>{% endfor %}</tbody><tfoot><tr><th colspan="{{rows.columns}}"><div class="spinner"><div></div><div></div><div></div><div></div></div></th></tr></tfoot></table>')
    };
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
    this.tableBinds();
  }

  Table.prototype.getData = function() {
    var data, filter, ref, table, value;
    table = this;
    data = {
      start: this.start,
      length: table.start ? table.loadMoreLength : table.length
    };
    if (this.order) {
      data.ordering = this.order;
    }
    if (this.filter) {
      ref = this.filter;
      for (filter in ref) {
        value = ref[filter];
        data[filter] = value;
      }
    }
    if (table.start && (this.MSSQLData != null)) {
      data.lastRow = this.MSSQLData;
    }
    if (this.existMore) {
      this.table.addClass('loading');
      this.request = $.getJSON(this.url, data, function(response) {
        table.table.removeClass('loading');
        table.request = null;
        if (table.MSSQLPagination) {
          table.MSSQLData = response[response.length - 1];
        }
        if (table.onGetData != null) {
          response = table.onGetData(response, table);
        }
        table.renderRows(response, !!table.start);
        if (!response.length || response.length < (table.start ? table.loadMoreLength : table.length)) {
          return table.existMore = false;
        } else {
          return table.start += response.length;
        }
      }).always(function() {
        table.table.removeClass('loading');
        table.request = null;
      });
    }
  };

  Table.prototype.nextPage = function() {
    if (this.request == null) {
      this.getData();
    }
  };

  Table.prototype.resetTable = function() {
    if (this.request != null) {
      this.request.abort();
    }
    this.request = null;
    this.start = 0;
    this.existMore = true;
    this.body.html('');
    this.getData();
    this.updateActions();
  };

  Table.prototype.columnsBinds = function() {
    this.orderBind();
    this.filterBind();
  };

  Table.prototype.filterBind = function() {
    var datePickerOptions, filter, table, timePickerOptions;
    table = this;
    filter = null;
    if ($.fn.datepicker != null) {
      datePickerOptions = $.extend({}, this.datePickerOptions);
      datePickerOptions.showOn = 'button';
      if ((datePickerOptions.constrainInput != null) && datePickerOptions.constrainInput) {
        datePickerOptions.constrainInput = false;
      }
      this.head.find('.date-picker input').datepicker(datePickerOptions);
      this.head.find('.date-picker .ui-datepicker-trigger').attr('tabIndex', -1);
      if ((this.datePickerOptions.constrainInput != null) && this.datePickerOptions.constrainInput) {
        this.head.find('.date-picker input').on('keydown.table blur', function(e) {
          var c, change, changeValue, date, dateFormat, i, j, k, len, now, ref, ref1, restOfYear, val;
          if (((ref = e.keyCode) === 13 || ref === 9) || e.type === 'blur') {
            now = new Date();
            date = {
              d: '',
              m: '',
              y: ''
            };
            dateFormat = datePickerOptions.dateFormat.replace(/[^\w]/g, '').replace(/y/g, 'yy');
            val = $(this).val();
            if (val.match(/^(\+|-)\d+$/g)) {
              now.setDate(now.getDate() + parseInt(val));
            } else if (val.match(/^\d+$/)) {
              for (i = j = 0, len = dateFormat.length; j < len; i = ++j) {
                c = dateFormat[i];
                if (i < val.length) {
                  date[c] += val[i];
                }
              }
              if (date.y.length !== 4) {
                restOfYear = '';
                for (i = k = 0, ref1 = 4 - date.y.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
                  restOfYear += now.getFullYear().toString()[i];
                }
                date.y = restOfYear + date.y;
              }
            } else if (val.match(/^((\+|-)(\d+)(d|m|y)){1,3}$/ig)) {
              while (val.match(/((\+|-)(\d+)(d|m|y))/i)) {
                change = val.match(/((\+|-)(\d+)(d|m|y))/i)[0];
                val = val.replace(change, '');
                changeValue = parseInt(change.slice(0, -1));
                if (change.toLowerCase().slice(-1) === 'd') {
                  now.setDate(now.getDate() + changeValue);
                }
                if (change.toLowerCase().slice(-1) === 'm') {
                  now.setMonth(now.getMonth() + changeValue);
                }
                if (change.toLowerCase().slice(-1) === 'y') {
                  now.setFullYear(now.getFullYear() + changeValue);
                }
              }
            } else {
              $(this).trigger('change');
              return;
            }
            if (date.d) {
              now.setDate(parseInt(date.d));
            }
            if (date.m) {
              now.setMonth(parseInt(date.m) - 1);
            }
            if (date.y) {
              now.setFullYear(parseInt(date.y));
            }
            $(this).datepicker('setDate', now);
            $(this).trigger('change');
          }
        });
        this.head.find('.date-picker input').each(function() {
          var allEvents, typeEvents;
          allEvents = $(this).data('events') || $._data($(this)[0], 'events');
          typeEvents = allEvents['keydown'];
          typeEvents.unshift(typeEvents.pop());
        });
      }
      this.head.find('.date-picker input').on('change keyup.table', function(e) {
        var dateInput;
        dateInput = $(this).val();
        if (e.type === 'keyup' && !((e.keyCode != null) && e.keyCode === 13 || !dateInput.length || dateInput.length === table.datePickerOptions.dateFormat.replace(/y/g, 'yy').length)) {
          return;
        }

        /*
        				if dateInput.length == 0 && $(@).datepicker.is(':focus')
        					$(@).datepicker('hide')
         */
        if (table.datePickerOptions.datePickerToFormat != null) {
          filter = table.datePickerOptions.datePickerToFormat(dateInput);
          if (filter === 'Invalid Date' || (filter == null)) {
            filter = null;
          } else {
            if (e.type === 'keyup' && !(e.ctrlKey || e.keyCode === 17)) {
              $(this).datepicker('setDate', filter);
            }
            filter = filter.toISOString();
          }
        } else {
          filter = dateInput;
        }
        table.doFilter(this, filter);
      });
    }
    if ($.fn.timepicker != null) {
      timePickerOptions = $.extend({}, this.timePickerOptions);
      timePickerOptions.showOn = 'button';
      this.head.find('.time-picker input').timepicker(timePickerOptions);
      this.head.find('.time-picker .ui-datepicker-trigger').attr('tabIndex', -1);
      if ((timePickerOptions.showSecond != null) && timePickerOptions.showSecond) {
        this.head.find('.time-picker').addClass('seconds');
      }
      this.head.find('.time-picker input').on('change keyup.table', function(e) {
        var timeInput;
        timeInput = $(this).val();
        if (e.type === 'keyup' && !((e.keyCode != null) && e.keyCode === 13 || !timeInput.length || timeInput.length === table.timePickerOptions.timeFormat.length)) {
          return;
        }
        if (table.timePickerOptions.timePickerToFormat != null) {
          filter = table.datePickerOptions.datePickerToFormat(timeInput);
        } else {
          filter = timeInput;
        }
        table.doFilter(this, filter, false);
      });
    }
    this.head.find('input').on('focus.table', function() {
      $(this).select();
    });
    this.head.find('input').on('keypress.table', function(e) {
      var keyCode, ref, value;
      if (!e.charCode) {
        return;
      }
      if ($(this).hasClass('number')) {
        keyCode = e.which || e.keyCode;
        if (keyCode < 48 || keyCode > 57) {
          value = $(this).val();
          if ($(this).hasClass('comparison') && (!value.match(/\./) && keyCode === 46 || (!value.match(/[=><]/) || $(this).hasClass('extended') && (value.match(/([=><]+)/g) && ((ref = value.match(/([=><]+)/g)[0] + String.fromCharCode(keyCode)) === '<=' || ref === '<>' || ref === '>='))) && (keyCode === 62 || keyCode === 61 || keyCode === 60))) {
            return;
          }
          return false;
        }
      }
    });
    this.head.find('input').on('keyup.table', function() {
      if (!$(this).parent().hasClass('date-picker') && !$(this).parent().hasClass('time-picker')) {
        filter = $(this).val();
        table.doFilter(this, filter, false);
      }
    });
    this.head.find('select').on('change', function() {
      table.doFilter(this, $(this).val());
    });
    this.head.find('input:checkbox').on('change', function() {
      table.doFilter(this, $(this).prop("checked"));
    });
  };

  Table.prototype.doFilter = function(element, filter, doNow) {
    var name, oldFilter, table;
    if (doNow == null) {
      doNow = true;
    }
    oldFilter = $.extend(true, {}, this.filter);
    name = $(element).attr('name');
    table = this;
    if (this.timeoutBind == null) {
      this.timeoutBind = null;
    }
    if (this.onFilter != null) {
      this.onFilter(element, filter);
    } else {
      if ((filter != null) && !filter) {
        filter = null;
      }
      if (filter != null) {
        this.filter[name] = filter;
      } else {
        delete this.filter[name];
      }
      if (oldFilter[name] !== this.filter[name] && this.autoRefresh) {
        clearTimeout(this.timeoutBind);
        if (doNow) {
          table.resetTable();
        } else {
          this.timeoutBind = setTimeout(function() {
            table.resetTable();
          }, table.filterTimeOut);
        }
      }
    }
  };

  Table.prototype.orderBind = function() {
    var table;
    table = this;
    this.head.find('label.order').on('click.table', function() {
      var oldOrder, orderBy, orderByIndex;
      if (table.request) {
        return false;
      }
      oldOrder = table.order;
      orderBy = $(this).data('order');
      orderByIndex = table.order.indexOf(orderBy);
      table.head.find('label.order').removeClass('asc desc');
      if (orderByIndex !== -1) {
        if (orderByIndex) {
          table.order = orderBy;
          $(this).addClass('asc');
        } else {
          table.order = "-" + orderBy;
          $(this).addClass('desc');
        }
      } else {
        table.order = orderBy;
        $(this).addClass('asc');
      }
      if (table.onOrder != null) {
        table.onOrder(table.order);
      } else {
        if (oldOrder !== table.order) {
          table.resetTable();
        }
      }
      return false;
    });
  };

  Table.prototype.tableBinds = function() {
    var action, actionsDiv, defaultAction, j, len, ref, table;
    table = this;
    this.bindActions();
    if (this.contextMenu) {
      this.body.on('contextmenu.table', 'tr:not(.row-content)', function(e) {
        table.menu(this, e);
        return false;
      });
    }
    if (this.selectable) {
      this.body.on('mousedown.table', 'tr:not(.row-content)', function() {
        if (table.request != null) {
          return false;
        }
        if (table.rowSelect($(this).index() - $(this).prevAll('.row-content').length, this)) {
          $(table.body).find('tr').removeClass('active');
          $(this).addClass('active');
        }
      });
    }
    if (this.defaultAction && this.actions) {
      ref = this.actions;
      for (j = 0, len = ref.length; j < len; j++) {
        action = ref[j];
        if (action.id === this.defaultAction) {
          defaultAction = action;
          actionsDiv = this.actionsDiv;
          this.body.on('dblclick.table', 'tr:not(.row-content)', function() {
            if (table.request != null) {
              return false;
            }
            document.getSelection().removeAllRanges();
            if (actionsDiv.find("[data-action=" + defaultAction.id + "]").length) {
              actionsDiv.find("[data-action=" + defaultAction.id + "]").trigger('click.table');
            } else {
              defaultAction.callback(table.rows[table.current], table);
            }
          });
        }
      }
    }
    this.body.on('scroll.table', function() {
      var bodyHeight, bodyPos, fromBottom, lastHeight, lastPos, positionLimit;
      if (table.body.find('tr.row-content').find('form').length) {
        positionLimit = {
          top: table.body.position().top,
          bottom: table.body.position().top + table.body.height()
        };
        table.body.find('tr.row-content').find('form').find('.error').each(function() {
          var toolTip, top;
          top = $(this).position().top;
          toolTip = $(this).find('.error-text');
          if (top > positionLimit.top && top + toolTip.height() < positionLimit.bottom) {
            toolTip.css('top', top);
          } else {
            toolTip.css('top', -9999);
          }
        });
      }
      bodyPos = table.body.position();
      bodyHeight = table.body.height();
      if (table.body.find('tbody tr').length) {
        lastPos = table.body.find('tbody tr:last').position();
        lastHeight = table.body.find('tbody tr:last').outerHeight();
        fromBottom = (lastPos.top + lastHeight) - (bodyHeight + bodyPos.top);
        if (fromBottom < table.fromBottomNextPage && fromBottom >= 0) {
          table.nextPage();
        }
      }
    });
    $('body').off('keydown.table');
    $('body').on('keydown.table', function(e) {
      var E, H, RM, ST, body, newRow, row, tables;
      if (!(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) || $(e.target).is('input, textarea, select')) {
        return;
      }
      tables = $('.table-data.arrow-navigation:visible');
      if (tables.find('.body tr.active').length) {
        tables = tables.find('.body tr.active').closest('.table-data');
        if (tables.filter('.active').length) {
          tables = tables.filter('.active');
        } else {
          tables = tables.first();
        }
        body = $('.body', tables);
        row = $('tr.active', tables);
        if (row.length) {
          if (e.keyCode === 13) {
            row.trigger('dblclick.table');
          } else {
            if (e.keyCode === 38) {
              newRow = row.prevAll().not('.row-content');
            } else {
              newRow = row.nextAll().not('.row-content');
            }
            newRow = newRow.first();
            if (newRow.length) {
              newRow.trigger('mousedown.table');
              H = body.height();
              E = newRow.height();
              ST = body.scrollTop();
              RM = newRow.offset().top - body.offset().top;
              if (RM < 0) {
                body.scrollTop(ST + RM);
              } else if (RM + E > H) {
                body.scrollTop((RM - H) + ST + E);
              }
            }
          }
        }
      }
    });
  };

  Table.prototype.menu = function(element, event) {
    var action, j, left, len, menuAction, ref, ref1, table, top;
    if (this.contextMenu) {
      this.menuDiv.html(this.templates.menu({
        actions: this.actions
      }));
      table = this;
      ref = this.actions;
      for (j = 0, len = ref.length; j < len; j++) {
        action = ref[j];
        this.menuDiv.attr({
          id: 'contextmenu'
        }).find("[data-action=" + action.id + "]").data('action-data', action).on('mousedown.table', function() {
          action = $(this).data('action-data');
          if (action.callback != null) {
            action.callback(table.rows[table.current], table);
          }
        });
        menuAction = this.menuDiv.find("[data-action=" + action.id + "]");
        if (!((action.global != null) || action.global) && ($(element).data('action-disabled') != null) && (ref1 = action.id, indexOf.call($(element).data('action-disabled'), ref1) >= 0)) {
          menuAction.addClass('disabled');
        } else {
          menuAction.removeClass('disabled');
        }
      }
      $(document.body).append(this.menuDiv);
      top = event.clientY;
      left = event.clientX;
      if (top + this.menuDiv.height() + 5 > $(document).height()) {
        top -= this.menuDiv.height();
      }
      if (left + this.menuDiv.width() + 5 > $(document).width()) {
        left -= this.menuDiv.width();
      }
      this.menuDiv.css({
        top: top,
        left: left
      });
      $(document).on('mousedown.table', function() {
        $('#contextmenu').remove();
        return $(document).unbind('mousedown.table');
      });
    }
  };

  Table.prototype.rowSelect = function(rowIndex, element) {
    this.current = rowIndex;
    this.updateActions(element);
    if (this.onRowSelect != null) {
      return this.onRowSelect(this.rows[rowIndex], element);
    }
    return true;
  };

  Table.prototype.addRowContainer = function(content, pinned) {
    var container, rowContainer, rows;
    if (pinned == null) {
      pinned = false;
    }
    rowContainer = $('<tr />');
    container = $("<td colspan=\"" + this.cols + "\" />");
    container.html(content);
    rowContainer.addClass('row-content').html(container);
    if (pinned) {
      if (this.body.find('tr.active').next().hasClass('row-content')) {
        return;
      }
      rowContainer.addClass('pinned');
      rowContainer.insertAfter(this.body.find('tr.active'));
      this.updateActions(this.body.find('tr.active'));
    } else {
      if (!this.body.find('tbody').length) {
        rows = [];
        rows.columns = this.cols;
        rows.head = true;
        this.body.html(this.templates.rows({
          rows: rows
        }));
      }
      this.body.find('tbody').prepend(rowContainer);
    }
    this.scrollRowContainer(rowContainer);
    return rowContainer;
  };

  Table.prototype.scrollRowContainer = function(rowContainer) {
    var topPosition;
    this.rowResize();
    topPosition = this.body.position();
    if (rowContainer.hasClass('pinned')) {
      topPosition.top += this.body.find('tr.active').height();
    }
    this.body.scrollTop(this.body.scrollTop() + (rowContainer.position().top - topPosition.top));
  };

  Table.prototype.closeRowContainer = function(index, force) {
    var cb, continueCallback, rowContainer, rowContainers, table;
    if (force == null) {
      force = false;
    }
    table = this;
    rowContainers = this.body.find('tbody tr');
    if (!this.editedNotification) {
      force = true;
    }
    if (rowContainers.length > index) {
      rowContainer = rowContainers.eq(index);
      continueCallback = function() {
        var rowActive;
        rowActive = rowContainer.prev('.active');
        rowContainer.remove();
        if (rowActive.length) {
          table.updateActions(rowActive);
        }
        if (!table.body.find('tbody tr').length) {
          table.body.html('');
        }
        table.rowResize();
      };
      if (this.onCloseRowContainer != null) {
        cb = this.onCloseRowContainer(index, force, this, rowContainer, continueCallback);
        if ((cb != null) && !cb) {
          return false;
        }
      } else if (!force && rowContainer.is('.edited') && !confirm('You are sure?\n Added/edited data not was saved')) {
        return false;
      }
      continueCallback();
    }
    return true;
  };

  Table.prototype.lockAction = function(id, lock, disable) {
    var action, actionButton, j, len, ref;
    if (lock == null) {
      lock = null;
    }
    if (disable == null) {
      disable = false;
    }
    ref = this.actions;
    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];
      if (action.id === id) {
        if (action.element != null) {
          actionButton = $(action.element);
        } else {
          actionButton = this.actionsDiv.find("[data-action=" + action.id + "]");
        }
        if (actionButton.hasClass('locked') && ((lock == null) || (lock != null) && !lock)) {
          actionButton.removeClass('locked');
        } else {
          actionButton.addClass('locked');
        }
        if (disable) {
          actionButton.addClass('disabled');
        } else {
          actionButton.removeClass('disabled');
        }
        return;
      }
    }
  };

  Table.prototype.updateActions = function(rowElement) {
    var action, actionButton, actionContentDisabled, actionDisabled, j, len, menuAction, ref, ref1, ref2;
    if (rowElement == null) {
      rowElement = null;
    }
    if (rowElement != null) {
      actionDisabled = $(rowElement).data('action-disabled') != null ? $(rowElement).data('action-disabled') : null;
      actionContentDisabled = ($(rowElement).data('action-content-disabled') != null) && $(rowElement).next('.row-content').length ? $(rowElement).data('action-content-disabled') : null;
    } else {
      actionDisabled = actionContentDisabled = null;
    }
    ref = this.actions;
    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];
      if (action.element != null) {
        actionButton = $(action.element);
      } else {
        actionButton = this.actionsDiv.find("[data-action=" + action.id + "]");
      }
      menuAction = this.menuDiv.find("[data-action=" + action.id + "]");
      if ((this.request != null) || !((action.global != null) || action.global) && ((rowElement == null) || ((rowElement != null) && ((actionDisabled != null) && (ref1 = action.id, indexOf.call(actionDisabled, ref1) >= 0) || (actionContentDisabled != null) && (ref2 = action.id, indexOf.call(actionContentDisabled, ref2) >= 0))))) {
        actionButton.addClass('disabled');
        menuAction.addClass('disabled');
      } else {
        actionButton.removeClass('disabled');
        menuAction.removeClass('disabled');
      }
    }
  };

  Table.prototype.renderActions = function() {
    var action, j, len, makeActions, ref;
    this.actionsDiv.addClass('table-actions');
    makeActions = [];
    ref = this.actions;
    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];
      if (action.element == null) {
        makeActions.push(action);
      }
    }
    this.actionsDiv.html(this.templates.actions({
      actions: makeActions
    }));
    this.bindActions();
    this.updateActions();
    return this.actionsDiv;
  };

  Table.prototype.bindActions = function() {
    var action, actionButton, j, len, ref, table;
    table = this;
    ref = this.actions;
    for (j = 0, len = ref.length; j < len; j++) {
      action = ref[j];
      if (action.element != null) {
        actionButton = $(action.element);
      } else {
        actionButton = this.actionsDiv.find("[data-action=" + action.id + "]");
      }
      actionButton.data('action-data', action).off('click.table');
      actionButton.data('action-data', action).on('click.table', function() {
        if ($(this).hasClass('disabled') || $(this).hasClass('locked')) {
          return;
        }
        action = $(this).data('action-data');
        if (action.callback != null) {
          action.callback(table.rows[table.current], table);
        }
      });
    }
  };

  Table.prototype.renderRows = function(data, append) {
    var appendRows, j, len, row;
    if (append == null) {
      append = false;
    }
    if (!append) {
      this.rows = [];
      this.body.scrollTop(0);
      this.updateActions();
    }
    appendRows = [];
    for (j = 0, len = data.length; j < len; j++) {
      row = data[j];
      if (Array.isArray(row)) {
        appendRows.push({
          attrs: null,
          cells: row
        });
      } else {
        appendRows.push(row);
      }
    }
    Array.prototype.push.apply(this.rows, appendRows);
    appendRows.columns = this.cols;
    if (this.rows.length) {
      if (appendRows.length) {
        if (!append) {
          appendRows.head = true;
          this.body.html(this.templates.rows({
            rows: appendRows
          }));
        } else {
          this.body.find('tbody').append(this.templates.rows({
            rows: appendRows
          }));
        }
      }
    } else {
      this.body.html('');
    }
    if (this.table.is(':visible')) {
      this.rowResize();
    }
    if (!append && this.selectable && this.selectFirst && this.rows.length) {
      this.body.find('tbody tr:first').trigger('mousedown.table');
    }
    return this.body;
  };

  Table.prototype.columnRule = function(index, style) {
    var attr, cssRule, exist, j, k, len, len1, rule, rulePos, selector, sheet, sheets, value;
    if (style == null) {
      style = null;
    }
    rule = "#" + (this.table.attr('id')) + " table > thead > tr > .col-" + index;
    if (!$('#table_columns').length) {
      $('head').append($('<style />').attr({
        id: 'table_columns',
        type: 'text/css'
      }));
    }
    if (document.styleSheets) {
      sheets = document.styleSheets;
      for (j = 0, len = sheets.length; j < len; j++) {
        sheet = sheets[j];
        if ($(sheet.ownerNode).attr('id') === 'table_columns') {
          break;
        }
      }
    }
    if (sheet.cssRules) {
      cssRule = sheet.cssRules;
    } else {
      cssRule = sheet.rules;
    }
    exist = false;
    for (rulePos = k = 0, len1 = cssRule.length; k < len1; rulePos = ++k) {
      selector = cssRule[rulePos];
      if ((selector.selectorText != null) && selector.selectorText.toLowerCase() === rule) {
        exist = true;
        break;
      }
    }
    if (style == null) {
      if (exist) {
        if (sheet.cssRules) {
          sheet.deleteRule(rulePos);
        } else {
          sheet.removeRule(rulePos);
        }
      }
      return;
    }
    if (!exist) {
      rulePos = cssRule.length;
      exist = true;
      if (sheet.addRule) {
        sheet.addRule(rule, null, rulePos);
      } else {
        sheet.insertRule(rule + " {}", rulePos);
      }
    }
    if (exist) {
      for (attr in style) {
        value = style[attr];
        cssRule[rulePos].style[attr] = value;
      }
    }
  };

  Table.prototype.columnsResize = function() {
    var check, colIndex, column, columnRule, columns, fixedCols, i, j, k, l, len, len1, len2, len3, len4, m, minWidth, n, o, p, ref, ref1, ref2, ref3, row, rows, table, tableWidth, width;
    table = this;
    fixedCols = 0;
    columns = [];
    rows = [];
    this.cols = 0;
    if (this.columns.length) {
      if (!Array.isArray(this.columns[0])) {
        rows = [this.columns];
      } else {
        rows = this.columns;
      }
      ref = rows[0];
      for (j = 0, len = ref.length; j < len; j++) {
        column = ref[j];
        this.cols += (column.attrs != null) && (column.attrs.colspan != null) ? column.attrs.colspan : 1;
      }
    }
    rows.columns = this.cols;
    for (i = k = 0, ref1 = this.cols - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
      table.columnRule(i);
    }
    this.table.css({
      width: ''
    });
    this.head.css({
      display: 'inline-block',
      width: 'auto'
    }).find('table').css({
      width: 'auto'
    });
    this.body.hide();
    this.foot.hide();
    tableWidth = this.table.width();
    this.head.css({
      display: '',
      width: ''
    }).find('table').css({
      width: ''
    });
    this.body.show();
    this.foot.show();
    this.table.width(tableWidth);
    ref2 = ['fixed', 'percent', 'auto'];
    for (l = 0, len1 = ref2.length; l < len1; l++) {
      check = ref2[l];
      for (m = 0, len2 = rows.length; m < len2; m++) {
        row = rows[m];
        i = -1;
        for (n = 0, len3 = row.length; n < len3; n++) {
          column = row[n];
          i++;
          if (columns.length <= i) {
            for (o = 0, ref3 = columns.length - i; 0 <= ref3 ? o <= ref3 : o >= ref3; 0 <= ref3 ? o++ : o--) {
              columns.push({
                rowspan: 0
              });
            }
          }
          if (columns[i].rowspan) {
            columns[i].rowspan--;
            i++;
          }
          if ((column.attrs != null) && (column.attrs.rowspan != null) && column.attrs.rowspan !== 1) {
            columns[i].rowspan += column.attrs.rowspan - 1;
          }
          if ((column.attrs != null) && (column.attrs.colspan != null) && column.attrs.colspan !== 1) {
            i += column.attrs.colspan - 1;
            continue;
          }
          if (columns[i].width == null) {
            width = 'auto';
            minWidth = 'initial';
            if (column.attrs != null) {
              if (column.attrs.width != null) {
                width = column.attrs.width;
              }
              if (column.attrs.minWidth != null) {
                minWidth = column.attrs.minWidth;
              }
            }
          } else {
            width = columns[i].width;
            minWidth = columns[i].minWidth;
          }
          if (check === 'fixed' && width.toString().match(/^\d+(px)?$/)) {
            width = parseInt(width);
            tableWidth -= width;
            fixedCols++;
          } else if (check === 'percent' && width.toString().match(/^\d+%$/)) {
            width = parseInt(tableWidth * (parseFloat(width) / 100));
            fixedCols++;
          } else if (check === 'auto' && width === 'auto') {
            width = parseInt(tableWidth * (1 / (this.cols - fixedCols)));
          }
          columns[i].width = width;
          columns[i].minWidth = minWidth;
        }
      }
    }
    this.table.css({
      paddingRight: tableWidth - parseInt(tableWidth * (1 / (this.cols - fixedCols))) * (this.cols - fixedCols)
    });
    for (colIndex = p = 0, len4 = columns.length; p < len4; colIndex = ++p) {
      columnRule = columns[colIndex];
      table.columnRule(colIndex, {
        width: columnRule.width + 'px',
        minWidth: columnRule.minWidth + (!isNaN(parseInt(columnRule.minWidth)) ? 'px' : '')
      });
    }
    if (this.head.width() < this.head.find('table').width()) {
      this.table.width(this.head.find('table').width());
    }
    if (!this.body.getNiceScroll().length) {
      this.rowResize();
    }
  };

  Table.prototype.rowResize = function() {
    var fullHeight;
    if (this.height != null) {
      this.table.css('maxHeight', this.height);
      fullHeight = this.table.height() - this.head.height() - this.foot.height();
    } else if (this.body.height()) {
      this.body.css('display', 'none');
      fullHeight = parseInt(this.table.closest(this.heightOfParent).height()) - (parseFloat(this.table.outerHeight()) + (this.body.is(':empty') ? 1 : 0) - (this.margin != null ? this.margin : 0));
    }
    this.body.css({
      maxHeight: fullHeight ? fullHeight : '',
      display: 'block'
    });
    if (this.body.get(0).scrollHeight > fullHeight) {
      if (!this.body.getNiceScroll().length) {
        this.body.niceScroll({
          horizrailenabled: false,
          cursoropacitymin: 1,
          railalign: this.scrollAlign,
          enablekeyboard: !this.arrowNavigation,
          cursorwidth: 3,
          railpadding: {
            top: 1,
            right: 1,
            left: 1,
            bottom: 1
          }
        });
      } else {
        this.body.getNiceScroll().resize();
      }
    } else {
      this.body.getNiceScroll().remove();
    }
  };

  Table.prototype.renderColumns = function(columns) {
    var column, j, len, order, ref, rows;
    this.columns = columns;
    order = null;
    rows = [];
    this.cols = 0;
    if (this.columns.length) {
      if (!Array.isArray(this.columns[0])) {
        rows = [this.columns];
      } else {
        rows = this.columns;
      }
      ref = rows[0];
      for (j = 0, len = ref.length; j < len; j++) {
        column = ref[j];
        this.cols += (column.attrs != null) && (column.attrs.colspan != null) ? column.attrs.colspan : 1;
      }
    }
    rows.columns = this.cols;
    if (this.showDefaultOrder && this.order) {
      order = {
        field: this.order.substr(!this.order.indexOf('-')),
        sort: !this.order.indexOf('-') ? 'desc' : 'asc'
      };
    }
    this.head.html(this.templates.columns({
      rows: rows,
      order: order
    }));
    this.columnsBinds();
    return this.head;
  };

  Table.prototype.renderFooter = function(footerRows) {
    var j, len, ref, row, rows;
    this.footer = footerRows;
    rows = [];
    if (this.footer.length) {
      ref = this.footer;
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        if (Array.isArray(row)) {
          rows.push({
            attrs: null,
            cells: row
          });
        } else {
          rows.push(row);
        }
      }
    }
    rows.columns = this.cols;
    this.foot.html(this.templates.foot({
      rows: rows
    }));
    return this.foot;
  };

  Table.prototype.uid = function() {
    return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
  };

  Table.prototype.render = function() {
    var attrs, table;
    attrs = JSON.parse(JSON.stringify(this.attrs));
    if (attrs.id == null) {
      attrs.id = "uid_" + (this.uid());
    }
    while ($("#uid_" + this.attrs.id).length) {
      attrs.id = "uid_" + (this.uid());
    }
    if (attrs["class"] != null) {
      this.table.addClass(attrs["class"]);
      delete attrs["class"];
    }
    this.table.attr(attrs).addClass("table-data scroll-" + this.scrollAlign + (this.selectable ? ' selectable' : '') + (this.arrowNavigation ? ' arrow-navigation' : ''));
    this.renderColumns(this.columns);
    this.renderRows(this.rows);
    this.renderFooter(this.footer);
    this.table.append(this.head);
    this.table.append(this.body);
    this.table.append(this.foot);
    table = this;
    $(window).on('resize.table', function() {
      if (table.table.is(':visible')) {
        table.columnsResize();
        table.rowResize();
      }
    });
    return this.table;
  };

  return Table;

})();

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

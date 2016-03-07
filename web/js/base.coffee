class Tab
	constructor: ->
		@tabs = []
		@navTabs = $('#tab')
		@contentTabs = $('#content')
		@currentTab = null
		@templates = {
			tab: '{% for tab in tabs %}<li><a href="#{{tab.id}}" title="{{tab.label}}" style="border-top-color: {{tab.color}}">{{tab.label}}</a><button type="button" class="close"><span class="glyphicon glyphicon-remove"></span></button></li>{% endfor %}'
		}

	getTabId: (id, index = false) ->
		for tab, i in @tabs
			if tab.id == id
				if index
					return i
				else
					return tab
		return null

	add: (tabObj) ->
		if (@getTabId(tabObj.id))
			@select(@getTabId(tabObj.id, true))
		else
			@tabs.push(tabObj)
			contentWrapper = $('<li />')
			@contentTabs.append(contentWrapper)
			cb = tabObj.callback(contentWrapper)
			if cb?
				contentWrapper.html(cb)
			@currentTab = @tabs.length - 1
			@render()
		return

	close: (index) ->
		@tabs.splice(index, 1)
		@contentTabs.children('li').eq(index).find('.table-data .body').getNiceScroll().remove()
		@contentTabs.children('li').eq(index).getNiceScroll().remove()
		@contentTabs.children('li').eq(index).remove()
		if @currentTab > index
			@currentTab--
			index--
		if @currentTab == index
			if @tabs.length > index
				@currentTab++
			else if index > 0
				@currentTab--
			else
				@currentTab = null
		@render()
		return

	select: (index) ->
		if not index?
			return
		@navTabs.children('li').removeClass('active').eq(index).addClass('active')
		tab = @navTabs.children('li').eq(index)
		tabsLeft = tab.parent().offset().left
		tabsWidth = tab.parent().width()
		tabLeft = tab.offset().left
		tabWidth = tab.outerWidth()
		tabsMargin = parseInt(@navTabs.children('li').first().css('marginLeft'))
		if tabLeft + tabWidth > tabsLeft + tabsWidth
			@navTabs.children('li').first().css('marginLeft', tabsMargin + ((tabsLeft + tabsWidth) - (tabLeft + tabWidth)))
		else if tabLeft < tabsLeft
			@navTabs.children('li').first().css('marginLeft', (tabsLeft - tabLeft) + tabsMargin)
		@contentTabs.children('li:visible').find('.table-data .body').getNiceScroll().hide()
		@contentTabs.children('li').getNiceScroll().hide()
		@contentTabs.children('li').hide().eq(index).show()
		if @contentTabs.children('li').eq(index).find('.table-data .body').length
			@contentTabs.children('li').eq(index).find('.table-data .body').getNiceScroll().show()
		if @contentTabs.children('li').eq(index).getNiceScroll().length
			@contentTabs.children('li').eq(index).getNiceScroll().show()
		else
			@contentTabs.children('li').eq(index).niceScroll({
				cursoropacitymin: 1
				cursorwidth: 5
				railpadding: {top: 1, right: 1, left: 1, bottom: 1}
			})
		$(window).trigger('resize')

	render: () ->
		@navTabs.html(swig.render(@templates.tab, {locals: {tabs: @tabs}}))
		tabWidth = 0
		@navTabs.find('li').each () ->
			tabWidth += $(@).outerWidth()
		if tabWidth > @navTabs.innerWidth()
			@navTabs.parent().addClass('scroll')
		else
			@navTabs.parent().removeClass('scroll')
		@select(@currentTab)
		return

class Notify
	@timer = null
	@time = 2
	@$notify = null
	constructor: (message, type = 'success') ->
		if not Notify.$notify?
			if not $('#notify').length
				$('body').append($('<div />', {id: 'notify'}).html('<div />'))
			Notify.$notify = $('#notify')
		if Notify.timer?
			clearTimeout(Notify.timer)
		Notify.$notify.children().removeClass().addClass(type).text(message)
		setTimeout(->
			Notify.$notify.addClass('active')
			return
		, 0)
		Notify.timer = setTimeout(->
			Notify.$notify.removeClass('active')
			return
		, Notify.time * 1000)
		return

login_time = 0
updateLogged = () ->
	login_time = new Date() - user.logged_at
	$('#logged_time').html swig.render("{{time|date('H:i')}}", {locals: {time: login_time}})
	$.get('/systems/users/update', null, (response) ->
		if not response.logged
			location.reload()
		return
	)
	return

confirmDialog = (message, callback, callback_action_for, caption) ->
	caption = caption || 'Confirmation';

	confirmPopup = $('.confirm').clone().appendTo('body');
	dialog = $('.dialog', confirmPopup);

	$('.title', dialog).text(caption);
	$('.info', dialog).text(message);
	$('.btn-success', dialog).prop('href', 'javascript:void(0);');
	confirmPopup.show();

	$('.cancel, .btn-success', dialog).off('click');
	$('.cancel', dialog).on 'click', () ->
		callback() if callback_action_for is false
		confirmPopup.remove()
		return
	$('.btn-success', dialog).on 'click', () ->
		callback() if callback_action_for is true
		confirmPopup.remove()
		return
	return

# setInterval(updateLogged, 60000)

(($) ->
	$ ->
#    updateLogged()
		$(window).on 'beforeunload', ->
			expires = new Date()
			console.log Math.round(expires.getTime() / 1000)
			document.cookie = "refresh=#{Math.round(expires.getTime() / 1000)};expires=#{new Date(expires.getTime() + 60000).toUTCString()};"
			return

		#menu show/hide button
		$('#menu-icon').click ->
			$('#menu').toggleClass('active')
			return false

		#menu click binds
		$('#menus span').click ->
			$(@).closest('li').toggleClass('active')
			return false

		$('#logout').click ->
			$('.confirm').show()
			return false

		$('.confirm .cancel').click ->
			$('.confirm').hide()
			return

		#initialize classes
		Tab = new Tab()

		#menu select menu item
		$('#menu a').click ->
			Tab.add menuAction[@hash.substr(1)]
			$('#menu').trigger('mouseleave')
			return false

		$('#menu').mouseenter ->
			$(this).addClass('active')
			return

		$('#menu').mouseleave ->
			$(this).removeClass('active')
			return

		#nav tab bar binds
		$('#tab').click (e) ->
			if ($(e.target).is('a'))
				index = $(e.target).closest('li').index()
				Tab.select(index)
			else if ($(e.target).is('button, span'))
				index = $(e.target).closest('li').index()
				Tab.close(index)
			return false

		#tab scrolls
		$('#prev, #next').click ->
			tabWidth = 0
			tabMargin = 1
			$('#tab li').each ->
				tabWidth += ($(@).outerWidth() + tabMargin)
			if tabWidth
				margin = parseInt($('#tab li:first').css('margin-left'))
				if $('#tab').innerWidth() + margin < tabWidth
					if ($(@).is('#next'))
						margin -= ($('#tab li:first').outerWidth() + tabMargin)
					else
						margin += ($('#tab li:first').outerWidth() + tabMargin)
				if margin > tabMargin
					margin = tabMargin
				else if Math.abs(margin) > tabWidth - $('#tab').innerWidth()
					margin = -(tabWidth - $('#tab').innerWidth()) #fixme: fast scroll actions
				$('#tab li:first').animate({marginLeft: margin})
			return false
	return
	#end
) jQuery
$(document).ready(function(){
  var socket = io.connect('http://localhost:3200');
  socket.on('news', function (data) {
    socket.emit('my other event', { my: 'data' });
  });

  socket.on('status:change', function (data) {
    var removeStatus = data.status === 'away' ? 'available' : 'away'
    $('#' + data._id + ' > div').removeClass(removeStatus).addClass(data.status)
  })

  socket.on('message', function (message) {
    if (message.user._id === $('#user').val()) {
      var messageOr = `<div class="message right">
      <img src="${message.user.images.avatar}" />
      <div class="bubble">
      ${message.message}
      <div class="corner"></div>
      <span>${moment(message.createdAt).fromNow()}</span>
      </div>
      </div>`

      $('#chat-messages').append(messageOr)

      var height = $('#chat-messages')[0].scrollHeight
      $('#chat-messages').scrollTop(height);
    }
  })
  // var preloadbg = document.createElement('img');
  // preloadbg.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/timeline1.png';

  $('#searchfield').focus(function () {
    if ($(this).val() === 'Search contacts...') {
      $(this).val('');
    }
  });

  $('#searchfield').focusout(function () {
    if ($(this).val() === '') {
      $(this).val('Search contacts...');
    }
  });

  $('#sendmessage input').focus(function () {
    if ($(this).val() === 'Send message...') {
      $(this).val('');
    }
  });

  $('#sendmessage input').focusout(function () {
    if ($(this).val() === '') {
      $(this).val('Send message...');
    }
  });

  $('.history').click(function () {
    var status = $(this).hasClass('awayh') ? 'available' : 'away'
    var self = this

    $.ajax({
      method: 'PUT',
      url: '/api/users',
      data: { status: status, onlyStatus: true },
    })
    .done(function (msg) {
      $(self).toggleClass('awayh')
    })
    .fail(function (err) {
      console.log('Not active user')
    })
  })

  $('#new-message').on('keypress', function (evt) {
    if (evt.which === 13) {
      $.ajax({
        method: 'POST',
        url: '/api/messages',
        data: { message: $(this).val(), user: $('#user').val() },
      })
      .done(function (msg) {
        var message = `<div class="message">
        <img src="${msg.user.images.avatar}" />
        <div class="bubble">
        ${msg.message}
        <div class="corner"></div>
        <span>${moment(msg.createdAt).fromNow()}</span>
        </div>
        </div>`

        $('#chat-messages').append(message)

        var height = $('#chat-messages')[0].scrollHeight
        $('#chat-messages').scrollTop(height);
      })
      .fail(function (err) {
        console.log(err)
      })

      $(this).val('')
    }
  })

  $('.friend').each(function () {
    $(this).click(function () {
      // $('#chat-messages').scrollTo()
      $('#user').val(this.id)
      var user = this.id
      var childOffset = $(this).offset();
      var parentOffset = $(this).parent().parent().offset();
      var childTop = childOffset.top - parentOffset.top;
      var clone = $(this).find('img').eq(0).clone();
      var top = childTop + 12 + 'px';

      $(clone).css({ top: top }).addClass('floatingImg').appendTo('#chatbox');

      setTimeout(function () {
        $('#profile p').addClass('animate');
        $('#profile').addClass('animate');
      }, 100);

      setTimeout(function () {
        $('#chat-messages').addClass('animate');
        $('.cx, .cy').addClass('s1');
        setTimeout(function () {
          $('.cx, .cy').addClass('s2');
        }, 100);
        setTimeout(function () {
          $('.cx, .cy').addClass('s3');
        }, 200);
      }, 150);

      $('.floatingImg').animate({
        width: '68px',
        left: '108px',
        top: '20px',
      }, 200);

      var name = $(this).find('p strong').html();
      var email = $(this).find('p span').html();

      $('#profile p').html(name);
      $('#profile span').html(email);

      $('.message').not('.right').find('img').attr('src', $(clone).attr('src'));
      $('#friendslist').fadeOut();
      $('#chatview').fadeIn();

      $.ajax({
        method: 'GET',
        url: '/api/messages',
        data: { user: this.id },
        beforeSend: function () {
          $('#chat-messages').html('Loading chat...')
        },
      })
      .done(function (data) {
        var chats = data
        if (!chats.length) {
          $('#chat-messages').html('No chats')
        } else {
          $('#chat-messages').html('')
          chats = chats.reverse()
          chats.forEach(function (chat) {
            var classRight = chat.user._id === user ? 'right' : ''
            var message = `<div class="message ${classRight}">
            <img src="${chat.user.images.avatar}" />
            <div class="bubble">
            ${chat.message}
            <div class="corner"></div>
            <span>${moment(chat.createdAt).fromNow()}</span>
            </div>
            </div>`
            $('#chat-messages').append(message)
          })
          var height = $('#chat-messages')[0].scrollHeight
          $('#chat-messages').scrollTop(height);
        }
      })
      .fail(function (err) {
        console.log(err)
      })

      $('#close').unbind('click').click(function () {
        $('#chat-messages, #profile, #profile p').removeClass('animate');
        $('.cx, .cy').removeClass('s1 s2 s3');
        $('.floatingImg').animate({
          width: '40px',
          top: top,
          left: '12px',
        }, 200, function () {
          $('.floatingImg').remove()
        });

        setTimeout(function () {
          $('#chatview').fadeOut();
          $('#friendslist').fadeIn();
        }, 50);
      });
    });
  });
});

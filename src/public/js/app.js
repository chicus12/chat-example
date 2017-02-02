const io = require('socket.io-client')
const Webrtc2Images = require('webrtc2images')
const $ = require('jquery')
const moment = require('moment')
require('moment/locale/es')

$(document).ready(() => {
  const rtc = new Webrtc2Images({
    width: 290,
    height: 153,
    frames: 10,
    type: 'image/jpeg',
    quality: 0.4,
    interval: 200,
  })

  rtc.startVideo(function (err) {
    if (err) return console.error(err)
  })

  const socket = io.connect('http://localhost:3200')

  socket.on('status:change', function (data) {
    const removeStatus = data.status === 'away' ? 'available' : 'away'
    $(`#${data._id} > div`)
      .removeClass(removeStatus)
      .addClass(data.status)
  })

  socket.on('message', function (message) {
    if (message.user._id === $('#user').val()) {
      let wrapper = message.message

      if (message.video) {
        wrapper = `<video class="video-container" src="${message.video}" loop autoplay></video>`
      }

      const newMessage = `<div class="message right">
        <img src="${message.user.images.avatar}" />
        <div class="bubble">
          ${wrapper}
          <div class="corner"></div>
          <span>${moment(message.createdAt).fromNow()}</span>
        </div>
      </div>`

      const chat = $('#chat-messages')
      chat.append(newMessage)

      const height = chat[0].scrollHeight
      chat.scrollTop(height)
    }
  })

  function record() {
    rtc.recordVideo(function (err, frames) {
      if (err) return console.error(err)

      $.ajax({
        method: 'POST',
        url: '/api/messages/video',
        data: { frames: frames, user: $('#user').val() },
      })
      .done(function (msg) {
        let wrapper = msg.message

        if (msg.video) {
          wrapper = `<video class="video-container" src="${msg.video}" loop autoplay></video>`
        }

        const message = `<div class="message">
        <img src="${msg.user.images.avatar}" />
        <div class="bubble">
        ${wrapper}
        <div class="corner"></div>
        <span>${moment(msg.createdAt).fromNow()}</span>
        </div>
        </div>`

        const chat = $('#chat-messages')
        chat.append(message)

        const height = chat[0].scrollHeight
        chat.scrollTop(height);
      })
      .fail(function (err) {
        console.log(err)
      })
      .always(function () {
        $('#video-preview').hide()
      })
    })
  }

  $('#video').click(function () {
    $('#video-preview').show()
    record()
  })

  $('#searchfield').focus(function () {
    if ($(this).val() === 'Search contacts...') {
      $(this).val('');
    }
  });

  $('#searchfield').focusout(function () {
    if ($(this).val() === '') {
      $(this).val('Search contacts...')
    }
  })

  $('#sendmessage input').focus(function () {
    if ($(this).val() === 'Send message...') {
      $(this).val('')
    }
  })

  $('#sendmessage input').focusout(function () {
    if ($(this).val() === '') {
      $(this).val('Send message...')
    }
  })

  $('.history').click(function () {
    const status = $(this).hasClass('awayh') ? 'available' : 'away'
    const self = this

    $.ajax({
      method: 'PUT',
      url: '/api/users',
      data: { status: status, onlyStatus: true },
    })
    .done(function () {
      $(self).toggleClass('awayh')
    })
    .fail(function () {
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
        const message = `<div class="message">
        <img src="${msg.user.images.avatar}" />
        <div class="bubble">
        ${msg.message}
        <div class="corner"></div>
        <span>${moment(msg.createdAt).fromNow()}</span>
        </div>
        </div>`

        const chat = $('#chat-messages')
        chat.append(message)

        const height = chat[0].scrollHeight
        chat.scrollTop(height);
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
      const user = this.id
      const childOffset = $(this).offset();
      const parentOffset = $(this).parent().parent().offset();
      const childTop = childOffset.top - parentOffset.top;
      const clone = $(this).find('img').eq(0).clone();
      const top = `${childTop + 12}px`;

      $(clone).css({ top }).addClass('floatingImg').appendTo('#chatbox');

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

      const name = $(this).find('p strong').html();
      const email = $(this).find('p span').html();

      $('#profile p').html(name);
      $('#profile span').html(email);

      $('.message').not('.right').find('img').attr('src', $(clone).attr('src'));
      $('#friendslist').fadeOut();
      $('#chatview').fadeIn();

      $.ajax({
        method: 'GET',
        url: '/api/messages',
        data: { user: this.id },
        beforeSend: () => {
          $('#chat-messages').html('Loading chat...')
        },
      })
      .done(function (data) {
        let chats = data
        if (!chats.length) {
          $('#chat-messages').html('No chats')
        } else {
          $('#chat-messages').html('')
          chats = chats.reverse()
          chats.forEach(function (chat) {
            const classRight = chat.user._id === user ? 'right' : ''
            let wrapper = chat.message

            if (chat.video) {
              wrapper = `<video class="video-container" src="${chat.video}" loop autoplay></video>`
            }

            const message = `<div class="message ${classRight}">
            <img src="${chat.user.images.avatar}" />
            <div class="bubble">
            ${wrapper}
            <div class="corner"></div>
            <span>${moment(chat.createdAt).fromNow()}</span>
            </div>
            </div>`
            $('#chat-messages').append(message)
          })
          const height = $('#chat-messages')[0].scrollHeight
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
          left: '12px',
          top,
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
})

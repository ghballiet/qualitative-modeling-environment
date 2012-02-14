$(document).ready(function() {
  function disableCont(msg) {
    $('#cont').addClass('err').attr('disabled', 'disabled').val(msg);
  }
  
  $('input').placeholder();
  $('#email2').keyup(function(e) {
    if($('#email2').val() != $('#email').val()) {
        disableCont('Emails do not match.');      
        $('#email, #email2').addClass('invalid');
    } else {
      disableCont('Enter your password.');      
      $('#email, #email2').removeClass('invalid').addClass('valid');
    }
  });
  
  $('#password2').keyup(function(e) {
    if($('#password2').val() != $('#password').val()) {
      $('#password, #password2').addClass('invalid');      
      disableCont('Passwords do not match.');
    } else {
      $('#email, #email2').removeClass('invalid').addClass('valid');
      $('#cont').val('Continue').removeAttr('disabled').removeClass('err');
    }
  });
  
  $('#name').keyup(function(e) {
    if($('#name').val() != '') {
      disableCont('Enter your last name.');
    }
  });
  
  $('#surname').keyup(function() {
    if($(this).val() != '') {
      disableCont('Enter your email address.');
    }
  });
  
  $('input').keyup(function() {
    if($('#name').val == '')
      disableCont('Enter your first name.');
    else if($('#surname').val == '')
      disableCont('Enter your last name.');
    else if($('#email').val == '')
      disableCont('Enter your email address.');
    else if($('#email2').val == '')
      disableCont('Enter your email address again.');
    else if($('#password').val == '')
      disableCont('Enter your password.');
    else if($('#password2').val == '')
      disableCont('Enter your password again.');
  });
});
$('.menu-icon').on('click', function(){
  $('.bar').toggleClass('bar--active')
  $('.overlay').toggleClass('overlay--active') 
})
  
$('.overlay').on('click', function(){
  if($('.overlay').hasClass('overlay--active')){
    $('.overlay').removeClass('overlay--active')
    $('.bar').removeClass('bar--active')
  }
})
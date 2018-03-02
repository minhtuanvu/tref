$(document).ready(function() {
  $('#search').on('keyup', function(e) {
    let typed = e.target.value;

    // make request to tref
    $.ajax({
      url: 'http://localhost:3000/search?key='+typed,
    }).done(function(result) {
      console.log(result);
    })
  });
});


!function ($) {
  $(function(){      
     $(document).ready(function() {
          var resp = '<option tipo=vacio value="">Seleccione...</option>';
         if(window.parent.tinymce !==undefined){
             window.parent.tinymce.activeEditor.windowManager.progressBar.show();
         }

          $.ajax({
              url:   'index.php/Ayuda/listarProjecto',
              type:  'post',
              success:  function (response) {
                  if(window.parent.tinymce !==undefined){
                      window.parent.tinymce.activeEditor.windowManager.progressBar.hide();
                  }

                  var items=[];
                  items=JSON.parse(response);
                  var x ="";
                  for(x in items.workspaces){

                      resp +=  '<option tipo=local value='+items.workspaces[x].nombre+'>'+items.workspaces[x].nombre+'</option>';
                  }
                  for(x in items.framework){

                      //$("#cmVisorProyect").append((items.framework[x].li));
                      var value = items.framework[x].uri;   
                      resp += '<option tipo=marco value='+value+'>'+items.framework[x].nombre+'</option>';
                  }

                  $("#cmVisorProyect").html(resp);

              }
          });

         //window
         if(window.parent.tinymce !==undefined){
             $("#admin").on("click", function(){
                 var winDk = window.parent.tinymce.activeEditor.windowManager.getWindows();
                 winDk[0].close();
             });
         }


      });

      $("#cmVisorProyect").bind('change', function() {
          var valor = $("#cmVisorProyect").val();

          var tipo = $("#cmVisorProyect option:selected").attr('tipo');

          if(tipo == 'local'){
              var url = 'workspaces/'+valor+'/index.html';
              $("#iframevisorMenuContext").attr('src',url);
          }else if(tipo == 'marco'){
              var url ='../../../'+valor+'/help/index.html';
              $("#iframevisorMenuContext").attr('src',url);
          }

      });

});

}(window.jQuery);

  /**
   * Cargar archivos de javascript en demanda.
   * @param {string} jsSrc Ruta del archivo JS.
   * @param {type} id Identificador para registrarlo.
   */
  function loadJs(jsSrc, id) {
      if(jsSrc != null) {
          var tagScript = document.createElement("script");
          tagScript.setAttribute("type", "text/javascript");
          tagScript.setAttribute("id", id);
          tagScript.setAttribute("src", jsSrc + ".js");
          document.getElementsByTagName("body")[0].appendChild(tagScript);
      }
  }
  /**
   * Cargar estilos desde archivos css.
   * @param {string} cssHref Ruta del archivo CSS.
   */
  function loadCss(cssHref) {
      if(cssHref != null) {
          var tagStyle = document.createElement("style");
          tagStyle.setAttribute("type", "text/css");
          tagStyle.setAttribute("href", cssHref + ".css");
          document.getElementsByTagName("head")[0].appendChild(tagStyle);
      }
  }
  /**
   * Crear o setear estilos.
   * @param {string} css Estilos que seran creados o seteados . e.g: .FilaVerde .x-grid3-cell-inner{color:black;background-color:#dffbda;}
   */
  function setCss(css) {
      var tag = document.createElement("style");
      tag.type = "text/css";
      if(tag.styleSheet) {
          tag.styleSheet.cssText = css;
      } else {
          tag.appendChild(document.createTextNode(css));
      }
      document.getElementsByTagName("head")[0].appendChild(tag);
  }



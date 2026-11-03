<?php

/**
 * ZendExt_Exception_LPWithValues
 *
 * Gestor de excepciones de log y presentacion con valores de forma dinámica.
 *
 * @author     Darien García Tejo.
 * @package    ZendExt
 * @subpackage ZendExt_Exception
 * @copyright  Centro UCID
 * @version    1.0-0
 */
class ZendExt_Exception_LPWithValues extends ZendExt_Exception_Log
{

    protected $_values = array();

    /**
     * ZendExt_Exception_LogPresentation
     *
     * Constructor de la clase
     *
     * @param ZendExt_Exception_LogPresentation $pParent - Excepcion padre
     *
     * @return void.
     */
    public function ZendExt_Exception_LPWithValues($pParent, $array)
    {
        $this->_values = $array;
        parent::ZendExt_Exception_Base($pParent);
    }

    /**
     * toString
     *
     * Convierte la excepcion a cadena
     *
     * @return string
     */
    public function toString()
    {
        return parent:: toString();
    }

    /**
     * handle
     *
     * Gestionar las excepciones de log y presentacion
     *
     * @return void.
     */
    public function handle()
    {
        $strException = $this->toString();
        ZendExt_Logger::write($strException);
        //Obtengo una instancia del registro.
        $registro = Zend_Registry::getInstance();
        parent::GenerateTraceException($this->_parent);
        //3 - para tiempo de explotación y 4 para tiempo de desarrollo.
        $send = new stdClass();
        if ($registro->config->development) {
            $send->codMsg = 4;
            $send->detalles = $this->getInnerExceptions();
        } else {
            if ($registro->config->msgTypeException) {
                $send->codMsg = 6;
                $send->exception = 1;
            } else
                $send->codMsg = 3;
        }
        $send->mensaje = $this->getDescription();
        $send->detalles = $this->getInnerExceptions();

        if (
//          Para las solicitudes AJAX
            isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
//          Para las solicitudes POST con ficheros (envíos de formularios)
            strpos($_SERVER['CONTENT_TYPE'],'multipart/form-data;') !== false ||
            strpos($_SERVER['CONTENT_TYPE'],'application/x-www-form-urlencoded;') !== false) {
            echo json_encode($send);
        } else { //Si la peticion no es por ajax
            //Obtengo una instancia del registro.
            $registro = Zend_Registry::getInstance();

            //Obtengo una instancia del GlobalConcept
            $global = ZendExt_GlobalConcept::getInstance();

            //Obtengo el idioma y el tema
            $tema = $global->Perfil->tema;

            //Obteniendo la direccion de ExtJS y UCID
            $dirTema = $registro->config->extjs_themes_path . $tema;

            //Se imprime la excepcion en codigo HTML
            $msgError = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
            $msgError .= '<link href="'
                . $dirTema . '/css/icon-clases.css" rel="stylesheet" type="text/css" media="screen"/></head><body>';
            $msgError .= '<pre>' .
                '<table width="100%" border="0"><tr>' .
                '<td width="7%">' .
                '<div class="iconoERROR" style="margin:10 0 0 10"></div>' .
                '</td>';
            $msgError .= '<td width="93%"><div style="margin:10px 0px 0px 0px;font-size:9pt" ><b>ERROR</b><br>'
                . $send->mensaje . '</div></td></tr>';
            if ($send->codMsg == 4) {
                $msgError .= "<tr>" .
                    "<td colspan = \"2\">&nbsp;</td>" .
                    "</tr>" .
                    "<tr>" .
                    ".<td colspan = \"2\">{$send->detalles}</td>" .
                    "</tr>" .
                    ".</table>" .
                    "</pre>" .
                    "</body>";
            } else {
                $msgError .= "</table></pre></body>";
            }
            echo $msgError;
        }
    }

    /**
     * getDescription
     *
     * Devolver la descripcion de la excepcion
     *
     * @return string.
     */
    public function getDescription()
    {
        return
            call_user_func_array('sprintf', array_merge(array(
                (string)$this->_parent->getDescription()
            ), $this->_values));
    }

}

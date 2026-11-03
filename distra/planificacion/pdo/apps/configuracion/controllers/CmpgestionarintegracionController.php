<?php
/**
 * Controlador para configurar integracion del sistema
 *
 */

class CmpgestionarintegracionController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init() {
        parent::init();
    }
    /**
     * Accion para mostrar la vista cmpgestionarintegracion.phtml
     *
     */
    function cmpgestionarintegracionAction() {
        $this->render();
    }
    /**
     * Accion para integracion.xml
     *
     */
    function cargarintegracionAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $file=dirname(dirname(__FILE__)).'/comun/recursos/xml/integracion.xml';
       /* $fp = fopen($file, 'r');
        $contenido = fread($fp, filesize($file)); guarda el contenido del fichero en la variable contenido*/
        $xml = simplexml_load_file($file);// coge el fichero xml y lo guarda como objeto
        echo json_encode(array('data' =>$xml->asXML() ));

    }
} 
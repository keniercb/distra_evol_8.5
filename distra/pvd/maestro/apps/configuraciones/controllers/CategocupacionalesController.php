<?php
/**
 * @name EstructuraconceptoController - Clase controladora de la configuración de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class CategocupacionalesController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function categocupacionalesAction()
    {
        $this->render();
    }

    /**
     * @method obtenerCfgEstructConcepto - Devuelve las configuraciones de estructuras por conceptos.
     * @author Orestes Rodríguez Lorenzo.
     */
  /*  function obtenerCfgEstructConceptoAction()
    {
        //Obteniendo el resultado y enviando a la vista
        echo json_encode(ConfEstructuraconceptoModel::obtenerConfEstructuraconcepto());
    }*/

    /**
     * @method obtenerEstructura - Devuelve la estructura organizativa
     * @author Orestes Rodríguez Lorenzo.
     */
    function getTipocategAction()
    {
        //Obteniendo el resultado y enviando a la vista
        $tipocat = ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(true);
        $this->response->data = $tipocat;
        echo json_encode($this->response);
    }

    /**
     * @method modConfEstructConcepto - Devuelve la estructura organizativa
     * @author Orestes Rodríguez Lorenzo.
     */
    function getCategoriasOcupAction()
    {
        $cfg = ConfCategOcupacionalesModel::getCategoriasOcup();
       // print_r($cfg);die;
        $cont = 0;
        $array = array();
        foreach($cfg as $datos){
            $array[$cont]['idmapeocategocup'] = $datos['idmapeocategocup'];
            $array[$cont]['idcategocup'] = $datos['idcategocup'];
            $array[$cont]['idcategoriareporte'] = $datos['idcategoriareporte'];
            $array[$cont]['idcategoriareporteresumenmov'] = $datos['idcategoriareporteresumenmov'];

            if($datos['idcategoriareporte']!=null){
                $tipocat = ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(true,$datos['idcategoriareporte']);
              //  $array[$cont]['categreporte'] =$tipocat[0]['denominacion'];
            }
            if($datos['idcategocup']!=null){
                $tipocat = ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(true,$datos['idcategocup']);
                $array[$cont]['denominacion'] =$tipocat[0]['denominacion'];
            }
            $cont++;

        }
        echo json_encode($array);
    }

    function modCategoriasOcupAction()
    {
        $cfg = ConfCategOcupacionalesModel::modCategoriasOcup(
            $this->_getParam('idmapeocategocup'),
            $this->_getParam('idcategocup'),
            $this->_getParam('idcategoriareporte')

        );
        echo json_encode($cfg);
    }
    
    function modCategoriasOcupResumenMovAction()
    {
        $cfg = ConfCategOcupacionalesModel::modCategoriasOcupResumenMov(
            $this->_getParam('idmapeocategocup'),
            $this->_getParam('idcategocup'),
            $this->_getParam('idcategoriareporteresumenmov')

        );
        echo json_encode($cfg);
    }
    
    function limpiarCategOcupParaReportesAction()
    {
        $cfg = ConfCategOcupacionalesModel::limpiarCategOcupParaReportes(
            $this->_getParam('idmapeocategocup')
        );
        echo json_encode($cfg);
    }
}
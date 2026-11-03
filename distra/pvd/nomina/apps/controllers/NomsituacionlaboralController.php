<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar situaciones laborales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomSituacionLaboralModel
 * @copyright UCID
 * @version 1.0
 */
class NomsituacionlaboralController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de las  situaciones laborales.
     */
    public function nomsituacionlaboralAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las  situaciones laborales.
     */
    public function obtenerListadoSituacionesLaboralesAction()
    {

        //Creando el modelo de negocio de gestion de  situaciones laborales.
        $modeloNegocioSituacion = new NomSituacionLaboralModel();

        //Obteniendo el listado de  situaciones laborales.
        $arrSituacion = $modeloNegocioSituacion->obtenerListadoSituaciones(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total de  situaciones laborales.
        $cantTotalSituaciones = $modeloNegocioSituacion->obtenerCantidadTotalSituaciones();

        //Imprimiendo el listado de  situaciones laborales.
        echo Zend_Json::encode(array('datos' => $arrSituacion, 'cantidad' => $cantTotalSituaciones));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    public function cargarconceptoAction()
    {

        //Creando el modelo de negocio de gestion de  situaciones laborales.
        $modeloNegocioSituacion = new NomSituacionLaboralModel();
        $nodo = $this->_getParam('node');
        //Obteniendo el listado de  situaciones laborales.
        $arrSituacion = NomSituacionLaboralModel::cargarconcepto($nodo);
        //Imprimiendo el listado de  situaciones laborales.
        echo Zend_Json::encode($arrSituacion);
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar una  situacion laboral.
     */
    public function adicionarSituacionLaboralAction()
    {

        //Creando el modelo de negocio de gestion de  situaciones laborales
        $modeloNegocioSituacion = new NomSituacionLaboralModel();

        //Insertando los datos de la  situacion laboral.
        $resp=$modeloNegocioSituacion->adicionarSituacionLaboral(
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
           // $this->_getParam('asociadocargo'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            Zend_Json::decode(stripslashes($this->_getParam('idconceptopercepciondescuento')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'La clasificación del la situación que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar una  situacion laboral.
     */
    public function modificarSituacionLaboralAction()
    {

        //Creando el modelo de negocio de gestion de situaciones laborales.
        $modeloNegocioSituacion = new NomSituacionLaboralModel();

        //Modificando los datos de la  situacion laboral.
        $resp= $modeloNegocioSituacion->modificarsituacionLaboral(
            $this->_getParam('idsituacionlaboral'),
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
           // $this->_getParam('asociadocargo'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'La clasificación del la situación  ya existe.'}";
        }
    }

    /**
     * Accion para eliminar una  situacion laboral.
     */
    public function eliminarSituacionLaboralAction()
    {

        //Creando el modelo de negocio de gestion de  situaciones laborales.
        $modeloNegocioSituacion = new NomSituacionLaboralModel();

        //Eliminando la  situacion laboral.
        $bool = $modeloNegocioSituacion->eliminarSituacionLaboral($this->_getParam('idsituacionlaboral'));

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion de exportar
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomSituacionLaboralModel();
        $arr = $obj->obtenerListadoSituaciones(0,1000);//print_r($arr);die;
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}

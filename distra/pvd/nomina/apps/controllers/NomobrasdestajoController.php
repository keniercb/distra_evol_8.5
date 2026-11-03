<?php
    $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
    //PDF
    require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
    //Excel
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class NomobrasdestajoController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function nomobrasdestajoAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }   

    public function obtenerListadoObrasAction()
    {

        $inicio = $this->_getParam('start', 0);
        $limite = $this->_getParam('limit', 10);
        $texto = $this->_request->getPost('texto');
        $identidad = $this->global->Estructura->idestructura;

        $datos = NomObrasDestajoModel::obtenerListadoNomenclador($texto, $inicio, $limite, $identidad);

        echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => count($datos)));
    }

    public function obtenerNumeroDeCodigoAction()
    {
        $objModel = new NomObrasDestajo();
        $r = $objModel->fnObtenerCodigoDisponible();

        echo Zend_Json::encode($r);
    }
    
    public function adicionarNomencladorObrasAction() 
    {
        $codigo = $this->_getParam('codigo');
        $denominacion = $this->_getParam('denominacion');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $identidad = $this->global->Estructura->idestructura;

        $obj = new NomObrasDestajoModel();

        $result = $obj->adicionarNomenclador($denominacion, $fechainicio, $fechafin, $codigo, $identidad);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($result == 2){
            echo "{'codigo':'1','mensaje':'El nomenclador se ha adicionado.'}";
        }else{
            echo "{'codigo':'3','mensaje':'El nomenclador ya existe.'}";
        }
    } 
    
    public function modificarNomencladorObrasAction() 
    {
        $codigo = $this->_getParam('codigo');
        $denominacion = $this->_getParam('denominacion');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $idnomobrasdestajo =  $this->_getParam('idnomobrasdestajo');

        $obj = new NomObrasDestajoModel();

        $result = $obj->modificarNomencladorObras($idnomobrasdestajo, $denominacion, $fechainicio, $fechafin, $codigo);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($result == 2){
            echo "{'codigo':'1','mensaje':'El nomenclador ha sido modificado.'}";
        }
    } 

    public function eliminarNomencladorAction() 
    {
        $idnomobrasdestajo = $this->_getParam('idnomobrasdestajo');
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $obj = new NomObrasDestajoModel();

        //Eliminando el tipo de destajo.
        $result = $obj->eliminarNomenclador($idnomobrasdestajo);

        if($result == 2){
			echo "{'codigo':'3'}";
		}else{
			//Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }

    public function modificarNomencladorEntidadAction()
    {
        $idnomobrasdestajo = $this->_getParam('idnomobrasdestajo');
        $activo = $this->_getParam('activo');      
        $identidad = $this->global->Estructura->idestructura;

        NomObrasDestajo::modificarNomencladorEntidad($idnomobrasdestajo, $activo, $identidad);

        echo "{'codigo':'1'}";

    }

    public function modificarNomencladorEstadoAction()
    {
        $idnomobrasdestajo = $this->_getParam('idnomobrasdestajo');
        $estado = $this->_getParam('estado');      

        NomObrasDestajo::modificarNomencladorEstado($idnomobrasdestajo, $estado);

        echo "{'codigo':'1'}";

    }

    
}

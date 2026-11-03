<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar sectores salariales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomSectorSalarialModel
 * @copyright UCID
 * @version 1.0
 */
class NomsectoressalarialesController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los sectores salariales.
     */
    public function nomsectoressalarialesAction() {

        //Agregando a la vista los ficheros js de la ayuda.
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los sectores salariales.
     */
    public function obtenerListadoSectoresSalarialesAction() {

        //Creando el modelo de negocio de gestion de sectores salariales.
        $modeloNegocioSectores = new NomSectorSalarialModel();
        
        //Obteniendo el listado de sectores salariales.
        $arrSectores = $modeloNegocioSectores->obtenerListadoSectores(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        
        //Obteniendo la cantidad total de sectores.
        $cantTotalSectores = $modeloNegocioSectores->obtenerCantidadTotalSectores();

        //Imprimiendo el listado de sectores.
        echo Zend_Json::encode(array('datos' => $arrSectores, 'cantidad' => $cantTotalSectores));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un sector salarial.
     */
    public function adicionarSectorSalarialAction() {

        //Creando el modelo de negocio de gestion de sectores salariales.
        $modeloNegocioSectores = new NomSectorSalarialModel();

        //Insertando los datos del sector salarial.
        $resp=$modeloNegocioSectores->adicionarSectorSalarial(
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El sector salarial que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un sector salarial.
     */
    public function modificarSectorSalarialAction() {

        //Creando el modelo de negocio de gestion de sectores salariales.
        $modeloNegocioSectores = new NomSectorSalarialModel();

        //Modificando los datos del sector salarial.
        $resp=$modeloNegocioSectores->modificarSectorSalarial(
            $this->_getParam('idsector'),
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El sector salarial ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un sector salarial.
     */
    public function eliminarSectorSalarialAction() {

        //Creando el modelo de negocio de gestion de sectores salariales.
        $modeloNegocioSectores = new NomSectorSalarialModel();

        //Eliminando el sector salarial.
        $bool = $modeloNegocioSectores->eliminarSectorSalarial($this->_getParam('idsector'));
        
        if($bool == 2){
			echo "{'codigo':'3'}";
		}else{
			// Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }

    /**
     * Accion de exportar
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomSectorSalarialModel();
        $arr = $obj->obtenerListadoSectores(0,1000);
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}

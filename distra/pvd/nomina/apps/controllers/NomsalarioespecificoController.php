<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar los salarios específicos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomSalarioEspecificoModel
 * @uses NomSalarioEspecificpModel
 * @copyright UCID
 * @version 1.0
 */
class NomsalarioespecificoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los salarios específicos.
     */
    public function nomsalarioespecificoAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los sectores.
     */
    public function obtenerListadoSectoresSalarialesAction() {

        //Creando el modelo de negocio de gestion de los sectores.
        $modeloNegocioSectores = new NomSectorSalarialModel();
        
        //Obteniendo el listado de formas de los sectores.
        $arrSectores = $modeloNegocioSectores->obtenerListadoSectores(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        
        //Obteniendo la cantidad total de sectores.
        $cantTotalSectores = $modeloNegocioSectores->obtenerCantidadTotalSectores();

        //Imprimiendo el listado de sectores.
        echo Zend_Json::encode(array('datos' => $arrSectores, 'cantidad' => $cantTotalSectores));
    }

    /**
     * Accion utilizada para listar los datos de los salarios específicos.
     */
    public function obtenerListadoSalarioEspecificoAction() {

        //Creando el modelo de negocio de gestion de salarios específicos.
        $modeloNegocioSistema = new NomSalarioEspecificoModel();
        
        //Obteniendo el listado de salarios específicos.
        $arrSistemas = $modeloNegocioSistema->obtenerListadoSalarioEspecifico(
            $this->_getParam('idsectorsalarial', 1),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        
        //Obteniendo la cantidad total de salarios específicos.
        $cantTotalSistemas = $modeloNegocioSistema->obtenerCantidadTotalSalarioEspecifico(
            $this->_getParam('idsectorsalarial', 1)
        );
        
        //Imprimiendo el listado de salarios específicos.
        echo Zend_Json::encode(array('datos' => $arrSistemas, 'cantidad' => $cantTotalSistemas));
    }

    /**
     * Accion para adicionar un salario específico.
     */
    public function adicionarSalarioEspecificoAction() {
        //Creando el modelo de negocio de gestion de salarios específicos.
        $modeloNegocioSistema = new NomSalarioEspecificoModel();
        $sector = $this->_request->getPost('idsector'); 
        
        //Insertando los datos del sistema de salarios específicos.
        $modeloNegocioSistema->adicionarSalarioEspecifico(
            $this->_getParam('denominacion'),
            $this->_request->getPost('salario'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $sector
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar un salario específico.
     */
    public function modificarSalarioEspecificoAction() {

        //Creando el modelo de negocio de gestion de salarios específicos.
        $modeloNegocioSistema = new NomSalarioEspecificoModel();

        //Modificando los datos del salario específico.
        $modeloNegocioSistema->modificarSalarioEspecifico(
            $this->_getParam('idsalarioesp'),
            $this->_getParam('denominacion'),
            $this->_getParam('salario'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idsector')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar un salario específico.
     */
    public function eliminarSalarioEspecificoAction() {

        //Creando el modelo de negocio de gestion de salarios específicos.
        $modeloNegocioSistema = new NomSalarioEspecificoModel();
        
        //Eliminando el salario específico.
        $bool = $modeloNegocioSistema->eliminarSalarioEspecifico($this->_getParam('idsalarioespecifico'));

        if($bool == 2){
			echo "{'codigo':'3'}";
		}else{
			//Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }

    /**
     * Accion de exportar
     */
    public function exportarNomencladorAction(){
        $obj = new NomSectorSalarialModel();
        $objse = new NomSalarioEspecificoModel();
        $datos = $obj->obtenerListadoSectores(0,1000);
        foreach ($datos as $pos => $sector) {
            $datos[$pos]['salariosespecificos'] = $objse->obtenerListadoSalarioEspecifico($sector['idsectorsalarial'], 0, 1000);
        }
        $r = $objse->fnExportarNomenclador($datos);
        echo json_encode($r);
    }
}

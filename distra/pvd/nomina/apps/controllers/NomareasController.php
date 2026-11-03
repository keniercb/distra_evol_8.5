<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar grupos escala.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomGrupoEscalaModel
 * @copyright UCID
 * @version 1.0
 */
class NomareasController extends ZendExt_Controller_Secure
{
    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión .
     */
    public function nomareasAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las áreas.
     */
    public function obtenerListadoAreaslaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        //Creando el modelo de negocio de gestion .
        $modeloNegocioAreas = new NomAreasModel();

        //Obteniendo el listado de grupos escala.
        $arrAreas = $modeloNegocioAreas->obtenerListadoAreas(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10),
            $idestructura
        );

        foreach ($arrAreas as $a => &$area) {
            $area['idcomposicion'] = $area['composicion'];
            $area['denomcomposicion'] = ($area['idcomposicion'] == 1) ? 'Cargos' : 'Entidad';
            $area['denommultipleseleccioncargos'] = ($area['multipleseleccioncargos'] == 1) ? 'Si' : 'No';
            unset($area['composicion']);
        }

        //Obteniendo la cantidad total.
        $cantTotalAreas = $modeloNegocioAreas->obtenerCantidadTotalAreas($idestructura);

        //Imprimiendo el listado de área.
        echo Zend_Json::encode(array('datos' => $arrAreas, 'cantidad' => $cantTotalAreas));
    }

    /**
     * Accion utilizada para listar todas las áreas.
     */
    public function obtenerTodosAreasAction()
    {

        $idestructura = $this->global->Estructura->idestructura;
        //Creando el modelo de negocio de gestion de áreas.
        $modeloNegocioAreas = new NomAreasModel();

        //Obteniendo el listado de áreas.
        $arrAreas = $modeloNegocioAreas->obtenerTodosAreas($idestructura);

        //Imprimiendo el listado.
        echo Zend_Json::encode(array('datos' => $arrAreas, 'cantidad' => count($arrAreas)));
    }

    /**
     * Accion para adicionar un área.
     */
    public function adicionarAreasAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        //Creando el modelo de negocio de gestion de área.
        $modeloNegocioAreas = new NomAreasModel();

        //Insertando los datos del área.
        $resp = $modeloNegocioAreas->adicionarAreas(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('composicion'),
            $this->_getParam('descripcion'),
            $this->_getParam('orden'),
            $this->_getParam('multipleseleccioncargos'),
            $idestructura
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','msg':'El área que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un área.
     */
    public function modificarAreasAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        //Creando el modelo de negocio de gestion de área.
        $modeloNegocioAreas = new NomAreasModel();

        //Modificando los datos del área.
        $resp = $modeloNegocioAreas->modificarAreas(
            $this->_getParam('idarea'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('composicion'),
            $this->_getParam('descripcion'),
            $this->_getParam('orden'),
            $this->_getParam('multipleseleccioncargos'),
            $idestructura
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','msg':'El área que quiere modificar ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un área.
     */
    public function eliminarAreasAction()
    {

        //Creando el modelo de negocio de gestion de areas.
        $modeloNegocioAreas = new NomAreasModel();

        //Eliminando el área.
        $bool = $modeloNegocioAreas->eliminarAreas(
            $this->_getParam('idarea')
        );

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para listar la estructura de plantilla nominal.
     */
    public function obtenerEstructuraPlantillaNominalAction()
    {
        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new NomAreasCargosModel();

        //Obteniendo el listado de plantillas.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraArea(
            $this->_getParam('idarea'), false
        );

        //Imprimiendo el listado de plantillas nominales.
        echo Zend_Json::encode($arrEstruc);
    }

    /**
     * Accion utilizada para listar la estructura restante.
     */
    public function obtenerEstructuraRestanteAction()
    {
        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new NomAreasCargosModel();

        $idestructura = $this->global->Estructura->idestructura;
        //print_r($idestructura);die;

        //Obteniendo el listado de estructuras restantes.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraRestantes(
            $idestructura,
            $this->_getParam('node'),
            $this->_getParam('composicion'),
            $this->_getParam('multipleseleccioncargos'),
            $this->_getParam('idarea')
        );

        //Imprimiendo el listado de estructuras restantes.
        echo Zend_Json::encode($arrEstruc);

    }

    /**
     * Accion utilizada para listar la estructura insertadas.
     */
    public function obtenerEstructuraInsertadasAction()
    {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new NomAreasCargosModel();

        //Obteniendo el listado de estructuras insertadas.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraArea(
            $this->_getParam('idarea'), true
        );

        //Imprimiendo el listado de estructuras insertadas.
        echo Zend_Json::encode($arrEstruc);
    }

    /**
     * Accion para adicionar una estructura de plantilla nominal.
     */
    public function adicionarEstructuraAreaAction()
    {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new NomAreasCargosModel();

        //Insertando los datos de la estructura plantilla nominal.
        $modeloNegocioCargosP->adicionarEstructuraArea(
            $this->_getParam('idarea'),
            $this->_getParam('identidad'),
            Zend_Json::decode(stripslashes($this->_getParam('array')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar una estructura de plantilla nominal.
     */
    public function eliminarEstructuraAreaAction()
    {
        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new NomAreasCargosModel();

        //Eliminando los datos de la estructura plantilla nominal.
        $modeloNegocioCargosP->eliminarEstructuraArea(
            $this->_getParam('idarea'),
            Zend_Json::decode(stripslashes($this->_getParam('array')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion utilizada para cargar las areas.
     */
    public function obtenerAreaAction()
    {

        $idestructura = $this->_getParam('idestructura');

        //Creando el modelo de negocio de nomenclador area.
        $modeloArea = new NomAreasModel();

        //Obteniendo el listado de areas.
        $arrArea = $modeloArea->obtenerAreas($idestructura);

        //Imprimiendo el listado de areas.
        echo Zend_Json::encode(array('datos' => $arrArea));
    }


    /**
     * Accion utilizada para exportar los cargos por areas.
     */
    public function exportarNomencladorAction()
    {
        $modeloNegocioCargosP = new NomAreasCargosModel();
        $idarea = $this->_getParam('idarea');
        $area = $this->_getParam('area');
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraArea($idarea, false);
        $r = $modeloNegocioCargosP->fnExportarNomenclador($idarea, $area, $arrEstruc);
        echo json_encode($r);
    }

}

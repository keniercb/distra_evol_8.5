<?php

/**
 * Controlador para configurar la estructura de los pagos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class ConfigestructurapagoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista.
     */
    public function configestructurapagoAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las plantillas nominales.
     */
    public function obtenerListadoPlantillasNominalesAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();
        
        //Obteniendo el listado de plantillas.
        $arrPlantilla = $modeloNegocioPlantillaN->obtenerListadoPlantillaNominal(
            $this->_getParam('identidad', 0)
        );

        //Imprimiendo el listado de plantillas nominales.
        echo Zend_Json::encode(array('datos' => $arrPlantilla, 'cantidad' => count($arrPlantilla)));
    }

    /**
     * Accion para adicionar una plantilla nominal.
     */
    public function adicionarPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();

        //Insertando los datos de la plantilla nominal.
        $modeloNegocioPlantillaN->adicionarPlantillaNominal(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('identidad')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para modificar una plantilla nominal.
     */
    public function modificarPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();

        //Modificando los datos de la plantilla nominal.
        $modeloNegocioPlantillaN->modificarPlantillaNominal(
            $this->_getParam('idplantilla'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para eliminar una plantilla nominal.
     */
    public function eliminarPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();


        //Eliminando la plantilla nominal.
        $modeloNegocioPlantillaN->eliminarPlantillaNominal(
            $this->_getParam('idplantilla')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion utilizada para listar la estructura de plantilla nominal.
     */
    public function obtenerEstructuraPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();
        
        //Obteniendo el listado de plantillas.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraPlantillaNominal(
            $this->_getParam('idplantilla', 0), false
        );

        //Imprimiendo el listado de plantillas nominales.
        echo Zend_Json::encode($arrEstruc);
    }

    /**
     * Accion utilizada para listar la estructura restante.
     */
    public function obtenerEstructuraRestanteAction() {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();
        
        //Obteniendo el listado de estructuras restantes.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraRestantes(
            $this->_getParam('identidad', 0),
            $this->_getParam('node', 0)
        );

        //Imprimiendo el listado de estructuras restantes.
        echo Zend_Json::encode($arrEstruc);
       
    }

    /**
     * Accion utilizada para listar la estructura insertadas.
     */
    public function obtenerEstructuraInsertadasAction() {

       //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();
        
        //Obteniendo el listado de estructuras insertadas.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraPlantillaNominal(
            $this->_getParam('idplantilla', 0), true
        );

        //Imprimiendo el listado de estructuras insertadas.
        echo Zend_Json::encode($arrEstruc);
    }

    /**
     * Accion para adicionar una estructura de plantilla nominal.
     */
    public function adicionarEstructuraPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Insertando los datos de la estructura plantilla nominal.
        $modeloNegocioCargosP->adicionarEstructuraPlantillaNominal(
            $this->_getParam('idplantilla'),
            $this->_getParam('identidad'),
           Zend_Json::decode(stripslashes($this->_getParam('array')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para eliminar una estructura de plantilla nominal.
     */
    public function eliminarEstructuraPlantillaNominalAction() {
        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Eliminando los datos de la estructura plantilla nominal.
        $modeloNegocioCargosP->eliminarEstructuraPlantillaNominal(
            $this->_getParam('idplantilla'),
           Zend_Json::decode(stripslashes($this->_getParam('array')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }
}
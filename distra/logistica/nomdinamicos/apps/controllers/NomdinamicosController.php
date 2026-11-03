<?php

/**
 * Controlador del Nomenclador de de Nomencladores Dinamicos, Los cuales se utilizaran a la hora de crear un atributo dinamico de tipo nomenclador
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    1.0
 */
class NomdinamicosController extends ZendExt_Controller_Secure {

    protected $atribDinamModel;

    function init () {
        parent :: init ();
        $this->atribDinamModel = new AtributosDinamicosModel();
    }

    function nomdinamicosAction()
    {
        //$this->view->arrayJs = array($this->integrator->ayuda->devolverJS());
        $this->render();
    }

    /**
     * Funcion para cargar los nomencladores ya insertados (árbol)
     */
    function getnomencladoresAction () {
        echo json_encode ($this->atribDinamModel->GetTablasNomencladores ());
    }

    /**
     * Funcion para insertar un nuevo nomenclador (árbol)
     */
    function insertarnomencladorAction () {

        try {
            $alias = $this->_request->getPost ('alias');
            $idtabla = $this->atribDinamModel->AdicionarTabla ('mod_datosmaestrosmeta', $alias, false, 2, $alias);

            echo json_encode (array('success' => true, 'idtabla' => $idtabla));
        } catch(Exception $e) {
            echo json_encode (array('failure' => true, 'error' => $e->getMessage ()));
        }
    }

    /**
     * Funcion para modificar un nuevo nomenclador (árbol)
     */
    function modificarnomencladorAction () {
        $alias = $this->_request->getPost ('alias');
        $idtabla = $this->_request->getPost ('idtabla');

        try {
            $this->atribDinamModel->tablaModel->modificarAliasTabla ($idtabla, $alias);

            echo json_encode (array('success' => true, 'idtabla' => $idtabla));
        } catch(Exception $e) {
            echo json_encode (array('failure' => true, 'error' => $e->getMessage ()));
        }
    }

    /**
     * Funcion para eliminar un nomenclado (árbol)
     */
    function eliminarnomencladorAction () {
        try {

            $idtabla = $this->_request->getPost ('idtabla');
            $this->atribDinamModel->tablaModel->eliminarTabla($idtabla);

            echo json_encode (array('success' => true, 'idtabla' => $idtabla));
        } catch(Exception $e) {
            echo json_encode (array('failure' => true, 'error' => $e->getMessage ()));
        }
    }

    /**
     * Función para cargar la configuración del grid editable de valores
     */
    function getgridatributosAction () {

        $configuracion = $this->atribDinamModel->metadataModel->obtenerConfigGridPanel ($this->_request->getPost ('idtabla'));
        $configFormulario = $this->atribDinamModel->metadataModel->obtenerConfigFormulario ($this->_request->getPost ('idtabla'));
        $configuracion->items = $configFormulario->items;

        echo json_encode ($configuracion);
    }

    /**
     * Función para insertar valores de un nomenclador
     * */
    function insertarvaloresAction () {

        try {
            $idtabla = $this->_request->getPost ('idtabla');
            $datos = json_decode (stripcslashes ($this->_request->getPost ('datos')));
            foreach($datos as $dato) {
                $this->atribDinamModel->metadataModel->insertarEnMetadatos ($idtabla, (array)$dato);
            }

            echo json_encode (array('success' => true));
        } catch(Exception $e) {
            echo json_encode (array('failure' => true, 'error' => $e->getMessage ()));
        }
    }

    /**
     * Función para modificar valores de un nomenclador
     */
    function modificarvaloresAction () {

        try {

            $idtabla = $this->_request->getPost ('idtabla');
            $datos = json_decode (stripcslashes ($this->_request->getPost ('datos')));

            foreach($datos as $dato) {
                $this->atribDinamModel->metadataModel->modificarEnMetadatos ($idtabla, (array)$dato);
            }

            echo json_encode (array('success' => true));
        } catch(Exception $e) {
            echo json_encode (array('failure' => true, 'error' => $e->getMessage ()));
        }
    }

    /**
     * Función para eliminar valores de un nomenclador
     */
    function eliminarvaloresAction () {

        try {

            $idtabla = $this->_request->getPost ('idtabla');
            $datos = json_decode (stripcslashes ($this->_request->getPost ('datos')));

            foreach($datos as $dato) {
                $this->atribDinamModel->metadataModel->eliminarEnMetadatos ($idtabla, (array)$dato);
            }

            echo json_encode (array('success' => true));
        } catch(Exception $e) {
            echo json_encode (array('failure' => true, 'error' => $e->getMessage ()));
        }
    }

    /**
     * Función para cargar el grid de valores de un nomenclador
     */
    function getvaloresAction () {

        $idtabla = $this->_request->getPost ('idtabla');
        $datos = Array();
        $total = 0;

        if(strlen ($idtabla) > 0) {
            $start = ($this->_request->getPost ('start')) ? $this->_request->getPost ('start') : 0;
            $limit = ($this->_request->getPost ('limit')) ? $this->_request->getPost ('limit') : 20;
            $config = $this->atribDinamModel->metadataModel->obtenerInfoTabla ($idtabla, array(), 'left');
            $temp_alias = $config->ar_select;
            if($config) {
                $config->ar_limit = $limit;
                $config->ar_offset = $start;
                $datos = $config->get ()->result_array ();
                $datos_new = array();
                foreach($datos as $pos => $dat){
                    $i = 0;
                    foreach($dat as $index => $d){
                        $temppos = substr($temp_alias[$i], strrpos($temp_alias[$i], ' as ') + 4);
                        $datos_new[$pos][$temppos] = $datos[$pos][$index];
                        unset($datos[$pos][$index]);
                        $i++;
                    }
                }
                $configCount = $config;
                $configCount->ar_select = Array('count (*)');
                $total = $configCount->get ()->result_array ();
                $total = $total[0]['count'];
            }
        }
        echo json_encode (array('datos' => $datos_new, 'total' => $total));
    }
}
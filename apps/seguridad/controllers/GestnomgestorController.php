<?php

/**
 * @name GestnomgestorController - Clase controladora 
 * del nomenclador de gestores.
 * @package   seguridad
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestnomgestorController extends ZendExt_Controller_Secure
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestnomgestorAction() - Función principal de la clase, 
     * encargada de renderizar la vista correspondiente.
     * @return void
     */
    public function gestnomgestorAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertargestorAction - Función usada para 
     * insertar un nuevo gestor.
     */
    public function insertargestorAction()
    {
        $gestor = new DatGestor();
        $gestor->gestor = $this->_request->getPost('gestor');
        $gestor->puerto = $this->_request->getPost('puerto');
        $gestor->descripcion = $this->_request->getPost('descripcion');
        $model = new DatGestorModel();
        $model->insertarnomgestor($gestor);
        $this->showMessage('El gestor ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificaromgestorAction - Función usada para 
     * modificar el gestor seleccionado.
     */
    public function modificaromgestorAction()
    {
        $gestor = new DatGestor();
        $model = new DatGestorModel();
        $gestor = Doctrine::getTable('DatGestor')
            ->find($this->_request->getPost('idgestor'));
        $gestor->gestor = $this->_request->getPost('gestor');
        $gestor->puerto = $this->_request->getPost('puerto');
        $gestor->descripcion = $this->_request->getPost('descripcion');
        $model->modificarnomgestor($gestor);
        $this->showMessage('El gestor ha sido modificado satisfactoriamente.');
    }

    /**
     * @method comprobargestoresAction - Función usada para verificar que 
     * gestor no se encuentre en uso al eliminarse.
     */
    public function comprobargestoresAction()
    {
        $idgestor = $this->_request->getPost('idgestor');
        if (DatGestor::obtenercantnomgestsist($idgestor) != 0) {
            throw new ZendExt_Exception('SEG011');
        } else {
            if (DatGestorDatServidorbd::obtenercantnomgest($idgestor)) {
                die("{'tiene':1}");
            } else {
                $model = new DatGestorModel();
                $gestor = Doctrine::getTable('DatGestor')->find($idgestor);
                $model->eliminarnomgestor($gestor);
                $this->showMessage(
                    'El gestor ha sido eliminado satisfactoriamente.'
                );
            }
        }
    }

    /**
     * @method eliminargestorAction - Función usada para 
     * eliminar un gestor determinado.
     */
    public function eliminargestorAction()
    {
        $model = new DatGestorModel();
        $gestor = Doctrine::getTable('DatGestor')
            ->find($this->_request->getPost('idgestor'));
        $model->eliminarnomgestor($gestor);
        $this->showMessage('El gestor ha sido eliminado satisfactoriamente.');
    }

    /**
     * @method cargarnomgestoresAction - Función usada para 
     * listar los gestores por lotes.
     */
    public function cargarnomgestoresAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $gestor = $this->_request->getPost("gestor");
        if ($gestor) {
            $datosgest = DatGestor::buscarnomgestores($gestor, $limit, $start);
            $canfilas = DatGestor::obtenercantnomgestoresbuscados($gestor);
        } else {
            $datosgest = DatGestor::cargarnomgestores($limit, $start);
            $canfilas = DatGestor::obtenercantnomgestores();
        }
        $datos = $datosgest->toArray();
        $result = array('cantidad_filas' => $canfilas, 'datos' => $datos);
        echo json_encode($result);
    }

}
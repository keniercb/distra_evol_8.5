<?php

/**
 * @name GestgestorController - Clase controladora de gestores.
 * @package   seguridad
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestgestorController extends SeguridadController
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestgestorAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestgestorAction()
    {
        $this->render();
    }

    /**
     * @method insertargestorservidorAction - Función usada para 
     * adicionar un nuevo tipo de gestor.
     */
    public function insertargestorservidorAction()
    {
        $gestorservidor = new DatGestorDatServidorbd();
        $gestorservidor->idgestor = $this->_request->getPost('idgestor');
        $gestorservidor->idservidor = $this->_request->getPost('idservidor');
        $model = new DatGestorDatServidorbdModel();
        $model->insertargestorervidor($gestorservidor);
        $this->showMessage('El gestor fue insertado satisfactoriamente.');
    }

    /**
     * @method modificargestorAction - Función usada para 
     * midificar el gestor seleccionado.
     */
    public function modificargestorAction()
    {
        $idgestor = $this->_request->getPost('idgestor');
        $nomgestor = $this->_request->getPost('gestor');
        $puertogestor = $this->_request->getPost('puerto');
        $descgestor = $this->_request->getPost('descripcion');
        $cantgestsist = DatGestor::obtenercantgestsist($idgestor);
        $cantgestbd = DatGestor::obtenercantgestbd($idgestor);
        if (($cantgestsist == 0) && ($cantgestbd == 0)) {
            $gestor = new DatGestor();
            $model = new DatGestorModel();
            $gestor = Doctrine::getTable('DatGestor')->find($idgestor);
            $gestor->gestor = $nomgestor;
            $gestor->puerto = $puertogestor;
            $gestor->descripcion = $descgestor;
            $model->modificargestor($gestor);
            $this->showMessage('El gestor fue modificado satisfactoriamente.');
        }
    }

    /**
     * @method cargargestoresAction - Función usada para cargar 
     * un listado de gestores por lotes.
     */
    public function cargargestoresAction()
    {
        $idservidor = $this->_request->getPost('idservidor');
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $datosgest = DatGestor::cargargestores($idservidor, $limit, $start);
        $canfilas = DatGestor::obtenercantgest($idservidor);
        $datos = $datosgest->toArray();
        echo json_encode(
            array('cantidad_filas' => $canfilas, 'datos' => $datos)
        );
    }

    /**
     * @method Función usada para cargar el árbol de 
     * servidores de base de dato.
     */
    public function cargarservidoresAction()
    {
        $idnodo = $this->_request->getPost('node');
        $servidoresArr = array();
        if ($idnodo == 0) {
            $servidores = DatServidor::cargarservidores();
            if (count($servidores) > 0) {
                foreach ($servidores as $valores => $valor) {
                    $servidoresArr[$valores] = $valor;
                    $servidoresArr[$valores]['leaf'] = true;
                }
            }
            echo json_encode($servidoresArr);
        }
    }

    /**
     * @method comprobargestoresAction - Función usada para comprobar 
     * que los gestores que se eliminarán no esten
     * en uso.
     */
    public function comprobargestoresAction()
    {
        $idgestor = $this->_request->getPost('idgestor');
        $idservidor = $this->_request->getPost('idservidor');
        $comprobar = DatGestor::obtenercantgestsistema($idservidor, $idgestor);
        if ($comprobar > 0) {
            throw new ZendExt_Exception('SEG011');
        }
        if (DatGestorDatServidorbd::eliminargestorservidor(
            $idservidor, $idgestor
        )) {
            echo "{'cod':1,'mensaje': 'El gestor fue "
            . "eliminado satisfactoriamente.'}";
        }
    }

    /**
     * @method eliminargestoresAction - Función usada para eliminar 
     * la relación establecida entre un gestor
     * y un servidor.
     */
    public function eliminargestoresAction()
    {
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        if (DatGestorDatServidorbd::eliminargestorservidor(
            $idservidor, $idgestor
        )) {
            echo "{'cod':1,'mensaje': 'El gestor fue "
            . "eliminado satisfactoriamente.'}";
        }
    }

    /**
     * @method cargarcombogestorAction - Función usada 
     * para listar los gestores.
     */
    public function cargarcombogestorAction()
    {
        $datos = DatGestor::cargarcombogestor();
        echo json_encode($datos->toArray());
    }

    /**
     * @method cargarcombogestoresAction - Función usada para cargar 
     * los gestores que pertenecen a un
     * servidor especifico.
     */
    public function cargarcombogestoresAction()
    {
        $idservidor = $this->_request->getPost('idservidor');
        $gestores = DatGestor::cargarcombogestores($idservidor);
        $datos = $gestores->toArray(true);
        echo json_encode($datos);
    }

}
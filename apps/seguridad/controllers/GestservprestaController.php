<?php

/**
 * @name GestservprestaController - Clase controladora de 
 * sevicios que presta un sistema.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestservprestaController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestservprestaAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestservprestaAction()
    {
        $this->render();
    }

    /**
     * @method insertarservicioAction - Función usada para adicionar 
     * un nuevo servicio que presta un sistema.
     */
    public function insertarservicioAction()
    {
        $servicio = new DatServicio();
        $servicio->denominacion = $this->_request->getPost('denominacion');
        $servicio->descripcion = $this->_request->getPost('descripcion');
        $servicio->wsdl = $this->_request->getPost('wsdl');
        $servicio->idsistema = $this->_request->getPost('idsistema');
        $serviciomodel = new DatServPrestaModel();
        $serviciomodel->insertarservicio($servicio);
        $this->showMessage('El servicio fue insertado satisfactoriamente.');
    }

    /**
     * @method modificarservicioAction - Función usada para 
     * modificar el servicio que presta un sistema.
     */
    public function modificarservicioAction()
    {
        $servicio = new DatServicio();
        $servicio = Doctrine::getTable('DatServicio')
            ->find($this->_request->getPost('idservicio'));
        $servicio->denominacion = $this->_request->getPost('denominacion');
        $servicio->descripcion = $this->_request->getPost('descripcion');
        $servicio->wsdl = $this->_request->getPost('wsdl');
        $servicio->idsistema = $this->_request->getPost('idsistema');
        $serviciomodel = new DatServPrestaModel();
        $serviciomodel->modificarservicio($servicio);
        $this->showMessage('El servicio fue modificoado satisfactoriamente.');
    }

    /**
     * @method eliminarservicioAction - Función usada para 
     * eliminar un servicio que presta un sistema.
     */
    public function eliminarservicioAction()
    {
        $servicio = new DatServicio();
        $servicio = Doctrine::getTable('DatServicio')
            ->find($this->_request->getPost('idservicio'));
        $serviciomodel = new DatServPrestaModel();
        $serviciomodel->eliminarservicio($servicio);
        $this->showMessage('El servicio fue eliminado satisfactoriamente.');
    }

    /**
     * @method cargarservicioAction - Función usada para listar 
     * los servicios que presta un sistema por lotes.
     */
    public function cargarservicioAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $datservicio = DatServicio::obtenerServicio($idsistema, $limit, $start);
        $cantserv = DatServicio::cantserviciop($idsistema);
        $datos = $datservicio->toArray();
        $result = array('cantidad_filas' => $cantserv, 'datos' => $datos);
        echo json_encode($result);
    }

}
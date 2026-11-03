<?php

/**
 * @name GestservicioconsController - Clase controladora.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestservicioconsController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestservicioconsAction() - Función principal 
     * de la clase, encargada de renderiar la
     * vista correspondiente.
     *
     * @return void
     */
    public function gestservicioconsAction()
    {
        $this->render();
    }

    /**
     * @method insertarservicioconsAction - Función usada 
     * para adicionar un nuevo servicio.
     */
    public function insertarservicioconsAction()
    {
        $serviciocons = new DatServicioDatSistema();
        $serviciocons->idservicio = $this->_request->getPost('idservicio');
        $serviciocons->idsistema = $this->_request->getPost('idsistema');
        $model = new DatServicioDatSistemaModel();
        $model->insertarserviciocons($serviciocons);
        $this->showMessage('El servicio fue insertado satisfactoriamente.');
    }

    /**
     * @method eliminarservicioconsAction - Función usada para 
     * eliminar el servicio seleccionado.
     */
    public function eliminarservicioconsAction()
    {
        $idservicio = $this->_request->getPost('idservicio');
        $idsistema = $this->_request->getPost('idsistema');
        DatServicioDatSistema::eliminarservicioscons($idservicio, $idsistema);
        $this->showMessage('El servicio fue eliminado satisfactoriamente.');
    }

    /**
     * @method cargarservicioconsAction - Función usada para listar
     *  los servicios de un sistema por lotes.
     */
    public function cargarservicioconsAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $limit = $this->_request->getPost("limit");
        $start = $this->_request->getPost("start");
        $datoserviciosc = DatServicioDatSistema::cargarserviciocons(
            $idsistema, $limit, $start
        );
        $cantf = DatServicioDatSistema::obtenercantsercons($idsistema);
        $datos = $datoserviciosc->toArray();
        $result = array('cantidad_filas' => $cantf, 'datos' => $datos);
        echo json_encode($result);
    }

    /**
     * @method cargarservicionoconsAction - Función usada para 
     * listar los servicios que consume un sistema.
     */
    public function cargarservicionoconsAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $datoserviciosnoc = DatServicioDatSistema::cargarservicionocons(
            $idsistema
        );
        $datos = $datoserviciosnoc->toArray(true);
        echo json_encode($datos);
    }

}
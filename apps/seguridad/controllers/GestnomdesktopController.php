<?php

/**
 * Clase controladora de nomencladores de gestor.
 *
 * @name GestnomdesktopController - Clase controladora.
 * @package   seguridad
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestnomdesktopController extends ZendExt_Controller_Secure
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestnomdesktopAction() - Función principal de la clase,
     *  encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestnomdesktopAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarnomdesktopAction - Función usada para
     *  adicionar un nuevo tipo de escritorio.
     */
    public function insertarnomdesktopAction()
    {
        $desktop = new NomDesktop();
        $desktop->denominacion = $this->_request->getPost('denominaciondes');
        $desktop->abreviatura = $this->_request->getPost('abreviaturades');
        $desktop->descripcion = $this->_request->getPost('descripciondes');
        if (self::verificarDesktop(
            'denominacion', $desktop->denominacion, null
        ) > 0) {
            throw new ZendExt_Exception('SEGDESK01');
        }
        if (self::verificarDesktop(
            'abreviatura', $desktop->abreviatura, null
        ) > 0) {
            throw new ZendExt_Exception('SEGDESK02');
        } else {
            $modeldesktop = new NomDesktopModel();
            $modeldesktop->insertardesktop($desktop);
            echo "{'cod':1,'mensaje': 'El escritorio ha sido "
            . "adicionado satisfactoriamente.'}";
        }
    }

    /**
     * @method modificarnomdesktopAction - Función usada para 
     * modificar un tipo de escritorio seleccionado.
     */
    public function modificarnomdesktopAction()
    {
        $iddesktop = $this->_request->getPost('iddesktop');
        $desktop = new NomDesktop();
        $desktop = Doctrine::getTable('NomDesktop')->find($iddesktop);
        $denominacion = $this->_request->getPost('denominaciondes');
        $desktop->descripcion = $this->_request->getPost('descripciondes');
        $abreviatura = $this->_request->getPost('abreviaturades');
        if ($desktop->denominacion != $denominacion) {
            if (self::verificarDesktop(
                'denominacion', $denominacion, $iddesktop
            ) > 0) {
                throw new ZendExt_Exception('SEGDESK01');
            }
        }
        if ($desktop->abreviatura != $abreviatura) {
            if (self::verificarDesktop(
                'abreviatura', $abreviatura, $iddesktop
            ) > 0) {
                throw new ZendExt_Exception('SEGDESK02');
            }
        }
        $desktop->denominacion = $denominacion;
        $desktop->abreviatura = $abreviatura;
        $modeldesktop = new NomDesktopModel();
        $modeldesktop->modificardesktop($desktop);
        echo "{'cod':1,'mensaje': 'El escritorio ha sido "
        . "modificado satisfactoriamente.'}";
    }

    /**
     * @method eliminarnomdesktopAction - Función usada para 
     * eliminar un tipo de escritorio.
     */
    public function eliminarnomdesktopAction()
    {
        $iddesktop = $this->_request->getPost('iddesktop');
        if (!SegUsuario::verificarDesktop($iddesktop)) {
            $modeldesktop = new NomDesktopModel();
            $desktop = Doctrine::getTable('NomDesktop')->find($iddesktop);
            $modeldesktop->eliminardesktop($desktop);
            echo "{'cod':1,'mensaje': 'El escritorio ha sido "
            . "eliminado satisfactoriamente.'}";
        } else {
            throw new ZendExt_Exception('SEGDESK03');
        }
    }

    /**
     * @method cargarnomdesktopAction - Función usada para 
     * cargar un listado de tipos de escritorio.
     */
    public function cargarnomdesktopAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        if ($limit > 0) {
            $datosdesktop = NomDesktop::cargarnomdesktop($limit, $start);
            $canfilas = NomDesktop::obtenercantnomdesktop();
            $datos = $datosdesktop->toArray();
            $result = array('cantidad_filas' => $canfilas, 'datos' => $datos);
        } else {
            $combodesktop = NomDesktop::cargarcombodesktop();
            $result = $combodesktop->toArray();
        }
        echo json_encode($result);
    }

    private function verificarDesktop($campo, $valor, $iddesktop)
    {
        return NomDesktop::verificarDesktop($campo, $valor, $iddesktop);
    }

}


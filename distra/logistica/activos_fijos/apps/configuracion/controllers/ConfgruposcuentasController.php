<?php

/**
 *
 */
class ConfgruposcuentasController extends ZendExt_Controller_Secure
{

    private $_confGruposCuentas;
    private $_sContabilidad;
    private $_configuracionHelper;

    /**
     *
     */
    function init()
    {
        parent:: init();
        $this->_confGruposCuentas = new ConfgruposcuentasModel();
        $this->_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        $this->_configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     *
     */
    function confgruposcuentasAction()
    {
        $this->render();
    }

    /**
     *
     */
    public function cargarMonedasDeLaEntidadAction()
    {
        $datos = $this->_confGruposCuentas->devolverDualidadMonetaria();
        echo json_encode($datos);
    }
    /**
     *
     */
    function cargargruposcuentasAction()
    {
        $parametros = new stdClass();

        if ($this->_request->getPost('codigo')) {
            $parametros->codigo = $this->_request->getPost('codigo');
        }
        if ($this->_request->getPost('descripcion')) {
            $parametros->descripcion = $this->_request->getPost('descripcion');
        }

        $parametros->idgruposubgrupo = 0;
        if ($this->_request->getPost('anode')) {
            $parametros->anode = $this->_request->getPost('anode');
            $parametros->idgruposubgrupo = $this->_request->getPost('anode');
        }

        $datos = $this->_confGruposCuentas->getGruposCuentas($parametros);
        echo json_encode(array('datos' => $datos));
    }

    /**
     *
     */
    public function cargarcuentascontroladasAction()
    {
        $classEstructura = 'Estructura';

        if (ComunAFTModel::integradoContabilidad()) {

            $filter = ($this->_request->getPost('query')) ? $this->_request->getPost('query') : '';

            $cuentas = $this->_sContabilidad->obtenerClasificadorCuentas(
                $this->global->$classEstructura->idestructura, 0, $filter
            );

            echo json_encode(array('cantfilas' => count($cuentas), 'datos' => $cuentas));
        } else {
            echo json_encode(array());
        }
    }

    /**
     *
     */
    public function salvargruposcuentasAction()
    {
        try {
            $this->salvarconfiguracion(json_decode(stripcslashes($this->_request->getPost('parametros'))));
        } catch (Exception $exc) {
            die($exc);
        }
    }

    /**
     *
     */
    public function salvarconfiguracion($parametros)
    {
        $classEstructura = 'Estructura';
        echo ($this->_confGruposCuentas->salvarGruposCuentas(
            $parametros, $this->global->$classEstructura->idestructura
        )
        ) ? "{'CodMsg':'1'}" : "{'CodMsg':'3'}";
    }

}

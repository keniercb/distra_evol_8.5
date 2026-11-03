<?php

/**
 * Controladora carga inicial
 *
 * @package    Configuración
 * @subpackage CargaInicial/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */
class CargainicialController extends ZendExt_Controller_Secure
{

    /**
     * Inicializa la vista
     */
    public function cargainicialAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Carga los datos del tab panel
     *
     * @return code Código de respuesta
     */
    public function cargardatostabpanelAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        try {
            $entidadconfigurada = $this->integrator->datosmaestros->entidadConfigurada($idestructura);
        } catch (Exception $e) {
            $entidadconfigurada = true;
        }
        if ($entidadconfigurada) {
            echo '{"success": 1}';
        } else {
            header('Location: ../../comun/recursos/xml/carga_inicial.xml');
        }
    }

    /**
     * Accede a los servicios de carga inicial
     */
    public function dameserviciocargainicialAction()
    {
        $idServ = $_GET['id'];
        if ($idServ) {
            switch ($idServ) {
                case 1:
                    $this->integrator->datosmaestros->bienvenida();
                    break;
                case 2:
                    $this->integrator->datosmaestros->ejercicio();
                    break;
                case 3:
                    try {
                        if (count(
                            $this->integrator->datosmaestros->obtenerEjerciciosConfiguradosCargaInicial(
                                $this->global->Estructura->idestructura
                            )
                        ) == 0
                        ) {
                            throw new ZendExt_Exception('CONF155');
//                        echo ( "{'codMsg':1,'mensaje': 'No existen ejercicios contables configurados.'}" );
                        } else {
                            $this->integrator->datosmaestros->fecha();
                        }
                    } catch (ZendExt_Exception_Presentation $u) {
                        throw new ZendExt_Exception_Presentation('CONF155', $u);
                    }
                    break;
                case 4:
                    $this->integrator->datosmaestros->Cierre();
                    break;
                case 5:
                    $this->integrator->datosmaestros->monedaC();
                    break;
                case 6:
                    $this->integrator->datosmaestros->monedaE();
                    break;
                case 7:
                    $this->integrator->datosmaestros->finalizar();
                    break;
            }
        }
    }

    /**
     * Accede al servicio cierreP
     *
     * @return code Código de respuesta
     */
    public function cierreAction()
    {
        try {
            $post = $this->_request->getPost();
            $idestructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $idestructura = $post['idestructura'];
            }
            $idsubsistema = $this->global->Subsistema->idsubsistema;
            $this->integrator->datosmaestros->cierreP($idestructura, $idsubsistema);
            echo("{'codMsg':-3}");
        } catch (Exception $e) {
            echo $e;
        }
    }

    /**
     * Accede al servicio subsistemaAperturado
     *
     * @return code Código de respuesta
     */
    public function aperturadoAction()
    {
        $post = $this->_request->getPost();
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        if ($this->integrator->datosmaestros->subsistemaAperturado($idestructura, 2) == 1) {
            echo ("{'codMsg':-1}");
        } else {
            echo ("{'codMsg':-2}");
        }
    }

    /**
     * Accede al servicio EscribirBienvenidaInicial
     *
     * @return code Código de respuesta
     */
    public function escribirbienvenidaAction()
    {
        $post = $this->_request->getPost();
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $this->integrator->datosmaestros->escribirBienvenidaCinicial($idestructura);
        echo ("{'codMsg':-1}");
    }

    /**
     * Accede al servicio cierreCinicial
     */
    public function cierreFAction()
    {
        $post = $this->_request->getPost();
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $this->integrator->datosmaestros->cierreCinicial($idestructura);
    }

    /**
     * Accede al servicio fechaCinicial
     */
    public function FechaCinicialAction()
    {
        return $this->integrator->datosmaestros->fechaCinicial();
    }

    function cierreMCAction()
    {

    }

}

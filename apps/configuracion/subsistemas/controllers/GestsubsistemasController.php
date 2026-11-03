<?php

/**
 * @package       ERP-Operaciones contables
 * @category      Controller
 * @author        Ing. Alejandro Mengana Pérez <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestsubsistemasController extends ZendExt_Controller_Secure
{

    private $model;

    function init()
    {
        $this->model = new SubsistemaModel();
        parent::init();
    }

    /**
     * Gestionar subsistemas
     *
     */
    public function gestsubsistemasAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /*
     * Carga los subsistemas
     */

    function getSubsistemasAction()
    {
        $result = $this->model->obtenerSubsistemas($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Carga los directorios y archivos del Ã¡rbol para elegir la clase que mapea
     */
    public function cargardirAction()
    {
        $data = $this->model->cargardir($this->_request->getPost());
        echo json_encode($data);
    }

    //Verificar uso
    function modificarEstadoAction()
    {
        try {
            $araysubsist = json_decode(
                stripslashes($this->_request->getPost('arraysubsist'))
            );
            $response = array(
                'code'         => 1,
                'clasificadas' => array(),
                'errors'       => array()
            );
            foreach ($araysubsist as $subsist) {
                if ($subsist->idestructurasubsist) {
                    $subsistema
                        = DatEstructurasubsist::BuscarEstructuraSubsistObjet(
                        $this->global->Estructura->idestructura,
                        $subsist->idsubsistema
                    );
                    $objDatEstructurasubsist = $subsistema[0];
                } else {
                    $objDatEstructurasubsist = new DatEstructurasubsist();
                    $objDatEstructurasubsist->idsubsistema
                        = $subsist->idsubsistema;
                    $objDatEstructurasubsist->idestructuracomun
                        = $this->global->Estructura->idestructura;
                }
                $objDatEstructurasubsist->idestado = $subsist->tipo;
                $numVerificacion
                    = EstructuraSubsistModel::verificarExisteSubsisteEntidad(
                    $objDatEstructurasubsist->idestructuracomun,
                    $objDatEstructurasubsist->idsubsistema,
                    $objDatEstructurasubsist->idestado
                );
                $aux = $this->switchVerificacionTipo(
                    $numVerificacion, $objDatEstructurasubsist, $subsist,
                    $response, $subsist->idestructurasubsist
                );
                $response = $aux;
            }
            $this->mensajeInsertarTipo($response);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    //Verificar uso
    private function switchVerificacionTipo(
        $numVerificacion, $objDatEstructurasubsist, $subsist, $response, $mod
    ) {
        switch ($numVerificacion) {
            case -1:
                if ($mod) {
                    $var = EstructuraSubsistModel::modificarEstructuraSubsist(
                        $objDatEstructurasubsist
                    );
                    if ($var) {
                        $response['succes'][]
                            = array('subsistema' => $subsist->idsubsistema);
                    } else {
                        $response['errors'][]
                            = array('subsistema' => $subsist->idsubsistema);
                    }
                } else {
                    if (EstructuraSubsistModel::insertarEstructuraSubsist(
                        $objDatEstructurasubsist
                    )
                    ) {
                        $response['succes'][]
                            = array('subsistema' => $subsist->idsubsistema);
                    } else {
                        $response['errors'][]
                            = array('subsistema' => $subsist->idsubsistema);
                    }
                }
                break;
            case -2:
                $response['clasificadas'][]
                    = array('subsistema' => $subsist->idsubsistema);
        }
        return $response;
    }

    //Verificar uso
    private function mensajeInsertarTipo($response)
    {
        if (count($response['errors']) == 0
            && count($response['clasificadas']) == 0
        ) {
            echo("{'codMsg':-1}");
            return;
        } else {
            if (count($response['errors']) == 0) {
                if (count($response['clasificadas']) == 1) {
                    echo("{'codMsg':-2}");
                } else {
                    echo("{'codMsg':-3}");
                }
                return;
            } else {
                echo("{'codMsg':-4}");
                return;
            }
        }
    }

    /**
     * Adicionar o modificar el subistema
     */
    public function addmodAction()
    {
        $result = $this->model->addModSubsistema($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Elimina la o las operaciones contables
     */
    public function delAction()
    {
        $result = $this->model->del($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Cambia el cierre del subsistema para la entidad (Cierra o No cierra)
     */
    public function cambiarCierreAction()
    {
        $result = $this->model->cambiarCierre($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Cambia el estado del subsistema para la entidad (Activo o Inactivo)
     */
    public function cambiarEstadoAction()
    {
        $result = $this->model->cambiarEstado($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Cambia la contabilización del subsistema (Contabiliza o No contabiliza)
     */
    public function cambiarContabilizacionAction()
    {
        $result = $this->model->cambiarContabilizacion($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Guarda los subsitemas configurados para la entidad actual como una plantilla
     * para ser usados posteriormente por otra entidad
     */
    public function crearPlantillaAction()
    {
        $result = $this->model->crearPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     */
    public function usarPlantillaAction()
    {
        $result = $this->model->usarPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Lista las plantillas creadas para este componente
     */
    public function listarPlantillaAction(){
        $result = $this->model->listarPlantillas($this->_request->getPost());
        echo(json_encode($result));
    }

}

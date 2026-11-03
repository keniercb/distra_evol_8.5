<?php

/**
 * @class      EstructuraubicacionController *
 * @package    Inventario
 * @subpackage Configuracion ubicacion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class EstructuraubicacionController extends BaseController
{
    private $model, $serviciosUbicacion, $idestructuraComun, $params;

    function init()
    {
        parent::init('log.lb.confestructubicacion');
        $this->serviciosUbicacion = LogisticaEstructuraUbicHelper::__init();
        $this->idestructuraComun = $this->global->Estructura->idestructura;
        $this->model = new DatEstructuraubicacionModel();
        $this->params = $this->_request->getParams();
    }

    function estructuraubicacionAction()
    {
        $this->prepareView();
        $this->initComponent('log.lb.confestructubicacion');

        $this->view->arrayJs = array(
            $this->configuracionHelper->obtenerJSVentanaIndicadore(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            ZendExt_IoC::getInstance()->logistica->getJsNomencladorProductos()
        );
        $this->autoShow = false;
        $this->render('estructuraubicacion');
    }

    /**
     * Devuelve el arbol de areas de responsabilidad o estructuras no formales.
     */
    public function cargarArbolAction()
    {
        $this->autoShow = false;
        $nivel = ($this->params['nivel']) ? $this->params['nivel'] : -1;
        $ultimoNivel = ($this->params['ultimo_nivel']) ? $this->params['ultimo_nivel'] : -1;
        if ($this->params['node'] == 0) {
            if ($this->params['tipo'] == 1) {
                //Cargar estructuras no formales
                $arrayDepositos = $this->serviciosUbicacion->cargardepositos(null, array(), null, null, null, -1);
                $cont = 0;
                foreach ($arrayDepositos['depositos'] as $deposito) {
                    $cont = $cont + 1;
                    $obj = new stdClass();
                    $obj->id = $deposito['iddeposito'];
                    $obj->text = $deposito['deposito'];
                    $arbolDepositos[] = $obj;
                }
                echo json_encode($arbolDepositos);
            } elseif ($this->params['tipo'] == 2) {
               /* $idarea = ($this->params['idarea']) ? $this->params['idarea'] : $this->idestructuraComun;
                echo json_encode($this->serviciosEstructuraComposicion->getEstructurasInternas($idarea));*/
                //Cargar estructuras no formales
                $arrayDepositos = $this->serviciosUbicacion->cargardepositos(null, array(), null, null, null, 0);
                $cont = 0;
                foreach ($arrayDepositos['depositos'] as $deposito) {
                    $cont = $cont + 1;
                    $obj = new stdClass();
                    $obj->id = $deposito['iddeposito'];
                    $obj->text = $deposito['deposito'];
                    $arbolDepositos[] = $obj;
                }
                echo json_encode($arbolDepositos);
            }
        } else {
            echo json_encode($this->model->ObtenerEstructurasUbicacion($this->params['node'], $nivel, $ultimoNivel));
        }
    }

    /**
     * Devuelve los datos de la estructura.
     */
    public function obtenerEstructuraAction()
    {
        $this->datos = $this->model->obtenerEstructura($this->params['id']);
        $this->success = true;
    }

    /**
     * Adiciona una estructura.
     */
    public function adicionarEstructuraAction()
    {
        $this->uiParams = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        if ($this->uiParams['idproducto'] || $this->uiParams['idunidadmedida'] || $this->uiParams['capacidad'] ||
            $this->uiParams['peso'] || $this->uiParams['alto']) {
            $this->uiParams['ubicacionarea'] = true;
        }
        $this->objectHelper->synchronize($this, $this->model->adicionarEstructura($this->uiParams));
    }

    /**
     * Elimina un area.
     */
    public function eliminarAreaAction()
    {
        $this->val = $this->model->eliminarArea($this->params['idestu']);
    }

    /**
     * Elimina una estructura.
     */
    public function eliminarEstructuraAction()
    {
        $this->val = $this->model->eliminarEstructura($this->params['idestu']);
    }

    /**
     * Devuelve los formatos configurados.
     */
    public function cargarComboformatoAction()
    {
        $formatos = $this->configuracionHelper->BuscarFormatosPorSubsist(
            $this->idestructuraComun, $this->params['idsubsistema']
        );
        foreach ($formatos as &$formato) {
            $partes = $this->configuracionHelper->BuscarParteFormato($formato->idformato);
            $ultimoNivel = 0;
            foreach ($partes as $key => $parte) {
                $formato->partes[$key]->nombre = $parte->nombre;
                $formato->partes[$key]->abreviatura = $parte->abreviatura;
                $formato->partes[$key]->nivel = $parte->nivel;
                $formato->partes[$key]->longitud = $parte->longitud;
                if ($formato->partes[$key]->nivel > $ultimoNivel) {
                    $ultimoNivel = $formato->partes[$key]->nivel;
                }
            }
            $formato->ultimo_nivel = $ultimoNivel;
        }
        $this->datos = $formatos;
    }

    /**
     * Guarda la configuracion de estructura ubicacion.
     */
    public function salvarconfiguracionAction()
    {
        $this->params['idconfigubicacion'] = $this->idestructuraComun;
        $this->datos = $this->model->salvarConfiguracion($this->params);
        $this->success = true;
    }

    /**
     * Devuelve la configuracion de estructura ubicacion.
     */
    public function cargarconfiguracionAction()
    {
        $this->datos = $this->model->devolverConfiguracion($this->idestructuraComun);
    }

}

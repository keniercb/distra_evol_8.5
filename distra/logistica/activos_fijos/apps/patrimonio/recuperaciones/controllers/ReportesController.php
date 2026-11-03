<?php

/**
 *  Para que se muestre en el sistema de seguridad las acciones de la controladora
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ReportesController extends BaseController {//Se usa esta clase en Distra

    public function init() {
        parent::init('log.aft.recuperacionespatrimonio');
        $this->view->arrayJs = array(/*$this->integrator->ayuda->devolverJS(),
        $this->pIntegrator->utilesGeneral->getJsReporte() */);
        $this->areaSeleccionada = $this->global->Estructura->idestructura;
    }

    public function cargarEspecialidadSistEmpAction() {
        $model = new ReportesModel();
        $idsistempresarial = $model->cargaridSistEmpresarial();
        echo json_encode($idsistempresarial);
    }

    public function cargarEspecialidadAction() {
        $idusuario = $this->global->Perfil->idusuario;

        $obj = new ConfiguracionActivosService();
        $idespecialidad = $obj->getEspecialidadByIdUsuario($idusuario);
        //print_r($idusuario);die("yoendy");

        if (count($idespecialidad) == 1) {
            $denominacionespecialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($idespecialidad[0]['idespecialidad']);
            $datos[0]['idespecialidad'] = $denominacionespecialidad[0]->idespecialidad;
            $datos[0]['denominacionespecialidad'] = $denominacionespecialidad[0]->denespecialidad;
            echo json_encode(array('data' => $datos, 'total' => count($datos)));
        } else {
            $index = 0;
            foreach ($idespecialidad as $idespe) {
                $denominacionespecialidad = $especialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($idespe['idespecialidad']);
                $datos[$index]['idespecialidad'] = $denominacionespecialidad[0]->idespecialidad;
                $datos[$index]['denominacionespecialidad'] = $denominacionespecialidad[0]->denespecialidad;
                $index++;
            }echo json_encode(array('data' => $datos, 'total' => count($datos)));
        }
    }

    public function BuscarPadreAbsoluto($datos){
        $padreArbol = array();
        foreach($datos as $i => $dato){
            if($dato['idestructura'] == $dato['idpadre']){
                $padreArbol = $dato;
                $padreArbol['nivel'] = 0;
                break;
            }
        }
        return self::dameHijos($padreArbol, $datos);
    }

    public function dameHijos($padre, $arreglo, $datos_final = array()){
        static $datos_final;
        $datos_final[] = $padre;
        foreach($arreglo as $pos => $elem){
            if($elem['idpadre'] == $padre['idestructura'] && $elem['idestructura'] != $padre['idestructura']){
                $elem['nivel'] = $padre['nivel'] + 1;
                $espacios = '';
                for($i = 0; $i < $elem['nivel']; $i+=1){
                    $espacios .= '&nbsp;&nbsp;';
                }
                $elem['denominacion'] = $espacios."└►" . $elem['denominacion'];
                unset($arreglo[$pos]);
                self::dameHijos($elem, $arreglo, $datos_final);
            }
        }
        return $datos_final;
    }


    public function reporteEspecialidadAction() {
        $parametros = $this->_request->getPost();
        $denominacionespec = $parametros['especialidad'];
        $reporte = $parametros['reporte'];

        /*$conf = new ConfiguracionService();
        $configuracion = $conf->getDenoAgrupReporte($idespecialidad);
        $denominacionespec = $configuracion[0]['denominacioncolumnareporte'];*/
        $model = new ReportesModel();
        $this->idreporte = $model->tipoReporteEspecialidad($denominacionespec, $reporte);
        $this->idestructura = $this->global->Estructura->idestructura;

    }

    public function reportesAction() {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.recuperacionespatrimonio');
        $this->renderTemplate();
    }
}


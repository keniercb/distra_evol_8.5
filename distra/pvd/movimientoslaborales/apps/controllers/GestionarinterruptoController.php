<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 15/03/19
 * Time: 17:25
 */
class GestionarinterruptoController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionarinterruptoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de interrupciones
     *
     * @return Arreglo con las interrupciones
     * @author Yaricel Guerra Vel�zquez
     */
    function getInterrupcionesAction()
    {
        $modeloNegocio = new DatInterrupcionModel();
        $datos = $modeloNegocio->getInterrupciones(
            $this->_getParam('query'), $this->_getParam('idestructura'),
            $this->_getParam('desde'), $this->_getParam('hasta'),
            $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de interrupto
     * @return Arreglo con los interrupto
     * @author Yaricel Guerra Vel�zquez
     */
    function getInterruptosAction()
    {
        $modeloNegocio = new DatInterruptoModel();
        $datos = $modeloNegocio->getInterruptosByInterrupcion(
            $this->_getParam('idinterrupcion'), $this->_getParam('query'),
            $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de imputables
     *
     * @return Arreglo con los imputables
     * @author Yaricel Guerra Vel�zquez
     */
    function getImputablesAction()
    {
        $modeloNegocio = new DatImputableModel();
        $datos = $modeloNegocio->getImputablesByInterrupcion(
            $this->_getParam('idinterrupcion'), $this->_getParam('query'), $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todos los motivos de interrupción
     *
     * @return Arreglo con los motivos de interrupción
     * @author Yaricel Guerra Vel�zquez
     */
    function getMotivosInterrupcionAction()
    {
        $modeloNegocio = new DatInterrupcion();
        $datos = $modeloNegocio->getMotivosInte();
        echo Zend_Json::encode($datos);
    }

    function getSituacionesAction()
    {
        $modeloNegocio = new DatInterrupcion();
        $datos = $modeloNegocio->getSituaciones();
        echo Zend_Json::encode($datos);
    }

    function getCausasnoreubicarAction()
    {
        $modeloNegocio = new DatInterrupcion();
        $datos = $modeloNegocio->getCausasnoreubicar();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Vel�zquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $idestructura = ($this->_getParam('idestructura'))?$this->_getParam('idestructura')
            :$_SESSION['Zeolides']['entidad']->idestructura;
        $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            $filtro,
            $idestructura,
            null,
            $start,
            $limit,
            1
        );
        echo Zend_Json::encode($datos);
    }

    function getEstructuraCargoAction()
    {
        try {
            $result = Array();
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
                $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
                foreach ($r as $est) {
                    if ($est->idconcepto == 7) {
                        $est->text = $est->text . " <b>($est->cantidad | $est->cantidad_real)</b>";
                    }
                    array_push($result, $est);
                }
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    /**
     * Adiciona interrupcion
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addInterrupcionAction()
    {
        $modeloNegocio = new DatInterrupcionModel();
        $arr = $modeloNegocio->addInterrupcion(
            $this->_getParam('idestructura'),
            $this->_getParam('idmotivointerrupcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('horas'),
            $this->_getParam('observacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica interrupcion     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateInterrupcionAction()
    {
        $modeloNegocio = new DatInterrupcionModel();
        $horas = ($this->_getParam('horas')) ? "'" . $this->_getParam('horas') . "'" : 'null';
        $fhasta = ($this->_getParam('fhasta'))? "'".$this->_getParam('fhasta')."'":'null';
        $observacion = ($this->_getParam('observacion')) ? "'" .$this->_getParam('observacion') . "'" : 'null';
        $arr = $modeloNegocio->updateInterrupcion(
            $this->_getParam('idinterrupcion'), $this->_getParam('idestructura'),
            $this->_getParam('idmotivointerrupcion'), $this->_getParam('fdesde'), $fhasta, $horas, $observacion
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina interrupcion     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteInterrupcionAction()
    {

        $arrayids = json_decode(stripslashes($this->_request->getPost('interrupcion')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatInterrupcionModel::deleteInterrupcion($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona interruptos
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addInterruptoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('interruptos')));
        foreach ($arrayids as $p) {
            $r = DatInterruptoModel::addInterrupto($p,
                $this->_getParam('idinterrupcion'), $this->_getParam('fdesde'),
                $this->_getParam('fhasta'), $this->_getParam('reubicado'),
                $this->_getParam('horas'), $this->_getParam('idsituacionint'),
                $this->_getParam('idcausanoreubicado')
            );
        }
        echo Zend_Json::encode($r);
    }

    function updInterruptoAction()
    {
        $r = DatInterruptoModel::updateInterrupto(
            $this->_getParam('idinterrupto'), $this->_getParam('fdesde'), $this->_getParam('fhasta'),
            $this->_getParam('reubicado'), $this->_getParam('horas'), $this->_getParam('idsituacionint'),
            $this->_getParam('idcausanoreubicado')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Adiciona imputables
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addImputableAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('imputables')));
        foreach ($arrayids as $p) {
            $r = DatImputableModel::addImputable(
                $this->_getParam('idinterrupcion'), $p
            );
        }
        echo Zend_Json::encode($r);
    }

    function deleteInterruptoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('interruptos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatInterruptoModel::deleteInterrupto($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function deleteImputableAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('imputables')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatImputableModel::deleteImputable($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}
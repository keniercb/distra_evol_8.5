<?php
class GestplantillaController extends ZendExt_Controller_Secure
{
	function init() {
		parent::init();
	}

    function gestplantillaAction() {

        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render('gestplantilla');
    }

    public function getPersonasporcargoAction()
    {
        $idnode = ($this->_getParam('idnode') == 'rootCargos')?null:$this->_getParam('idnode');
        $idcargo = ($this->_getParam('idcargo') == 'rootCargos')?null:$this->_getParam('idcargo');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $filtro = $this->_getParam('filtro');
        $idpersona = $this->_getParam('idpersona');
        $nombreapellidos = $this->_getParam('nombreapellidos');

        $obj = new DatEstructuraasistenciaModel();
        if($idnode != null){
            $arrayCargos = $obj->getAsistenciaCargos($idnode);
            $cargos = array();
            $aux = array();
            $padres = array();
            if($arrayCargos != null){
                foreach($arrayCargos as $cargo)
                {
                    array_push($cargos,$cargo['idcargo']);
                }
                $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(null,$filtro,
                    null,null,null,$cargos,null);
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($personas->data[0]['idarea']);
                $personas->data[0]['denomarea'] = $estructura[0]->denominacion;

                $arreglopersonasTemp = $obj->existePrsonaSub($personas->data, $idnode);
            }else{
                $arreglopersonasTemp = $obj->existePrsonaSub(null, $idnode);
            }
            $arreglopersonas = array();
            foreach($arreglopersonasTemp as $per)
            {
                if($per != $idpersona)
                {
                    array_push($arreglopersonas,$per);
                }
            }
                if($arreglopersonas != null){
                    $arraypersonas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona
                        ($arreglopersonas,$filtro,$limit,$start,null,null,null);
                    foreach($arraypersonas->data as $ind => $person){
                        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($person['idarea']);
                        $arraypersonas->data[$ind]['denomarea'] = $estructura[0]->denominacion;
                       if(!empty($person['idcargo']))
                       {
                           if ($obj->getSubByIdPerson($person['idpersona']) != null) {
                               $existeAsPadre = Doctrine::getTable('DatEstructuraasistencia')
                                   ->findBySql(
                                       'idestructuraasistencia = idpadre and idpersona = ' . $person['idpersona']
                                   );
                               if ((is_object($existeAsPadre) && $existeAsPadre->count() != 0)) {
                                   $arraypersonas->data[$ind]['subordinacion'] = 'Controlador';
                                   $arraypersonas->data[$ind]['bandera'] = 1;
                               } else {
                                   $arraypersonas->data[$ind]['subordinacion'] = 'Movimientos temporales';
                                   $arraypersonas->data[$ind]['bandera'] = 1;
                               }
                           } else {
                               $arraypersonas->data[$ind]['subordinacion'] = $person['denomentidad'];
                               $arraypersonas->data[$ind]['bandera'] = 0;
                           }
                       }
                        else
                        {
                            $arraypersonas->data[$ind]['subordinacion'] = 'Fuera de plantilla';
                            $arraypersonas->data[$ind]['bandera'] = 1;
                        }
                        if(!empty($person['idcargo']))
                        {
                            $aux = $obj->getPadreByIdCargo($person['idcargo']);
                            foreach ($aux as $k => $p) {
                                $padres[$k] = $p['idcargo'];
                            }
                            $arraypersonas->data[$ind]['padres'] = $padres;
                        }
                        else
                        {
                            $padres[0] = $idnode;
                            $arraypersonas->data[$ind]['padres'] = $padres;
                        }
                    }
                    echo Zend_Json::encode(array('datos' => $arraypersonas->data, 'cantidad' => $arraypersonas->quantity));
                }else
                    echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
        }else
            echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    public function obtenerPersonasAsistenciaAction()
    {
        $obj = new DatEstructuraasistenciaModel();
        $result = $obj->getAsistenciaPersonas($this->_request->getPost ('node'));
        echo(json_encode($result));
    }

    public function getPersonasfueraplantillaAction()
    {
        $obj = new DatEstructuraasistenciaModel();
        $result = $obj->getPFP($this->_request->getPost ('idestructura'));
        echo(json_encode($result));
    }

    public function obtenerCargosAsistenciaAction()
    {
        if($this->_getParam('node') == 'root')
        {
            $obj = new DatEstructuraasistenciaModel();
            $result = $obj->getAsistenciaCargos( $this->_getParam('node'));
            foreach($result as $key => $nodes)
            {
                $result[$key]['leaf'] = true;
            }
        }
        else
        {
            $obj = new DatEstructuraasistenciaModel();
            $result = $obj->getAsistenciaCargos( $this->_getParam('node'));
        }

        echo(json_encode($result));
    }

    public function getPersonasencargoAction()
    {
        $cargo[0]=$this->_getParam('idcargo');
        $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(null,null,null,null,null,$cargo,null);
        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($personas->data[0]['idarea']);
        $personas->data[0]['denomarea'] = $estructura[0]->denominacion;
        echo(json_encode($personas));
    }

    function guardarPersonasAsistenciaAction()
    {

        $idpadre = ($this->_getParam('idpadre') == 'rootCargos')?null:$this->_getParam('idpadre');
        $idcargos = json_decode(stripslashes($this->_getParam('idcargo'))) ;
        $idpersona = $this->_getParam('idpersona');
        $modeloNegocio = new DatEstructuraasistenciaModel();
        $existen = $modeloNegocio->guardarPersonasAsistencia($idpersona, $idpadre,$idcargos);
        $r->guardar = true;
        if($existen['tipo'] == 2)
        {
            $r->existen = implode(' ',$existen['data']);
            $r->tipo = 2;
        }
        else
        {
            $r->existen =$existen['data'];
            $r->tipo = 1;
        }
        echo json_encode($r);

    }

    function existePersonaAction()
    {
        $modeloNegocio = new DatEstructuraasistenciaModel();
        if($modeloNegocio->existePersona($this->_getParam('idpersona'),$this->_getParam('idpadre'))==null){
            echo "false";
        } else {
           echo "true";
        }
    }

    function delPersonasAsistenciaAction()
    {
        $modelo = new DatEstructuraasistenciaModel();
        $resp = $modelo->eliminarCargo(json_decode(stripslashes($this->_getParam('idestructuraasistencia'))));
        if($resp == false)
        {
            $m->codMsge = 3;
        }else{
            $m->codMsge = 1;
        }
        echo json_encode($m);
    }

    public function cambiarOrdenAction()
    {
        $idestructuraasistencia = $this->_getParam('idestructuraasistencia');
        $idpadre = ($this->_getParam('idpadre') == 'root')?$idestructuraasistencia:$this->_getParam('idpadre');
        DatEstructuraasistenciaModel::cambiarOrden($idpadre, $idestructuraasistencia);
        $this->_enviarNotificacionCorrecta();
    }

    function cambiarpadreAction()
    {
        $exite = 0;
        $idcargonew = $this->_getParam('idcargonew');
        $idpersona = $this->_getParam('idpersona');
        $idestructuraasistencia = $this->_getParam('idestructuraasistencia');
        $modeloNegocio = new DatEstructuraasistenciaModel();
            if(!$modeloNegocio->existeCargo($idcargonew,$idestructuraasistencia,$idpersona)){
                $array = $modeloNegocio->cambiarPadre($idcargonew,$idestructuraasistencia,$idpersona);
            }else{
                $exite = 1;
            }
        $r->existe = $exite;
        echo json_encode($r);

    }

    function pegarCargosAction()
    {
        $accion = $this->_getParam('accion');
        $idestructurasToPaste = json_decode(stripslashes($this->_getParam('idestructurasToPaste')));
        $estructuraPadreToPaste = $this->_getParam('estructuraPadreToPaste');
        $modeloNegocio = new DatEstructuraasistenciaModel();
        if($accion == 'copy')
            $result = $modeloNegocio->copyCargos($estructuraPadreToPaste,$idestructurasToPaste);
        else
            $result = $modeloNegocio->cutCargos($estructuraPadreToPaste,$idestructurasToPaste);
        $r->result = $result;
        echo json_encode($r);
    }

    function cambiarpersonaAction()
    {
        $idestructuraasistencia = $this->_getParam('idestructuraasistencia');
        $personas = json_decode(stripslashes($this->_getParam('idspersonas'))) ;
        $personasother = json_decode(stripslashes($this->_getParam('idspersonasother'))) ;
        $modeloNegocio = new DatEstructuraasistenciaModel();
        if($personas != null){
            $r = $modeloNegocio->cambiarPersonaCargo($idestructuraasistencia, $personas);
        }
        if($personasother != null){
            $r = $modeloNegocio->actualizar($idestructuraasistencia, $personasother);
        }
        $this->_enviarNotificacionCorrecta();
    }

    function delPersonasSubordinacionAction()
    {
        $modelo = new DatEstructuraasistenciaModel();
        $resp = $modelo->eliminarPersona(json_decode(stripslashes($this->_getParam('array'))));
        if($resp == false)
        {
            $m->codMsge = 3;
        }else{
            $m->codMsge = 1;
        }
        echo json_encode($m);
    }

    private function _enviarNotificacionCorrecta() {
        echo "{success: 'true'}";
    }
}
?>
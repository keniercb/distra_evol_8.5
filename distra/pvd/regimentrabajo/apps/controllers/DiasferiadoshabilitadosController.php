<?php
class DiasferiadoshabilitadosController extends ZendExt_Controller_Secure
{
	function init() {
		parent::init();
	}

	function diasferiadoshabilitadosAction() {
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render('diasferiadoshabilitados');
	}

    function cargarGruposRegimenAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        $identidades = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad);
		$Model = new NomGrupodescansoModel();
        $result = $Model->getGrupoDescansoByEntidadActive($this->_request->getPost('criterio'), null, 0,$identidades);
        $r['datos'] = $result->data;
        $r['cantidad'] = $result->quantity;
        echo (json_encode ($r));
    }

    function getpersonasByIdGrupoDescansoAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $filtro = $this->_request->getPost('filtro');
        $Model = new NomGrupodescansoModel();
        $result = $Model->getpersonasByIdGrupoDescanso($idgrupodescanso,$filtro/*,$limit, $start*/);
        $r['datos'] = $result['data'];
        $r['cantidad'] = $result['cantidad'];
        echo (json_encode ($r));
    }

    function getDiasFeriadosAction()
    {
        $idspersona = json_decode(stripslashes($this->_request->getPost('idspersona')));
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $annoactual = date('Y')/*$this->_request->getPost('anno')*/;

            $Model = new ConfCalendarioModel();
            $ConfCalendariopersona = new ConfCalendariopersona();
            $arraydiasferiados = $Model->getDiasFeriados($idgrupodescanso,$annoactual);

            if(count($idspersona)>0){
                //$arraydiashablitados = $ConfCalendariopersona->getDiasFeriadosByIdpersona($idspersona);
                $arraydiashablitados = $Model->getDiasFeriadosHabilitados($idspersona);

                if(count($arraydiashablitados)==0){
                    foreach($arraydiasferiados as $key => $fecha){
                        $arraydiasferiados[$key]['habilitado'] = 'No';
                    }
                }else{
                    foreach($arraydiasferiados as $key => $fecha){
                        foreach($arraydiashablitados as $ind => $dia){
                            if($fecha['fecha'] == $dia['fecha']){
                                $arraydiasferiados[$key]['habilitado'] = 'Si';
                                $arraydiasferiados[$key]['iddiaferiadohabilitado'] = $dia['iddiaferiadohabilitado'];
                                $arraydiasferiados[$key]['idpersona'] = $dia['idpersona'];
                                $h = explode(':',$dia['horas']);
                                $arraydiasferiados[$key]['horas'] = $h[0].':'.$h[1];
                                break;
                            }else{
                                $arraydiasferiados[$key]['habilitado'] = 'No';
                                $arraydiasferiados[$key]['iddiaferiadohabilitado'] = 0;
                                $arraydiasferiados[$key]['idpersona'] = $dia['idpersona'];
                                $arraydiasferiados[$key]['horas'] = '';
                            }
                        }
                    }
                }
            }else{
                $idspersona = array();
                if(!empty($idgrupodescanso)){
                    $ids = NomGrupodescanso::getpersonasByIdsGrupoDescanso(array($idgrupodescanso));
                }else{
                    $objDatos = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(),null,null,null,
                        array(),array(),null);
                    $arrPersonas = $objDatos->data;

                    $ids = array();
                    foreach ($arrPersonas as $persona) {
                        array_push($ids, $persona['idpersona']);
                    }
                }
                foreach($ids as $ind => $idpersona){
                    array_push($idspersona,$idpersona['idpersona']);
                }
                if(count($idspersona)>0)
                    $arraydiashablitados = $Model->getDiasFeriadosHabilitados($idspersona);
                if(count($arraydiashablitados)==0){
                    foreach($arraydiasferiados as $key => $fecha){
                        $arraydiasferiados[$key]['habilitado'] = 'No';
                    }
                }else{
                    foreach($arraydiasferiados as $key => $fecha){
                        foreach($arraydiashablitados as $ind => $dia){
                            if($fecha['fecha'] == $dia['fecha']){
                                $arraydiasferiados[$key]['habilitado'] = 'Si';
                                $arraydiasferiados[$key]['iddiaferiadohabilitado'] = $dia['iddiaferiadohabilitado'];
                                $arraydiasferiados[$key]['idpersona'] = $dia['idpersona'];
                                $h = explode(':',$dia['horas']);
                                $arraydiasferiados[$key]['horas'] = $h[0].':'.$h[1];
                                break;
                            }else{
                                $arraydiasferiados[$key]['habilitado'] = 'No';
                                $arraydiasferiados[$key]['iddiaferiadohabilitado'] = 0;
                                $arraydiasferiados[$key]['idpersona'] = $dia['idpersona'];
                                $arraydiasferiados[$key]['horas'] = '';
                            }
                        }
                    }
                }
            }
            $result['datos'] = $arraydiasferiados;
        echo json_encode($result);
    }

    function guardarDiasFeriadosHabilesAction()
    {
        $fechashoras = json_decode(stripslashes($this->_request->getPost('fechashoras')));
        $datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $tipo = $this->_request->getPost('tipo');
        $modelConfCalendario = new ConfCalendarioModel();
        $result = $modelConfCalendario->guardarDiasFeriadosHabiles($fechashoras,$datos,$tipo);
        if($result)
            $r['cod'] =1;
        else
            $r['cod'] =3;
        echo (json_encode ($r));
    }

    function delDiasFeriadosHabilesAction()
    {
        $datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $iddiaferiadohabilitado = json_decode(stripslashes($this->_request->getPost('iddiaferiadohabilitado')));
        $fechas = json_decode(stripslashes($this->_request->getPost('fechas')));
        $tipo = $this->_request->getPost('tipo');
        $modelConfCalendario = new ConfCalendarioModel();
        $result = $modelConfCalendario->delDiasFeriadosHabiles($datos,$tipo,$fechas);
        if($result)
            $r['cod'] =1;
        else
            $r['cod'] =3;
        echo (json_encode ($r));
    }

}
?>
<?php

class GestdestinatariosController extends ZendExt_Controller_Secure
{

    private $_grupoDestinatarioModel;
    private $_personModel;

    public function init()
    {
        parent::init();
        $this->_grupoDestinatarioModel = new DatGrupoDestinatarioModel();
        $this->_personModel = new DatPersonaNotificacionesModel();
    }

    public function gestdestinatariosAction()
    {
        $this->render();
    }

    public function asignarpersonaagrupoAction()
    {
        $personaModel = new DatPersonaNotificacionesModel();
        $grupoDestModel = new DatGrupoDestinatarioModel();
        $persona = new DatPersonaNotificaciones();
        $persona->idpersona = $this->_request->idpersona;
        $inserto = $personaModel->insertar_datpersonanotificaciones($persona);
        if (!$inserto) {
            $arr = $persona->getByParam('idpersona');
            $persona->iddestinatario = $arr[0]['iddestinatario'];
        }
        $grupoDest = new DatGrupoDestinatario();
        $grupoDest->idgrupo = $this->_request->idgrupo;
        $grupoDest->iddestinatario = $persona->iddestinatario;
        $insertoGrupoDest = $grupoDestModel->insertardat_grupo_destinatario(
            $grupoDest
        );
        $result['msgLabel'] = $insertoGrupoDest ? 'msgPersonAsigned2Group'
            : 'msgGroupContainsPerson';
        echo json_encode($result);
    }

    public function eliminardestinatariofromgrupoAction()
    {
        $destinatarios = json_decode($this->_request->destinatarios);
        $grupo = json_decode($this->_request->grupo);
    }

    public function insertargrupoAction()
    {
        $objGrupo = new DatGrupoNotificaciones();
        $objGrupoModel = new DatGrupoNotificacionesModel();
        $objGrupoDestModel = new DatGrupoDestinatarioModel();
        $objGrupo->nombre = $this->_request->nombre;
        $objGrupo->creadopor = $this->global->Perfil->idusuario;
        $parentGroup = $this->_request->nodo;
        $objGrupoModel->insertar_datgruponotificaciones($objGrupo);
        if ($parentGroup) {
            if ($objGrupoModel->isGroup($parentGroup)) {
                $grupoDest = new DatGrupoDestinatario();
                $grupoDest->idgrupo = $parentGroup;
                $grupoDest->iddestinatario = $objGrupo->iddestinatario;
                $objGrupoDestModel->insertardat_grupo_destinatario($grupoDest);
            }
        }
        echo json_encode(array('msgLabel' => 'msgAddGroup'));
    }

    public function insertardestinatarioAction()
    {

    }

    public function modificargrupoAction()
    {
        $objGrupoModel = new DatGrupoNotificacionesModel();
        $nombre = $this->_request->nombre;
        $idgrupo = $this->_request->idgrupo;
        $objGroup = Doctrine:: getTable('DatGrupoNotificaciones')->find(
            $idgrupo
        );
        $objGroup->nombre = $nombre;
        $objGrupoModel->modificar_datgruponotificaciones($objGroup);
        echo json_encode(array('msgLabel' => 'msgUpdGroup'));
    }

    public function cargargruposAction()
    {
        $start = $this->_request->start;
        $limit = $this->_request->limit;
        $nodo = $this->_request->nodo;
        $idusuario = $this->global->Perfil->idusuario;
        $datos = DatGrupoNotificaciones:: cargarGrupos(
            /*$nodo, */$idusuario, $start, $limit
        );

        echo json_encode(
            array('total' => DatGrupoNotificaciones:: getTotal(
                $nodo, $idusuario
            ), 'grupos'   => $datos['data'])
        );
    }

    public function eliminardestinatarioAction()
    {
        DatDestinatario:: eliminarDestinatario($this->_request->iddestinatario);
        echo json_encode(array('msgLabel' => 'msgDelGroup'));
    }

    public function cargardestinatariosAction()
    {
        $start = $this->_request->start;
        $limit = $this->_request->limit;
        $filtro = $this->_request->texto ? $this->_request->texto : '';
        $parent = $this->_request->idgrupo;
        //if(!$filtro){
        $grupos = $this->obtenergrupos($start, $limit, $parent);
        $totalGrupos = DatGrupoNotificaciones:: getTotal($parent);
        $personasch = array();
        if ($grupos['cantidad'] != $limit) {
            $start = ($grupos['cantidad'] > 0) ? 0 : $start - $totalGrupos;
            $personasch = $this->obtenerpersonasch(
                $start, $limit - $grupos['cantidad'], $filtro
            );
        }
        $destinatarios = isset($personasch) ? array_merge(
            $grupos['destinatarios'], $personasch['destinatarios']
        )
            : $grupos['destinatarios'];
        $destinatarios = array('destinatarios' => $destinatarios);
        $total = $totalGrupos + $personasch['cantidad'];
        echo json_encode(
            array('cantidad_filas' => $total,
                  'datos'          => $destinatarios['destinatarios'])
        );

    }

    private function obtenerpersonasch($start, $limit, $texto = '')
    {
        $iddominio = $this->global->Perfil->iddominio;
        $idestructura = $this->global->Estructura->idestructura;
        $personasch = array();
        $personas = $this->integrator->pvd->BuscarPersonaPorTexto(
            $start, $limit, $texto, $idestructura, $iddominio, 1
        );
        $cantidad = $this->integrator->pvd->CantidadBuscarPersonaPorTexto(
            $texto, $idestructura, $iddominio, 1
        );
        $personTipoDest = $this->_personModel->getTypeId();
        if (count($personas)) {
            foreach ($personas as $key => $person) {
                $personasch[$key]['contacto'] = NotificacionesUtil:: fullName(
                    $person
                );
                $personasch[$key]['idcontacto'] = $person['idpersona'];
                $personasch[$key]['idtipodestinatario'] = $personTipoDest;
                $destData = DatDestinatarioModel:: existeDestinatario(
                    $personTipoDest, $person['idpersona']
                );
                $personasch[$key]['iddestinatario'] = $destData[0];
                $personasch[$key]['grupos'] = $this->_personModel->getGroupsOf(
                    $destData[0]
                );
            }
        }

        return array('destinatarios' => $personasch, 'cantidad' => $cantidad);
    }

    public function cargardestinatariosdeavisoAction()
    {
        $datos = DatDestinatarioModel:: getByAviso(
            $this->_request->idaviso, $this->_request->start,
            $this->_request->limit
        );
        $total = DatDestinatarioModel:: getTotalByAviso(
            $this->_request->idaviso
        );
        echo json_encode(array('datos' => $datos, 'total' => $total));
    }

    public function cargarpersonasdeavisoAction()
    {
        $datos = DatPersonaNotificacionesModel:: getByAviso(
            $this->_request->idaviso, $this->_request->start,
            $this->_request->limit
        );
        $total = DatPersonaNotificacionesModel:: getTotalByAviso(
            $this->_request->idaviso
        );
        echo json_encode(array('datos' => $datos, 'total' => $total));
    }

    /**
     * @deprecated
     */
    public function abrirbusquedapersonaAction()
    {
        $dirController="/pvd/repositorio_persona/persona/index.php/"
            ."buscarpersona/buscarpersonaf";
        header('Location: ' . $dirController);
    }

    public function obtenertipodestinatariopordefectoAction()
    {
        $personModel = new DatPersonaNotificacionesModel();
        echo json_encode(array('id' => $personModel->getTypeId()));
    }

    public function obtenerusuarioactualAction()
    {
        echo json_encode(
            array('idusuario' => $this->global->Perfil->idusuario)
        );
    }

    public function cargarpersonasfromgrupoAction()
    {
        $grupoModel = new DatGrupoNotificacionesModel();
        $personaModel = new DatPersonaNotificacionesModel();
        $total = 0;
        $i = 0;
        $destinatarios = $grupoModel->getConcretDestinatarios(
            $this->_request->iddestinatario, $this->_request->start,
            $this->_request->limit, $total
        );
        $personas = array();
        if (count($destinatarios['Persona'])) {
            foreach ($destinatarios['Persona'] as $persona) {
                $personas[$i]['idpersona'] = $persona;
                $personas[$i++]['nombre'] = $personaModel->getFullName(
                    null, $persona
                );
            }
        }
        echo json_encode(array('total' => $total, 'datos' => $personas));
    }

    public function eliminarpersonasfromgroupAction()
    {
        $gd = new DatGrupoDestinatarioModel();
        $msg = (count(json_decode($this->_request->personas)) > 1 ? 'msgDelPersonFromGroupP' : 'msgDelPersonFromGroup');
        $gd->eliminarPersonasFromGroup(
            $this->_request->grupo, json_decode($this->_request->personas)
        );
        echo json_encode(array('msgLabel' => $msg));
    }

    public function eliminardestinatariosdeavisoAction()
    {
        $destinatarios = json_decode($this->_request->data);
        $idaviso = $this->_request->idaviso;
        DatAvisoDestinatarioViaContenido:: deleteByDestAndAviso(
            $idaviso, $destinatarios
        );
        echo json_encode(
            array('msgLabel' => count($destinatarios) == 1 ? 'msgDelDestinatary'
                : 'msgDelDestinataries')
        );
    }

}
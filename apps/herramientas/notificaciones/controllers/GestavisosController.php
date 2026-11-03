<?php

class GestavisosController extends ZendExt_Controller_Secure
{
    private $_avisoModel;
    private $_cmpModel;
    private $_xmlHandlerModel;

    public function init()
    {
        parent::init();
        $this->_cmpModel = new ComponentSpecModel();
        $this->_avisoModel = new DatAvisoModel();
        $this->_xmlHandlerModel = new XmlHandlerModel();
    }

    public function listartiposavisosAction()
    {
        echo json_encode(
            NomTipoaviso:: cargarTipoAvisos(
                $this->_request->start, $this->_request->limit
            )
        );

        return;
    }

    private function insertaraviso($values)
    {


        $objAviso = new DatAviso();
        $objAviso->denominacion = $values->denominacion;
        $objAviso->activo = NotificacionesUtil::toStrictBoolean($values->activo)
            ? 1 : 0;
        $objAviso->descripcion = $values->descripcion;
        $objAviso->creadopor = ($values->idusuario) ? $values->idusuario
            : $this->global->Perfil->idusuario;
        $objAviso->idtipoaviso = $values->idtypeaviso;
        list($objAviso->cmpvalidador, $objAviso->svcvalidador) = explode(
            ComponentSpecModel :: SEPARATOR, $values->validador
        );

        $this->_avisoModel->insertardat_aviso($objAviso);
        $objEventoAvisoModel = new DatEventoAvisoModel();
        $objEventoAviso = new DatEventoAviso();
        $objEventoAviso->idevento = $values->idevento;
        $objEventoAviso->idaviso = $objAviso->idaviso;
        $objEventoAvisoModel->insertardat_evento_aviso($objEventoAviso);

        return $objAviso->idaviso;


    }


    private function insertarcontenidos($vias)
    {

        $contenidos = array();
        foreach ($vias as $via => $content) {
            $concretContentRecord = 'Dat' . ucfirst($via) . 'Content';
            $concretContentModel = $concretContentRecord . 'Model';
            $concretInsertMethod = 'insertardat_' . $via . '_content';
            $objContent = new $concretContentRecord();
            $objContent->texto = $content->body;
            if ($via == 'email') {
                $objContent->asunto = $content->topic;
            }
            $objContentModel = new $concretContentModel();
            $contenido['id'] = $objContentModel->$concretInsertMethod(
                $objContent
            );
            $contenido['via'] = $via;
            $contenidos[] = $contenido;
        }

        return $contenidos;
    }

    public function insertaravisoAction()
    {

        $values = json_decode($this->_request->values);
        $idavisoDenominacion = DatAvisoModel::getIdAvisoDadoDenominacion(
            $values->idevento, $values->denominacion
        );


        if (count($idavisoDenominacion) == 0) {
            $dests = array();
            //destinatarios	
            foreach ($values->destinatarios as $destinatario) {
                $dests[] = DatDestinatarioModel:: insertarDestinatario(
                    $destinatario->idtipocontacto, $destinatario->idcontacto
                );
            }

            //aviso	+ evento_aviso		
            $idaviso = $this->insertaraviso($values);


            //contenidos
            $contents = $this->insertarcontenidos($values->medios);

            //agregar el aviso, los destinatarios, y el contenido	
            $avisoDestViaContModel = new DatAvisoDestinatarioViaContenidoModel(
            );

            foreach ($dests as $dest) {
                foreach ($contents as $content) {
                    $avisoDestViaCont = new DatAvisoDestinatarioViaContenido();
                    $avisoDestViaCont->idaviso = $idaviso;
                    $avisoDestViaCont->iddestinatario = $dest;
                    $avisoDestViaCont->idcontenido = $content['id'];
                    $avisoDestViaContModel->
                    insertardat_aviso_destinatario_via_contenido(
                        $avisoDestViaCont
                    );
                }
            }
            echo json_encode(
                array('cod' => 7, 'msgLabel' => 'msgAddNotification')
            );
        } else {
            echo json_encode(
                array('cod' => 6,
                      'mensaje' => 'El aviso que quiere adicionar ya existe.')
            );
            //$this->showMessage('El aviso a agregar ya existe.');
        }
    }

    public function listaravisosAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idevento = $this->_request->getPost('idevento');
        echo json_encode(
            array('datos' => $this->_avisoModel->listarAvisos(
                $idevento, $start, $limit
            ),
                  'total' => $this->_avisoModel->countListarAvisos($idevento))
        );
    }

    public function desactivaravisoAction()
    {
        $aviso = Doctrine::getTable('DatAviso')->find($this->_request->idaviso);
        $aviso->activo = 0;
        $aviso->save();
    }

    public function cargarfuncionobservadoraAction()
    {
        $node = $this->_request->node;
        $fromCmp = false;
        if ($node == '0') {
            $evento = Doctrine::getTable('DatEvent')->find(
                $this->_request->idevento
            );
            if ($evento->referencia) {
                $node = ComponentSpecModel:: getComponentByFullReference(
                    $evento->referencia
                );
                $fromCmp = true;
            }
        }
        $functions = $this->_xmlHandlerModel->showIoCServices($node, $fromCmp);
        if (!count($functions) && $fromCmp) {
            $this->showMessage(
                "El subsistema asociado con el evento seleccionado no tiene"
                ."implementada ninguna funcionalidad."
            );
            //@TODO
        } else {
            echo json_encode($functions);
        }
    }

    public function eliminaravisoAction()
    {
        $datAviso = Doctrine::getTable('DatAviso')->find(
            $this->_request->idaviso
        );
        try {
            $this->_avisoModel->eliminardat_aviso($datAviso);
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                echo json_encode(
                    array('cod' => 6, 'msgLabel' => 'msgFailDelNotification')
                );

                return;
            }
        }
        echo json_encode(array('cod' => 1, 'msgLabel' => 'msgDelNotification'));

    }

    public function obtenertipoavisopordefectoAction()
    {
        echo json_encode(
            array('id' => NomTipoavisoModel:: getIdByName('Alerta'))
        );
    }

    public function cargarcontenidosdeavisoAction()
    {
        echo json_encode(
            DatAvisoDestinatarioViaContenidoModel:: getContentsByAviso(
                $this->_request->idaviso
            )
        );
    }

    public function modificaravisoAction()
    {
        $data = json_decode($this->_request->values);
        $aviso = Doctrine::getTable('DatAviso')->find($data->idaviso);
        if (isset ($data->denominacion)) {
            $aviso->denominacion = $data->denominacion;
        }
        if (isset ($data->descripcion)) {
            $aviso->descripcion = $data->descripcion;
        }
        if (isset ($data->activo)) {
            $aviso->activo = $data->activo ? 1 : 0;
        }
        if (isset ($data->validador)) {
            list($aviso->cmpvalidador, $aviso->svcvalidador) = explode(
                '-', $data->validador
            );
        }
        if (isset ($data->idtypeaviso)) {
            $aviso->idtipoaviso = $data->idtypeaviso;
        }
        $aviso->save();
        $viasInfo = new stdClass();
        $viasInfo->viasActivadas = $data->viasActivadas;
        $viasInfo->viasDesactivadas = $data->viasDesactivadas;
        $viasInfo->oldVias = $data->oldVias;
        $viasInfo->data = $data->medios;

        $destinatariosInfo = new stdClass();
        $destinatariosInfo->newDestinatarios = $data->newDestinatarios;
        $destinatariosInfo->oldDestinatarios = $data->oldDestinatarios;
        $destinatariosInfo->delDestinatarios = $data->delDestinatarios;

        //$destinatariosInfo = $data->destinatarios;        
        $this->_avisoModel->modificarContenidosAviso(
            $data->idaviso, $viasInfo, $destinatariosInfo
        );
        echo json_encode(array('cod' => 1, 'msgLabel' => 'msgUpdNotification'));
    }

}

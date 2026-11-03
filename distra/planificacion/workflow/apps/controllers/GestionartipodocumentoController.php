<?php

class GestionartipodocumentoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
        $this->model[] = new DatSubsistemaModel();            //0
        $this->model[] = new ConfDocModel();                //1
        $this->model[] = new DatEstado();                    //2
        $this->model[] = new ConfDocDatEstadoModel();        //3
        $this->model[] = new DatEstadoModel();                //4
        $this->model[] = new ConfDocDatEstado();            //5
        $this->model[] = new ConfDoc();                        //6
        $this->model[] = new DatSubsistemaConfDocModel();    //7
        $this->model[] = new DatSubsistemaConfDoc();        //8
        $this->model[] = new DatTransicion();                //9
    }

    function gestionartipodocumentoAction()
    {
        $this->render();
    }

    //funcciones Subsistema
    function cargarsubAction()
    {
        $datos = Array();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = $this->model[0]->cargarSubsistema($start, $limit);
        echo json_encode($datos);
    }

    
    function cargarsubmodAction()
    {
        $datos = Array();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idtdoc = $this->_request->getPost('idtdoc');
        $datos = $this->model[0]->CargarSubsistemaMod($start, $limit, $idtdoc);
        echo json_encode($datos);
    }

    //funcciones tipo documento
    function cargartdocAction()
    {
        $datos = Array();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = $this->model[1]->CargarTipoDocConf($start, $limit);
        echo json_encode($datos);
    }

    function eliminartdocAction()
    {
        $idtdoc = $this->_request->getPost('idtdoc');
        if ($this->model[9]->NoExisteTransicionesConDoc($idtdoc)) {
            $datdoc = Doctrine::getTable('ConfDoc')->find($idtdoc);
            if ($this->model[1]->Eliminar($datdoc)) {
                echo("{'codMsg':1,mensaje:'El Tipo de Documento se 
                    elimin&oacute; satisfactoriamente.'}");
            } else {
                echo("{'codMsg':2,mensaje:'El Tipo de Documento no se 
                    elimin&oacute; satisfactoriamente.'}");
            }
        } else {
            echo("{'codMsg':3,mensaje:'El Tipo de Documento se encuentra en 
                una o varias Transiciones.'}");
        }
    }

    function adicionartdocAction()
    {
        $datdoc = new ConfDoc();
        $arrSub = json_decode(stripslashes($this->_request->getPost('arrSub')));
        $denom = $this->_request->getPost('denomtdoc');
        $datdoc->denominacion = $denom;
        if ($this->model[1]->Insertar($datdoc)) {
            $r = $this->model[6]->GetIDTDoc();
            $idtdoc = $r[0]['max'];
            foreach ($arrSub as $row) {
                $tdocsub = new DatSubsistemaConfDoc();
                $tdocsub->idsubsistema = $row->idsub;
                $tdocsub->idtipodoc = $idtdoc;
                $this->model[7]->Insertar($tdocsub);
            }
            echo("{'codMsg':1,mensaje:'El tipo documento se inserto 
                satisfactoriamente'}");
        } else {
            echo("{'codMsg':2,mensaje:'No se pudo insertar el tipo documento 
                satisfactoriamente'}");
        }
    }

    function modificartdocAction()
    {
        $idtdoc = $this->_request->getPost('idtdoc');
        $denom = $this->_request->getPost('denomtdoc');
        $arrSub = json_decode(stripslashes($this->_request->getPost('arrSub')));
        $datdoc = Doctrine::getTable('ConfDoc')->find($idtdoc);
        $datdoc->denominacion = $denom;
        if ($this->model[1]->Actualizar($datdoc)) {
            if ($this->model[8]->EliminarSub($idtdoc)) {
                foreach ($arrSub as $row) {
                    $tdocsub = new DatSubsistemaConfDoc();
                    $tdocsub->idsubsistema = $row->idsubmod;
                    $tdocsub->idtipodoc = $idtdoc;
                    $this->model[7]->Insertar($tdocsub);
                }
                echo("{'codMsg':1,mensaje:'El tipo documento se actualizo 
                    satisfactoriamente'}");
            }
        } else {
            echo("{'codMsg':2,mensaje:'No se pudo actualizar el tipo documento 
                satisfactoriamente'}");
        }
    }

    //Estados
    //Funcion para cargar los estados asociados el tipo documento
    function cargarestadoasocAction()
    {
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtdoc = $this->_request->getPost('idtdoc');
        $datos = Array();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = $this->model[2]->GetPorLimite(
            $start, $limit, $idtdoc, $idusuariosession
        );
        if ($datos['total'] > 0) {
            echo json_encode(
                array('total' => $datos['total'], 'datos' => $datos['datos'])
            );
        } else {
            echo json_encode(array('total' => 0, 'datos' => array()));
        }
    }

    //Funcion para cargar los estados sin asociar el tipo documento
    function cargarestadosasocAction()
    {
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtdoc = $this->_request->getPost('idtdoc');
        $datos = Array();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = $this->model[2]->GetPorLimiteEstado(
            $start, $limit, $idtdoc, $idusuariosession
        );
        if ($datos['total'] > 0) {
            echo json_encode(
                array('total' => $datos['total'], 'datos' => $datos['datos'])
            );
        } else {
            echo json_encode(array('total' => 0, 'datos' => array()));
        }
    }

    //Funcion para eliminar la asociacion de un estado al documento
    function eliminarestaosocAction()
    {
        $idtdoc = $this->_request->getPost('idtdoc');
        $idestado = $this->_request->getPost('idestado');
        $this->model[3]->Eliminar($idtdoc, $idestado);
        echo("{'codMsg':1}");
    }

    //Funcion para asociar un estado al tipo documento
    function asociarestadotdocAction()
    {
        $idtdoc = $this->_request->getPost('idtdoc');
        $arrEst = json_decode(stripslashes($this->_request->getPost('arrEst')));
        foreach ($arrEst as $row) {
            $idusuariosession = $this->global->Perfil->idusuario;
            $confdocdatestado = new ConfDocDatEstado();
            $confdocdatestado->idtipodoc = $idtdoc;
            $confdocdatestado->idestado = $row;
            $confdocdatestado->idautor = $idusuariosession;
            $this->model[3]->Insertar($confdocdatestado);
        }
        echo("{'codMsg':1}");
    }

    function desasociarestadotdocAction()
    {
        $idtdoc = $this->_request->getPost('idtdoc');
        $arrEst = json_decode(stripslashes($this->_request->getPost('arrEst')));
        $puedeeliminar = 1;
        $canteliminados = 0;
        if (isset($arrEst)) {
            foreach ($arrEst as $row) {
                $cantestadoentransicion
                    = $this->model[9]->ExisteEstadoEnTransicion($row, $idtdoc);
                if ($cantestadoentransicion > 0) {
                    $puedeeliminar = 0;
                } else {
                    $existeasoc = Doctrine::getTable('ConfDocDatEstado')
                        ->findByDql("idtipodoc = $idtdoc AND idestado = $row");
                    if (isset($existeasoc[0]->idestado)) {
                        $existeasoc->delete();
                        $canteliminados++;
                    }
                }
            }
            if ($canteliminados > 0) {
                $respuesta = 1;
            }
            if ($canteliminados == 0) {
                $respuesta = 2;
            }
            echo("{'codMsg':" . $respuesta . "}");
        }
    }

    function modificarestadoinicialAction()
    {
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = $this->_request->getPost('idtdoc');
        $idestado = $this->_request->getPost('idestado');
        $valor = $this->_request->getPost('valor');
        $this->model[5]->Actualizar(
            $idestado, $idtipodoc, $idusuariosession, $valor
        );
        echo("{'codMsg':1}");
    }
}



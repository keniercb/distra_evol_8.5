<?php

class DatElementodocModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function addElimdocumento($documentos, $params) {
        try {
            $collectionElementosDoc = new Doctrine_Collection('DatElementodoc');
            if ($params['asociar'] == 'true') {
                foreach ($documentos as $index => $doc) {
                    $objDatelementodoc = new DatElementodoc();
                    $objDatelementodoc->idelemento = $params['idelemento'];
                    $objDatelementodoc->iddocumentos = $doc;
                    $collectionElementosDoc[$index] = $objDatelementodoc;
                }
                $collectionElementosDoc->save();

                $objDatElemento = Doctrine::getTable('DatElemento')->find($params['idelemento']);
                $objDatElemento->documento = 1;
                $objDatElemento->save();
            } else {
                foreach ($documentos as $index => $doc) {
                    $objDatelementodoc = Doctrine::getTable('DatElementodoc')->findByDql("idelemento=? AND iddocumentos=?", array($params['idelemento'], $doc));
                    $collectionElementosDoc[$index] = $objDatelementodoc;
                }
                $collectionElementosDoc->delete();

                if ($params['cantDoc'] == 0) {
                    $objDatElemento = Doctrine::getTable('DatElemento')->find($params['idelemento']);
                    $objDatElemento->documento = 0;
                    $objDatElemento->save();
                }
            }
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503)
                return '-4';
        }
        return true;
    }


    public function buscarDocumentoByElemento($idElemento) {
        $doc = DatElementodoc::buscarDocumentoByElemento($idElemento);
        return $doc;
    }

    public function docAsociadosByidelemento($param) {
        try {
            $docAsociados = DatElementodoc::getDocByidelemento($param);
            $idsubsistema = 30;
            $estructura = $this->global->Estructura->idestructura;

            $documentos = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad($idsubsistema, $estructura, array());
            $datos = array();
            if ($param['asociar'] == 'false') {
                foreach ($documentos as $key => $doc) {
                    foreach ($docAsociados as $k => $docAsoc) {
                        if ($doc->iddocumentos == $docAsoc['iddocumentos'])
                            $datos[] = $doc;
                    }
                }
            }else {
                if (count($docAsociados) > 0) {
                    foreach ($documentos as $key => $doc) {
                        $asoc = false;
                        foreach ($docAsociados as $k => $docAsoc) {
                            if ($doc->iddocumentos == $docAsoc['iddocumentos']) {
                                $asoc = true;
                                break;
                            }
                        }
                        if (!$asoc)
                            $datos[] = $doc;
                    }
                }else {
                    $datos = $documentos;
                }
            }
            return $datos;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503)
                return '-4';
        }
    }

    public function addElementodoc($params) {
        //print_r($params);die;
        $doc = DatElementodocModel::buscarDocumentoByElemento($params['idelemento']);
        if(empty($doc))
            $result = DatElementodoc::guardarElementodoc($params);
        else
            $result = DatElementodoc::updateElementodoc($params);
        if ($result) {
            return (array('codMsg' => 1));
        } else {
            return (array('codMsg' => 0));
        }
    }

}

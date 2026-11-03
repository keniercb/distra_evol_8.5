<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarresidenteModel extends ZendExt_Model implements IConceptoExport
{

    protected $_objConfigGeneralService;

    /**
     * DatFamiliarresidenteModel constructor.
     */
    public function __construct()
    {
        $this->_objDomain = new DatFamiliarresidente();

        $this->_objConfigGeneralService = new ConfiguracionGeneralService();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFamiliarRelacionesByPesona($idpersona, $filtro, $limit, $start)
    {
        try {
            $res = new stdClass();

            $res->data = $this->_objDomain->getFamiliarRelacionesByPesona($idpersona, $filtro, $limit, $start);
            $res->quantity = $this->_objDomain->getCantFamiliarRelacionesByPesona($idpersona, $filtro);

            foreach ($res->data as $k => $v) {
                $pais = $this->_objConfigGeneralService->findContryById($v['idpais']);
                $res->data[$k]['pais'] = $pais['nombrepais'];
            }

            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function adicionarFamiliarRelaciones($idpersona, $arrFamiliar)
    {
        try {
           
            foreach ($arrFamiliar as $v) {
                $obj = new DatFamiliarresidente();
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idpais = $v->idpais;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idnacionalidad = $v->idnacionalidad;
                $obj->idpersona = $idpersona;
                $obj->save();
                return $obj->idfamiliarresidente;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    public function modificarFamiliarRelaciones($idpersona, $arrFamiliar)
    {
        try {

            foreach ($arrFamiliar as $v) {
                $obj = DatFamiliarresidente::getByid($v->idfamiliarresidente);
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idpais = $v->idpais;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idnacionalidad = $v->idnacionalidad;
                $obj->idpersona = $idpersona;
                $obj->save();
                return $obj->idfamiliarresidente;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    public function eliminarFamiliarRelaciones($arrFamiliar)
    {

        try {
            foreach ($arrFamiliar as $v) {
                $familiar = DatFamiliarresidente::getByid($v);
                $familiar->delete();
            }
            return 1;
        } catch (Exception $e) {
            $result['eroor'] = $e;
            return $result;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dfamr.*')->leftJoin($baseAlias . '.DatFamiliarresidente dfamr');
    }
}


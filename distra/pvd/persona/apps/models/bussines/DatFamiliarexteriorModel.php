<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarexteriorModel extends ZendExt_Model implements IConceptoExport
{

    protected $_objConfigGeneralService;

    /**
     * DatFamiliarexteriorModel constructor.
     */
    public function __construct()
    {
        $this->_objDomain = new DatFamiliarexterior();

        $this->_objConfigGeneralService = new ConfiguracionGeneralService();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFamiliarResidenteByPesona($idpersona, $filtro, $limit, $start)
    {
        try {
            $res = new stdClass();

            $res->data = $this->_objDomain->getFamiliarResidenteByPesona($idpersona, $filtro, $limit, $start);
            $res->quantity = $this->_objDomain->getCantFamiliarResidenteByPesona($idpersona, $filtro);

            foreach ($res->data as $k => $v) {
                $pais = $this->_objConfigGeneralService->findContryById($v['idpais']);
                $res->data[$k]['pais'] = $pais['nombrepais'];
            }
          
            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function adicionarFamiliarResidente($idpersona, $arrFamiliar)
    {
        try {

            foreach ($arrFamiliar as $v) {
                $obj = new DatFamiliarexterior();
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idpais = $v->idpais;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idpersona = $idpersona;

                $obj->save();
                return $obj->idfamiliarexterior;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    public function modificarFamiliarResidente($idpersona, $arrFamiliar)
    {
        try {

            foreach ($arrFamiliar as $v) {
                $obj = DatFamiliarexterior::getByid($v->idfamiliarexterior);
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idpais = $v->idpais;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idpersona = $idpersona;
                $obj->save();
                return $obj->idfamiliarexterior;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    public function eliminarFamiliarResidente($arrFamiliar)
    {

        try {
            foreach ($arrFamiliar as $v) {
                $familiar = DatFamiliarexterior::getByid($v);
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
        return $query->addSelect('dfext.*')->leftJoin($baseAlias . '.DatFamiliarexterior dfext');
    }
}


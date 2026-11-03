<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarviajeModel extends ZendExt_Model implements IConceptoExport
{
    protected $_objDomain;
    protected $_objConfigGeneralService;

    /**
     * DatFamiliarviajeModel constructor.
     */
    public function __construct()
    {
        $this->_objDomain = new DatFamiliarviaje();

        $this->_objConfigGeneralService = new ConfiguracionGeneralService();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFamiliarViajeByPesona($idpersona)
    {
        try {
            $res = new stdClass();
            $res->data = $this->_objDomain->getFamiliarViajeByPesona($idpersona, $filtro, $limit, $start);
            $res->quantity = $this->_objDomain->getCantFamiliarViajeByPesona($idpersona, $filtro);
            foreach ($res->data as $k => $v) {
                $pais = $this->_objConfigGeneralService->findContryById($v['idpais']);
                $res->data[$k]['pais'] = $pais['nombrepais'];
            }

            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function adicionarFamiliarViaje($idpersona, $arrFamiliar)
    {
        try {
            foreach ($arrFamiliar as $v) {
                $obj = new DatFamiliarviaje();
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idpais = $v->idpais;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idpersona = $idpersona;
                $obj->save();
                return $obj->idfamiliarviaje;
            }
        } catch (Exception $e) {
            print_r($e->getMessage());die;
            $result['error'] = $e;
            return $result;
        }
    }

    public function modificarFamiliarViaje($idpersona, $arrFamiliar)
    {
        try {

            foreach ($arrFamiliar as $v) {
                $obj = DatFamiliarviaje::getByid($v->idfamiliarviaje);
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idpais = $v->idpais;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idpersona = $idpersona;
                $obj->save();
                return $obj->idfamiliarviaje;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    public function eliminarFamiliarViaje($arrFamiliar)
    {

        try {
            foreach ($arrFamiliar as $v) {
                $familiar = DatFamiliarviaje::getByid($v);
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
        return $query->addSelect('dfamv.*')->leftJoin($baseAlias . '.DatFamiliarviaje dfamv');
    }

}


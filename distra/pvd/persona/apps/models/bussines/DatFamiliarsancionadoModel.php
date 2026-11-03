<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarsancionadoModel extends ZendExt_Model implements IConceptoExport
{

    /**
     * @var ConfiguracionGeneralService
     */
    protected $_objConfigGeneralService;


    /**
     * DatFamiliarsancionadoModel constructor.
     */
    public function __construct()
    {
        $this->_objDomain = new DatFamiliarsancionado();

        $this->_objConfigGeneralService = new ConfiguracionGeneralService();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     * @return stdClass
     * @throws Exception
     */
    public function getFamiliarSancionadoByPesona($idpersona, $filtro, $limit, $start)
    {
        try {
            $res = new stdClass();

            $res->data = $this->_objDomain->getFamiliarSancionadoByPesona($idpersona, $filtro, $limit, $start);
            $res->quantity = $this->_objDomain->getCantFamiliarSancionadoByPesona($idpersona, $filtro);

            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idpersona
     * @param $arrFamiliar
     * @return mixed
     */
    public function adicionarFamiliarSancionado($idpersona, $arrFamiliar)
    {
        try {

            foreach ($arrFamiliar as $v) {
                $obj = new DatFamiliarsancionado();
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idsancion = $v->idsancion;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idmotivosancion = $v->idmotivosancion;
                $obj->idpersona = $idpersona;

                $obj->save();
                return $obj->idfamiliarsancionado;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    /**
     * @param $idpersona
     * @param $arrFamiliar
     * @return mixed
     */
    public function modificarFamiliarSancionado($idpersona, $arrFamiliar)
    {
        try {

            foreach ($arrFamiliar as $v) {
                $obj = DatFamiliarsancionado::getByid($v->idfamiliarsancionado);
                $obj->fdesde = $v->fdesde;
                $obj->fhasta = $v->fhasta;
                $obj->idsancion = $v->idsancion;
                $obj->idmotivosancion = $v->idmotivosancion;
                $obj->idfamiliar = $v->idfamiliar;
                $obj->idpersona = $idpersona;
                $obj->save();
                return $obj->idfamiliarsancionado;
            }
        } catch (Exception $e) {
            $result['error'] = $e;
            return $result;
        }
    }

    /**
     * @param $arrFamiliar
     * @return int
     */
    public function eliminarFamiliarSancionado($arrFamiliar)
    {

        try {
            foreach ($arrFamiliar as $v) {
                $familiar = DatFamiliarsancionado::getByid($v);
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
        return $query->addSelect('dfamrsa.*')->leftJoin($baseAlias . '.DatFamiliarsancionado dfamrsa');
    }
}


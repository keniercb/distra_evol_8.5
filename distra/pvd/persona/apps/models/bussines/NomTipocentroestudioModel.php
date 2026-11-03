<?php

class NomTipocentroestudioModel extends ZendExt_Model
{
    protected $_objTipoCentroEstudio;

    protected $_response;

    function __construct()
    {
        $this->_objTipoCentroEstudio = new NomTipocentroestudio();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @throws Exception
     */
    public function getTipoCentroEstudioActive($filtro, $limit, $start)
    {
        try {
            $this->_response->data = $this->_objTipoCentroEstudio->getTipoCentroEstudioActive($filtro, $limit, $start);
            $this->_response->quantity = ($limit > 0) ? $this->_objTipoCentroEstudio->getCantTipoCentroEstudioActive(
                $filtro
            ) : count($this->_response->data);

            return $this->_response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objTipoCentroEstudio
     *
     * @throws Exception
     */
    public function addTipoCentroEstudio($objTipoCentroEstudio)
    {
        try {
            if (!$this->_objTipoCentroEstudio->findByIdOrDenom($objTipoCentroEstudio->denominacion)) {
                $obj = new NomTipocentroestudio();
                foreach ($objTipoCentroEstudio as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipocentroestudio;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idtipocentroestudio
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @throws Exception
     */
    public function modTipoCentroEstudio($idtipocentroestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->_objTipoCentroEstudio->findByIdOrDenom($denominacion, $idtipocentroestudio)) {
                $this->_objTipoCentroEstudio = new NomTipocentroestudio();
                $result = $this->_objTipoCentroEstudio->modTipoCentroEstudio(
                    $idtipocentroestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );

                return $result;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $arrids
     *
     * @return Doctrine_Collection
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delTipoCentroEstudio($arrids)
    {
        $data = Utiles::reflectArray($arrids);
        if (count($data) > 0) {
            try {
                $query = Doctrine_Query::create()->delete('NomTipocentroestudio')
                    ->whereIn('idtipocentroestudio', $data);
                $query->execute();
            } catch (Doctrine_Exception $e) {
                throw $e;
            }
        } else {
            return false;
        }
    }
}


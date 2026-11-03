<?php

class DatPersonaentidadModel extends ZendExt_Model
{
    protected $objPersonEntidad;

    function __construct()
    {
        $this->objPersonEntidad = new DatPersonaentidad();
    }

    /**
     * @param Doctrine_Collection $collection
     * @param                     $data
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public static function linkCollectionToSave(Doctrine_Collection $collection, $data)
    {
        try {
            foreach ($data as $k => $v) {
                if (!empty($v)) {
                    $collection[0][$k] = $v;
                }
            }

            return $collection;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function darAltaEntidad($persona, $data, $situacion = null)
    {
        try {
            $collection = new Doctrine_Collection('DatPersonaentidad');
            foreach ($persona as $p => $id) {
                $collection[$p]['idpersona'] = $id;
                foreach ($data as $k => $v) {
                    if (!empty($v)) {
                        $collection[$p][$k] = $v;
                    }
                }
                if (!empty($situacion)) {
                    $collection[$p]['DatSituacionlaboral'] = DatSituacionModel::linkCollectionToSave(
                        $collection[$p]['DatSituacionlaboral'], $situacion
                    );
                }
            }
            $collection->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function darBaja($ids, $data)
    {
        try {
            $collection = $this->objPersonEntidad->getById($ids);
            if (!empty($collection)) {
                foreach ($collection as $p => $i) {
                    $idpersonaentidad = $collection[$p]->idpersonaentidad;
                    $collection[$p]->fhasta = $data[$idpersonaentidad]['fbaja'];
                    $collection[$p]->idmotivobaja = $data[$idpersonaentidad]['idmotivobaja'];
                }
                if ($collection->isModified(true)) {
                    $collection->save();
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function removeRegister($id)
    {
        $objModelSituacion = new DatSituacionModel();
        $cargosUpdate = $objModelSituacion->getCargosToSync(null, $id);
        $this->objPersonEntidad->removeRecord($id);
        $objModelSituacion->syncCompletamientoCargo($cargosUpdate);
    }

    public function updateData($id, array $data)
    {
        try {
            if (isset($id) && count($data) > 0) {
                $query = Doctrine_Query::create()->update('DatPersonaentidad')->whereIn(
                    'idpersonaentidad', Utiles::reflectArray($id)
                );
                foreach ($data as $k => $v) {
                    $query->set($k, $v ? $v : null);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAllNumerosPublicos()
    {
        $DOS = new DatPersonaentidad();
        return $DOS->getAllNumerosPublicos();
    }
}


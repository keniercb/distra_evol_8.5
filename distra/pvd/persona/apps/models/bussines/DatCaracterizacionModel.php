<?php

class DatCaracterizacionModel extends ZendExt_Model implements IConceptoExport
{
    protected $_objDatCaracterizacion;

    function __construct()
    {
        $this->_objDatCaracterizacion = new DatCaracterizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param       $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getDatosPsicometricosByPersona($idpersona, $limit, $start)
    {
        try {
            $tmp->data = $this->_objDatCaracterizacion->getDatosPsicometricosByPersona($idpersona,  $limit, $start);
            $tmp->quantity = ($limit > 0) ? $this->_objDatCaracterizacion->getCantDatosPsicometricosByPersona(
                $idpersona
            ) : count($tmp->data);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $datos
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function addDatosPsicometricos(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = new Doctrine_Collection(Doctrine_Core::getTable('DatCaracterizacion'));
                    foreach ($datos as $k => $v) {
                        $collection[0]->$k = $v;
                    }
                    $collection[0]->idpersona = $idpersona;
                    $collection->save();
                    return $collection->getFirst()->idcaracterizacion;
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos psicométricos', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $datos
     * @param       $idpersona
     *
     * @return mixed
     * @throws Exception
     */
    public function modDatosPsicometricos(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = $this->_objDatCaracterizacion->getById($datos['idcaracterizacion']);

                    if ($collection) {
                        foreach ($datos as $k => $v) {
                            $collection->$k = $v;
                        }
                        $collection->idpersona = $idpersona;
                        $collection->save();

                        return $collection->idcaracterizacion;
                    } else {
                        throw new  Exception('No existen datos psicométricos de la persona', 3);
                    }
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos psicométricos', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dft.*')->leftJoin($baseAlias . '.DatCaracterizacion dft');
    }
}


<?php

class DatFenotipoModel extends ZendExt_Model implements IConceptoExport
{
    protected $_objDatFenotipo;

    function __construct()
    {
        $this->_objDatFenotipo = new DatFenotipo();
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
    public function getDatosFenotipicosByPersona(array $idpersona, $filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objDatFenotipo->getDatosFenotipicosByPersona($idpersona, $filtro, $limit, $start);
            $tmp->quantity = ($limit > 0) ? $this->_objDatFenotipo->getCantDatosFenotipicosByPersona(
                $idpersona, $filtro
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
    public function addDatosFenotipicos(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = new Doctrine_Collection(Doctrine_Core::getTable('DatFenotipo'));
                    foreach ($datos as $k => $v) {
                        $collection[0]->$k = $v;
                    }
                    $collection[0]->idpersona = $idpersona;
                    $collection->save();
                    return $collection->getFirst()->idfenotipo;
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos fenotipicos', 3);
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
    public function modDatosFenotipicos(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = $this->_objDatFenotipo->getById($datos['idfenotipo']);
                    if ($collection) {
                        foreach ($datos as $k => $v) {
                            $collection->$k = $v;
                        }
                        $collection->idpersona = $idpersona;
                        $collection->save();

                        return $collection->idfenotipo;
                    } else {
                        throw new  Exception('No existe datos fenotipos de la persona', 3);
                    }
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos fenotipicos', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dft.*')->leftJoin($baseAlias . '.DatFenotipo dft');
    }
}


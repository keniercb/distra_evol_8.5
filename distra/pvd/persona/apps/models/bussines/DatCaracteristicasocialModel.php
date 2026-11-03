<?php

class DatCaracteristicasocialModel extends ZendExt_Model implements IConceptoExport
{
    protected $objDatosSociales;
    protected $response;

    function __construct()
    {
        $this->objDatosSociales = new DatCaracteristicasocial();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getDatosSocialesByPersona($idpersona, $filtro = null, $limit = null, $start = 0)
    {
        try {
            $this->response->data = $this->objDatosSociales->getDatosSocialesByPersona(
                Utiles::reflectArray($idpersona), $filtro, $limit, $start
            );
            $this->response->quantity = ($limit > 0) ? $this->objDatosSociales->getCantDatosSocialesByPersona(
                Utiles::reflectArray($idpersona), $filtro
            ) : count($this->response->data);

            return $this->response;
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
    public function addDatosSociales(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = new Doctrine_Collection(Doctrine_Core::getTable('DatCaracteristicasocial'));
                    foreach ($datos as $k => $v) {
                        $collection[0]->$k = $v;
                    }
                    $collection[0]->idpersona = $idpersona;
                    $collection->save();

                    return $collection->getFirst()->idcaracteristicasocial;
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos sociales', 3);
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
    public function modDatosSociales(array $datos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($datos) > 0) {
                    $collection = $this->objDatosSociales->getById($datos['idcaracteristicasocial']);
                    if ($collection) {
                        foreach ($datos as $k => $v) {
                            $collection->$k = $v;
                        }
                        $collection->idpersona = $idpersona;
                        $collection->save();

                        return $collection->idcaracteristicasocial;
                    } else {
                        throw new  Exception('No existe datos sociales de la persona', 3);
                    }
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar los datos sociales', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dsociales.*')->leftJoin($baseAlias . '.DatCaracteristicasocial dsociales');
    }
}


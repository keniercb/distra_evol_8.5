<?php

/**
 * Class DatCaracterizacion
 */
class DatCaracterizacion extends BaseDatCaracterizacion
{

    /**
     * Constructor
     */
    public function getById($idcaracterizacion)
    {
        return Doctrine::getTable('DatCaracterizacion')->find($idcaracterizacion);
    }


    public function getDatosPsicometricosByPersona($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCaracterizacion df')->where('df.idpersona=?', $idpersona);

            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}
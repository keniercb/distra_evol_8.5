<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class NomFila extends BaseNomFila
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario', 
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasMany(
            'NomValor',
            array('local' => 'idfila', 'foreign' => 'idfila')
        );
    }

    static public function genId()
    {
        $query = new Doctrine_Query();
        $result = $query->select('max(f.idfila) as maximo')
            ->from('NomFila f')
            ->execute()
            ->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    static public function eliminarfila($idfila)
    {
        try {
            $query = Doctrine_Query::create();
            $query->delete()->from('NomFila f')
                ->where("f.idfila = ?", $idfila)->execute();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

}
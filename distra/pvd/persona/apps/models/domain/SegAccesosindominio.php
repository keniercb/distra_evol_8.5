<?php

/**
 * Class SegAccesosindominio
 */
class SegAccesosindominio extends BaseSegAccesosindominio
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idusuario
     *
     * @return Doctrine_Record
     */
    public function getById($idusuario)
    {
        return Doctrine::getTable('SegAccesosindominio')->find($idusuario);
    }

    /**
     * @param array $idpersona
     * @param       $idusuario
     */
    public function delAccesoSinDominio(array $idpersona, $idusuario)
    {
        try {
            if (count($idpersona) > 0 && !empty($idusuario)) {
                $query = Doctrine_Query::create()
                    ->delete('SegAccesosindominio')
                    ->whereIn('idpersona', $idpersona)
                    ->andWhere(
                        'idusuario = ?', $idusuario
                    );
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}


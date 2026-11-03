<?php

/**
 * @name SegUsuarioDatSerautenticacion - Clase dominio de la relación 
 * establecida entre usuario y servidor de autenticación.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegUsuarioDatSerautenticacion extends BaseSegUsuarioDatSerautenticacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasOne(
            'DatSerautenticacion',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
    }

    /**
     * @method eliminarusuarioservidoraut($idusuario) - Elimina la relación 
     * que existe entre el usuario y el servidor de autenticación.
     * @param integer $idusuario - Identificador del usuario.
     */
    static public function eliminarusuarioservidoraut($idusuario)
    {
        Doctrine_Query::create()->delete()
            ->from('SegUsuarioDatSerautenticacion')
            ->where("idusuario=? ", $idusuario)
            ->execute();
    }

    /**
     * @method cantservidoraut($idusuario) - Retorna los metadatos de la 
     * relación que se establece entre el usuario y el sevidor
     *  de autenticación.
     * @param integer $idusuario - Identificador del usuario.
     * @return DoctrineCollection.
     */
    static public function cantservidoraut($idusuario)
    {
        return Doctrine_Query::create()->select('s.idservidor')
            ->from('SegUsuarioDatSerautenticacion s')
            ->where("s.idusuario = ?", $idusuario)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method obtenercantservuser($idservidor) - Retorna la cantidad 
     * de usuarios que están asociados a un servidor.
     * @param integer $idservidor - Identificador del servidor.
     * @return integer - Cantidad de servidores.
     */
    static public function obtenercantservuser($idservidor)
    {
        $result = Doctrine_Query::create()->select('count(s.idservidor) cant')
            ->from('SegUsuarioDatSerautenticacion s')
            ->where("s.idservidor = ?", $idservidor)
            ->execute();
        return $result[0]->cant;
    }

    /**
     * @author Darien García Tejo.
     * @method existUserAutenticationServer($idusuario) - Verifica que el 
     * usuario este asociado a un servidor de autenticación.
     * @param integer $idusuario - Identificador del usuario.
     * @return bool
     */
    static function existUserAutenticationServer($idusuario)
    {
        return (
            Doctrine_Query::create()->from('SegUsuarioDatSerautenticacion a')
                ->where("a.idusuario = ?", $idusuario)
                ->count() > 0) ? true : false;
    }

}